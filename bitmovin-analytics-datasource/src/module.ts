import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { BitmovinAnalyticsDataQuery, MyDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, BitmovinAnalyticsDataQuery, MyDataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
