export type IDadosVeiculosModelos = {
  id_veiculo_marca: number;
  id_veiculo_especie: number;
  nome: string;
};

export type IPostVeiculosModelos = {
  criado_por: string;
  veiculos_modelos: IDadosVeiculosModelos[];
};
