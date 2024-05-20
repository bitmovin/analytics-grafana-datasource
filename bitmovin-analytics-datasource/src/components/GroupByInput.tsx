import React from 'react';
import { SelectableValue } from '@grafana/data';
import { HorizontalGroup, IconButton, Select } from '@grafana/ui';

import { QueryAttribute } from '../types/queryAttributes';
import { QueryAdAttribute } from '../types/queryAdAttributes';
import { isEmpty } from 'lodash';

export enum REORDER_DIRECTION {
  UP,
  DOWN,
}

type Props = {
  readonly groupBy: SelectableValue<QueryAttribute | QueryAdAttribute>;
  readonly selectableGroupBys: Array<SelectableValue<QueryAttribute | QueryAdAttribute>>;
  readonly onDelete: () => void;
  readonly onChange: (newValue: QueryAdAttribute | QueryAttribute) => void;
  readonly isFirst: boolean;
  readonly isLast: boolean;
  readonly onReorderGroupBy: (direction: REORDER_DIRECTION) => void;
};

export function GroupByInput(props: Props) {
  return (
    <HorizontalGroup>
      <Select
        value={isEmpty(props.groupBy) ? undefined : props.groupBy}
        onChange={(value) => props.onChange(value.value!)}
        options={props.selectableGroupBys}
        width={30}
      />
      <IconButton
        tooltip="Move down"
        onClick={() => props.onReorderGroupBy(REORDER_DIRECTION.DOWN)}
        name="arrow-down"
        disabled={props.isLast}
      />
      <IconButton
        tooltip="Move up"
        onClick={() => props.onReorderGroupBy(REORDER_DIRECTION.UP)}
        name="arrow-up"
        disabled={props.isFirst}
      />
      <IconButton tooltip="Delete Group By" name="trash-alt" onClick={props.onDelete} size="lg" variant="destructive" />
    </HorizontalGroup>
  );
}
