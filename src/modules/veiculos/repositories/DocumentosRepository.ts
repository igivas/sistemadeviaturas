import { Repository, getRepository, QueryRunner } from 'typeorm';
import IDocumentosRepository from './interfaces/IDocumentosRepository';
import Documento from '../entities/Documento';

class DocumentosRepository implements IDocumentosRepository {
  private ormRepository: Repository<Documento>;

  constructor() {
    this.ormRepository = getRepository(Documento);
  }

  async findLastDocumento(): Promise<Documento | undefined> {
    return this.ormRepository.findOne({
      order: { id_documento: 'DESC' },
    });
  }

  async findLastDocumentoByYear(
    ano_documento: number,
  ): Promise<Documento | undefined> {
    return this.ormRepository.findOne({
      where: { ano_documento },
      order: { id_documento: 'DESC' },
    });
  }

  async create(data: Documento, queryRunner: QueryRunner): Promise<Documento> {
    const documento = queryRunner.manager.create(Documento, data);
    return queryRunner.manager.save(documento);
  }

  async update(
    oldValue: Documento,
    newData: Partial<Documento>,
    queryRunner?: QueryRunner,
  ): Promise<Documento | undefined> {
    throw new Error('Method not implemented.');
  }

  async deleDocumento(documento: Documento): Promise<Documento> {
    return this.ormRepository.remove(documento);
  }
}

export default DocumentosRepository;
