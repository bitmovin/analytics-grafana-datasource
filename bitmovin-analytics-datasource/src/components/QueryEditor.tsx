import React, { ChangeEvent, useEffect, useState } from 'react';
import { FieldSet, InlineField, InlineSwitch, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';

import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';
import { fetchLicenses } from '../utils/licenses';
import { DEFAULT_SELECTABLE_QUERY_INTERVAL, SELECTABLE_QUERY_INTERVALS } from '../utils/intervalUtils';
import { DEFAULT_SELECTABLE_AGGREGATION, SELECTABLE_AGGREGATIONS } from '../types/aggregations';
import { SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';

enum LoadingState {
  Default = 'DEFAULT',
  Loading = 'LOADING',
  Success = 'SUCCESS',
  Error = 'ERROR',
}

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery, datasource }: Props) {
  const [selectableLicenses, setSelectableLicenses] = useState<SelectableValue[]>([]);
  const [licenseLoadingState, setLicenseLoadingState] = useState<LoadingState>(LoadingState.Default);
  const [licenseErrorMessage, setLicenseErrorMessage] = useState('');
  const [isTimeSeries, setIsTimeSeries] = useState(true);

  useEffect(() => {
    setLicenseLoadingState(LoadingState.Loading);
    fetchLicenses(datasource.apiKey, datasource.baseUrl)
      .then((licenses) => {
        setSelectableLicenses(licenses);
        setLicenseLoadingState(LoadingState.Success);
      })
      .catch((e) => {
        setLicenseLoadingState(LoadingState.Error);
        setLicenseErrorMessage(e.status + ' ' + e.statusText);
      });
  }, [datasource.apiKey, datasource.baseUrl]);

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

  const onIntervalChange = (item: SelectableValue) => {
    onChange({ ...query, interval: item.value });
    onRunQuery();
  };

  const renderTimeSeriesOption = () => {
    return (
      <>
        <InlineField label="Interval" labelWidth={20}>
          <Select
            defaultValue={DEFAULT_SELECTABLE_QUERY_INTERVAL}
            onChange={(item) => onIntervalChange(item)}
            width={40}
            options={SELECTABLE_QUERY_INTERVALS}
          />
        </InlineField>
      </>
    );
  };

  return (
    <div className="gf-form">
      <FieldSet>
        <InlineField
          label="License"
          labelWidth={20}
          invalid={licenseLoadingState === LoadingState.Error}
          error={`Error when fetching Analytics Licenses: ${licenseErrorMessage}`}
          disabled={licenseLoadingState === LoadingState.Error}
        >
          <Select
            onChange={onLicenseChange}
            width={40}
            options={selectableLicenses}
            noOptionsMessage="No Analytics Licenses found"
            isLoading={licenseLoadingState === LoadingState.Loading}
            placeholder={licenseLoadingState === LoadingState.Loading ? 'Loading Licenses' : 'Choose License'}
          />
        </InlineField>
        <InlineField label="Metric" labelWidth={20}>
          <Select
            defaultValue={DEFAULT_SELECTABLE_AGGREGATION}
            onChange={(item) => onMetricChange(item)}
            width={40}
            options={SELECTABLE_AGGREGATIONS}
          />
        </InlineField>
        <InlineField label="Dimension" labelWidth={20}>
          <Select
            onChange={onDimensionChange}
            width={40}
            options={datasource.adAnalytics ? SELECTABLE_QUERY_AD_ATTRIBUTES : SELECTABLE_QUERY_ATTRIBUTES}
          />
        </InlineField>
        <InlineField label="Format as time series" labelWidth={20}>
          <InlineSwitch value={isTimeSeries} onChange={onFormatAsTimeSeriesChange}></InlineSwitch>
        </InlineField>
        {isTimeSeries && renderTimeSeriesOption()}
      </FieldSet>
    </div>
  );
}
