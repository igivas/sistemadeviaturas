import {
  getRepository,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import Email from '../entities/Email';
import {
  IEmailsRepository,
  IEmailsSearch,
} from './interfaces/IEmailsRepository';

class EmailsRepository implements IEmailsRepository {
  private ormRepository: Repository<Email>;

  constructor() {
    this.ormRepository = getRepository(Email);
  }

  async find(
    page: number,
    perPage: number,
    { ativo, email }: IEmailsSearch,
  ): Promise<[Email[], number]> {
    return this.ormRepository.findAndCount({
      where: (qb: SelectQueryBuilder<Email>) => {
        if (email)
          qb.where(`Email.email LIKE (:email)`, { email: `%${email}%` });

        if (ativo && email) {
          qb.andWhere(`Email.ativo = :ativo`, { ativo });
        } else if (ativo) qb.where(`Email.ativo = :ativo`, { ativo });
      },

      take: page && perPage ? perPage : undefined,
      skip: page && perPage ? page * perPage - perPage : undefined,
    });
  }

  async findById(id_email: string): Promise<Email | undefined> {
    return this.ormRepository.findOne({
      where: {
        id_email,
      },
    });
  }

  async findByEmail(email: string): Promise<Email | undefined> {
    return this.ormRepository.findOne({
      where: {
        email,
      },
    });
  }

  async create(data: Email[], queryRunner?: QueryRunner): Promise<Email[]> {
    const email = queryRunner
      ? queryRunner.manager.create(Email, data)
      : this.ormRepository.create(data);

    const response = queryRunner
      ? await queryRunner.manager.save(email)
      : await this.ormRepository.save(email);

    return response;
  }

  async update(
    oldValue: Email,
    newData: Partial<Email>,
    queryRunner?: QueryRunner,
  ): Promise<Email> {
    const updatedEmail = queryRunner
      ? queryRunner.manager.merge(Email, oldValue, newData)
      : this.ormRepository.merge(oldValue, newData);

    return queryRunner
      ? queryRunner.manager.save(updatedEmail)
      : this.ormRepository.save(updatedEmail);
  }
}

export default EmailsRepository;
