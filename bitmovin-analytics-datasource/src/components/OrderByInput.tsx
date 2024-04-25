import React from 'react';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QuerySortOrder } from '../types/queryOrderBy';
import { HorizontalGroup, IconButton, RadioButtonGroup, Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { Space } from '@grafana/plugin-ui';

type Props = {
  attribute: QueryAttribute | QueryAdAttribute | '';
  onAttributeChange: (newValue: QueryAttribute | QueryAdAttribute) => void;
  onSortOrderChange: (newValue: QuerySortOrder) => void;
  sortOrder: QuerySortOrder;
  isAdAnalytics: boolean;
  onDelete: () => void;
};

const sortOrderOption: SelectableValue<QuerySortOrder>[] = [
  { value: 'ASC', description: 'Sort by ascending', icon: 'sort-amount-up' },
  { value: 'DESC', description: 'Sort by descending', icon: 'sort-amount-down' },
];

export function OrderByInput(props: Props) {
  return (
    <HorizontalGroup spacing="xs">
      {
        //TODOMY fix autospaching ui issue
      }
      <div
        style={{
          width: '100%',
        }}
      >
        <Select
          value={props.attribute}
          onChange={(value) => props.onAttributeChange(value.value as QueryAttribute | QueryAdAttribute)}
          options={props.isAdAnalytics ? SELECTABLE_QUERY_AD_ATTRIBUTES : SELECTABLE_QUERY_ATTRIBUTES}
        />
      </div>
      <RadioButtonGroup
        options={sortOrderOption}
        value={props.sortOrder}
        onChange={(value) => props.onSortOrderChange(value)}
      />
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
}
