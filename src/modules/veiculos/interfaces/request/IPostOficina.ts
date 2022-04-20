export type IDadosOficina = {
  nome: string;
  id_oficina_pai?: string;
  cpf_cnpj: string;
  id_municipio: string;
  ativo: '0' | '1';
  endereco: string;
  numero: string;
  endereco_complemento?: string;
};

export type IPostOficina = {
  criado_por: string;
  oficinas: IDadosOficina[];
};
