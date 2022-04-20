import Usuario from '@modules/public/entities/Usuario';
import PessoaFisicaPm from '@modules/public/entities/PessoaFisicaPm';
import UsuarioDTOResponse from '@modules/veiculos/dto/Response/UsuarioDTOResponse';

export default {
  render(
    usuario: Pick<
      PessoaFisicaPm,
      'pm_codigo' | 'gra_codigo' | 'pm_cpf' | 'pessoa'
    >,
  ): UsuarioDTOResponse {
    return new UsuarioDTOResponse(usuario);
  },

  renderMany(
    usuarios: Pick<
      PessoaFisicaPm,
      'pm_codigo' | 'gra_codigo' | 'pm_cpf' | 'pessoa'
    >[],
  ): UsuarioDTOResponse[] {
    return usuarios.map(usuario => this.render(usuario));
  },
};
