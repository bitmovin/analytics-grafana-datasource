import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { FieldSet, HorizontalGroup, InlineField, InlineSwitch, Input, Select } from '@grafana/ui';
import type { QueryEditorProps, SelectableValue } from '@grafana/data';
import { defaults } from 'lodash';

import { DataSource } from '../datasource';
import {
  BitmovinDataSourceOptions,
  BitmovinAnalyticsDataQuery,
  DEFAULT_QUERY,
  OldBitmovinAnalyticsDataQuery,
} from '../types/grafanaTypes';
import { fetchLicenses } from '../utils/licenses';
import { DEFAULT_SELECTABLE_QUERY_INTERVAL, SELECTABLE_QUERY_INTERVALS } from '../utils/intervalUtils';
import { SELECTABLE_AGGREGATION_METHODS } from '../types/aggregationMethod';
import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { isMetric, SELECTABLE_METRICS } from '../types/metric';
import { GroupByRow } from './GroupByRow';
import { OrderByRow } from './OrderByRow';
import type { QueryOrderBy } from '../types/queryOrderBy';
import type { QueryFilter } from '../types/queryFilter';
import { FilterRow } from './FilterRow';

enum LoadingState {
  Default = 'DEFAULT',
  Loading = 'LOADING',
  Success = 'SUCCESS',
  Error = 'ERROR',
}

type Props = QueryEditorProps<
  DataSource,
  BitmovinAnalyticsDataQuery | OldBitmovinAnalyticsDataQuery,
  BitmovinDataSourceOptions
>;

