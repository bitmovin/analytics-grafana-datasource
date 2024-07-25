import React from 'react';
import { SelectableValue } from '@grafana/data';
import { IconButton, VerticalGroup } from '@grafana/ui';
import { differenceWith } from 'lodash';

import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { GroupByInput, REORDER_DIRECTION } from './GroupByInput';

const getSelectableGroupByOptions = (
  selectedGroupBys: Array<QueryAttribute | QueryAdAttribute>,
  isAdAnalytics: boolean
): Array<SelectableValue<QueryAttribute | QueryAdAttribute>> => {
  if (isAdAnalytics) {
    return differenceWith(
      SELECTABLE_QUERY_AD_ATTRIBUTES,
      selectedGroupBys,
      (selectableValue, selectedValue) => selectableValue.value === selectedValue
    );
  } else {
    return differenceWith(
      SELECTABLE_QUERY_ATTRIBUTES,
      selectedGroupBys,
      (selectableValue, selectedValue) => selectableValue.value === selectedValue
    );
  }
};

const mapGroupByToSelectableValue = (
  selectedGroupBy: QueryAttribute | QueryAdAttribute,
  isAdAnalytics: boolean
): SelectableValue<QueryAttribute | QueryAdAttribute> => {
  if (isAdAnalytics) {
    return SELECTABLE_QUERY_AD_ATTRIBUTES.filter((selectableValue) => selectableValue.value === selectedGroupBy);
  } else {
    return SELECTABLE_QUERY_ATTRIBUTES.filter((selectableValue) => selectableValue.value === selectedGroupBy);
  }
};

type Props = {
  readonly isAdAnalytics: boolean;
  readonly onChange: (newGroupBys: Array<QueryAttribute | QueryAdAttribute>) => void;
  readonly groupBys: Array<QueryAttribute | QueryAdAttribute>;
};

export function GroupByRow(props: Props) {
  const paddingTop = props.groupBys.length === 0 ? 4 : 0;
  const deleteGroupByInput = (index: number) => {
    const newSelectedGroupBys = [...props.groupBys];
    newSelectedGroupBys.splice(index, 1);

    props.onChange(newSelectedGroupBys);
  };

  const onSelectedGroupByChange = (index: number, newSelectedGroupBy: QueryAttribute | QueryAdAttribute) => {
    const newSelectedGroupBys = [...props.groupBys];
    newSelectedGroupBys.splice(index, 1, newSelectedGroupBy);

    props.onChange(newSelectedGroupBys);
  };

  const reorderGroupBy = (direction: REORDER_DIRECTION, index: number) => {
    const newSelectedGroupBys = [...props.groupBys];
    const groupByToMove = newSelectedGroupBys[index];
    newSelectedGroupBys.splice(index, 1);

    const newIndex = direction === REORDER_DIRECTION.UP ? index - 1 : index + 1;
    newSelectedGroupBys.splice(newIndex, 0, groupByToMove);

    props.onChange(newSelectedGroupBys);
  };

  const addGroupByInput = () => {
    const newDefaultSelectedValue = getSelectableGroupByOptions(props.groupBys, props.isAdAnalytics)[0].value!;
    props.onChange([...props.groupBys, newDefaultSelectedValue]);
  };

  return (
    <VerticalGroup>
      {props.groupBys.map((item, index, selectedGroupBysArray) => (
        <GroupByInput
          key={index}
          groupBy={mapGroupByToSelectableValue(item, props.isAdAnalytics)}
          onChange={(newValue: QueryAdAttribute | QueryAttribute) => onSelectedGroupByChange(index, newValue)}
          selectableGroupBys={getSelectableGroupByOptions(selectedGroupBysArray, props.isAdAnalytics)}
          onDelete={() => deleteGroupByInput(index)}
          isFirst={index === 0}
          isLast={index === selectedGroupBysArray.length - 1}
          onReorderGroupBy={(direction: REORDER_DIRECTION) => reorderGroupBy(direction, index)}
        />
      ))}
      <div style={{ paddingTop }}>
        <IconButton name="plus-square" tooltip="Add Group By" onClick={() => addGroupByInput()} size="xl" />
      </div>
    </VerticalGroup>
  );
}
