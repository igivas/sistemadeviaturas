import Unidade from '@modules/public/entities/Unidade';
import UnidadeDTOResponse from '@modules/veiculos/dto/Response/UnidadeDTOResponse';

export default {
  render(unidade: Unidade): UnidadeDTOResponse {
    return new UnidadeDTOResponse(unidade);
  },
  renderMany(unidades: Unidade[]): UnidadeDTOResponse[] {
    return unidades.map(unidade => this.render(unidade));
  },
};
