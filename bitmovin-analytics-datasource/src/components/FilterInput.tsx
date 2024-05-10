import React from 'react';
import { SelectableValue } from '@grafana/data';
import { HorizontalGroup, IconButton, Input, Select, Tooltip } from '@grafana/ui';

import { QueryAttribute } from '../types/queryAttributes';
import { QueryAdAttribute } from '../types/queryAdAttributes';
import { QueryFilterOperator, SELECTABLE_QUERY_FILTER_OPERATORS } from '../types/queryFilter';
import { isEmpty } from 'lodash';

type Props = {
  readonly isAdAnalytics: boolean;
  readonly selectableFilterAttributes: Array<SelectableValue<QueryAttribute | QueryAdAttribute>>;
  readonly attribute: SelectableValue<QueryAttribute | QueryAdAttribute>;
  readonly onAttributeChange: (newValue: SelectableValue<QueryAdAttribute | QueryAttribute>) => void;
  readonly operator: SelectableValue<QueryFilterOperator>;
  readonly onOperatorChange: (newValue: SelectableValue<QueryFilterOperator>) => void;
  readonly value: string;
  readonly onValueChange: (newValue: string) => void;
  readonly onDelete: () => void;
  readonly onAddFilter: () => void;
  readonly parsingValueError?: string;
};

export function FilterInput(props: Props) {
  return (
    <HorizontalGroup spacing="xs">
      <Select
        value={isEmpty(props.attribute) ? undefined : props.attribute}
        onChange={(value) => props.onAttributeChange(value)}
        options={props.selectableFilterAttributes}
        width={30}
      />
      <Select
        value={isEmpty(props.operator) ? undefined : props.operator}
        onChange={(value) => props.onOperatorChange(value)}
        options={SELECTABLE_QUERY_FILTER_OPERATORS}
        width={15}
      />
      <Tooltip
        content={props.parsingValueError ? props.parsingValueError : ''}
        show={!!props.parsingValueError}
        theme="error"
      >
        <Input
          value={props.value}
          invalid={!!props.parsingValueError}
          type="text"
          onChange={(value) => props.onValueChange(value.currentTarget.value)}
          width={30}
        />
      </Tooltip>
      <IconButton
        tooltip="Add Filter"
        onClick={props.onAddFilter}
        name="check"
        size="xl"
        variant="primary"
        disabled={isEmpty(props.attribute) || isEmpty(props.operator)}
      />
      <IconButton
        tooltip="Delete Filter"
        name="trash-alt"
        onClick={() => props.onDelete()}
        size="lg"
        variant="destructive"
      />
    </HorizontalGroup>
  );
}
