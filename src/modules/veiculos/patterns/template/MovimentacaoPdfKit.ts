import { format } from 'date-fns';
import path from 'path';
import { IMovimentacaoPDFKit } from '../../interfaces/patterns/template/IMovimentacaoPDFKit';
import {
  IDocumentInfo,
  IGeneratePdf,
} from '../../interfaces/patterns/template/IAbstractPdf';
import AbstractPdfKit from './AbstractPdfKit';

abstract class MovimentacaoPdfKit
  extends AbstractPdfKit
  implements IGeneratePdf {
  constructor(pdfOptions: PDFKit.PDFDocumentOptions) {
    super(pdfOptions);

    const logoEstado = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'assets',
      'images',
      'logoPMCE_215px.jpeg',
    );

    this.pdf.image(logoEstado, (this.pdf.x * 6) / 2 - 23, 30, {
      scale: 0.25,
    });
  }

  public setDocumentInfo({
    author,
    creationDate,
    title,
  }: IDocumentInfo): PDFKit.PDFDocument {
    this.pdf.info = {
      Author: author,
      Title: title,
      CreationDate: creationDate,
    };

    this.pdf.font('Times-Roman').fontSize(12);
    return this.pdf;
  }

  createCabecalho({
    dataAtual,
    unidadeOrigem,
    oficio,
  }: IMovimentacaoPDFKit): PDFKit.PDFDocument {
    this.pdf.moveDown(7);
    this.pdf.text(`Oficio ${oficio}`, {
      align: 'left',
    });
    this.pdf.moveDown(1);
    this.pdf.text(format(dataAtual, "dd 'de' EEEE 'de' yyyy"), {
      align: 'right',
    });

    this.pdf.moveDown(3);
    this.pdf.text(`Ao Senhor ${unidadeOrigem.getComandante}`, {
      align: 'left',
    });

    this.pdf.moveDown(0.125);
    this.pdf.text('Cargo dele');
    this.pdf.moveDown(0.125);
    this.pdf.text('Cargo dele');
    return this.pdf.moveDown(2);
  }

  abstract createCorpo(data: any): PDFKit.PDFDocument;

  abstract createConclusao(data: any): PDFKit.PDFDocument;
}

export default MovimentacaoPdfKit;
