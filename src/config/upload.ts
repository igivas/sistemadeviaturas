import multer, { MulterError } from 'multer';
import path from 'path';

export const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');

export const aquisicaoFolder = path.join(uploadFolder, 'aquisicao');
export const movimentacaoFolder = path.join(uploadFolder, 'movimentacao');

export const storage = multer({
  limits: {
    // 2 megas
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (request, file, next) => {
    if (!file.mimetype.match(/^(application\/pdf)|(image\/((pn|(jpe?))g))$/)) {
      return next(new MulterError('LIMIT_UNEXPECTED_FILE', 'aquisicao_file'));
    }

    return next(null, true);
  },
});
