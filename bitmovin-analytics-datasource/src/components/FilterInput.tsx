import React from 'react';
import { SelectableValue } from '@grafana/data';
import { HorizontalGroup, IconButton, Input, Select, Tooltip } from '@grafana/ui';

import { QueryAttribute } from '../types/queryAttributes';
import { QueryAdAttribute } from '../types/queryAdAttributes';
import { REORDER_DIRECTION } from './GroupByInput';
import { QueryFilterOperator, SELECTABLE_QUERY_FILTER_OPERATORS } from '../types/queryFilter';

type Props = {
  readonly isAdAnalytics: boolean;
  readonly selectableFilterAttributes: Array<SelectableValue<QueryAttribute | QueryAdAttribute>>;
  readonly onAttributeChange: (newValue: SelectableValue<QueryAdAttribute | QueryAttribute>) => void;
  readonly onOperatorChange: (newValue: SelectableValue<QueryFilterOperator>) => void;
  readonly onValueChange: (newValue: string) => void;
  readonly onDelete: () => void;
  readonly isFirst: boolean;
  readonly isLast: boolean;
  readonly onReorderFilter: (direction: REORDER_DIRECTION) => void;
  readonly parsingValueError?: string;
};

export function FilterInput(props: Props) {
  return (
    <HorizontalGroup spacing="xs">
      <Select
        onChange={(value) => props.onAttributeChange(value)}
        options={props.selectableFilterAttributes}
        width={30}
      />
      <Select
        onChange={(value) => props.onOperatorChange(value)}
        options={SELECTABLE_QUERY_FILTER_OPERATORS}
        width={15}
      />

      {
        //TODOMY debounce the text editing a little bit...
      }
      <Tooltip
        content={props.parsingValueError ? props.parsingValueError : ''}
        show={!!props.parsingValueError}
        theme="error"
      >
        <Input
          invalid={!!props.parsingValueError}
          type="text"
          onChange={(value) => props.onValueChange(value.currentTarget.value)}
          width={30}
        />
      </Tooltip>
      <IconButton
        tooltip="Move down"
        onClick={() => props.onReorderFilter(REORDER_DIRECTION.DOWN)}
        name="arrow-down"
        disabled={props.isLast}
      />
      <IconButton
        tooltip="Move up"
        onClick={() => props.onReorderFilter(REORDER_DIRECTION.UP)}
        name="arrow-up"
        disabled={props.isFirst}
      />
      <IconButton
        tooltip="Delete Group By"
        name="trash-alt"
        onClick={() => props.onDelete()}
        size="lg"
        variant="destructive"
      />
    </HorizontalGroup>
  );
}
