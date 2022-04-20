import { Response, Request } from 'express';
import { getRepository, Repository } from 'typeorm';
// import AppError from 'errors/AppError';
import SituacaoTipo from '../entities/SituacaoTipo';

// import AppError from '../../../errors/AppError';
// import SituacoesTipos from '../entities/SituacoesTipos';

export default class SituacoesTiposController {
  private situacoesTipos: Repository<SituacaoTipo>;

  public async index(request: Request, response: Response): Promise<Response> {
    this.situacoesTipos = getRepository(SituacaoTipo);

    const situacoes = await this.situacoesTipos.find({
      relations: ['situacoesTiposEspecificacoes', 'situacoesTiposLocalizacoes'],
    });

    return response.json(
      situacoes?.map(situacao => {
        const {
          situacoesTiposEspecificacoes,
          situacoesTiposLocalizacoes,
          ...restSituacao
        } = situacao;

        return {
          ...restSituacao,
          motivos:
            situacoesTiposEspecificacoes.map(situacaoEspecificacao => ({
              ...situacaoEspecificacao,
              id_situacao_tipo: undefined,
            })) || [],

          localizacoes:
            situacoesTiposLocalizacoes.map(
              situacaoTipoLocalizacao => situacaoTipoLocalizacao.localizacao,
            ) || [],
        };
      }),
    );
  }

  // public async show(request: Request, response: Response): Promise<Response> {
  //   const { id } = request.params;
  //   this.SituacoesTiposRepo = getRepository(ReferenciaPneus);
  //   try {
  //     const prefixo = await this.referenciaPneusRepo.findOne({
  //       where: { id_referencia_pneu: id },
  //     });
  //     return response.status(201).json(prefixo);
  //   } catch (erro) {
  //     throw new AppError(erro);
  //   }
  // }

  // public async update(request: Request, response: Response): Promise<Response> {
  //   const { id } = request.params;
  //   this.referenciaPneusRepo = getRepository(ReferenciaPneus);
  //   try {
  //     const referenciaPneu = await this.referenciaPneusRepo.findOne({
  //       where: { id_referencia_pneu: id },
  //     });

  //     if (!referenciaPneu) {
  //       throw new AppError('Não pode identificar a referencia de pneu');
  //     }

  //     const data = request.body;
  //     this.referenciaPneusRepo.merge(referenciaPneu, data);
  //     const referenciaPneuAtualizado = await this.referenciaPneusRepo.save(
  //       referenciaPneu,
  //     );
  //     return response.status(201).json(referenciaPneuAtualizado);
  //   } catch (erro) {
  //     throw new AppError(erro);
  //   }
  // }

  // public async delete(request: Request, response: Response): Promise<Response> {
  //   const { id } = request.params;
  //   this.referenciaPneusRepo = getRepository(ReferenciaPneus);
  //   try {
  //     const referenciaPneu = await this.referenciaPneusRepo.findOne({
  //       where: { id_referencia_pneu: id },
  //     });
  //     if (!referenciaPneu) {
  //       throw new AppError('Não pode identificar a referencia de Pneu');
  //     }

  //     await this.referenciaPneusRepo.delete(id);
  //     return response
  //       .status(201)
  //       .json({ message: 'Referência de pneu removida com sucesso' });
  //   } catch (erro) {
  //     throw new AppError(erro);
  //   }
  // }
}
