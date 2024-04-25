import * as React from 'react';
import { useState } from 'react';
import { IconButton, VerticalGroup } from '@grafana/ui';
import { OrderByInput } from './OrderByInput';
import { QueryAttribute } from '../types/queryAttributes';
import { QueryAdAttribute } from '../types/queryAdAttributes';
import { QueryOrderBy, QuerySortOrder, SelectableQueryOrderBy } from '../types/queryOrderBy';
import { Space } from '@grafana/plugin-ui';

type Props = {
  readonly isAdAnalytics: boolean;
  readonly onChange: (newOrderBy: QueryOrderBy[]) => void;
};

export function OrderByRow(props: Props) {
  const [orderBys, setOrderBys] = useState<SelectableQueryOrderBy[]>([]);

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
  const addOrderByInput = () => {
    //TODOMY what to use as the default value
    setOrderBys((prevState) => [...prevState, { name: '', order: 'ASC' }]);
  };

  return (
    <>
      <VerticalGroup>
        {orderBys.map((item, index) => (
          <OrderByInput
            isAdAnalytics={props.isAdAnalytics}
            attribute={item.name}
            onAttributeChange={(newValue: QueryAttribute | QueryAdAttribute) => onAttributesChange(index, newValue)}
            onSortOrderChange={(newValue: QuerySortOrder) => onSortOrdersChange(index, newValue)}
            sortOrder={item.order}
            onDelete={() => deleteOrderByInput(index)}
          />
        ))}
      </VerticalGroup>
      <Space v={0.5} />
      {
        //TODOMY fix position of the IconButton
      }
      <IconButton name="plus-square" tooltip="Add Order By" size="xl" onClick={() => addOrderByInput()} />
    </>
  );
}
