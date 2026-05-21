import React from 'react';
import { Input } from '@grafana/ui';

interface VariableQueryEditorProps {
  query: string;
  onChange: (query: string) => void;
}

export function VariableQueryEditor({ query, onChange }: VariableQueryEditorProps) {
  return (
    <Input
      value={query}
      placeholder='dimension:COUNTRY  or  dimension:BROWSER license:YOUR_LICENSE_KEY'
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
}
