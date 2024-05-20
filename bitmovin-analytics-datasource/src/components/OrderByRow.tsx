import React from 'react';
import { Box, IconButton, VerticalGroup } from '@grafana/ui';
import type { SelectableValue } from '@grafana/data';
import { differenceWith } from 'lodash';

import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import type { QueryOrderBy, QuerySortOrder } from '../types/queryOrderBy';
import { OrderByInput } from './OrderByInput';
import { REORDER_DIRECTION } from './GroupByInput';

//TODOMY should the selectable not be only available from the Group By attributes?
const getSelectableOrderByOptions = (
  selectedOrderBys: QueryOrderBy[],
  isAdAnalytics: boolean
): Array<SelectableValue<QueryAdAttribute | QueryAttribute>> => {
  if (isAdAnalytics) {
    return differenceWith(
      SELECTABLE_QUERY_AD_ATTRIBUTES,
      selectedOrderBys,
      (selectableValue, selectedValue) => selectableValue.value === selectedValue.name
    );
  } else {
    return differenceWith(
      SELECTABLE_QUERY_ATTRIBUTES,
      selectedOrderBys,
      (selectableValue, selectedValue) => selectableValue.value === selectedValue.name
    );
  }
};

const mapOrderByAttributeToSelectableValue = (
  selectedOrderBy: QueryAttribute | QueryAdAttribute,
  isAdAnalytics: boolean
): SelectableValue<QueryAttribute | QueryAdAttribute> => {
  if (isAdAnalytics) {
    return SELECTABLE_QUERY_AD_ATTRIBUTES.filter((selectableValue) => selectableValue.value === selectedOrderBy);
  } else {
    return SELECTABLE_QUERY_ATTRIBUTES.filter((selectableValue) => selectableValue.value === selectedOrderBy);
  }
};

type Props = {
  readonly isAdAnalytics: boolean;
  readonly onChange: (newOrderBy: QueryOrderBy[]) => void;
  readonly orderBys: QueryOrderBy[];
};

export function OrderByRow(props: Props) {
  const deleteOrderByInput = (index: number) => {
    const newOrderBys = [...props.orderBys];
    newOrderBys.splice(index, 1);

    props.onChange(newOrderBys);
  };

  const onAttributesChange = (index: number, newAttribute: SelectableValue<QueryAttribute | QueryAdAttribute>) => {
    const newOrderBys = [...props.orderBys];
    const newOrderBy = { name: newAttribute.value, order: newOrderBys[index].order } as QueryOrderBy;

    newOrderBys.splice(index, 1, newOrderBy);

    props.onChange(newOrderBys);
  };

  const onSortOrdersChange = (index: number, newSortOrder: QuerySortOrder) => {
    const newOrderBys = [...props.orderBys];
    const newOrderBy = { name: newOrderBys[index].name, order: newSortOrder } as QueryOrderBy;

    newOrderBys.splice(index, 1, newOrderBy);

    props.onChange(newOrderBys);
  };
  const reorderOrderBy = (direction: REORDER_DIRECTION, index: number) => {
    const newIndex = direction === REORDER_DIRECTION.UP ? index - 1 : index + 1;

    const newOrderBys = [...props.orderBys];
    const orderByToMove = newOrderBys[index];
    newOrderBys.splice(index, 1);
    newOrderBys.splice(newIndex, 0, orderByToMove);

    props.onChange(newOrderBys);
  };

  const addOrderByInput = () => {
    const newDefaultSelectedValue = getSelectableOrderByOptions(props.orderBys, props.isAdAnalytics)[0].value!;
    //TODOMY decide on whats the best approach here with the new selected Value, it shouldn't run when adding a new default value, or should it?
    props.onChange([...props.orderBys, { name: newDefaultSelectedValue, order: 'ASC' }]);
  };

  return (
    <VerticalGroup>
      {props.orderBys.map((orderBy, index, selectedOrderBys) => (
        <OrderByInput
          key={index}
          isAdAnalytics={props.isAdAnalytics}
          selectableOrderByAttributes={getSelectableOrderByOptions(selectedOrderBys, props.isAdAnalytics)}
          attribute={mapOrderByAttributeToSelectableValue(orderBy.name, props.isAdAnalytics)}
          onAttributeChange={(newValue: SelectableValue<QueryAdAttribute | QueryAttribute>) =>
            onAttributesChange(index, newValue)
          }
          sortOrder={orderBy.order}
          onSortOrderChange={(newValue: QuerySortOrder) => onSortOrdersChange(index, newValue)}
          onDelete={() => deleteOrderByInput(index)}
          isFirst={index === 0}
          isLast={index === selectedOrderBys.length - 1}
          onReorderOrderBy={(direction: REORDER_DIRECTION) => reorderOrderBy(direction, index)}
        />
      ))}

      <Box paddingTop={props.orderBys.length === 0 ? 0.5 : 0}>
        <IconButton name="plus-square" tooltip="Add Order By" onClick={() => addOrderByInput()} size="xl" />
      </Box>
    </VerticalGroup>
  );
}
