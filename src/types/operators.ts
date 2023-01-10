export enum OPERATOR {
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
  EQ = 'EQ',
  NE = 'NE',
  CONTAINS = 'CONTAINS',
  NOTCONTAINS = 'NOTCONTAINS',
  IN = 'IN'
}

export enum ORDERBY {
  ASC = 'ASC',
  DESC = 'DESC'
}

export const OPERATOR_LIST = Object.values(OPERATOR);
export const ORDERBY_LIST = Object.values(ORDERBY);
