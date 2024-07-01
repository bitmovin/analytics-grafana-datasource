import React from 'react';
import { SelectableValue } from '@grafana/data';
import { HorizontalGroup, IconButton, RadioButtonGroup, Select } from '@grafana/ui';

import { QueryAttribute } from '../types/queryAttributes';
import { QueryAdAttribute } from '../types/queryAdAttributes';
import { QuerySortOrder } from '../types/queryOrderBy';
import { REORDER_DIRECTION } from './GroupByInput';
import { isEmpty } from 'lodash';

type Props = {
  readonly isAdAnalytics: boolean;
  readonly attribute: SelectableValue<QueryAttribute | QueryAdAttribute>;
  readonly selectableOrderByAttributes: Array<SelectableValue<QueryAttribute | QueryAdAttribute>>;
  readonly onAttributeChange: (newValue: SelectableValue<QueryAdAttribute | QueryAttribute>) => void;
  readonly sortOrder: QuerySortOrder;
  readonly onSortOrderChange: (newValue: QuerySortOrder) => void;
  readonly onDelete: () => void;
  readonly isFirst: boolean;
  readonly isLast: boolean;
  readonly onReorderOrderBy: (direction: REORDER_DIRECTION) => void;
};

const sortOrderOption: Array<SelectableValue<QuerySortOrder>> = [
  { value: 'ASC', description: 'Sort by ascending', icon: 'sort-amount-up' },
  { value: 'DESC', description: 'Sort by descending', icon: 'sort-amount-down' },
];

export function OrderByInput(props: Props) {
  return (
    <HorizontalGroup spacing="xs">
      <Select
        value={isEmpty(props.attribute) ? undefined : props.attribute}
        onChange={(selectableValue) => props.onAttributeChange(selectableValue)}
        options={props.selectableOrderByAttributes}
        width={30}
      />
      <RadioButtonGroup
        options={sortOrderOption}
        value={props.sortOrder}
        onChange={(value) => props.onSortOrderChange(value)}
      />
      <IconButton
        tooltip="Move down"
        onClick={() => props.onReorderOrderBy(REORDER_DIRECTION.DOWN)}
        name="arrow-down"
        disabled={props.isLast}
      />
      <IconButton
        tooltip="Move up"
        onClick={() => props.onReorderOrderBy(REORDER_DIRECTION.UP)}
        name="arrow-up"
        disabled={props.isFirst}
      />
      <IconButton tooltip="Delete Order By" name="trash-alt" onClick={props.onDelete} size="lg" variant="destructive" />
    </HorizontalGroup>
  );
}
