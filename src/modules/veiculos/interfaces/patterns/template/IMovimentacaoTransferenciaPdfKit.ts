import UnidadeDTOResponse from '@modules/veiculos/dto/Response/UnidadeDTOResponse';
import { IMovimentacaoPDFKit } from './IMovimentacaoPDFKit';

export interface IConclusaoMovimentacao extends IMovimentacaoPDFKit {
  unidadeDestino: UnidadeDTOResponse;
}
