export interface IPDF {
  /* createDocumentInstance(): PDFKit.PDFDocument; */

  gerarDocumento(
    documentInfo: any,
    cabecalho: any,
    corpo: any,
    conclusao: any,
  ): any;
}
