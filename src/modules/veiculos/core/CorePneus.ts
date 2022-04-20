import { injectable, inject } from 'tsyringe';
import IPneusRepository from '@modules/veiculos/repositories/interfaces/IPneusRepository';
import Pneu from '@modules/veiculos/entities/Pneu';
import * as Yup from 'yup';
import AppError from '../../../errors/AppError';
import { IPostReferenciasPneus } from '../interfaces/request/IPostReferenciasPneus';

const schema = Yup.object()
  .shape({
    referencia: Yup.string().required('Referencia é necessario'),
    /* .matches(
        /^[\d+]{3}\/[0-9]{2}R(\d+(\.\d+)?)$/,
        'Formato de referencia invalido',
      ), */
    id_veiculo_especie: Yup.number().required('Veiculo Espécie é requerido'),
  })
  .required('Objeto de referencia é necessario');

type ReferenciaFormat = Yup.InferType<typeof schema>;
@injectable()
class CorePneus {
  constructor(
    @inject('PneusRepository')
    private referenciaRepository: IPneusRepository,
  ) {}

  public async create({
    referenciasPneus,
    criado_por,
  }: IPostReferenciasPneus): Promise<Pneu[]> {
    try {
      return Promise.all(
        referenciasPneus.map(async referenciaPneu => {
          if (
            await this.referenciaRepository.findReferenciasByDesc(
              referenciaPneu.descricao,
            )
          )
            throw new AppError('A referencia já está cadastrada');

          return this.referenciaRepository.create({
            id_veiculo_especie: referenciaPneu.id_veiculo_especie,
            referencia: referenciaPneu.descricao,
            criado_por,
          } as Pneu);
        }),
      );
    } catch (error) {
      throw new AppError(error);
    }
  }

  public async list(idVeiculoEspecie?: string): Promise<Pneu[]> {
    let referencias;
    try {
      const id_veiculo_especie = idVeiculoEspecie
        ? Number(idVeiculoEspecie)
        : undefined;

      if (!idVeiculoEspecie || !Number.isNaN(id_veiculo_especie)) {
        referencias = await this.referenciaRepository.findReferencias(
          id_veiculo_especie,
        );
      } else throw new SyntaxError();
    } catch (error) {
      if (error instanceof SyntaxError)
        throw new AppError('Veiculo Espécie invalido');
      return [];
    }
    return referencias;
  }
}

export default CorePneus;
