export const OPERATOR = {
  GT: 'GT',
  GTE: 'GTE',
  LT: 'LT',
  LTE: 'LTE',
  EQ: 'EQ',
  NQ: 'NQ',
  CONTAINS: 'CONTAINS',
  NOTCONTAINS: 'NOTCONTAINS'
};

export const OPERATOR_LIST = Object.keys(OPERATOR).map(key => OPERATOR[key]);
