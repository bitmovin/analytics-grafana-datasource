import React from 'react';
import { HorizontalGroup, IconButton, Select } from '@grafana/ui';
import { QueryAttribute } from '../types/queryAttributes';
import { QueryAdAttribute } from '../types/queryAdAttributes';
import { SelectableValue } from '@grafana/data';

type Props = {
  groupBy: SelectableValue<QueryAttribute | QueryAdAttribute>;
  selectableGroupBys: Array<SelectableValue<QueryAttribute | QueryAdAttribute>>;
  onDelete: () => void;
  onChange: (newValue: SelectableValue<QueryAdAttribute | QueryAttribute>) => void;
};
export function GroupByInput(props: Props) {
  //TODOMY delete margin between select and icon
  //TODOMY border around the icon
  return (
    <HorizontalGroup>
      <Select value={props.groupBy} onChange={props.onChange} options={props.selectableGroupBys} width={30} />
      <IconButton tooltip="Delete Group By" name="trash-alt" onClick={() => props.onDelete()} size="lg" />
    </HorizontalGroup>
  );
}
