export const requiredField = (field: string): string =>
  `Campo ${field.toUpperCase()} é requerido`;

export const maxLengthRequiredField = (field: string, length: number): string =>
  `Campo ${field.toUpperCase()} é de no máximo ${length} caracteres`;

export const dateTypeErrorField = (field: string, isYear = false): string =>
  `Insira um(a) ${field.toUpperCase()} ${isYear ? 'com ano' : ''} válida`;
