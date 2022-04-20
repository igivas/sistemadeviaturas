import { container } from 'tsyringe';

import IVeiculosRepository from '@modules/veiculos/repositories/interfaces/IVeiculosRepository';
import VeiculosRepository from '@modules/veiculos/repositories/VeiculosRepository';

import IPneusRepository from '@modules/veiculos/repositories/interfaces/IPneusRepository';
import PneusRepository from '@modules/veiculos/repositories/PneusRepository';

import ILocaisExternosRepository from '@modules/veiculos/repositories/interfaces/ILocaisExternosRepository';
import LocaisExternosRepository from '@modules/veiculos/repositories/LocaisExternosRepository';

import IOrgaosRepository from '@modules/veiculos/repositories/interfaces/IOrgaosRepository';
import OrgaosRepository from '@modules/veiculos/repositories/OrgaosRepository';

import { IPrefixoRepository } from '@modules/veiculos/repositories/interfaces/IPrefixosRepository';
import PrefixosRepository from '@modules/veiculos/repositories/PrefixosRepository';

import IAquisicoesRepository from '@modules/veiculos/repositories/interfaces/IAquisicoesRepository';
import AquisicoesRepository from '@modules/veiculos/repositories/AquisicoesRepository';

import ISituacoesRepository from '@modules/veiculos/repositories/interfaces/ISituacoesRepository';
import SituacoesVeiculoRepository from '@modules/veiculos/repositories/SituacoesVeiculoRepository';

import IMovimentacoesFasesRepository from '@modules/veiculos/repositories/interfaces/IMovimentacoesFasesRepository';
import MovimentacoesFasesRepository from '@modules/veiculos/repositories/MovimentacoesFaseRepository';

import ITiposMovimentacoesRepository from '@modules/veiculos/repositories/interfaces/ITiposMovimentacoesRepository';
import TiposMovimentacoesRepository from '@modules/veiculos/repositories/TiposMovimentacoesRepository';

import IMovimentacoesRepository from '@modules/veiculos/repositories/interfaces/IMovimentacoesRepository';
import MovimentacoesRepository from '@modules/veiculos/repositories/MovimentacoesRepository';

import IDadosMovimentacoesMudancasVeiculosRepository from '@modules/veiculos/repositories/interfaces/IDadosMovimentacoesMudancasVeiculosRepository';
import DadosMovimentacoesMudancasVeiculosRepository from '@modules/veiculos/repositories/DadosMovimentacoesMudancasVeiculosRepository';

import IMovimentacoesTransferenciasRepository from '@modules/veiculos/repositories/interfaces/IMovimentacoesTransferenciasRepository';
import MovimentacoesTransferenciaRepository from '@modules/veiculos/repositories/MovimentacoesTransferenciaRepository';

import ICheckRepository from '@modules/veiculos/repositories/interfaces/ICheckRepository';
import CheckRepository from '@modules/veiculos/repositories/CheckRepository';

import IKmsRepository from '@modules/veiculos/repositories/interfaces/IKmsRepository';
import KmsRepository from '@modules/veiculos/repositories/KmsRepository';

import { IIdentificadoresRepository } from '@modules/veiculos/repositories/interfaces/IIdentificadoresRepository';
import IdentificadoresRepository from '@modules/veiculos/repositories/IdentificadoresRepository';

import { IVeiculosIdentificadoresRepository } from '@modules/veiculos/repositories/interfaces/IVeiculosIdentificadoresRepository';
import VeiculosIdentificadoresRepository from '@modules/veiculos/repositories/VeiculosIdentificadoresRepository';

import IDocumentosRepository from '@modules/veiculos/repositories/interfaces/IDocumentosRepository';
import DocumentosRepository from '@modules/veiculos/repositories/DocumentosRepository';

import { IVeiculosPneusRepository } from '@modules/veiculos/repositories/interfaces/IVeiculosPneusRepository';
import VeiculosPneusRepository from '@modules/veiculos/repositories/VeiculosPneusRepository';

import { IEmailsRepository } from '@modules/veiculos/repositories/interfaces/IEmailsRepository';
import EmailsRepository from '@modules/veiculos/repositories/EmailsRepository';

import { IGruposEmailsRepository } from '@modules/veiculos/repositories/interfaces/IGruposEmailsRepository';
import GruposEmailsRepository from '@modules/veiculos/repositories/GruposEmailsRepository';

