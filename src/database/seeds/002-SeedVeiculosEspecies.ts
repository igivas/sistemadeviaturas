import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import VeiculoEspecie from '../../modules/veiculos/entities/VeiculoEspecie';

export default class VeiculosEspecies implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(VeiculoEspecie)
      .values([
        { nome: 'Motocicleta' },
        { nome: 'Triciclo' },
        { nome: 'Quadriciclo' },
        { nome: 'Automóvel' },
        { nome: 'Caminhonete' },
        { nome: 'Caminhão' },
        { nome: 'Camioneta' },
        { nome: 'Microônibus' },
        { nome: 'Ônibus' },
        { nome: 'Reboque ou Semi-reboque' },
        { nome: 'Utilitário' },
        { nome: 'Trator' },
        { nome: 'Outros' },
      ])
      .execute();
  }
}
