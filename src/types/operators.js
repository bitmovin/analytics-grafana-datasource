export const OPERATOR = {
  GT: 'GT',
  GTE: 'GTE',
  LT: 'LT',
  LTE: 'LTE',
  EQ: 'EQ',
  NQ: 'NQ',
  CONTAINS: 'CONTAINS',
  NOTCONTAINS: 'NOTCONTAINS',
  IN: 'IN'
};

export const ORDERBY = {
  ASC: 'ASC',
  DESC: 'DESC'
};

export const OPERATOR_LIST = Object.keys(OPERATOR).map(key => OPERATOR[key]);
export const ORDERBY_LIST = Object.keys(ORDERBY).map(key => ORDERBY[key]);
