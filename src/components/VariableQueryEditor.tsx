import React, { useState } from 'react';
import { InlineField, Input } from '@grafana/ui';
import type { BitmovinVariableQuery } from '../types/variableQuery';

interface Props {
  query: BitmovinVariableQuery;
  onChange: (query: BitmovinVariableQuery) => void;
}

/**
 * Editor for "Query" template variables. User can define dimension and license for the query. The query runs when
 * the user leaves the field or clicks "Run query".
 */
export function VariableQueryEditor({ query, onChange }: Props) {
  const [value, setValue] = useState(query?.query ?? '');

  const commit = () => {
    if (value !== query?.query) {
      onChange({ ...query, refId: query?.refId ?? 'BitmovinVariableQuery', query: value });
    }
  };

  return (
    <InlineField
      label="Query"
      labelWidth={20}
      tooltip="e.g. 'licenses' or 'dimension:COUNTRY' or 'dimension:BROWSER license:YOUR_LICENSE_KEY'. Without a license the first available one is used. Values are fetched from the last 24 hours."
      grow
    >
      <Input
        aria-label="Variable query"
        value={value}
        placeholder="licenses or dimension:COUNTRY or dimension:BROWSER license:YOUR_LICENSE_KEY"
        onChange={(e) => setValue(e.currentTarget.value)}
        onBlur={commit}
      />
    </InlineField>
  );
}
