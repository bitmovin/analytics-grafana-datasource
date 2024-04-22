import React, { ChangeEvent, useEffect, useState } from 'react';
import { FieldSet, InlineField, InlineSwitch, Input, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';
import { DEFAULT_SELECTABLE_QUERY_INTERVAL, SELECTABLE_QUERY_INTERVALS } from '../utils/intervalUtils';
import { DEFAULT_SELECTABLE_AGGREGATION, SELECTABLE_AGGREGATIONS } from '../types/aggregations';
import { fetchLicenses, SelectableLicense } from '../utils/licenses';
import { SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery, datasource }: Props) {
  const [licenses, setLicenses] = useState<SelectableLicense[]>([]);
  const [isTimeSeries, setIsTimeSeries] = useState(true);

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

  const onLicenseChange = (item: SelectableValue) => {
    onChange({ ...query, licenseKey: item.value });
    onRunQuery();
  };

  const onMetricChange = (item: SelectableValue) => {
    onChange({ ...query, aggregation: item.value });
    onRunQuery();
  };

  const onDimensionChange = (item: SelectableValue) => {
    onChange({ ...query, dimension: item.value });
    onRunQuery();
  };

  const onFormatAsTimeSeriesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsTimeSeries(event.currentTarget.checked);
    if (event.currentTarget.checked) {
      onChange({ ...query, interval: 'AUTO' });
    } else {
      onChange({ ...query, interval: undefined });
    }
    onRunQuery();
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
        <InlineField label="Dimension" labelWidth={20}>
          <Select
            onChange={(item) => onDimensionChange(item)}
            width={20}
            options={datasource.adAnalytics ? SELECTABLE_QUERY_AD_ATTRIBUTES : SELECTABLE_QUERY_ATTRIBUTES}
          />
        </InlineField>
        <InlineField label="Format as time series" labelWidth={20}>
          <InlineSwitch value={isTimeSeries} onChange={onFormatAsTimeSeriesChange}></InlineSwitch>
        </InlineField>
        {isTimeSeries && renderTimeSeriesOption()}
        <InlineField label="Limit" labelWidth={20}>
          <Input type="number" onChange={onLimitChange} width={20} />
        </InlineField>
      </FieldSet>
    </div>
  );
}
