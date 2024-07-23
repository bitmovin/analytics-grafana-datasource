import React, { ChangeEvent, useEffect } from 'react';
import { DataSourceHttpSettings, FieldSet, InlineField, InlineSwitch, Input } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { BitmovinDataSourceOptions } from '../types/grafanaTypes';

interface Props extends DataSourcePluginOptionsEditorProps<BitmovinDataSourceOptions> {}

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;

  // sets the instanceSettings.url to the default bitmovin api url if it is not already set when opening the ConfigEditor
  useEffect(() => {
    if (options.url === '' || options.url == null) {
      onOptionsChange({ ...options, url: 'https://api.bitmovin.com/v1' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAdAnalyticsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const jsonData = {
      ...options.jsonData,
      isAdAnalytics: event.currentTarget.checked,
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
        <InlineField required label="API Key" labelWidth={26}>
          <Input
            required
            onChange={onAPIKeyChange}
            value={jsonData.apiKey || ''}
            placeholder="Analytics API Key"
            width={40}
            id={`config-editor-${props.options.name}_api-key-input`}
          />
        </InlineField>
        <InlineField label="Tenant Org Id" labelWidth={26}>
          <Input
            onChange={onTenantOrgIdChange}
            value={jsonData.tenantOrgId || ''}
            placeholder="Tenant Org Id"
            width={40}
            id={`config-editor-${props.options.name}_tenant-org-id-input`}
          />
        </InlineField>
        <InlineField label="Ad Analytics" tooltip={'Check if you want to query ads data'} labelWidth={26}>
          <InlineSwitch value={jsonData.isAdAnalytics || false} onChange={onAdAnalyticsChange}></InlineSwitch>
        </InlineField>
      </FieldSet>
    </>
  );
}