import IOficinasRepository from '@modules/veiculos/repositories/interfaces/IOficinasRepository';
import OficinasRepository from '@modules/veiculos/repositories/OficinasRepository';

import MovimentacoesManutencoesRepository from '@modules/veiculos/repositories/MovimentacoesManutencoesRepository';
import { IMovimentacoesManutencoesRepository } from '@modules/veiculos/repositories/interfaces/IMovimentacoesManutencoesRepository';

import { IVeiculosLocalizacoesRepository } from '@modules/veiculos/repositories/interfaces/IVeiculosLocalizacoesRepository';
import VeiculosLocalizacoesRepository from '@modules/veiculos/repositories/VeiculosLocalizacoesRepository';

import { IManutencoesOficinasRepository } from '@modules/veiculos/repositories/interfaces/IManutencoesOficinasRepository';
import ManutencoesOficinasRepository from '@modules/veiculos/repositories/ManutencoesOficinasRepository';

/**
 * Inicio da parte de usuario
 */

import IUsuariosRepository from '@modules/seg/repositories/interfaces/IUsuariosRepository';
import UsuariosRepository from '@modules/seg/repositories/UsuariosRepository';

import HashProvider from '@modules/seg/providers/HashProvider/ScriptCaseHashProvider';
import IHashProvider from '@modules/shared/providers/HashProvider/IHashProvider';

import IGraduacoesRepository from '@modules/public/repositories/interfaces/IGraduacoesRepository';
import GraduacoesRepository from '@modules/public/repositories/GraduacoesRepository';

import IGruposUsuarioRepository from '@modules/seg/repositories/interfaces/IGruposUsuarioRespository';
import GruposUsuarioRepository from '@modules/seg/repositories/GruposUsuarioRepository';

import UsuariosUnidadesRepository from '@modules/public/repositories/UsuariosUnidadesRepository';
import IUsuariosUnidadesRepository from '@modules/public/repositories/interfaces/IUsuariosUnidadesRepository';

import { IMunicipiosRepository } from '@modules/public/repositories/interfaces/IMunicipiosRepository';
import MunicipiosRepository from '@modules/public/repositories/MunicipiosRepository';

import { IEnderecosRepository } from '@modules/public/repositories/interfaces/IEnderecosRepository';
import EnderecosRepository from '@modules/public/repositories/EnderecosRepository';

import IVeiculosModelosRepository from '@modules/veiculos/repositories/interfaces/IVeiculosModelosRepository';
import VeiculosModelosRepository from '@modules/veiculos/repositories/VeiculosModelosRepository';
import IVeiculosEspeciesRepository from '@modules/veiculos/repositories/interfaces/IVeiculosEspeciesRepository';
import VeiculosEspeciesRepository from '@modules/veiculos/repositories/VeiculosEspeciesRepository';
import IVeiculosMarcasRepository from '@modules/veiculos/repositories/interfaces/IVeiculosMarcasRepository';
import VeiculosMarcasRepository from '@modules/veiculos/repositories/VeiculosMarcasRepository';
import IPessoasFisicasPmsPublicRepository from '../modules/public/repositories/interfaces/IPessoasFisicasPmsRepository';
import PessoasFisicasPmsPublicRepository from '../modules/public/repositories/PessoasFisicasPmsRepository';

import ISistemasRepository from '../modules/seg/repositories/interfaces/ISistemasRespository';
import SistemasRepository from '../modules/seg/repositories/SistemasRepository';

import UnidadesRepository from '../modules/public/repositories/UnidadesRepository';
import IUnidadesRepository from '../modules/public/repositories/interfaces/IUnidadesRepository';

container.registerSingleton<IVeiculosRepository>(
  'VeiculosRepository',
  VeiculosRepository,
);

container.registerSingleton<IMovimentacoesRepository>(
  'MovimentacoesRepository',
  MovimentacoesRepository,
);

container.registerSingleton<IDadosMovimentacoesMudancasVeiculosRepository>(
  'DadosMovimentacoesMudancasVeiculosRepository',
  DadosMovimentacoesMudancasVeiculosRepository,
);

container.registerSingleton<IMovimentacoesTransferenciasRepository>(
  'MovimentacoesTransferenciaRepository',
  MovimentacoesTransferenciaRepository,
);

