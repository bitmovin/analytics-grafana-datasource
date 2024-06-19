import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
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
  const isMetricSelected = useMemo(() => {
    return props.query.dimension ? isMetric(props.query.dimension) : false;
  }, [props.query.dimension]);

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
    if (props.query.resultFormat == null) {
      return;
    }
    console.log('in the plugin conversion');
    //TODO why is it not working for more than one queries in a dashboard? Why do I need to first reset to the ewnewst graph

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

    let interval = props.query.interval;
    if (props.query.resultFormat === 'table') {
      setIsTimeSeries(false);
      interval = undefined;
    }

    props.onChange({ ...props.query, filter: convertedFilters, interval: interval, resultFormat: undefined });
    props.onRunQuery();
  }, [props.query]);

  const query = defaults(props.query, DEFAULT_QUERY);

  const handleLicenseChange = (item: SelectableValue) => {
    props.onChange({ ...query, license: item.value });
    props.onRunQuery();
  };

  const handleAggregationChange = (item: SelectableValue) => {
    props.onChange({ ...query, metric: item.value });
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
        {!isMetricSelected && (
          <InlineField label="Metric" labelWidth={20} required>
            <Select
              value={query.metric}
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
