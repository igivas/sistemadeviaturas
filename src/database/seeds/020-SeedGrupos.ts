import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import Grupo from '@modules/veiculos/entities/Grupo';
import { v4 as uuidv4 } from 'uuid';

export default class Grupos implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const grupos = [
      {
        criado_por: '30891368',
        grupo: 'Grupo Identificador',
      },
    ];

    await connection
      .createQueryBuilder()
      .insert()
      .into(Grupo)
      .values(
        grupos.map(
          grupo =>
            ({
              ...grupo,
              id_grupo: uuidv4(),
            } as Grupo),
        ),
      )
      .execute();
  }
}
