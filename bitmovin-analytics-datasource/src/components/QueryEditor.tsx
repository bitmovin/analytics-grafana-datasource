import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { FieldSet, HorizontalGroup, InlineField, InlineSwitch, Input, Select } from '@grafana/ui';
import type { QueryEditorProps, SelectableValue } from '@grafana/data';
import { defaults } from 'lodash';

import { DataSource } from '../datasource';
import {
  BitmovinDataSourceOptions,
  BitmovinAnalyticsDataQuery,
  DEFAULT_QUERY,
  isOldBitmovinAnalyticsDataQuery,
} from '../types/grafanaTypes';
import { fetchLicenses } from '../utils/licenses';
import { DEFAULT_SELECTABLE_QUERY_INTERVAL, SELECTABLE_QUERY_INTERVALS } from '../utils/intervalUtils';
import { SELECTABLE_AGGREGATION_METHODS } from '../types/aggregationMethod';
import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { isMetric, Metric, SELECTABLE_METRICS } from '../types/metric';
import { GroupByRow } from './GroupByRow';
import { OrderByRow } from './OrderByRow';
import type { QueryOrderBy } from '../types/queryOrderBy';
import type { QueryFilter } from '../types/queryFilter';
import { FilterRow } from './FilterRow';
import { convertFilterValueToProperType } from '../utils/filterUtils';

enum LoadingState {
  Default = 'DEFAULT',
  Loading = 'LOADING',
  Success = 'SUCCESS',
  Error = 'ERROR',
}

type Props = QueryEditorProps<DataSource, BitmovinAnalyticsDataQuery, BitmovinDataSourceOptions>;

export function QueryEditor(props: Props) {
  const [selectableLicenses, setSelectableLicenses] = useState<SelectableValue[]>([]);
  const [licenseLoadingState, setLicenseLoadingState] = useState<LoadingState>(LoadingState.Default);
  const [licenseErrorMessage, setLicenseErrorMessage] = useState('');
  const [isTimeSeries, setIsTimeSeries] = useState(!!props.query.interval);
  const [percentileValue, setPercentileValue] = useState(props.query.percentileValue);
  const isMetricSelected = useMemo(() => {
    return props.query.metric != null;
  }, [props.query.metric]);
  const isPercentileSelected = useMemo(() => {
    return props.query.queryAggregationMethod === 'percentile';
  }, [props.query.queryAggregationMethod]);
  const query = defaults(props.query, DEFAULT_QUERY);

  /** Fetch Licenses */
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
  }, [props.datasource.apiKey, props.datasource.baseUrl]);

  /**
   * Ensures that dashboard JSON Models from the old Angular plugin are mapped correctly to the
   * current model used by the application. Uses the {@link BitmovinAnalyticsDataQuery.resultFormat}
   * as an indicator of whether an old JSON model was loaded.
   */
  useEffect(() => {
    if (!isOldBitmovinAnalyticsDataQuery(props.query)) {
      return;
    }
    //TODOMY why is it not working for more than one queries in a dashboard? Why do I need to first reset to the ewnewst graph

    // The old Angular plugin did the filter value conversion in the query method before
    // sending the request, so the filter values saved in the old JSON model are the "raw"
    // input values as strings. The new react plugin, however, saves the converted API conform filter
    // values in the JSON model, as it converts the filter values in the `QueryInputFilter` component.
    // This allows the new plugin to provide error feedback directly to the user via a tooltip before
    // sending the request.
    const convertedFilters = props.query.filter.map((filter) => {
      return {
        name: filter.name,
        operator: filter.operator,
        value: convertFilterValueToProperType(
          filter.value as string,
          filter.name,
          filter.operator,
          !!props.datasource.adAnalytics
        ),
      } as QueryFilter;
    });

    // interval was always set in the old plugin's logic even for table data
    // the new plugin only sets the interval for timeseries so for table data we need to reset the interval
    let interval = props.query.interval;
    if (props.query.resultFormat === 'table') {
      setIsTimeSeries(false);
      interval = undefined;
    }

    // percentileValue was always set in the old plugin's logic,
    // but it should only be set with the 'percentile' metric selected
    let percentile = props.query.percentileValue;
    if (props.query.metric !== 'percentile') {
      percentile = undefined;
    }

    // mapping is needed because old plugin used
    //  - the metric field to save the query aggregations
    //  - the dimension field to save metric and query attributes
    // new plugin separates metric, query aggregations and query attributes in own fields to make data model more future-proof
    //  - the metric field saves Metrics (e.g. avg_concurrent_viewers)
    //  - the aggregation field saves query Aggregations (e.g. count)
    //  - the dimension field saves the query Attributes (e.g. Impression_id)
    const aggregation = props.query.metric;
    let metric = undefined;
    let dimension = props.query.dimension;
    if (props.query.dimension && isMetric(props.query.dimension)) {
      metric = props.query.dimension as Metric;
      dimension = undefined;
    }

    const oldQuery = { ...props.query };
    delete oldQuery['resultFormat'];
    const newQuery: BitmovinAnalyticsDataQuery = {
      ...oldQuery,
      filter: convertedFilters,
      interval: interval,
      percentileValue: percentile,
      metric: metric,
      dimension: dimension,
      queryAggregationMethod: aggregation,
    };

    props.onChange(newQuery);
    props.onRunQuery();
  }, []);

  const handleLicenseChange = (item: SelectableValue) => {
    props.onChange({ ...query, license: item.value });
    props.onRunQuery();
  };

  const handleAggregationChange = (item: SelectableValue) => {
    props.onChange({ ...query, queryAggregationMethod: item.value, metric: undefined });
    props.onRunQuery();
  };

  const handleDimensionChange = (item: SelectableValue) => {
    if (isMetric(item.value)) {
      props.onChange({ ...query, queryAggregationMethod: undefined, dimension: undefined, metric: item.value });
    } else {
      props.onChange({ ...query, dimension: item.value, metric: undefined });
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
                value={query.queryAggregationMethod}
                onChange={(item) => handleAggregationChange(item)}
                width={30}
                options={SELECTABLE_AGGREGATION_METHODS}
              />
            </InlineField>
          )}
          {isPercentileSelected && (
            <Input
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
              props.datasource.adAnalytics
                ? SELECTABLE_QUERY_AD_ATTRIBUTES
                : SELECTABLE_QUERY_ATTRIBUTES.concat(SELECTABLE_METRICS)
            }
          />
        </InlineField>
        <InlineField label="Filter" labelWidth={20}>
          <FilterRow
            isAdAnalytics={props.datasource.adAnalytics ? true : false}
            onQueryFilterChange={handleQueryFilterChange}
            filters={props.query.filter}
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
          <Input defaultValue={query.limit} type="number" onBlur={handleLimitBlur} width={30} placeholder="No limit" />
        </InlineField>
        <InlineField label="Format as time series" labelWidth={20}>
          <InlineSwitch value={isTimeSeries} onChange={handleFormatAsTimeSeriesChange}></InlineSwitch>
        </InlineField>
        {isTimeSeries && renderTimeSeriesOption()}
        <InlineField label="Alias By" labelWidth={20}>
          <Input defaultValue={query.alias} placeholder="Naming pattern" onBlur={handleAliasByBlur} />
        </InlineField>
      </FieldSet>
    </div>
  );
}
