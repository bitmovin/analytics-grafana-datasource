import React, { ChangeEvent, useEffect, useState } from 'react';
import { FieldSet, InlineField, InlineSwitch, Input, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';
import { DEFAULT_SELECTABLE_QUERY_INTERVAL, SELECTABLE_QUERY_INTERVALS } from '../utils/intervalUtils';
import { DEFAULT_SELECTABLE_AGGREGATION, SELECTABLE_AGGREGATIONS } from '../types/aggregations';
import { fetchLicenses, SelectableLicense } from '../utils/licenses';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery, datasource }: Props) {
  const [licenses, setLicenses] = useState<SelectableLicense[]>([]);

  useEffect(() => {
    fetchLicenses(datasource.apiKey, datasource.baseUrl).then((licenses) => {
      setLicenses(licenses);
    }); //TODOMY how to handle error when fetching license?
  }, []);
  const onIntervalChange = (item: SelectableValue) => {
    onChange({ ...query, interval: item.value });
    //TODOMY when should the query be rerun?
    onRunQuery();
  };

  const onMetricChange = (item: SelectableValue) => {
    onChange({ ...query, aggregation: item.value });
    onRunQuery();
  };

  const onLicenseChange = (item: SelectableValue) => {
    onChange({ ...query, licenseKey: item.value });
    onRunQuery();
  };

  const onFormatAsTimeSeriesChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, timeSeries: event.currentTarget.checked });
  };

  const onLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, limit: event.target.value as unknown as number });
  };

  const renderTimeSeriesOption = () => {
    return (
      <>
        <InlineField label="Interval" labelWidth={20}>
          <Select
            defaultValue={DEFAULT_SELECTABLE_QUERY_INTERVAL}
            onChange={(item) => onIntervalChange(item)}
            width={20}
            options={SELECTABLE_QUERY_INTERVALS}
          />
        </InlineField>
      </>
    );
  };

  const { timeSeries } = query;

  return (
    <div className="gf-form">
      <FieldSet>
        <InlineField label="License" labelWidth={20}>
          <Select onChange={(item) => onLicenseChange(item)} width={20} options={licenses} />
        </InlineField>
        <InlineField label="Metric" labelWidth={20}>
          <Select
            defaultValue={DEFAULT_SELECTABLE_AGGREGATION}
            onChange={(item) => onMetricChange(item)}
            width={20}
            options={SELECTABLE_AGGREGATIONS}
          />
        </InlineField>
        <InlineField label="Format as time series" labelWidth={20}>
          <InlineSwitch onChange={onFormatAsTimeSeriesChange}></InlineSwitch>
        </InlineField>
        {timeSeries && renderTimeSeriesOption()}
        <InlineField label="Limit" labelWidth={20}>
          <Input type="number" onChange={onLimitChange} width={20} />
        </InlineField>
      </FieldSet>
    </div>
  );
}
