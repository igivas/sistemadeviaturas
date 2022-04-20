import Documento from '@modules/veiculos/entities/Documento';
import { IDefaultRepository } from './IDefaultRepository';

export default interface IDocumentosRepository
  extends IDefaultRepository<Documento> {
  findLastDocumentoByYear(
    ano_documento: number,
  ): Promise<Documento | undefined>;
  findLastDocumento(): Promise<Documento | undefined>;
  deleDocumento(documento: Documento): Promise<Documento>;
}
