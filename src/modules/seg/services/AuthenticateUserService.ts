/* eslint-disable @typescript-eslint/no-unused-vars */

import { sign } from 'jsonwebtoken';
import Usuario from '@modules/seg/entities/Usuario';
import authConfig from '@config/auth';
import { injectable, inject } from 'tsyringe';

import IUsuariosRepository from '@modules/seg/repositories/interfaces/IUsuariosRepository';
import IGraduacoesRepository from '@modules/seg/repositories/interfaces/IGraduacoesRepository';
import IPessoasFisicasPmsRepository from '@modules/public/repositories/interfaces/IPessoasFisicasPmsRepository';
import IGruposUsuarioRepository from '@modules/seg/repositories/interfaces/IGruposUsuarioRespository';
import IUnidadesRepository from '@modules/public/repositories/interfaces/IUnidadesRepository';
// import IUsuariosUnidadesRepository from '@modules/public/repositories/interfaces/IUsuariosUnidadesRepository';
import UnidadeDTOResponse from '@modules/veiculos/dto/Response/UnidadeDTOResponse';
import AppError from '../../../errors/AppError';
import IHashProvider from '../providers/HashProvider/IHashProvider';
import unidadesView from '../../../views/unidades_view';
import jwtContext from '../../../contexts/jwtContext';

type PerfilFormat = {
  id_perfil: number;
  descricao: string;
};
interface IRequest {
  matricula: string;
  senha: string;
}

interface IUsuario extends Usuario {
  id_usuario: string;
  nome: string;
  cpf: string;
  email?: string;
  pm_apelido?: string;
  pm_codigo?: string;
  pm_numero?: string;
  matricula?: string;
  militar: boolean;
  gra_codigo?: number;
  graduacao?: { gra_nome: string; gra_sigla: string; gra_codigo: number };
  perfis: PerfilFormat[];
  currentPerfil?: {
    value: string;
    label: string;
  };
  opm?: any;
  opms?: UnidadeDTOResponse[];
}

export interface IResponse {
  usuario: Omit<
    IUsuario,
    | 'usu_senha'
    | 'usu_nome'
    | 'usu_nome'
    | 'usu_email'
    | 'usu_codigo'
    | 'uni_codigo'
    | 'usu_nivel'
  >;
  token: string;
}

@injectable()
class AuthenticateUsuarioService {
  constructor(
    @inject('UsuariosRepository')
    private usuariosRepository: IUsuariosRepository,

    @inject('PessoasFisicasPmsPublicRepository')
    private pessoasFisicasPmsRepository: IPessoasFisicasPmsRepository,

    @inject('GraduacoesRepository')
    private graduacoesRepository: IGraduacoesRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UnidadesRepository')
    private unidadesRepository: IUnidadesRepository,

    @inject('GruposUsuarioRepository')
    private gruposUsuarioRepository: IGruposUsuarioRepository,
  ) {}

  public async execute({ matricula, senha }: IRequest): Promise<IResponse> {
    const matriculaSanatized = matricula.replace(/[.-]/g, '').trim();
    const senhaSanatized = senha.trim();
    const usuario = await this.usuariosRepository.findByMatricula(
      matriculaSanatized,
    );

    if (!usuario) {
      throw new AppError('Combinação incorreta de matrícula e senha.', 401);
    }

    const senhaMatched = await this.hashProvider.compareHash(
      senhaSanatized,
      usuario.usu_senha,
    );

    if (!senhaMatched) {
      throw new AppError('Combinação incorreta de matrícula e senha.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const pessoaFisicaPm = await this.pessoasFisicasPmsRepository.findByMatricula(
      matricula,
    );

    let usuarioObject: IUsuario;

    const grupos = await this.gruposUsuarioRepository.findByMatriculaSistema(
      matricula,
      [Number(process.env.ID_SISTEMA)],
    );

    if (grupos.length <= 0 && usuario.usu_nivel < 1) {
      throw new AppError(
        'Usuário não tem permissão pra acessar este sistema!',
        401,
      );
    }

    let perfis;

    if (pessoaFisicaPm) {
      const graduacao = await this.graduacoesRepository.findById(
        pessoaFisicaPm.gra_codigo,
      );

      const opm = await this.unidadesRepository.findById(
        pessoaFisicaPm.uni_codigo,
      );

      let formatedOpm;
      if (opm) formatedOpm = unidadesView.render(opm);

      perfis = grupos.map(grupo => {
        return {
          descricao: grupo?.gru_nome,
          id_perfil: grupo?.gru_codigo,
        };
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { pm_cpf, uni_codigo, ...restPessoaFisicaPM } = pessoaFisicaPm;

      usuarioObject = {
        id_usuario: usuario.usu_codigo,
        militar: true,
        matricula: pessoaFisicaPm.pm_codigo,
        cpf: pm_cpf,
        nome: usuario.usu_nome,
        ...restPessoaFisicaPM,
        ...usuario,
        graduacao,
        opm: formatedOpm,
        email: usuario.usu_email,
        perfis,
        currentPerfil: {
          label: perfis[0]?.descricao,
          value: perfis[0]?.id_perfil.toString(),
        },
        // opms,
      };
    } else {
      perfis = grupos.map(grupo => {
        return {
          descricao: grupo.gru_nome,
          id_perfil: grupo.gru_codigo,
        };
      });

      usuarioObject = {
        id_usuario: usuario.usu_codigo,
        cpf: usuario.usu_codigo,
        nome: usuario.usu_nome,
        militar: false,
        ...usuario,
        perfis,
      };
    }

    usuarioObject.perfis =
      usuario.usu_nivel > 0
        ? [
            ...perfis,
            {
              descricao:
                usuario?.usu_nivel === 1
                  ? 'SAV - Administrador'
                  : 'SAV - Superadministrador',
              id_perfil: usuario?.usu_nivel,
            },
          ]
        : perfis;

    const token = jwtContext.createToken(secret, {
      id_usuario: usuario.usu_codigo,
      perfis: usuarioObject.perfis,
    });

    delete usuarioObject.gra_codigo;
    // eslint-disable-next-line
    const {
      usu_senha,
      usu_nome,
      usu_email,
      usu_codigo,
      ...rest
    } = usuarioObject;

    return { usuario: { ...rest }, token };
  }
}

export default AuthenticateUsuarioService;
