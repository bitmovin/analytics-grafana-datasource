export const AGGREGATION = {
  COUNT: 'count',
  SUM: 'sum',
  AVG: 'avg',
  MIN: 'min',
  MAX: 'max',
  STDDEV: 'stddev',
  PERCENTILE: 'percentile',
  VARIANCE: 'variance',
  MEDIAN: 'median'
};

export const AGGREGATION_LIST = Object.keys(AGGREGATION).map(key => AGGREGATION[key]);
