import React, { ChangeEvent } from 'react';
import { DataSourceHttpSettings, FieldSet, InlineField, InlineSwitch, Input } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions> {}

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;

  const onAdAnalyticsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      adAnalytics: event.currentTarget.checked,
    };
    onOptionsChange({ ...options, jsonData });
  };

  const onAPIKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      apiKey: event.currentTarget.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  const onTenantOrgIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      tenantOrgId: event.currentTarget.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  const { jsonData } = options;

  return (
    <>
      <DataSourceHttpSettings
        defaultUrl="https://api.bitmovin.com/v1"
        dataSourceConfig={options}
        onChange={onOptionsChange}
        showAccessOptions={true}
      />

      <FieldSet label="Bitmovin Analytics Details">
        <InlineField label="API Key" labelWidth={26}>
          <Input onChange={onAPIKeyChange} value={jsonData.apiKey || ''} placeholder="Analytics API Key" width={40} />
        </InlineField>
        <InlineField label="Tenant Org Id (Optional)" labelWidth={26}>
          <Input
            onChange={onTenantOrgIdChange}
            value={jsonData.tenantOrgId || ''}
            placeholder="Tenant Org Id"
            width={40}
          />
        </InlineField>
        <InlineField label="Ad Analytics" tooltip={'Check if you want to query ads data'} labelWidth={26}>
          <InlineSwitch value={jsonData.adAnalytics || false} onChange={onAdAnalyticsChange}></InlineSwitch>
        </InlineField>
      </FieldSet>
    </>
  );
}
