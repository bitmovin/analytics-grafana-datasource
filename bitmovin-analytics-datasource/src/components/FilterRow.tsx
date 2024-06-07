import React, { useEffect, useState } from 'react';
import { differenceWith } from 'lodash';
import { SelectableValue } from '@grafana/data';
import { Box, HorizontalGroup, IconButton, InlineLabel, VerticalGroup } from '@grafana/ui';

import { QueryFilter, QueryFilterOperator, QueryFilterValue } from '../types/queryFilter';
import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { FilterInput } from './FilterInput';
import { convertFilterValueToProperType, mapQueryFilterValueToRawFilterValue } from '../utils/filterUtils';

export type FilterRowData = {
  attribute: QueryAdAttribute | QueryAttribute | undefined;
  operator: QueryFilterOperator | undefined;
  rawFilterValue: string;
  convertedFilterValue: QueryFilterValue;
  parsingValueError: string;
};

const mapFilterAttributesToSelectableValue = (
  filters: FilterRowData[],
  isAdAnalytics: boolean
): Array<SelectableValue<QueryAttribute | QueryAdAttribute>> => {
  if (isAdAnalytics) {
    return differenceWith(
      SELECTABLE_QUERY_AD_ATTRIBUTES,
      filters,
      (selectableValue, selectedValue) => selectableValue.value === selectedValue.attribute
    );
  } else {
    return differenceWith(
      SELECTABLE_QUERY_ATTRIBUTES,
      filters,
      (selectableValue, selectedValue) => selectableValue.value === selectedValue.attribute
    );
  }
};

const mapFilterRowsToQueryFilters = (filters: FilterRowData[]): QueryFilter[] => {
  return filters.map((filter) => {
    return {
      name: filter.attribute!,
      operator: filter.operator!,
      value: filter.convertedFilterValue,
    };
  });
};

type Props = {
  readonly isAdAnalytics: boolean;
  readonly onQueryFilterChange: (newFilters: QueryFilter[]) => void;
  readonly filters: QueryFilter[];
};

export function FilterRow(props: Props) {
  const [filterInputs, setFilterInputs] = useState<FilterRowData[]>([]);

  /** Map QueryFilters to FilterRowData */
  useEffect(() => {
    const filterRows = props.filters.map((filter) => {
      return {
        attribute: filter.name,
        operator: filter.operator,
        rawFilterValue: mapQueryFilterValueToRawFilterValue(filter.value),
        convertedFilterValue: filter.value,
        parsingValueError: '',
      };
    });
    setFilterInputs(filterRows);
  }, [props.filters]);

  const addFilterInput = () => {
    const newFilterInputs = [...filterInputs];
    newFilterInputs.push({
      attribute: undefined,
      operator: undefined,
      rawFilterValue: '',
      convertedFilterValue: '',
      parsingValueError: '',
    });
    setFilterInputs(newFilterInputs);
  };

  const onSaveFilter = (index: number) => {
    const filter = filterInputs[index];
    try {
      const convertedValue = convertFilterValueToProperType(
        filter.rawFilterValue,
        filter.attribute!,
        filter.attribute!,
        filter.operator!,
        props.isAdAnalytics
      );

      const newFilter: FilterRowData = { ...filter, convertedFilterValue: convertedValue, parsingValueError: '' };

      const newFilters = [...filterInputs];
      newFilters.splice(index, 1, newFilter);

      setFilterInputs(filterInputs);

      props.onQueryFilterChange(mapFilterRowsToQueryFilters(newFilters));
    } catch (e: unknown) {
      if (e instanceof Error) {
        const errorMessage = e.message;
        const newFilter: FilterRowData = { ...filter, parsingValueError: errorMessage };

        const newFilters = [...filterInputs];
        newFilters.splice(index, 1, newFilter);

        setFilterInputs(newFilters);
      }
    }
  };

  const deleteFilterInput = (index: number) => {
    const newFilters = [...filterInputs];
    newFilters.splice(index, 1);

    setFilterInputs(newFilters);

    props.onQueryFilterChange(mapFilterRowsToQueryFilters(newFilters));
  };

  const onAttributesChange = (index: number, newAttribute: SelectableValue<QueryAttribute | QueryAdAttribute>) => {
    const filter = filterInputs[index];
    const newFilter: FilterRowData = { ...filter, attribute: newAttribute.value! };
    const newFilters = [...filterInputs];
    newFilters.splice(index, 1, newFilter);

    setFilterInputs(newFilters);
  };

  const onOperatorsChange = (index: number, newOperator: SelectableValue<QueryFilterOperator>) => {
    const filter = filterInputs[index];
    const newFilter: FilterRowData = { ...filter, operator: newOperator.value! };
    const newFilters = [...filterInputs];
    newFilters.splice(index, 1, newFilter);

    setFilterInputs(newFilters);
  };

  const onValuesChange = (index: number, newValue: string) => {
    const filter = filterInputs[index];
    const newFilter: FilterRowData = { ...filter, rawFilterValue: newValue };
    const newFilters = [...filterInputs];
    newFilters.splice(index, 1, newFilter);

    setFilterInputs(newFilters);
  };

  return (
    <VerticalGroup>
      {filterInputs.length > 0 && (
        <HorizontalGroup spacing={'none'}>
          <InlineLabel width={30} tooltip="">
            Dimension
          </InlineLabel>
          <InlineLabel width={15} tooltip="">
            Operator
          </InlineLabel>
          <InlineLabel width={30} tooltip="">
            Value
          </InlineLabel>
        </HorizontalGroup>
      )}
      {filterInputs.map((filter, index, filtersArray) => (
        <FilterInput
          key={index}
          isAdAnalytics={props.isAdAnalytics}
          filter={filter}
          selectableFilterAttributes={mapFilterAttributesToSelectableValue(filtersArray, props.isAdAnalytics)}
          onAttributeChange={(newValue: SelectableValue<QueryAdAttribute | QueryAttribute>) =>
            onAttributesChange(index, newValue)
          }
          onOperatorChange={(newValue: SelectableValue<QueryFilterOperator>) => onOperatorsChange(index, newValue)}
          onValueChange={(newValue: string) => onValuesChange(index, newValue)}
          onDelete={() => deleteFilterInput(index)}
          onSaveFilter={() => onSaveFilter(index)}
        />
      ))}

      <Box paddingTop={filterInputs.length === 0 ? 0.5 : 0}>
        <IconButton name="plus-square" tooltip="Add Filter" onClick={() => addFilterInput()} size="xl" />
      </Box>
    </VerticalGroup>
  );
}
