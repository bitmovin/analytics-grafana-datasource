import React, { useEffect, useMemo, useState } from 'react';
import { HorizontalGroup, IconButton, Input, Select, Tooltip } from '@grafana/ui';

import { QueryFilter, QueryFilterOperator, SELECTABLE_QUERY_FILTER_OPERATORS } from '../types/queryFilter';
import type { SelectableValue } from '@grafana/data';
import { QueryAttribute, SELECTABLE_QUERY_ATTRIBUTES } from '../types/queryAttributes';
import { QueryAdAttribute, SELECTABLE_QUERY_AD_ATTRIBUTES } from '../types/queryAdAttributes';
import { convertFilterValueToProperType } from 'utils/filterUtils';

interface QueryFilterInputProps {
  /** `undefined` when component is used to create new filter (no values yet) */
  value: undefined | QueryFilter;

  onChange(queryFilter: QueryFilter): void;

  onDelete(): void;

  isAdAnalytics: boolean;
  /** Selected query filters are used to filter out used values from attribute select options */
  selectedQueryFilters: QueryFilter[];
  queryEditorId: string;
}

export function QueryFilterInput(props: Readonly<QueryFilterInputProps>) {
  /** Flag to indicate that query filter is undefined, does not exist yet, and this component is used to create new one */
  const isCreatingNewOne = props.value == null;

  const [derivedQueryFilterState, setDerivedQueryFilterState] = useState(
    buildInitialDerivedQueryFilterState(props.value)
  );

  /** Update and override {@link derivedQueryFilterState}, when {@link QueryFilterInputProps} value is changed */
  useEffect(() => setDerivedQueryFilterState(buildInitialDerivedQueryFilterState(props.value)), [props.value]);

  const attributeSelectValue = useMemo(
    () => findAttributeSelectableValue(derivedQueryFilterState.attribute, props.isAdAnalytics),
    [derivedQueryFilterState.attribute, props.isAdAnalytics]
  );

  const operatorSelectValue = useMemo(
    () => findOperatorSelectableValue(derivedQueryFilterState.operator),
    [derivedQueryFilterState.operator]
  );

  function handleAttributeChange(selectedValue: SelectableValue<QueryAttribute | QueryAdAttribute>) {
    setDerivedQueryFilterState((prevState) => ({
      ...prevState,
      dirty: true,
      attribute: selectedValue.value,
      attributeError: undefined,
    }));
  }

  function handleOperatorChange(selectedValue: SelectableValue<QueryFilterOperator>) {
    setDerivedQueryFilterState((prevState) => ({
      ...prevState,
      dirty: true,
      operator: selectedValue.value,
      operatorError: undefined,
    }));
  }

  function handleInputValueChange(value: string) {
    setDerivedQueryFilterState((prevState) => ({
      ...prevState,
      dirty: true,
      value: value,
      inputValueError: undefined,
    }));
  }

  function handleRevertClick() {
    setDerivedQueryFilterState(buildInitialDerivedQueryFilterState(props.value));
  }

  function handleSaveClick() {
    if (derivedQueryFilterState.attribute == null) {
      setDerivedQueryFilterState((prevState) => ({
        ...prevState,
        attributeError: 'Filter attribute has to be selected',
      }));
      return;
    }

    if (derivedQueryFilterState.operator == null) {
      setDerivedQueryFilterState((prevState) => ({
        ...prevState,
        operatorError: 'Filter operator has to be selected',
      }));
      return;
    }

    try {
      convertFilterValueToProperType(
        derivedQueryFilterState.value!,
        derivedQueryFilterState.attribute!,
        derivedQueryFilterState.operator!,
        props.isAdAnalytics
      );

      props.onChange({
        name: derivedQueryFilterState.attribute!,
        operator: derivedQueryFilterState.operator!,
        value: derivedQueryFilterState.value!,
      });
    } catch (e: unknown) {
      setDerivedQueryFilterState((prevState) => ({
        ...prevState,
        inputValueError: e instanceof Error ? e.message : 'Could not save value',
      }));
    }
  }

  return (
    <HorizontalGroup spacing="xs">
      <Tooltip
        content={derivedQueryFilterState.attributeError ?? ''}
        show={derivedQueryFilterState.attributeError != null}
        theme="error"
      >
        {/* this div wrapper is needed to expose `ref` for Tooltip above */}
        <div>
          <Select
            id={`query-editor-${props.queryEditorId}_filter-attribute-select`}
            value={attributeSelectValue}
            onChange={handleAttributeChange}
            options={props.isAdAnalytics ? SELECTABLE_QUERY_AD_ATTRIBUTES : SELECTABLE_QUERY_ATTRIBUTES}
            width={ATTRIBUTE_COMPONENT_WIDTH}
            invalid={derivedQueryFilterState.attributeError != null}
          />
        </div>
      </Tooltip>
      <Tooltip
        content={derivedQueryFilterState.operatorError ?? ''}
        show={derivedQueryFilterState.operatorError != null}
        theme="error"
      >
        {/* this div wrapper is needed to expose `ref` for Tooltip above */}
        <div>
          <Select
            id={`query-editor-${props.queryEditorId}_filter-operator-select`}
            value={operatorSelectValue}
            onChange={handleOperatorChange}
            options={SELECTABLE_QUERY_FILTER_OPERATORS}
            width={OPERATOR_COMPONENT_WIDTH}
            invalid={derivedQueryFilterState.operatorError != null}
          />
        </div>
      </Tooltip>
      <Tooltip
        content={derivedQueryFilterState.inputValueError ?? ''}
        show={derivedQueryFilterState.inputValueError != null}
        theme="error"
      >
        <Input
          data-testid={`query-editor-${props.queryEditorId}_filter-value-input`}
          value={derivedQueryFilterState.value}
          onChange={(e) => handleInputValueChange(e.currentTarget.value)}
          invalid={derivedQueryFilterState.inputValueError != null}
          type="text"
          width={VALUE_COMPONENT_WIDTH}
        />
      </Tooltip>

      <IconButton
        data-testid={`query-editor-${props.queryEditorId}_filter-delete-button`}
        variant="destructive"
        name="trash-alt"
        size="lg"
        tooltip="Delete Filter"
        onClick={props.onDelete}
      />
      {/* in "create mode" we want to show save icons all the time */}
      {(isCreatingNewOne || derivedQueryFilterState.dirty) && (
        <IconButton
          data-testid={`query-editor-${props.queryEditorId}_filter-save-button`}
          variant="primary"
          name={isCreatingNewOne ? 'plus-square' : 'save'}
          size="lg"
          tooltip={isCreatingNewOne ? 'Add new filter' : 'Save changes'}
          onClick={handleSaveClick}
        />
      )}
      {/* in "create mode" there is nothing to revert to */}
      {!isCreatingNewOne && derivedQueryFilterState.dirty && (
        <IconButton
          data-testid={`query-editor-${props.queryEditorId}_filter-revert-changes-button`}
          variant="secondary"
          name="history"
          size="lg"
          tooltip="Revert changes"
          onClick={handleRevertClick}
        />
      )}
    </HorizontalGroup>
  );
}

