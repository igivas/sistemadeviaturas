import { IPostMovimentacaoDocument } from '@modules/veiculos/interfaces/request/IPostMovimentacaoDocument';
import MovimentacaoPdfKit from './MovimentacaoPdfKit';
import { IConclusaoMovimentacao } from '../../interfaces/patterns/template/IMovimentacaoTransferenciaPdfKit';

class MovimentacaoTransferenciaPdfKit extends MovimentacaoPdfKit {
  constructor(pdfOptions: PDFKit.PDFDocumentOptions) {
    super(pdfOptions);
  }

  createCorpo({
    data_movimentacao,
    km_atual,
  }: IPostMovimentacaoDocument & { km_atual: number }): PDFKit.PDFDocument {
    this.pdf
      .font('Times-Bold')
      .fontSize(12)
      .text('Assunto: Oferta de Movimentacao de Veiculo', {
        align: 'center',
      });
    this.pdf.moveDown(2);
    this.pdf.font('Times-Roman');
    this.pdf.text(`Conteudo do texto ${data_movimentacao}`, {
      align: 'left',
      indent: 20,
    });

    return this.pdf;
  }

  createConclusao({
    unidadeDestino,
  }: IConclusaoMovimentacao): PDFKit.PDFDocument {
    this.pdf.moveDown(1.5);
    this.pdf.text('Atenciosamente', {
      align: 'left',
      indent: 20,
    });
    this.pdf.moveDown(1.5);
    this.pdf.text(`${unidadeDestino.getComandante}`, {
      align: 'center',
      indent: 10,
    });
    this.pdf.text('Cargo de quem faz oferta', {
      align: 'center',
      indent: 10,
    });
    return this.pdf;
  }
}

export default MovimentacaoTransferenciaPdfKit;
