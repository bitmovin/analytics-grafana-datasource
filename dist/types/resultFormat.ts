export enum ResultFormat {
  TABLE = 'table',
  TIME_SERIES = 'time_series'
}

export type ResultData = {series: ResultSeriesData[], datapointsCnt: number}

export type ResultSeriesData = {target: any, datapoints: [any[]]}