export const ATTRIBUTE_COMPONENT_WIDTH = 30;
export const OPERATOR_COMPONENT_WIDTH = 15;
export const VALUE_COMPONENT_WIDTH = 30;

type DerivedQueryFilterState = {
  attribute: undefined | QueryFilter['name'];
  attributeError: undefined | string;
  operator: undefined | QueryFilter['operator'];
  operatorError: undefined | string;
  value: undefined | QueryFilter['value'];
  /** `true` if some values have been changed by inputs */
  dirty: boolean;
  /** `undefined` when input value is valid */
  inputValueError: undefined | string;
};

function buildInitialDerivedQueryFilterState(queryFilter: undefined | QueryFilter): DerivedQueryFilterState {
  return {
    attribute: queryFilter?.name,
    attributeError: undefined,
    operator: queryFilter?.operator,
    operatorError: undefined,
    value: queryFilter?.value,
    dirty: false,
    inputValueError: undefined,
  };
}

function findAttributeSelectableValue(
  attribute: undefined | QueryAttribute | QueryAdAttribute,
  isAdAnalytics: boolean
): undefined | SelectableValue<QueryAttribute | QueryAdAttribute> {
  if (attribute == null) {
    return undefined;
  }

  const ALL_ATTRIBUTES: Array<SelectableValue<QueryAttribute | QueryAdAttribute>> = isAdAnalytics
    ? SELECTABLE_QUERY_AD_ATTRIBUTES
    : SELECTABLE_QUERY_ATTRIBUTES;

  return ALL_ATTRIBUTES.find((s) => s.value === attribute);
}

function findOperatorSelectableValue(
  operator: undefined | QueryFilterOperator
): undefined | SelectableValue<QueryFilterOperator> {
  if (operator == null) {
    return undefined;
  }

  return SELECTABLE_QUERY_FILTER_OPERATORS.find((s) => s.value === operator);
}
