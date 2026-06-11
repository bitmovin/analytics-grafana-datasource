import { isEmpty } from 'lodash';

import {
  BOOLEAN_QUERY_AD_ATTRIBUTES,
  FLOAT_QUERY_AD_ATTRIBUTES,
  INTEGER_QUERY_AD_ATTRIBUTES,
  QueryAdAttribute,
} from '../types/queryAdAttributes';
import { QueryFilterOperator, OutputQueryFilterValue } from '../types/queryFilter';
import {
  BOOLEAN_QUERY_FILTER_ATTRIBUTES,
  INTEGER_QUERY_FILTER_ATTRIBUTES,
  QueryAttribute,
} from '../types/queryAttributes';

const NULL_FILTER_ATTRIBUTES_SET = new Set<QueryAttribute | QueryAdAttribute>([
  'AD_TYPE',
  'CDN_PROVIDER',
  'CUSTOM_DATA_1',
  'CUSTOM_DATA_2',
  'CUSTOM_DATA_3',
  'CUSTOM_DATA_4',
  'CUSTOM_DATA_5',
  'CUSTOM_DATA_6',
  'CUSTOM_DATA_7',
  'CUSTOM_DATA_8',
  'CUSTOM_DATA_9',
  'CUSTOM_DATA_10',
  'CUSTOM_DATA_11',
  'CUSTOM_DATA_12',
  'CUSTOM_DATA_13',
  'CUSTOM_DATA_14',
  'CUSTOM_DATA_15',
  'CUSTOM_DATA_16',
  'CUSTOM_DATA_17',
  'CUSTOM_DATA_18',
  'CUSTOM_DATA_19',
  'CUSTOM_DATA_20',
  'CUSTOM_DATA_21',
  'CUSTOM_DATA_22',
  'CUSTOM_DATA_23',
  'CUSTOM_DATA_24',
  'CUSTOM_DATA_25',
  'CUSTOM_DATA_26',
  'CUSTOM_DATA_27',
  'CUSTOM_DATA_28',
  'CUSTOM_DATA_29',
  'CUSTOM_DATA_30',
  'CUSTOM_DATA_31',
  'CUSTOM_DATA_32',
  'CUSTOM_DATA_33',
  'CUSTOM_DATA_34',
  'CUSTOM_DATA_35',
  'CUSTOM_DATA_36',
  'CUSTOM_DATA_37',
  'CUSTOM_DATA_38',
  'CUSTOM_DATA_39',
  'CUSTOM_DATA_40',
  'CUSTOM_DATA_41',
  'CUSTOM_DATA_42',
  'CUSTOM_DATA_43',
  'CUSTOM_DATA_44',
  'CUSTOM_DATA_45',
  'CUSTOM_DATA_46',
  'CUSTOM_DATA_47',
  'CUSTOM_DATA_48',
  'CUSTOM_DATA_49',
  'CUSTOM_DATA_50',
  'CUSTOM_USER_ID',
  'ERROR_CODE',
  'EXPERIMENT_NAME',
  'ISP',
  'PLAYER_TECH',
  'PLAYER_VERSION',
  'VIDEO_ID',
]);

const BOOLEAN_QUERY_AD_ATTRIBUTES_SET = new Set<string>(BOOLEAN_QUERY_AD_ATTRIBUTES);
const BOOLEAN_QUERY_FILTER_ATTRIBUTES_SET = new Set<string>(BOOLEAN_QUERY_FILTER_ATTRIBUTES);

const INTEGER_QUERY_AD_ATTRIBUTES_SET = new Set<string>(INTEGER_QUERY_AD_ATTRIBUTES);
const FLOAT_QUERY_AD_ATTRIBUTES_SET = new Set<string>(FLOAT_QUERY_AD_ATTRIBUTES);
const INTEGER_QUERY_FILTER_ATTRIBUTES_SET = new Set<string>(INTEGER_QUERY_FILTER_ATTRIBUTES);

export const isNullFilter = (filterAttribute: QueryAttribute | QueryAdAttribute): boolean =>
  NULL_FILTER_ATTRIBUTES_SET.has(filterAttribute);

export function isBooleanFilter(attribute: QueryAttribute | QueryAdAttribute, isAdAnalytics: boolean): boolean {
  return isAdAnalytics
    ? BOOLEAN_QUERY_AD_ATTRIBUTES_SET.has(attribute)
    : BOOLEAN_QUERY_FILTER_ATTRIBUTES_SET.has(attribute);
}

function isNumericFilter(attribute: QueryAttribute | QueryAdAttribute, isAdAnalytics: boolean): boolean {
  if (isAdAnalytics) {
    return INTEGER_QUERY_AD_ATTRIBUTES_SET.has(attribute) || FLOAT_QUERY_AD_ATTRIBUTES_SET.has(attribute);
  } else {
    return INTEGER_QUERY_FILTER_ATTRIBUTES_SET.has(attribute);
  }
}

/** A "string" filter attribute: anything not classified as boolean or numeric. */
export function isStringFilter(attribute: QueryAttribute | QueryAdAttribute, isAdAnalytics: boolean): boolean {
  return !isBooleanFilter(attribute, isAdAnalytics) && !isNumericFilter(attribute, isAdAnalytics);
}

