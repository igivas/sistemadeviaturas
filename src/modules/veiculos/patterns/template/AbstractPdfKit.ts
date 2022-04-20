import PDFDocument from 'pdfkit';
import { IPDF } from '../../interfaces/patterns/strategy/IPDF';
import { IGeneratePdf } from '../../interfaces/patterns/template/IAbstractPdf';

abstract class AbstractPdfKit implements IPDF, IGeneratePdf {
  protected pdf: PDFKit.PDFDocument;

  constructor(pdfOptions: PDFKit.PDFDocumentOptions) {
    this.pdf = new PDFDocument(pdfOptions);
  }

  abstract setDocumentInfo(data: any): any;

  abstract createCabecalho(data: any): any;

  abstract createCorpo(data: any): any;

  abstract createConclusao(data: any): any;

  gerarDocumento(
    documentInfo: any,
    cabecalho: any,
    corpo: any,
    conclusao: any,
  ): PDFKit.PDFDocument {
    this.setDocumentInfo(documentInfo);
    this.createCabecalho(cabecalho);
    this.createCorpo(corpo);
    return this.createConclusao(conclusao);
  }
}

export default AbstractPdfKit;
