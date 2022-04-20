import VeiculoPneu from '@modules/veiculos/entities/VeiculoPneu';
import { QueryRunner } from 'typeorm';

export type IVeiculosPneusRepository = {
  findVeiculoPneusByIdVeiculo(id_veiculo: number): Promise<VeiculoPneu[]>;

  create(
    data: VeiculoPneu[],
    queryRunner?: QueryRunner,
  ): Promise<VeiculoPneu[]>;
  update(
    oldValue: VeiculoPneu[],
    newData: Partial<VeiculoPneu[]>,
    queryRunner?: QueryRunner,
  ): Promise<VeiculoPneu[] | undefined>;

  delete(pneus: VeiculoPneu[]): Promise<VeiculoPneu[]>;
};
