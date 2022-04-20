import { IPDF } from '../../interfaces/patterns/strategy/IPDF';

class PdfContext implements IPDF {
  private strategy: IPDF;

  public setStrategy(strategy: IPDF): void {
    this.strategy = strategy;
  }

  public getStrategy(): IPDF {
    return this.strategy;
  }

  gerarDocumento(
    documentInfo: any,
    cabecalho: any,
    corpo: any,
    conclusao: any,
  ): any {
    return this.strategy.gerarDocumento(
      documentInfo,
      cabecalho,
      corpo,
      conclusao,
    );
  }
}

export default PdfContext;
