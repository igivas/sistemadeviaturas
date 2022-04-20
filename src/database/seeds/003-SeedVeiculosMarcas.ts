import { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import VeiculoMarca from '../../modules/veiculos/entities/VeiculoMarca';

export default class VeiculosMarcas implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(VeiculoMarca)
      .values([
        { nome: 'Volkswagen', criado_por: '13444013' },
        { nome: 'Fiat', criado_por: '13444013' },
        { nome: 'Chevrolet', criado_por: '13444013' },
        { nome: 'Ford', criado_por: '13444013' },
        { nome: 'Toyota', criado_por: '13444013' },
        { nome: 'Honda', criado_por: '13444013' },
        { nome: 'Hyundai', criado_por: '13444013' },
        { nome: 'Nissan', criado_por: '13444013' },
        { nome: 'Kia', criado_por: '13444013' },
        { nome: 'Mercedes-Benz', criado_por: '13444013' },
        { nome: 'Peugeot', criado_por: '13444013' },
        { nome: 'Citroen', criado_por: '13444013' },
        { nome: 'Mitsubishi', criado_por: '13444013' },
        { nome: 'Audi', criado_por: '13444013' },
        { nome: 'BMW', criado_por: '13444013' },
        { nome: 'Renault', criado_por: '13444013' },
        { nome: 'Agrale', criado_por: '13444013' },
        { nome: 'Dafra', criado_por: '13444013' },
        { nome: 'H. Davidson', criado_por: '13444013' },
        { nome: 'Jeep', criado_por: '13444013' },
        { nome: 'Magnata', criado_por: '13444013' },
        { nome: 'New Holland', criado_por: '13444013' },
        { nome: 'Yamaha', criado_por: '13444013' },
        { nome: 'Traxx', criado_por: '13444013' },
        { nome: 'Iveco', criado_por: '13444013' },
        { nome: 'Troller', criado_por: '13444013' },
      ])
      .execute();
  }
}
