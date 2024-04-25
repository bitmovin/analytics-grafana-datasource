import * as React from 'react';
import { useState } from 'react';
import { QueryAttribute } from '../types/queryAttributes';
import { QueryAdAttribute } from '../types/queryAdAttributes';
import { FieldSet, IconButton } from '@grafana/ui';
import { QueryFilter, QueryFilterOperator, SelectableQueryFilter } from '../types/queryFilter';
import { FilterInput } from './FilterInput';

type Props = {
  readonly isAdAnalytics: boolean;
  readonly onChange: (newFilters: QueryFilter[]) => void;
};
export const FilterRow = (props: Props) => {
  const [filters, setFilters] = useState<SelectableQueryFilter[]>([]);

  const deleteFilter = (index: number) => {
    const newFilter = [...filters];
    newFilter.splice(index, 1);

    setFilters(newFilter);
    props.onChange(newFilter as QueryFilter[]);
  };

  const onAttributesChange = (index: number, newAttribute: QueryAttribute | QueryAdAttribute) => {
    const newFilters = [...filters];
    const newValue = {
      name: newAttribute,
      operator: newFilters[index].operator,
      value: newFilters[index].value,
    } as QueryFilter;
    newFilters.splice(index, 1, newValue);
    setFilters(newFilters);
    props.onChange(newFilters as QueryFilter[]);
  };

  const onOperatorChange = (index: number, newOperator: QueryFilterOperator) => {
    const newFilters = [...filters];
    const newValue = {
      name: newFilters[index].name,
      operator: newOperator,
      value: newFilters[index].value,
    } as QueryFilter;
    newFilters.splice(index, 1, newValue);
    setFilters(newFilters);
    props.onChange(newFilters as QueryFilter[]);
  };

  const onFilterValueChange = (index: number, newFilterValue: string | number) => {
    const newFilters = [...filters];
    const newValue = {
      name: newFilters[index].name,
      operator: newFilters[index].operator,
      value: newFilterValue,
    } as QueryFilter;
    newFilters.splice(index, 1, newValue);
    setFilters(newFilters);
    props.onChange(newFilters as QueryFilter[]);
  };

  const addFilterInput = () => {
    //TODOMY what to use as the default value
    setFilters((prevState) => [...prevState, { name: '', operator: '', value: '' }]);
  };

  return (
    <FieldSet>
      {filters.map((item, index) => (
        <FilterInput
          isAdAnalytics={props.isAdAnalytics}
          filter={filters[index]}
          onAttributeChange={(newValue: QueryAttribute | QueryAdAttribute) => onAttributesChange(index, newValue)}
          onOperatorChange={(newValue: QueryFilterOperator) => onOperatorChange(index, newValue)}
          onFilterValueChange={(newValue: string | number) => onFilterValueChange(index, newValue)}
          onDelete={() => deleteFilter(index)}
        />
      ))}

      {
        //TODOMY fix position of the IconButton
      }
      <IconButton name="plus-square" tooltip="Add Order By" size="xl" onClick={() => addFilterInput()} />
    </FieldSet>
  );
};