const parseValueForInFilter = (rawValue: string) => {
  const value: string[] = JSON.parse(rawValue);
  if (!Array.isArray(value)) {
    throw new Error();
  }
  return value;
};

/**
 * Normalises the raw value of an `IN` filter into a JSON array string that
 * {@link parseValueForInFilter} can parse.
 *
 * Accepts the three shapes an `IN` value can arrive in:
 * - an explicit JSON array typed by the user: `["Firefox","Chrome"]` (passed through unchanged)
 * - a Grafana multi-value variable glob: `{Firefox,Chrome}`
 * - a comma separated list or a single value (e.g. when a multi-value variable resolves to a
 *   single selection): `Firefox,Chrome` or `Firefox`
 *
 * A single value is wrapped into a one-element array so a one-item variable selection
 * stays a valid `IN` filter instead of throwing.
 */
export function normalizeInFilterValue(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('[')) {
    // Already a JSON array (user-typed or produced by the multi-value format callback).
    return trimmed;
  }
  // Strip Grafana's multi-value glob braces ({a,b,c}) if present, then split on commas.
  const inner = trimmed.replace(/^\{(.*)\}$/, '$1');
  const parts = inner
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  return JSON.stringify(parts);
}

const parseNumber = (rawValue: string, kind: 'integer' | 'float'): number => {
  const parsed = kind === 'float' ? parseFloat(rawValue) : parseInt(rawValue, 10);
  if (isNaN(parsed)) {
    const expected = kind === 'float' ? 'a floating point number' : 'an integer number';
    throw new Error(`Couldn't parse filter value, please provide data as ${expected}`);
  }
  return parsed;
};

const convertFilterForAds = (rawValue: string, filterAttribute: QueryAdAttribute) => {
  if (isBooleanFilter(filterAttribute, true)) {
    return rawValue === 'true';
  }
  if (FLOAT_QUERY_AD_ATTRIBUTES_SET.has(filterAttribute)) {
    return parseNumber(rawValue, 'float');
  }
  if (INTEGER_QUERY_AD_ATTRIBUTES_SET.has(filterAttribute)) {
    return parseNumber(rawValue, 'integer');
  }
  return rawValue;
};

const convertFilter = (rawValue: string, filterAttribute: QueryAttribute) => {
  if (isBooleanFilter(filterAttribute, false)) {
    return rawValue === 'true';
  }
  if (INTEGER_QUERY_FILTER_ATTRIBUTES_SET.has(filterAttribute)) {
    return parseNumber(rawValue, 'integer');
  }
  return rawValue;
};

/**
 * Transforms the string filter Value from the UI to the appropriate type for our API.
 *
 * @param {string} rawValue The raw string value from the Filter Input.
 * @param {QueryAttribute | QueryAdAttribute} filterAttribute The filter attribute.
 * @param {QueryFilterOperator} filterOperator The filter operator.
 * @param {boolean} isAdAnalytics If Ad Analytics are queried.
 * @returns {OutputQueryFilterValue} The correctly converted Filter Value.
 * */
export const convertFilterValueToProperType = (
  rawValue: string,
  filterAttribute: QueryAttribute | QueryAdAttribute,
  filterOperator: QueryFilterOperator,
  isAdAnalytics: boolean
): OutputQueryFilterValue => {
  if (isEmpty(rawValue) && isNullFilter(filterAttribute)) {
    return null;
  }

  if (filterOperator === 'IN') {
    try {
      return parseValueForInFilter(normalizeInFilterValue(rawValue));
    } catch (e) {
      throw new Error(
        `Couldn't parse IN filter. Provide a JSON array (e.g.: ["Firefox", "Chrome"]) or select values from a multi-value Grafana variable.`
      );
    }
  }

  if (isAdAnalytics) {
    return convertFilterForAds(rawValue, filterAttribute as QueryAdAttribute);
  }
  return convertFilter(rawValue, filterAttribute as QueryAttribute);
};

/** Minimal shape of a Grafana template variable needed for the multi-value check. */
export interface VariableLike {
  name: string;
  /** True for variables configured to allow selecting multiple values. */
  multi?: boolean;
}

const MULTI_VALUE_WARNING =
  'This is a multi-value variable but the operator is not "IN". Only the first selected value will be applied — use the "IN" operator to match all selected values.';

/**
 * Returns a warning when a non-IN filter references a multi-value variable, otherwise `undefined`.
 * A multi-value variable can resolve to several values, but the Bitmovin API only accepts a single
 * value for non-IN operators (only the first selected value is applied at query time) — this
 * surfaces that in the query editor. The warning is shown for any multi-value variable, regardless
 * of how many values are currently selected (a multi-value variable's value is always an array).
 */
export function getMultiValueOperatorWarning(
  value: string | undefined,
  operator: QueryFilterOperator | undefined,
  variables: VariableLike[]
): string | undefined {
  if (!value || !operator || operator === 'IN') {
    return undefined;
  }

  const usesMultiValueVariable = variables.some(
    (v) => v.multi === true && (value.includes(`$${v.name}`) || value.includes(`\${${v.name}}`))
  );

  return usesMultiValueVariable ? MULTI_VALUE_WARNING : undefined;
}
