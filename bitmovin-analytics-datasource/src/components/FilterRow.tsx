import React, { useState } from 'react';
import { Box, HorizontalGroup, IconButton, InlineLabel, VerticalGroup } from '@grafana/ui';

import { QueryFilter } from '../types/queryFilter';
import {
  ATTRIBUTE_COMPONENT_WIDTH,
  OPERATOR_COMPONENT_WIDTH,
  QueryFilterInput,
  VALUE_COMPONENT_WIDTH,
} from './QueryFilterInput';

type Props = {
  readonly isAdAnalytics: boolean;
  readonly onQueryFilterChange: (newFilters: QueryFilter[]) => void;
  readonly filters: QueryFilter[];
};

export function FilterRow(props: Props) {
  const [hasNewQueryFilter, setHasNewQueryFilter] = useState<boolean>(false);

  function handleQueryFilterDelete(queryFilterIndex: number) {
    const newQueryFilters = [...props.filters];
    newQueryFilters.splice(queryFilterIndex, 1);
    props.onQueryFilterChange(newQueryFilters);
  }

  function handleQueryFilterChange(queryFilterIndex: number, changedQueryFilter: QueryFilter) {
    const newQueryFilters = [...props.filters];
    newQueryFilters.splice(queryFilterIndex, 1, changedQueryFilter);
    props.onQueryFilterChange(newQueryFilters);
  }

  function handleNewQueryFilterChange(newQueryFilter: QueryFilter) {
    const newQueryFilters = [...props.filters, newQueryFilter];
    props.onQueryFilterChange(newQueryFilters);
    setHasNewQueryFilter(false);
  }

  return (
    <VerticalGroup>
      {(props.filters.length > 0 || hasNewQueryFilter) && (
        <HorizontalGroup spacing={'none'}>
          <InlineLabel width={ATTRIBUTE_COMPONENT_WIDTH} tooltip="">
            Attribute
          </InlineLabel>
          <InlineLabel width={OPERATOR_COMPONENT_WIDTH} tooltip="">
            Operator
          </InlineLabel>
          <InlineLabel width={VALUE_COMPONENT_WIDTH} tooltip="">
            Value
          </InlineLabel>
        </HorizontalGroup>
      )}

      {props.filters.map((queryFilter, queryFilterIdx) => (
        <QueryFilterInput
          isAdAnalytics={props.isAdAnalytics}
          value={queryFilter}
          onChange={(changedQueryFilter) => handleQueryFilterChange(queryFilterIdx, changedQueryFilter)}
          onDelete={() => handleQueryFilterDelete(queryFilterIdx)}
          selectedQueryFilters={props.filters}
          key={queryFilterIdx}
        />
      ))}

      <Box paddingTop={props.filters.length === 0 ? 0.5 : 0}>
        {hasNewQueryFilter ? (
          <QueryFilterInput
            isAdAnalytics={props.isAdAnalytics}
            value={undefined}
            onChange={handleNewQueryFilterChange}
            onDelete={() => setHasNewQueryFilter(false)}
            selectedQueryFilters={props.filters}
          />
        ) : (
          <IconButton
            name="plus-square"
            tooltip="Add Filter"
            onClick={() => setHasNewQueryFilter(true)}
            size="xl"
            disabled={hasNewQueryFilter}
          />
        )}
      </Box>
    </VerticalGroup>
  );
}