export function QueryEditor(props: Props) {
  const query = defaults(props.query, DEFAULT_QUERY);
  const [selectableLicenses, setSelectableLicenses] = useState<SelectableValue[]>([]);
  const [licenseLoadingState, setLicenseLoadingState] = useState<LoadingState>(LoadingState.Default);
  const [licenseErrorMessage, setLicenseErrorMessage] = useState('');
  const [isTimeSeries, setIsTimeSeries] = useState(query.resultFormat === 'time_series');
  const [percentileValue, setPercentileValue] = useState(query.percentileValue);
  const isMetricSelected = useMemo(() => {
    return query.dimension ? isMetric(query.dimension) : false;
  }, [query.dimension]);
  const isPercentileSelected = useMemo(() => {
    return query.metric === 'percentile';
  }, [query.metric]);

  /** Fetch Licenses */
  useEffect(() => {
    setLicenseLoadingState(LoadingState.Loading);
    fetchLicenses(props.datasource.apiKey, props.datasource.baseUrl, props.datasource.tenantOrgId)
      .then((licenses) => {
        setSelectableLicenses(licenses);
        setLicenseLoadingState(LoadingState.Success);
      })
      .catch((e) => {
        setLicenseLoadingState(LoadingState.Error);
        setLicenseErrorMessage(e.status + ' ' + e.statusText);
      });
  }, [props.datasource.apiKey, props.datasource.baseUrl, props.datasource.tenantOrgId]);

  const handleLicenseChange = (item: SelectableValue) => {
    props.onChange({ ...query, license: item.value });
    props.onRunQuery();
  };

  const handleAggregationChange = (item: SelectableValue) => {
    // set a default value when percentile is selected and delete percentileValue when percentile is deselected
    // to not pollute the dashboard.json file
    let percentile = undefined;
    if (item.value === 'percentile' && percentileValue == null) {
      setPercentileValue(95);
      percentile = 95;
    } else {
      setPercentileValue(undefined);
    }

    props.onChange({ ...query, metric: item.value, percentileValue: percentile });
    props.onRunQuery();
  };

  const handleDimensionChange = (item: SelectableValue) => {
    props.onChange({ ...query, dimension: item.value });
    props.onRunQuery();
  };

  const handleGroupByChange = (newGroupBys: Array<QueryAttribute | QueryAdAttribute>) => {
    props.onChange({ ...query, groupBy: newGroupBys });
    props.onRunQuery();
  };

  const handleOrderByChange = (newOrderBys: QueryOrderBy[]) => {
    props.onChange({ ...query, orderBy: newOrderBys });
    props.onRunQuery();
  };

  const handleQueryFilterChange = (newFilters: QueryFilter[]) => {
    props.onChange({ ...query, filter: newFilters });
    props.onRunQuery();
  };

  const handleLimitBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const limit = parseInt(event.target.value, 10);
    props.onChange({ ...query, limit: isNaN(limit) ? undefined : limit });
    props.onRunQuery();
  };

  const handleFormatAsTimeSeriesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsTimeSeries(event.currentTarget.checked);
    if (event.currentTarget.checked) {
      props.onChange({ ...query, interval: 'AUTO', resultFormat: 'time_series' });
    } else {
      props.onChange({ ...query, interval: undefined, resultFormat: 'table' });
    }
    props.onRunQuery();
  };

  const handleIntervalChange = (item: SelectableValue) => {
    props.onChange({ ...query, interval: item.value });
    props.onRunQuery();
  };

  const handleAliasByBlur = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange({ ...query, alias: event.target.value });
    props.onRunQuery();
  };

  const handlePercentileValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    let percentile = parseInt(event.target.value, 10);
    if (percentile < 0) {
      percentile = 0;
    } else if (percentile > 99) {
      percentile = 99;
    }
    setPercentileValue(percentile);
  };

  const handlePercentileBlur = () => {
    props.onChange({ ...query, percentileValue: percentileValue });
    props.onRunQuery();
  };

  const renderTimeSeriesOption = () => {
    return (
      <>
        <InlineField label="Interval" labelWidth={20}>
          <Select
            id={`query-editor-${props.query.refId}_interval-select`}
            defaultValue={DEFAULT_SELECTABLE_QUERY_INTERVAL}
            value={query.interval}
            onChange={(item) => handleIntervalChange(item)}
            width={30}
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
          required
        >
          <Select
            id={`query-editor-${props.query.refId}_license-select`}
            value={query.license}
            onChange={handleLicenseChange}
            width={30}
            options={selectableLicenses}
            noOptionsMessage="No Analytics Licenses found"
            isLoading={licenseLoadingState === LoadingState.Loading}
            placeholder={licenseLoadingState === LoadingState.Loading ? 'Loading Licenses' : 'Choose License'}
          />
        </InlineField>
        <HorizontalGroup spacing="xs">
          {!isMetricSelected && (
            <InlineField label="Metric" labelWidth={20} required>
              <Select
                value={query.metric}
                onChange={(item) => handleAggregationChange(item)}
                width={30}
                options={SELECTABLE_AGGREGATION_METHODS}
                id={`query-editor-${props.query.refId}_aggregation-method-select`}
              />
            </InlineField>
          )}
          {isPercentileSelected && (
            <Input
              id={`query-editor-${props.query.refId}_percentile-value-input`}
              value={percentileValue}
              onChange={handlePercentileValueChange}
              onBlur={handlePercentileBlur}
              type="number"
              placeholder="value"
              width={10}
            />
          )}
        </HorizontalGroup>
        <InlineField label="Dimension" labelWidth={20} required>
          <Select
            value={query.dimension}
            onChange={handleDimensionChange}
            width={30}
            options={
              props.datasource.isAdAnalytics
                ? SELECTABLE_QUERY_AD_ATTRIBUTES
                : SELECTABLE_QUERY_ATTRIBUTES.concat(SELECTABLE_METRICS)
            }
            id={`query-editor-${props.query.refId}_dimension-select`}
          />
        </InlineField>
        <InlineField label="Filter" labelWidth={20}>
          <FilterRow
            isAdAnalytics={props.datasource.isAdAnalytics ? true : false}
            onQueryFilterChange={handleQueryFilterChange}
            filters={query.filter}
            queryEditorId={props.query.refId}
          />
        </InlineField>
        <InlineField label="Group By" labelWidth={20}>
          <GroupByRow
            isAdAnalytics={props.datasource.isAdAnalytics ? true : false}
            onChange={handleGroupByChange}
            groupBys={query.groupBy}
            queryEditorId={props.query.refId}
          />
        </InlineField>
        <InlineField label="Order By" labelWidth={20}>
          <OrderByRow
            isAdAnalytics={props.datasource.isAdAnalytics ? true : false}
            onChange={handleOrderByChange}
            orderBys={query.orderBy}
            queryEditorId={props.query.refId}
          />
        </InlineField>
        <InlineField label="Limit" labelWidth={20}>
          <Input
            id={`query-editor-${props.query.refId}_limit-input`}
            defaultValue={query.limit}
            type="number"
            onBlur={handleLimitBlur}
            width={30}
            placeholder="No limit"
          />
        </InlineField>
        <InlineField label="Format as time series" labelWidth={20}>
          <InlineSwitch
            id={`query-editor-${props.query.refId}_format-as-time-series-switch`}
            value={isTimeSeries}
            onChange={handleFormatAsTimeSeriesChange}
          ></InlineSwitch>
        </InlineField>
        {isTimeSeries && renderTimeSeriesOption()}
        <InlineField label="Alias By" labelWidth={20}>
          <Input
            id={`query-editor-${props.query.refId}_alias-by-input`}
            defaultValue={query.alias}
            placeholder="Naming pattern"
            onBlur={handleAliasByBlur}
          />
        </InlineField>
      </FieldSet>
    </div>
  );
}
