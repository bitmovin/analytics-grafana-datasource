import React, { useState } from 'react';
import { difference } from 'lodash';
import { SelectableValue } from '@grafana/data';
import { Box, IconButton, VerticalGroup } from '@grafana/ui';

import { QueryFilter, QueryFilterOperator, QueryFilterValue } from '../types/queryFilter';
import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { REORDER_DIRECTION } from './GroupByInput';
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
  const [values, setValues] = useState<QueryFilterValue[]>([]);
  const [parsingValueErrors, setParsingValueErrors] = useState<string[]>([]);

  const addFilterInput = () => {
    setSelectedAttributes((prevState) => [...prevState, {}]);
    setSelectedOperators((prevState) => [...prevState, {}]);
    setValues((prevState) => [...prevState, '']);
    setParsingValueErrors((prevState) => [...prevState, '']);
  };

  const deleteFilterInput = (index: number) => {
    const newSelectedAttributes = [...selectedAttributes];
    newSelectedAttributes.splice(index, 1);

    const newSelectedOperators = [...selectedOperators];
    newSelectedOperators.splice(index, 1);

    const newValues = [...values];
    newValues.splice(index, 1);

    const newParsingValueErrors = [...parsingValueErrors];
    newParsingValueErrors.splice(index, 1);

    setSelectedAttributes(newSelectedAttributes);
    setSelectedOperators(newSelectedOperators);
    setValues(newValues);
    setParsingValueErrors(newParsingValueErrors);
    //TODOMY before calling this I need to make sure that the filter is actually complete and all the values are set...
    props.onChange(mapFiltersToQueryFilters(newSelectedAttributes, newSelectedOperators, newValues));
  };

  const onAttributesChange = (index: number, newAttribute: SelectableValue<QueryAttribute | QueryAdAttribute>) => {
    const newSelectedAttributes = [...selectedAttributes];
    newSelectedAttributes.splice(index, 1, newAttribute);
    setSelectedAttributes(newSelectedAttributes);

    props.onChange(mapFiltersToQueryFilters(newSelectedAttributes, selectedOperators, values));
  };

  const onOperatorsChange = (index: number, newOperator: SelectableValue<QueryFilterOperator>) => {
    const newSelectedOperators = [...selectedOperators];
    newSelectedOperators.splice(index, 1, newOperator);
    setSelectedOperators(newSelectedOperators);

    //TODOMY here I also need to check the value and ,aybe throw an error

    //TODOMY difference between checking if value is valid and actually parsing it ?

    props.onChange(mapFiltersToQueryFilters(selectedAttributes, newSelectedOperators, values));
  };

  const onValuesChange = (index: number, newValue: string) => {
    try {
      const convertedValue = convertFilterValueToProperType(
        newValue,
        selectedAttributes[index].value!,
        selectedOperators[index].value!,
        props.isAdAnalytics
      );
      console.log(convertedValue, convertedValue);

      const newValues = [...values];
      newValues.splice(index, 1, convertedValue);
      console.log(newValues);
      setValues(newValues);

      const newParsingValueErrors = [...parsingValueErrors];
      newParsingValueErrors.splice(index, 1, '');
      setParsingValueErrors(newParsingValueErrors);

      props.onChange(mapFiltersToQueryFilters(selectedAttributes, selectedOperators, newValues));
    } catch (e: any) {
      const errorMessage = e.message;
      const newParsingValueErrors = [...parsingValueErrors];
      newParsingValueErrors.splice(index, 1, errorMessage);
      setParsingValueErrors(newParsingValueErrors);
    }
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
    console.log(queryFilters);
    return queryFilters;
  };

  const reorderFilter = (direction: REORDER_DIRECTION, index: number) => {
    const newIndex = direction === REORDER_DIRECTION.UP ? index - 1 : index + 1;

    const newSelectedAttributes = [...selectedAttributes];
    const attributeToMove = newSelectedAttributes[index];
    newSelectedAttributes.splice(index, 1);
    newSelectedAttributes.splice(newIndex, 0, attributeToMove);

    const newSelectedOperators = [...selectedOperators];
    const operatorToMove = newSelectedOperators[index];
    newSelectedOperators.splice(index, 1);
    newSelectedOperators.splice(newIndex, 0, operatorToMove);

    const newValues = [...values];
    const valueToMove = newValues[index];
    newValues.splice(index, 1);
    newValues.splice(newIndex, 0, valueToMove);

    setSelectedAttributes(newSelectedAttributes);
    setSelectedOperators(newSelectedOperators);
    setValues(newValues);

    props.onChange(mapFiltersToQueryFilters(newSelectedAttributes, newSelectedOperators, newValues));
  };

  return (
    <VerticalGroup>
      {selectedAttributes.map((attribute, index, array) => (
        <FilterInput
          key={index}
          isAdAnalytics={props.isAdAnalytics}
          selectableFilterAttributes={mapFilterAttributesToSelectableValue()}
          onAttributeChange={(newValue: SelectableValue<QueryAdAttribute | QueryAttribute>) =>
            onAttributesChange(index, newValue)
          }
          onOperatorChange={(newValue: SelectableValue<QueryFilterOperator>) => onOperatorsChange(index, newValue)}
          onValueChange={(newValue: string) => onValuesChange(index, newValue)}
          onDelete={() => deleteFilterInput(index)}
          isFirst={index === 0}
          isLast={index === array.length - 1}
          onReorderFilter={(direction: REORDER_DIRECTION) => reorderFilter(direction, index)}
          parsingValueError={parsingValueErrors[index] === '' ? undefined : parsingValueErrors[index]}
        />
      ))}

      <Box paddingTop={selectedAttributes.length === 0 ? 0.5 : 0}>
        <IconButton name="plus-square" tooltip="Add Group By" onClick={() => addFilterInput()} size="xl" />
      </Box>
    </VerticalGroup>
  );
}