container.registerSingleton<IMovimentacoesFasesRepository>(
  'MovimentacoesFasesRepository',
  MovimentacoesFasesRepository,
);

container.registerSingleton<ITiposMovimentacoesRepository>(
  'TiposMovimentacoesRepository',
  TiposMovimentacoesRepository,
);

container.registerSingleton<ILocaisExternosRepository>(
  'LocaisExternosRepository',
  LocaisExternosRepository,
);

container.registerSingleton<IMovimentacoesManutencoesRepository>(
  'MovimentacoesManutencoesRepository',
  MovimentacoesManutencoesRepository,
);

container.registerSingleton<IManutencoesOficinasRepository>(
  'ManutencoesOficinasRepository',
  ManutencoesOficinasRepository,
);

container.registerSingleton<IVeiculosLocalizacoesRepository>(
  'VeiculosLocalizacoesRepository',
  VeiculosLocalizacoesRepository,
);

container.registerSingleton<IOficinasRepository>(
  'OficinasRepository',
  OficinasRepository,
);

container.registerSingleton<IPneusRepository>(
  'PneusRepository',
  PneusRepository,
);

container.registerSingleton<IVeiculosPneusRepository>(
  'VeiculosPneusRepository',
  VeiculosPneusRepository,
);

container.registerSingleton<IOrgaosRepository>(
  'OrgaosRepository',
  OrgaosRepository,
);

container.registerSingleton<IPrefixoRepository>(
  'PrefixosRepository',
  PrefixosRepository,
);

container.registerSingleton<IVeiculosIdentificadoresRepository>(
  'VeiculosIdentificadoresRepository',
  VeiculosIdentificadoresRepository,
);

container.registerSingleton<IKmsRepository>('KmsRepository', KmsRepository);

container.registerSingleton<IAquisicoesRepository>(
  'AquisicoesRepository',
  AquisicoesRepository,
);

container.registerSingleton<ISituacoesRepository>(
  'SituacoesVeiculoRepository',
  SituacoesVeiculoRepository,
);

container.registerSingleton<IIdentificadoresRepository>(
  'IdentificadoresRepository',
  IdentificadoresRepository,
);

container.registerSingleton<ICheckRepository>(
  'ICheckRepository',
  CheckRepository,
);

container.registerSingleton<IDocumentosRepository>(
  'DocumentosRepository',
  DocumentosRepository,
);

container.registerSingleton<IEmailsRepository>(
  'EmailsRepository',
  EmailsRepository,
);

container.registerSingleton<IGruposEmailsRepository>(
  'GruposEmailsRepository',
  GruposEmailsRepository,
);

/**
 * Inicio da parte de usuario
 */

container.registerSingleton<IGruposUsuarioRepository>(
  'GruposUsuarioRepository',
  GruposUsuarioRepository,
);

container.registerSingleton<ISistemasRepository>(
  'SistemasRepository',
  SistemasRepository,
);

container.registerSingleton<IUsuariosUnidadesRepository>(
  'UsuariosUnidadesRepository',
  UsuariosUnidadesRepository,
);

container.registerSingleton<IHashProvider>('HashProvider', HashProvider);

container.registerSingleton<IUnidadesRepository>(
  'UnidadesRepository',
  UnidadesRepository,
);

container.registerSingleton<IUsuariosRepository>(
  'UsuariosRepository',
  UsuariosRepository,
);
container.registerSingleton<IGraduacoesRepository>(
  'GraduacoesRepository',
  GraduacoesRepository,
);

container.registerSingleton<IPessoasFisicasPmsPublicRepository>(
  'PessoasFisicasPmsPublicRepository',
  PessoasFisicasPmsPublicRepository,
);

container.registerSingleton<IMunicipiosRepository>(
  'MunicipiosRepository',
  MunicipiosRepository,
);

container.registerSingleton<IEnderecosRepository>(
  'EnderecosRepository',
  EnderecosRepository,
);

container.registerSingleton<IVeiculosModelosRepository>(
  'VeiculosModelosRepository',
  VeiculosModelosRepository,
);

container.registerSingleton<IVeiculosEspeciesRepository>(
  'VeiculosEspeciesRepository',
  VeiculosEspeciesRepository,
);

container.registerSingleton<IVeiculosMarcasRepository>(
  'VeiculosMarcasRepository',
  VeiculosMarcasRepository,
);

export default container;
