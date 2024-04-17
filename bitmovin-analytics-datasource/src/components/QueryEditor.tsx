import React, { ChangeEvent } from 'react';
import { FieldSet, InlineField, InlineSwitch, Input, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';
import { DEFAULT_SELECTABLE_QUERY_INTERVAL, SELECTABLE_QUERY_INTERVALS } from '../utils/intervalUtils';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const onIntervalChange = (item: SelectableValue) => {
    onChange({ ...query, interval: item.value });
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
