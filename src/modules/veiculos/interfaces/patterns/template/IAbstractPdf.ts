export type IDocumentInfo = {
  title: string;
  creationDate: Date;
  author: string;
};

export type IGeneratePdf = {
  setDocumentInfo(data: any): any;
  createCabecalho(data: any): any;
  createCorpo(data: any): any;
  createConclusao(data: any): any;
};
