import React from 'react';
import { FieldSet, InlineField, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';
import { QueryIntervals } from '../utils/intervalUtils';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const onIntervalChange = (item: SelectableValue) => {
    onChange({ ...query, interval: item.value });
    onRunQuery();
  };

  return (
    <div className="gf-form">
      <FieldSet>
        <InlineField label="Interval" labelWidth={10}>
          <Select
            defaultValue={QueryIntervals[0]}
            onChange={(item) => onIntervalChange(item)}
            width={20}
            options={QueryIntervals}
          />
        </InlineField>
      </FieldSet>
    </div>
  );
}
