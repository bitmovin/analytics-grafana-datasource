import React, { useState } from 'react';
import { difference, isEmpty } from 'lodash';
import { SelectableValue } from '@grafana/data';
import { Box, HorizontalGroup, IconButton, InlineLabel, VerticalGroup } from '@grafana/ui';

import { QueryFilter, QueryFilterOperator, QueryFilterValue } from '../types/queryFilter';
import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { FilterInput } from './FilterInput';
import { convertFilterValueToProperType } from '../utils/filterUtils';

type Filter = {
  selectedAttribute: SelectableValue<QueryAdAttribute | QueryAttribute>;
  selectedOperator: SelectableValue<QueryFilterOperator>;
  rawFilterValue: string;
  convertedFilterValue: QueryFilterValue;
  parsingValueError: string;
};

const mapFilterAttributesToSelectableValue = (
  filters: Filter[],
  isAdAnalytics: boolean
): Array<SelectableValue<QueryAttribute | QueryAdAttribute>> => {
  const selectedAttributes = filters.map((filter) => filter.selectedAttribute);
  if (isAdAnalytics) {
    return difference(SELECTABLE_QUERY_AD_ATTRIBUTES, selectedAttributes);
  } else {
    return difference(SELECTABLE_QUERY_ATTRIBUTES, selectedAttributes);
  }
};

const mapFiltersToQueryFilters = (filters: Filter[]): QueryFilter[] => {
  return filters.map((filter) => {
    return {
      name: filter.selectedAttribute.value!,
      operator: filter.selectedOperator.value!,
      value: filter.convertedFilterValue,
    } as QueryFilter;
  });
};

type Props = {
  readonly isAdAnalytics: boolean;
  readonly onChange: (newFilters: QueryFilter[]) => void;
};

export function FilterRow(props: Props) {
  const [filters, setFilters] = useState<Filter[]>([]);

  const addFilterInput = () => {
    setFilters((prevState) => [
      ...prevState,
      {
        selectedAttribute: {},
        selectedOperator: {},
        rawFilterValue: '',
        convertedFilterValue: '',
        parsingValueError: '',
      } as Filter,
    ]);
  };

  const onAddFilter = (index: number) => {
    const filter = filters[index];
    try {
      const convertedValue = convertFilterValueToProperType(
        filter.rawFilterValue,
        filter.selectedAttribute.value!,
        filter.selectedAttribute.label!,
        filter.selectedOperator.value!,
        props.isAdAnalytics
      );

      const newFilter = { ...filter, convertedFilterValue: convertedValue, parsingValueError: '' } as Filter;

      const newFilters = [...filters];
      newFilters.splice(index, 1, newFilter);

      setFilters(newFilters);

      props.onChange(mapFiltersToQueryFilters(newFilters));
    } catch (e: unknown) {
      if (e instanceof Error) {
        const errorMessage = e.message;
        const newFilter = { ...filter, parsingValueError: errorMessage } as Filter;

        const newFilters = [...filters];
        newFilters.splice(index, 1, newFilter);

        setFilters(newFilters);
      }
    }
  };

  const deleteFilterInput = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);

    setFilters(newFilters);

    props.onChange(mapFiltersToQueryFilters(newFilters));
  };

  const onAttributesChange = (index: number, newAttribute: SelectableValue<QueryAttribute | QueryAdAttribute>) => {
    const filter = filters[index];
    const newFilter = { ...filter, selectedAttribute: newAttribute } as Filter;
    const newFilters = [...filters];
    newFilters.splice(index, 1, newFilter);

    setFilters(newFilters);
  };

  const onOperatorsChange = (index: number, newOperator: SelectableValue<QueryFilterOperator>) => {
    const filter = filters[index];
    const newFilter = { ...filter, selectedOperator: newOperator } as Filter;
    const newFilters = [...filters];
    newFilters.splice(index, 1, newFilter);

    setFilters(newFilters);
  };

  const onValuesChange = (index: number, newValue: string) => {
    const filter = filters[index];
    const newFilter = { ...filter, rawFilterValue: newValue };
    const newFilters = [...filters];
    newFilters.splice(index, 1, newFilter);

    setFilters(newFilters);
  };

  return (
    <VerticalGroup>
      {filters.length !== 0 && (
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
      {filters.map((filter, index, filtersArray) => (
        <FilterInput
          key={index}
          isAdAnalytics={props.isAdAnalytics}
          selectableFilterAttributes={mapFilterAttributesToSelectableValue(filtersArray, props.isAdAnalytics)}
          onAttributeChange={(newValue: SelectableValue<QueryAdAttribute | QueryAttribute>) =>
            onAttributesChange(index, newValue)
          }
          onOperatorChange={(newValue: SelectableValue<QueryFilterOperator>) => onOperatorsChange(index, newValue)}
          onValueChange={(newValue: string) => onValuesChange(index, newValue)}
          onDelete={() => deleteFilterInput(index)}
          addFilterDisabled={isEmpty(filter.selectedAttribute) || isEmpty(filter.selectedOperator)}
          onAddFilter={() => onAddFilter(index)}
          parsingValueError={isEmpty(filter.parsingValueError) ? undefined : filter.parsingValueError}
        />
      ))}

      <Box paddingTop={filters.length === 0 ? 0.5 : 0}>
        <IconButton name="plus-square" tooltip="Add Filter" onClick={() => addFilterInput()} size="xl" />
      </Box>
    </VerticalGroup>
  );
}
