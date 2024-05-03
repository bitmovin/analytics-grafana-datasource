import React, { useState } from 'react';
import { SelectableValue } from '@grafana/data';
import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { IconButton, Stack } from '@grafana/ui';
import { GroupByInput } from './GroupByInput';
import { difference } from 'lodash';

type Props = {
  readonly isAdAnalytics: boolean;
  readonly onChange: (newGroupBys: Array<QueryAdAttribute> | Array<QueryAttribute>) => void;
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
    props.onChange(groupBys as Array<QueryAttribute> | Array<QueryAdAttribute>);
  };

  const onSelectedGroupByChange = (
    index: number,
    newSelectedGroupBy: SelectableValue<QueryAttribute | QueryAdAttribute>
  ) => {
    const newSelectedGroupBys = [...selectedGroupBys];
    newSelectedGroupBys.splice(index, 1, newSelectedGroupBy);
    setSelectedGroupBys(newSelectedGroupBys);

    const groupBys = newSelectedGroupBys.map((groupBy) => groupBy.value);
    props.onChange(groupBys as Array<QueryAttribute> | Array<QueryAdAttribute>);
  };

  const addGroupByInput = () => {
    setSelectedGroupBys((prevState) => [...prevState, { name: '', label: '' }]);
  };

  //TODOMY fix the overflowing of a lot of selects are created, make it go to the next row
  return (
    <Stack>
      {selectedGroupBys?.map((item, index) => (
        <GroupByInput
          groupBy={item}
          onChange={(newValue: SelectableValue<QueryAdAttribute | QueryAttribute>) =>
            onSelectedGroupByChange(index, newValue)
          }
          selectableGroupBys={mapGroupBysToSelectableValue()}
          onDelete={() => deleteGroupByInput(index)}
        />
      ))}
      <IconButton name="plus-square" tooltip="Add Group By" onClick={() => addGroupByInput()} size="xxl" />
    </Stack>
  );
}
