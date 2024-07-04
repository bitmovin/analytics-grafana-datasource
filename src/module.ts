import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import {
  BitmovinAnalyticsDataQuery,
  BitmovinDataSourceOptions,
  OldBitmovinAnalyticsDataQuery,
} from './types/grafanaTypes';

export const plugin = new DataSourcePlugin<
  DataSource,
  BitmovinAnalyticsDataQuery | OldBitmovinAnalyticsDataQuery,
  BitmovinDataSourceOptions
>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
