import * as React from 'react';
import { QueryFilterOperator, SELECTABLE_QUERY_FILTER_OPERATORS, SelectableQueryFilter } from '../types/queryFilter';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { Field, HorizontalGroup, IconButton, Input, Select } from '@grafana/ui';
import { Space } from '@grafana/plugin-ui';
import { convertFilterValueToProperType } from '../utils/filterUtils';
import { useState } from 'react';

type Props = {
  readonly isAdAnalytics: boolean;
  readonly filter: SelectableQueryFilter;
  readonly onAttributeChange: (newValue: QueryAttribute | QueryAdAttribute) => void;
  readonly onOperatorChange: (newValue: QueryFilterOperator) => void;
  readonly onFilterValueChange: (newValue: boolean | number | string | Array<string>) => void;
  readonly onDelete: () => void;
};
export const FilterInput = (props: Props) => {
  const [filterValueError, setFilterValueError] = useState(null);

  //TODOMY delay check here, only on enter? Small timeout or check button?
  const onFilterValueChange = (value: string, filter: SelectableQueryFilter) => {
    try {
      const convertedValue = convertFilterValueToProperType(value, filter, props.isAdAnalytics);
      setFilterValueError(null);
      props.onFilterValueChange(convertedValue);
    } catch (e) {
      setFilterValueError(e.message);
    }
  };

  return (
    <HorizontalGroup spacing="xs">
      {
        //TODOMY fix autospaching ui issue
      }

      <Field label="Dimension">
        <Select
          value={props.filter.name}
          onChange={(value) => props.onAttributeChange(value.value as QueryAttribute | QueryAdAttribute)}
          options={props.isAdAnalytics ? SELECTABLE_QUERY_AD_ATTRIBUTES : SELECTABLE_QUERY_ATTRIBUTES}
        />
      </Field>

      <Field label="Operator">
        <Select
          value={props.filter.operator}
          onChange={(value) => props.onOperatorChange(value.value as QueryFilterOperator)}
          options={SELECTABLE_QUERY_FILTER_OPERATORS}
        />
      </Field>
      <Field label="Value" invalid={filterValueError !== null} error={filterValueError}>
        <Input onChange={(value) => onFilterValueChange(value.currentTarget.value, props.filter)} />
      </Field>
      <Space h={1} />
      <IconButton
        name="trash-alt"
        size="xl"
        tooltip="Delete Order By"
        onClick={() => props.onDelete()}
        variant="destructive"
      />
    </HorizontalGroup>
  );
};
