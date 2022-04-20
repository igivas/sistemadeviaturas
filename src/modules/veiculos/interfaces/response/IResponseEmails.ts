import Email from '@modules/veiculos/entities/Email';

export type IResponseEmails = {
  total: number;
  totalPage: number;
  items: Email[];
};
