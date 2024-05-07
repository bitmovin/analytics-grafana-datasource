import React, { useState } from 'react';
import { Box, IconButton, VerticalGroup } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { difference } from 'lodash';

import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { QueryOrderBy, QuerySortOrder } from '../types/queryOrderBy';
import { OrderByInput } from './OrderByInput';
import { REORDER_DIRECTION } from './GroupByInput';

type Props = {
  readonly isAdAnalytics: boolean;
  readonly onChange: (newOrderBy: QueryOrderBy[]) => void;
};

export function OrderByRow(props: Props) {
  const [selectedAttributes, setSelectedAttributes] = useState<
    Array<SelectableValue<QueryAdAttribute | QueryAttribute>>
  >([]);
  const [selectedSortOrders, setSelectedSortOrders] = useState<QuerySortOrder[]>([]);

  const mapOrderBysToSelectableValue = (): Array<SelectableValue<QueryAttribute | QueryAdAttribute>> => {
    if (props.isAdAnalytics) {
      return difference(SELECTABLE_QUERY_AD_ATTRIBUTES, selectedAttributes);
    } else {
      return difference(SELECTABLE_QUERY_ATTRIBUTES, selectedAttributes);
    }
  };

  const mapSelectedValuesToQueryOrderBy = (
    selectedAttributes: Array<SelectableValue<QueryAttribute | QueryAdAttribute>>,
    selectedSortOrders: QuerySortOrder[]
  ): QueryOrderBy[] => {
    const queryOrderBys: QueryOrderBy[] = [];
    for (let i = 0; i < selectedAttributes.length; i++) {
      queryOrderBys.push({
        name: selectedAttributes[i].value!,
        order: selectedSortOrders[i],
      });
    }
    return queryOrderBys;
  };

  const deleteOrderByInput = (index: number) => {
    const newSelectedAttributes = [...selectedAttributes];
    newSelectedAttributes.splice(index, 1);

    const newSelectedSortOrders = [...selectedSortOrders];
    newSelectedSortOrders.splice(index, 1);

    setSelectedAttributes(newSelectedAttributes);
    setSelectedSortOrders(newSelectedSortOrders);
    props.onChange(mapSelectedValuesToQueryOrderBy(newSelectedAttributes, newSelectedSortOrders));
  };

  const onAttributesChange = (index: number, newAttribute: SelectableValue<QueryAttribute | QueryAdAttribute>) => {
    const newSelectedAttributes = [...selectedAttributes];
    newSelectedAttributes.splice(index, 1, newAttribute);
    setSelectedAttributes(newSelectedAttributes);

    props.onChange(mapSelectedValuesToQueryOrderBy(newSelectedAttributes, selectedSortOrders));
  };

  const onSortOrdersChange = (index: number, newSortOrder: QuerySortOrder) => {
    const newSelectedSortOrders = [...selectedSortOrders];
    newSelectedSortOrders.splice(index, 1, newSortOrder);
    setSelectedSortOrders(newSelectedSortOrders);

    props.onChange(mapSelectedValuesToQueryOrderBy(selectedAttributes, newSelectedSortOrders));
  };

  const reorderOrderBy = (direction: REORDER_DIRECTION, index: number) => {
    const newIndex = direction === REORDER_DIRECTION.UP ? index - 1 : index + 1;

    const newSelectedAttributes = [...selectedAttributes];
    const attributeToMove = newSelectedAttributes[index];
    newSelectedAttributes.splice(index, 1);
    newSelectedAttributes.splice(newIndex, 0, attributeToMove);

    const newSelectedSortOrders = [...selectedSortOrders];
    const sortOrderToMove = newSelectedSortOrders[index];
    newSelectedSortOrders.splice(index, 1);
    newSelectedSortOrders.splice(newIndex, 0, sortOrderToMove);

    setSelectedAttributes(newSelectedAttributes);
    setSelectedSortOrders(newSelectedSortOrders);

    props.onChange(mapSelectedValuesToQueryOrderBy(newSelectedAttributes, newSelectedSortOrders));
  };
  const addOrderByInput = () => {
    setSelectedAttributes((prevState) => [...prevState, {}]);
    setSelectedSortOrders((prevState) => [...prevState, 'ASC']);
  };

  return (
    <VerticalGroup>
      {selectedAttributes.map((attribute, index, array) => (
        <OrderByInput
          isAdAnalytics={props.isAdAnalytics}
          selectableOrderByAttributes={mapOrderBysToSelectableValue()}
          attribute={attribute}
          onAttributeChange={(newValue: SelectableValue<QueryAdAttribute | QueryAttribute>) =>
            onAttributesChange(index, newValue)
          }
          sortOrder={selectedSortOrders[index]}
          onSortOrderChange={(newValue: QuerySortOrder) => onSortOrdersChange(index, newValue)}
          onDelete={() => deleteOrderByInput(index)}
          isFirst={index === 0}
          isLast={index === array.length - 1}
          onReorderOrderBy={(direction: REORDER_DIRECTION) => reorderOrderBy(direction, index)}
        />
      ))}

      <Box paddingTop={selectedAttributes.length === 0 ? 0.5 : 0}>
        <IconButton name="plus-square" tooltip="Add Group By" onClick={() => addOrderByInput()} size="xl" />
      </Box>
    </VerticalGroup>
  );
}
