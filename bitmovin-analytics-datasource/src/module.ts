import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { BitmovinAnalyticsDataQuery, BitmovinDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, BitmovinAnalyticsDataQuery, BitmovinDataSourceOptions>(
  DataSource
)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
