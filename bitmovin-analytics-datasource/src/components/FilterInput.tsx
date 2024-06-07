import React from 'react';
import type { SelectableValue } from '@grafana/data';
import { HorizontalGroup, IconButton, Input, Select, Tooltip } from '@grafana/ui';
import { isEmpty } from 'lodash';

import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryFilterOperator, SELECTABLE_QUERY_FILTER_OPERATORS } from '../types/queryFilter';
import { FilterRowData } from './FilterRow';

const mapAttributeToSelectableValue = (
  attribute: QueryAttribute | QueryAdAttribute,
  isAdAnalytics: boolean
): SelectableValue<QueryAttribute | QueryAdAttribute> => {
  if (isAdAnalytics) {
    return SELECTABLE_QUERY_AD_ATTRIBUTES.filter((selectableValue) => selectableValue.value === attribute);
  } else {
    return SELECTABLE_QUERY_ATTRIBUTES.filter((selectableValue) => selectableValue.value === attribute);
  }
};

const mapOperatorToSelectableOperator = (operator: QueryFilterOperator): SelectableValue<QueryFilterOperator> => {
  return SELECTABLE_QUERY_FILTER_OPERATORS.filter((selectableOperator) => selectableOperator.value === operator);
};

type Props = {
  readonly isAdAnalytics: boolean;
  readonly filter: FilterRowData;
  readonly selectableFilterAttributes: Array<SelectableValue<QueryAttribute | QueryAdAttribute>>;
  readonly onAttributeChange: (newValue: SelectableValue<QueryAdAttribute | QueryAttribute>) => void;
  readonly onOperatorChange: (newValue: SelectableValue<QueryFilterOperator>) => void;
  readonly onValueChange: (newValue: string) => void;
  readonly onDelete: () => void;
  readonly onSaveFilter: () => void;
};

export function FilterInput(props: Props) {
  return (
    <HorizontalGroup spacing="xs">
      <Select
        value={
          props.filter.attribute
            ? mapAttributeToSelectableValue(props.filter.attribute, props.isAdAnalytics)
            : undefined
        }
        onChange={(selectableValue) => props.onAttributeChange(selectableValue)}
        options={props.selectableFilterAttributes}
        width={30}
      />
      <Select
        value={mapOperatorToSelectableOperator(props.filter.operator)}
        onChange={(value) => props.onOperatorChange(value)}
        options={SELECTABLE_QUERY_FILTER_OPERATORS}
        width={15}
      />
      <Tooltip
        content={isEmpty(props.filter.parsingValueError) ? '' : props.filter.parsingValueError}
        show={!isEmpty(props.filter.parsingValueError)}
        theme="error"
      >
        <Input
          value={props.filter.rawFilterValue}
          invalid={!isEmpty(props.filter.parsingValueError)}
          type="text"
          onChange={(value) => props.onValueChange(value.currentTarget.value)}
          width={30}
        />
      </Tooltip>
      <IconButton
        tooltip="Add Filter"
        onClick={props.onSaveFilter}
        name="check"
        size="xl"
        variant="primary"
        disabled={isEmpty(props.filter.attribute) || isEmpty(props.filter.operator)}
      />
      <IconButton tooltip="Delete Filter" name="trash-alt" onClick={props.onDelete} size="lg" variant="destructive" />
    </HorizontalGroup>
  );
}
