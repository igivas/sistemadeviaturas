import VeiculoMarca from '@modules/veiculos/entities/VeiculoMarca';

export default interface IVeiculosMarcasRepository {
  findByMarca(id_veiculo_marca: number): Promise<VeiculoMarca | undefined>;
}
