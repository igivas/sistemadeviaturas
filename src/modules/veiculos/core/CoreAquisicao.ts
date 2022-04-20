import { injectable, inject } from 'tsyringe';
import { QueryRunner } from 'typeorm';
import { aquisicaoFolder } from '@config/upload';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import AppError from '../../../errors/AppError';
import { IPostAquisicao } from '../interfaces/request/IPostAquisicao';
import IAquisicoesRepository from '../repositories/interfaces/IAquisicoesRepository';
import Aquisicao from '../entities/Aquisicao';

@injectable()
class CoreAquisicao {
  constructor(
    @inject('AquisicoesRepository')
    private aquisicoesRepository: IAquisicoesRepository,
  ) {}

  private createFile(
    file: Express.Multer.File,
    fullPathFilename: string,
  ): void {
    fs.writeFile(
      `${fullPathFilename}`,
      file.buffer,
      { flag: 'w' },
      function (error) {
        if (error) {
          console.log(error);

          throw error;
        }
      },
    );
  }

  private removeFile(filename: string): void {
    fs.unlink(filename, function (err) {
      console.error(err?.message);
      throw err;
    });
  }

  private sanitazeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private createRandomHash(): string {
    fs.mkdirSync(aquisicaoFolder, { recursive: true });

    return `${crypto.randomBytes(6).toString('hex')}-${Date.now()}`;
  }

  async create(
    values: IPostAquisicao & { id_veiculo: number; criado_por: string },
    queryRunner?: QueryRunner,
    file?: Express.Multer.File,
  ): Promise<any> {
    if (Number.isNaN(values.id_veiculo))
      throw new AppError('Id do veiculo invalido');

    const filename = file
      ? `${this.createRandomHash()}-${this.sanitazeFilename(file.originalname)}`
      : '';
    try {
      const fullPathFilename = path.resolve(aquisicaoFolder, filename);

      if (file) this.createFile(file, fullPathFilename);

      return this.aquisicoesRepository.create(
        {
          ...values,
          file_path: file
            ? `${process.env.URL_SAV}/documentos/aquisicao/${filename}`
            : undefined,
        } as Aquisicao,
        queryRunner,
      );
    } catch (error) {
      if (file && fs.existsSync(filename)) this.removeFile(filename);

      if (queryRunner) throw error;
      else throw new AppError('Não pode inserir dados');
    }
  }

  async update(
    id: number,
    values: IPostAquisicao & { atualizado_por: string },
    file?: Express.Multer.File,
  ): Promise<Aquisicao> {
    if (Number.isNaN(id))
      throw new AppError('Valor invalido de id de aquisicao');

    const aquisicao = await this.aquisicoesRepository.findById(id);
    if (!aquisicao) throw new AppError('Aquisicao não encontrada');

    const filename = file
      ? `${this.createRandomHash()}-${this.sanitazeFilename(file.filename)}`
      : '';
    const fullPathFilename = path.resolve(aquisicaoFolder, filename);

    try {
      if (file) this.createFile(file, fullPathFilename);

      const aquisicaoResponse = await this.aquisicoesRepository.update(
        {
          id_aquisicao: aquisicao.id_aquisicao,
        } as Aquisicao,
        {
          ...values,
          file_path: file
            ? `${process.env.URL_SAV}/documentos/aquisicao/${filename}`
            : aquisicao.file_path,
        },
      );

      return aquisicaoResponse as Aquisicao;
    } catch (error) {
      if (file && fs.existsSync(filename)) this.removeFile(filename);

      throw new AppError('Não pode inserir aquisicao');
    }
  }

  async list(id_veiculo: number): Promise<Aquisicao[]> {
    if (Number.isNaN(id_veiculo))
      throw new AppError('Valor invalido de id de aquisicao');

    return this.aquisicoesRepository.findAllByIdVeiculo(id_veiculo);
  }
}

export default CoreAquisicao;
