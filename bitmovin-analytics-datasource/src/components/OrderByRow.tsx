import React, { useState } from 'react';
import { Box, IconButton, VerticalGroup } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { cloneDeep, differenceWith } from 'lodash';

import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { QueryOrderBy, QuerySortOrder, SelectableQueryOrderBy } from '../types/queryOrderBy';
import { OrderByInput } from './OrderByInput';
import { REORDER_DIRECTION } from './GroupByInput';

type Props = {
  readonly isAdAnalytics: boolean;
  readonly onChange: (newOrderBy: QueryOrderBy[]) => void;
};

export function OrderByRow(props: Props) {
  const [orderBys, setOrderBys] = useState<SelectableQueryOrderBy[]>([]);

  const mapOrderBysToSelectableValue = (): Array<SelectableValue<QueryAttribute | QueryAdAttribute>> => {
    if (props.isAdAnalytics) {
      const orderByAdAttributes = orderBys.map((orderBy) => orderBy.name as QueryAdAttribute);
      return differenceWith(
        SELECTABLE_QUERY_AD_ATTRIBUTES,
        orderByAdAttributes,
        (selectableAttribute, orderByAdAttribute) => selectableAttribute.value === orderByAdAttribute
      );
    } else {
      const orderByAttributes = orderBys.map((orderBy) => orderBy.name as QueryAdAttribute);
      return differenceWith(
        SELECTABLE_QUERY_ATTRIBUTES,
        orderByAttributes,
        (selectableAttribute, orderByAttribute) => selectableAttribute.value === orderByAttribute
      );
    }
  };

  const deleteOrderByInput = (index: number) => {
    const newOrderBys = [...orderBys];
    newOrderBys.splice(index, 1);

    setOrderBys(newOrderBys);
    props.onChange(newOrderBys as QueryOrderBy[]);
  };

  const onAttributesChange = (index: number, newAttribute: QueryAttribute | QueryAdAttribute) => {
    const newOrderBys = [...orderBys];
    const newValue = { name: newAttribute, order: newOrderBys[index].order } as QueryOrderBy;
    newOrderBys.splice(index, 1, newValue);
    setOrderBys(newOrderBys);
    props.onChange(newOrderBys as QueryOrderBy[]);
  };

  const onSortOrdersChange = (index: number, newSortOrder: QuerySortOrder) => {
    const newOrderBys = [...orderBys];
    const newValue = { name: newOrderBys[index].name, order: newSortOrder } as QueryOrderBy;
    newOrderBys.splice(index, 1, newValue);
    setOrderBys(newOrderBys);
    props.onChange(newOrderBys as QueryOrderBy[]);
  };

  const reorderOrderBy = (direction: REORDER_DIRECTION, index: number) => {
    const clonedOrderbys = cloneDeep(orderBys);
    const orderByToMove = clonedOrderbys[index];
    const orderBysWithoutOrderByToMove = clonedOrderbys.slice(0, index).concat(clonedOrderbys.slice(index + 1));
    const newIndex = direction === REORDER_DIRECTION.UP ? index - 1 : index + 1;

    const newOrderBys = orderBysWithoutOrderByToMove
      .slice(0, newIndex)
      .concat(orderByToMove)
      .concat(orderBysWithoutOrderByToMove.slice(newIndex));

    //TODOMY why is this not triggering a rerender?
    setOrderBys(newOrderBys);
    props.onChange(newOrderBys as QueryOrderBy[]);
  };
  const addOrderByInput = () => {
    setOrderBys((prevState) => [...prevState, { name: '', order: 'ASC' }]);
  };

  return (
    <VerticalGroup>
      {orderBys.map((item, index, orderBys) => (
        <OrderByInput
          isAdAnalytics={props.isAdAnalytics}
          selectableGroupByAttributes={mapOrderBysToSelectableValue()}
          attribute={item.name}
          onAttributeChange={(newValue: QueryAttribute | QueryAdAttribute) => onAttributesChange(index, newValue)}
          sortOrder={item.order}
          onSortOrderChange={(newValue: QuerySortOrder) => onSortOrdersChange(index, newValue)}
          onDelete={() => deleteOrderByInput(index)}
          isFirst={index === 0}
          isLast={index === orderBys.length - 1}
          onReorderGroupBy={(direction: REORDER_DIRECTION) => reorderOrderBy(direction, index)}
        />
      ))}

      <Box paddingTop={orderBys.length === 0 ? 0.5 : 0}>
        <IconButton name="plus-square" tooltip="Add Group By" onClick={() => addOrderByInput()} size="xl" />
      </Box>
    </VerticalGroup>
  );
}
