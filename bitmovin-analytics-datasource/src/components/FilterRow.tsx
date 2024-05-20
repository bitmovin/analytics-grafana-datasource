import React from 'react';
import { differenceWith, isEmpty } from 'lodash';
import { SelectableValue } from '@grafana/data';
import { Box, HorizontalGroup, IconButton, InlineLabel, VerticalGroup } from '@grafana/ui';

import { QueryFilter, QueryFilterOperator } from '../types/queryFilter';
import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { FilterInput } from './FilterInput';
import { convertFilterValueToProperType } from '../utils/filterUtils';
import type { FilterRowData } from './QueryEditor';

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
      name: filter.attribute,
      operator: filter.operator,
      value: filter.convertedFilterValue,
    } as QueryFilter;
  });
};

type Props = {
  readonly isAdAnalytics: boolean;
  readonly onChange: (newFilters: QueryFilter[]) => void;
  readonly onFilterRowChange: (newFilters: FilterRowData[]) => void;
  readonly filters: FilterRowData[];
};

export function FilterRow(props: Props) {
  const addFilterInput = () => {
    const newFilters = [...props.filters];
    newFilters.push({
      attribute: {},
      operator: {},
      rawFilterValue: '',
      convertedFilterValue: '',
      parsingValueError: '',
    } as FilterRowData);
    props.onFilterRowChange(newFilters);
  };

  const onAddFilter = (index: number) => {
    const filter = props.filters[index];
    try {
      const convertedValue = convertFilterValueToProperType(
        filter.rawFilterValue,
        filter.attribute,
        filter.attribute,
        filter.operator,
        props.isAdAnalytics
      );

      const newFilter = { ...filter, convertedFilterValue: convertedValue, parsingValueError: '' } as FilterRowData;

      const newFilters = [...props.filters];
      newFilters.splice(index, 1, newFilter);

      props.onFilterRowChange(newFilters);

      props.onChange(mapFilterRowsToQueryFilters(newFilters));
    } catch (e: unknown) {
      if (e instanceof Error) {
        const errorMessage = e.message;
        const newFilter = { ...filter, parsingValueError: errorMessage } as FilterRowData;

        const newFilters = [...props.filters];
        newFilters.splice(index, 1, newFilter);

        props.onFilterRowChange(newFilters);
      }
    }
  };

  const deleteFilterInput = (index: number) => {
    const newFilters = [...props.filters];
    newFilters.splice(index, 1);

    props.onFilterRowChange(newFilters);

    props.onChange(mapFilterRowsToQueryFilters(newFilters));
  };

  const onAttributesChange = (index: number, newAttribute: SelectableValue<QueryAttribute | QueryAdAttribute>) => {
    const filter = props.filters[index];
    const newFilter = { ...filter, attribute: newAttribute.value } as FilterRowData;
    const newFilters = [...props.filters];
    newFilters.splice(index, 1, newFilter);

    props.onFilterRowChange(newFilters);
  };

  const onOperatorsChange = (index: number, newOperator: SelectableValue<QueryFilterOperator>) => {
    const filter = props.filters[index];
    const newFilter = { ...filter, operator: newOperator.value } as FilterRowData;
    const newFilters = [...props.filters];
    newFilters.splice(index, 1, newFilter);

    props.onFilterRowChange(newFilters);
  };

  const onValuesChange = (index: number, newValue: string) => {
    const filter = props.filters[index];
    const newFilter = { ...filter, rawFilterValue: newValue };
    const newFilters = [...props.filters];
    newFilters.splice(index, 1, newFilter);

    props.onFilterRowChange(newFilters);
  };

  return (
    <VerticalGroup>
      {props.filters.length !== 0 && (
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
      {props.filters.map((filter, index, filtersArray) => (
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
          addFilterDisabled={isEmpty(filter.attribute) || isEmpty(filter.operator)}
          onAddFilter={() => onAddFilter(index)}
        />
      ))}

      <Box paddingTop={props.filters.length === 0 ? 0.5 : 0}>
        <IconButton name="plus-square" tooltip="Add Filter" onClick={() => addFilterInput()} size="xl" />
      </Box>
    </VerticalGroup>
  );
}
