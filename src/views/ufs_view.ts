import Uf from '@modules/public/entities/Uf';
import EstadoDtoResponse from '@modules/veiculos/dto/Response/EstadoDtoResponse';

export default {
  render(uf: Uf): EstadoDtoResponse {
    return new EstadoDtoResponse(uf);
  },

  renderMany(ufs: Uf[]): EstadoDtoResponse[] {
    return ufs.map(uf => this.render(uf));
  },
};
