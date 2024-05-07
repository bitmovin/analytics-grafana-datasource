import React, { useState } from 'react';
import { SelectableValue } from '@grafana/data';
import { Box, IconButton, VerticalGroup } from '@grafana/ui';
import { difference } from 'lodash';

import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { GroupByInput, REORDER_DIRECTION } from './GroupByInput';

type Props = {
  readonly isAdAnalytics: boolean;
  readonly onChange: (newGroupBys: QueryAdAttribute[] | QueryAttribute[]) => void;
};

export function GroupByRow(props: Props) {
  const [selectedGroupBys, setSelectedGroupBys] = useState<Array<SelectableValue<QueryAdAttribute | QueryAttribute>>>(
    []
  );

  const mapGroupBysToSelectableValue = (): Array<SelectableValue<QueryAttribute | QueryAdAttribute>> => {
    if (props.isAdAnalytics) {
      return difference(SELECTABLE_QUERY_AD_ATTRIBUTES, selectedGroupBys);
    } else {
      return difference(SELECTABLE_QUERY_ATTRIBUTES, selectedGroupBys);
    }
  };

  const deleteGroupByInput = (index: number) => {
    const newSelectedGroupBys = [...selectedGroupBys];
    newSelectedGroupBys.splice(index, 1);

    setSelectedGroupBys(newSelectedGroupBys);

    const groupBys = newSelectedGroupBys.map((groupBy) => groupBy.value);
    props.onChange(groupBys as QueryAttribute[] | QueryAdAttribute[]);
  };

  const onSelectedGroupByChange = (
    index: number,
    newSelectedGroupBy: SelectableValue<QueryAttribute | QueryAdAttribute>
  ) => {
    const newSelectedGroupBys = [...selectedGroupBys];
    newSelectedGroupBys.splice(index, 1, newSelectedGroupBy);
    setSelectedGroupBys(newSelectedGroupBys);

    const groupBys = newSelectedGroupBys.map((groupBy) => groupBy.value);
    props.onChange(groupBys as QueryAttribute[] | QueryAdAttribute[]);
  };

  const reorderGroupBy = (direction: REORDER_DIRECTION, index: number) => {
    const newSelectedGroupBys = [...selectedGroupBys];
    const groupByToMove = newSelectedGroupBys[index];
    newSelectedGroupBys.splice(index, 1);

    const newIndex = direction === REORDER_DIRECTION.UP ? index - 1 : index + 1;
    newSelectedGroupBys.splice(newIndex, 0, groupByToMove);
    setSelectedGroupBys(newSelectedGroupBys);

    const groupBys = newSelectedGroupBys.map((groupBy) => groupBy.value);
    props.onChange(groupBys as QueryAttribute[] | QueryAdAttribute[]);
  };

  const addGroupByInput = () => {
    setSelectedGroupBys((prevState) => [...prevState, { name: '', label: '' }]);
  };

  return (
    <VerticalGroup>
      {selectedGroupBys.map((item, index, groupBys) => (
        <GroupByInput
          key={index}
          groupBy={item}
          onChange={(newValue: SelectableValue<QueryAdAttribute | QueryAttribute>) =>
            onSelectedGroupByChange(index, newValue)
          }
          selectableGroupBys={mapGroupBysToSelectableValue()}
          onDelete={() => deleteGroupByInput(index)}
          isFirst={index === 0}
          isLast={index === groupBys.length - 1}
          onReorderGroupBy={(direction: REORDER_DIRECTION) => reorderGroupBy(direction, index)}
        />
      ))}
      <Box paddingTop={selectedGroupBys.length === 0 ? 0.5 : 0}>
        <IconButton name="plus-square" tooltip="Add Group By" onClick={() => addGroupByInput()} size="xl" />
      </Box>
    </VerticalGroup>
  );
}
