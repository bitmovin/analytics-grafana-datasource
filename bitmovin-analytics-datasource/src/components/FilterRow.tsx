import React, { useState } from 'react';
import { difference } from 'lodash';
import { SelectableValue } from '@grafana/data';
import { Box, HorizontalGroup, IconButton, InlineLabel, VerticalGroup } from '@grafana/ui';

import { QueryFilter, QueryFilterOperator, QueryFilterValue } from '../types/queryFilter';
import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { FilterInput } from './FilterInput';
import { convertFilterValueToProperType } from '../utils/filterUtils';

type Props = {
  readonly isAdAnalytics: boolean;
  readonly onChange: (newFilters: QueryFilter[]) => void;
};

export function FilterRow(props: Props) {
  const [selectedAttributes, setSelectedAttributes] = useState<
    Array<SelectableValue<QueryAdAttribute | QueryAttribute>>
  >([]);
  const [selectedOperators, setSelectedOperators] = useState<Array<SelectableValue<QueryFilterOperator>>>([]);
  const [rawFilterValues, setRawFilterValues] = useState<string[]>([]);
  const [convertedQueryFilterValues, setConvertedQueryFilterValues] = useState<QueryFilterValue[]>([]);
  const [parsingValueErrors, setParsingValueErrors] = useState<string[]>([]);

  const addFilterInput = () => {
    setSelectedAttributes((prevState) => [...prevState, {}]);
    setSelectedOperators((prevState) => [...prevState, {}]);
    setRawFilterValues((prevState) => [...prevState, '']);
    setConvertedQueryFilterValues((prevState) => [...prevState, '']);
    setParsingValueErrors((prevState) => [...prevState, '']);
  };

  const onAddFilter = (index: number) => {
    try {
      const convertedValue = convertFilterValueToProperType(
        rawFilterValues[index],
        selectedAttributes[index].value!,
        selectedAttributes[index].label!,
        selectedOperators[index].value!,
        props.isAdAnalytics
      );

      const newConvertedQueryFilterValues = [...convertedQueryFilterValues];
      newConvertedQueryFilterValues.splice(index, 1, convertedValue);
      setConvertedQueryFilterValues(newConvertedQueryFilterValues);

      const newParsingValueErrors = [...parsingValueErrors];
      newParsingValueErrors.splice(index, 1, '');
      setParsingValueErrors(newParsingValueErrors);

      props.onChange(mapFiltersToQueryFilters(selectedAttributes, selectedOperators, newConvertedQueryFilterValues));
    } catch (e: any) {
      const errorMessage = e.message;
      const newParsingValueErrors = [...parsingValueErrors];
      newParsingValueErrors.splice(index, 1, errorMessage);
      setParsingValueErrors(newParsingValueErrors);
    }
  };

  const deleteFilterInput = (index: number) => {
    const newSelectedAttributes = [...selectedAttributes];
    newSelectedAttributes.splice(index, 1);

    const newSelectedOperators = [...selectedOperators];
    newSelectedOperators.splice(index, 1);

    const newValues = [...rawFilterValues];
    newValues.splice(index, 1);

    const newConvertedQueryFilterValues = [...convertedQueryFilterValues];
    newConvertedQueryFilterValues.splice(index, 1);

    const newParsingValueErrors = [...parsingValueErrors];
    newParsingValueErrors.splice(index, 1);

    setSelectedAttributes(newSelectedAttributes);
    setSelectedOperators(newSelectedOperators);
    setRawFilterValues(newValues);
    setConvertedQueryFilterValues(newConvertedQueryFilterValues);
    setParsingValueErrors(newParsingValueErrors);

    props.onChange(
      mapFiltersToQueryFilters(newSelectedAttributes, newSelectedOperators, newConvertedQueryFilterValues)
    );
  };

  const onAttributesChange = (index: number, newAttribute: SelectableValue<QueryAttribute | QueryAdAttribute>) => {
    const newSelectedAttributes = [...selectedAttributes];
    newSelectedAttributes.splice(index, 1, newAttribute);
    setSelectedAttributes(newSelectedAttributes);
  };

  const onOperatorsChange = (index: number, newOperator: SelectableValue<QueryFilterOperator>) => {
    const newSelectedOperators = [...selectedOperators];
    newSelectedOperators.splice(index, 1, newOperator);
    setSelectedOperators(newSelectedOperators);
  };

  const onValuesChange = (index: number, newValue: string) => {
    const newRawValues = [...rawFilterValues];
    newRawValues.splice(index, 1, newValue);
    setRawFilterValues(newRawValues);
  };

  const mapFilterAttributesToSelectableValue = (): Array<SelectableValue<QueryAttribute | QueryAdAttribute>> => {
    if (props.isAdAnalytics) {
      return difference(SELECTABLE_QUERY_AD_ATTRIBUTES, selectedAttributes);
    } else {
      return difference(SELECTABLE_QUERY_ATTRIBUTES, selectedAttributes);
    }
  };

  const mapFiltersToQueryFilters = (
    selectedAttributes: Array<SelectableValue<QueryAttribute | QueryAdAttribute>>,
    selectedOperators: Array<SelectableValue<QueryFilterOperator>>,
    values: QueryFilterValue[]
  ): QueryFilter[] => {
    const queryFilters: QueryFilter[] = [];
    for (let i = 0; i < selectedAttributes.length; i++) {
      queryFilters.push({
        name: selectedAttributes[i].value!,
        operator: selectedOperators[i].value!,
        value: values[i],
      });
    }
    return queryFilters;
  };

  return (
    <VerticalGroup>
      {selectedAttributes.length !== 0 && (
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
      {selectedAttributes.map((attribute, index) => (
        <FilterInput
          key={index}
          isAdAnalytics={props.isAdAnalytics}
          selectableFilterAttributes={mapFilterAttributesToSelectableValue()}
          attribute={attribute}
          onAttributeChange={(newValue: SelectableValue<QueryAdAttribute | QueryAttribute>) =>
            onAttributesChange(index, newValue)
          }
          operator={selectedOperators[index]}
          onOperatorChange={(newValue: SelectableValue<QueryFilterOperator>) => onOperatorsChange(index, newValue)}
          value={rawFilterValues[index]}
          onValueChange={(newValue: string) => onValuesChange(index, newValue)}
          onDelete={() => deleteFilterInput(index)}
          onAddFilter={() => onAddFilter(index)}
          parsingValueError={parsingValueErrors[index] === '' ? undefined : parsingValueErrors[index]}
        />
      ))}

      <Box paddingTop={selectedAttributes.length === 0 ? 0.5 : 0}>
        <IconButton name="plus-square" tooltip="Add Filter" onClick={() => addFilterInput()} size="xl" />
      </Box>
    </VerticalGroup>
  );
}
