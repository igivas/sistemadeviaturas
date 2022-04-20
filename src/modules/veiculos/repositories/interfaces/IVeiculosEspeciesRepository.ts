import VeiculoEspecie from '@modules/veiculos/entities/VeiculoEspecie';

export default interface IVeiculosEspeciesRepository {
  findByEspecie(
    id_veiculo_especie: number,
  ): Promise<VeiculoEspecie | undefined>;
}
