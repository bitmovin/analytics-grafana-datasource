import React from 'react';
import { SelectableValue } from '@grafana/data';
import { HorizontalGroup, IconButton, Select } from '@grafana/ui';

import { QueryAttribute } from '../types/queryAttributes';
import { QueryAdAttribute } from '../types/queryAdAttributes';

type Props = {
  groupBy: SelectableValue<QueryAttribute | QueryAdAttribute>;
  selectableGroupBys: Array<SelectableValue<QueryAttribute | QueryAdAttribute>>;
  onDelete: () => void;
  onChange: (newValue: SelectableValue<QueryAdAttribute | QueryAttribute>) => void;
  isFirst: boolean;
  isLast: boolean;
  onReorderGroupBy: (direction: REORDER_DIRECTION) => void;
};

export enum REORDER_DIRECTION {
  UP,
  DOWN,
}
export function GroupByInput(props: Props) {
  return (
    <HorizontalGroup>
      <Select value={props.groupBy} onChange={props.onChange} options={props.selectableGroupBys} width={30} />
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
