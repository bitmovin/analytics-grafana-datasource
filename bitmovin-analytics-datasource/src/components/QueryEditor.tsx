import React, { ChangeEvent, useEffect, useState } from 'react';
import { FieldSet, InlineField, InlineSwitch, Input, Select } from '@grafana/ui';
import type { QueryEditorProps, SelectableValue } from '@grafana/data';
import { defaults } from 'lodash';

import { DataSource } from '../datasource';
import { BitmovinDataSourceOptions, BitmovinAnalyticsDataQuery, DEFAULT_QUERY } from '../types/grafanaTypes';
import { fetchLicenses } from '../utils/licenses';
import { DEFAULT_SELECTABLE_QUERY_INTERVAL, SELECTABLE_QUERY_INTERVALS } from '../utils/intervalUtils';
import { SELECTABLE_AGGREGATIONS } from '../types/aggregations';
import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { isMetric, SELECTABLE_METRICS } from '../types/metric';
import { GroupByRow } from './GroupByRow';
import { OrderByRow } from './OrderByRow';
import type { QueryOrderBy } from '../types/queryOrderBy';
import type { QueryFilter, QueryFilterOperator, QueryFilterValue } from '../types/queryFilter';
import { FilterRow } from './FilterRow';
import { mapFilterValueToRawFilterValue } from '../utils/filterUtils';

enum LoadingState {
  Default = 'DEFAULT',
  Loading = 'LOADING',
  Success = 'SUCCESS',
  Error = 'ERROR',
}

export type FilterRowData = {
  attribute: QueryAdAttribute | QueryAttribute;
  operator: QueryFilterOperator;
  rawFilterValue: string;
  convertedFilterValue: QueryFilterValue;
  parsingValueError: string;
};

type Props = QueryEditorProps<DataSource, BitmovinAnalyticsDataQuery, BitmovinDataSourceOptions>;

export function QueryEditor(props: Props) {
  const [selectableLicenses, setSelectableLicenses] = useState<SelectableValue[]>([]);
  const [licenseLoadingState, setLicenseLoadingState] = useState<LoadingState>(LoadingState.Default);
  const [licenseErrorMessage, setLicenseErrorMessage] = useState('');
  const [isTimeSeries, setIsTimeSeries] = useState(true);
  const [isDimensionMetricSelected, setIsDimensionMetricSelected] = useState(false);
  const [filterRows, setFilterRows] = useState<FilterRowData[]>([]);

  useEffect(() => {
    setLicenseLoadingState(LoadingState.Loading);
    fetchLicenses(props.datasource.apiKey, props.datasource.baseUrl)
      .then((licenses) => {
        setSelectableLicenses(licenses);
        setLicenseLoadingState(LoadingState.Success);
      })
      .catch((e) => {
        setLicenseLoadingState(LoadingState.Error);
        setLicenseErrorMessage(e.status + ' ' + e.statusText);
      });

    const filterRows = props.query.filters.map((filter) => {
      return {
        attribute: filter.name,
        operator: filter.operator,
        rawFilterValue: mapFilterValueToRawFilterValue(filter.value),
        convertedFilterValue: filter.value,
        parsingValueError: '',
      } as FilterRowData;
    });
    setFilterRows(filterRows);
  }, [props.datasource.apiKey, props.datasource.baseUrl, props.query.filters]);

  const query = defaults(props.query, DEFAULT_QUERY);

  const handleLicenseChange = (item: SelectableValue) => {
    props.onChange({ ...query, licenseKey: item.value });
    props.onRunQuery();
  };

  const handleAggregationChange = (item: SelectableValue) => {
    props.onChange({ ...query, aggregation: item.value, metric: undefined });
    props.onRunQuery();
  };

  const handleDimensionChange = (item: SelectableValue) => {
    if (isMetric(item.value)) {
      setIsDimensionMetricSelected(true);
      props.onChange({ ...query, aggregation: undefined, dimension: undefined, metric: item.value });
    } else {
      setIsDimensionMetricSelected(false);
      props.onChange({ ...query, dimension: item.value });
    }
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

  const handleFilterRowChange = (newFilters: FilterRowData[]) => {
    setFilterRows(newFilters);
  };

  const handleFilterChange = (newFilters: QueryFilter[]) => {
    props.onChange({ ...query, filters: newFilters });
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
      props.onChange({ ...query, interval: 'AUTO' });
    } else {
      props.onChange({ ...query, interval: undefined });
    }
    props.onRunQuery();
  };

  const handleIntervalChange = (item: SelectableValue) => {
    props.onChange({ ...query, interval: item.value });
    props.onRunQuery();
  };

  const handleAliasByBlur = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange({ ...query, aliasBy: event.target.value });
    props.onRunQuery();
  };

  const renderTimeSeriesOption = () => {
    return (
      <>
        <InlineField label="Interval" labelWidth={20}>
          <Select
            defaultValue={DEFAULT_SELECTABLE_QUERY_INTERVAL}
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
            value={query.licenseKey}
            onChange={handleLicenseChange}
            width={30}
            options={selectableLicenses}
            noOptionsMessage="No Analytics Licenses found"
            isLoading={licenseLoadingState === LoadingState.Loading}
            placeholder={licenseLoadingState === LoadingState.Loading ? 'Loading Licenses' : 'Choose License'}
          />
        </InlineField>
        {!isDimensionMetricSelected && (
          <InlineField label="Metric" labelWidth={20} required>
            <Select
              value={query.aggregation}
              onChange={(item) => handleAggregationChange(item)}
              width={30}
              options={SELECTABLE_AGGREGATIONS}
            />
          </InlineField>
        )}
        <InlineField label="Dimension" labelWidth={20} required>
          <Select
            value={query.dimension}
            onChange={handleDimensionChange}
            width={30}
            options={
              props.datasource.adAnalytics
                ? SELECTABLE_QUERY_AD_ATTRIBUTES
                : SELECTABLE_QUERY_ATTRIBUTES.concat(SELECTABLE_METRICS)
            }
          />
        </InlineField>
        <InlineField label="Filter" labelWidth={20}>
          <FilterRow
            isAdAnalytics={props.datasource.adAnalytics ? true : false}
            onChange={handleFilterChange}
            onFilterRowChange={handleFilterRowChange}
            filters={filterRows}
          />
        </InlineField>
        <InlineField label="Group By" labelWidth={20}>
          <GroupByRow
            isAdAnalytics={props.datasource.adAnalytics ? true : false}
            onChange={handleGroupByChange}
            groupBys={query.groupBy}
          />
        </InlineField>
        <InlineField label="Order By" labelWidth={20}>
          <OrderByRow
            isAdAnalytics={props.datasource.adAnalytics ? true : false}
            onChange={handleOrderByChange}
            orderBys={query.orderBy}
          />
        </InlineField>
        <InlineField label="Limit" labelWidth={20}>
          <Input value={query.limit} type="number" onBlur={handleLimitBlur} width={30} placeholder="No limit" />
        </InlineField>
        <InlineField label="Format as time series" labelWidth={20}>
          <InlineSwitch value={isTimeSeries} onChange={handleFormatAsTimeSeriesChange}></InlineSwitch>
        </InlineField>
        {isTimeSeries && renderTimeSeriesOption()}
        <InlineField label="Alias By" labelWidth={20}>
          <Input value={query.aliasBy} placeholder="Naming pattern" onBlur={handleAliasByBlur} />
        </InlineField>
      </FieldSet>
    </div>
  );
}
