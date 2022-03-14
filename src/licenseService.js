class LicenseService {

  constructor(requestHandler, baseURL) {
    this.requestHandler = requestHandler;
    this.baseURL = baseURL;
  }

  async _fetchLicensesForEndpoint(endpoint, mapperFunction) {
    const requestOptions = {
      url: this.baseURL + endpoint,
      method: 'GET',
    };

    const licensesResponse = await this.requestHandler.doRequest(requestOptions);

    if (licensesResponse.status !== 200) {
      return [];
    }

    const licenses = [];
    for (const item of licensesResponse.data.data.result.items) {
      const license = mapperFunction(item);
      licenses.push(license);
    }
    return licenses;
  }

  async fetchLicenses() {
    let allLicenses = [];

    const licenseEndpoints = [
      {
        endpoint: '/analytics/licenses',
        mapperFunc: (item) => ({
          ...item,
          'label': item.name ? item.name : item.licenseKey
        }),
      },
      {
        endpoint: '/analytics/virtual-licenses',
        mapperFunc: (item) => ({
          ...item,
          'licenseKey': item.id,
          'label': item.name ? item.name : item.id
        }),
      },
      {
        endpoint: '/analytics/demo-licenses',
        mapperFunc: (item) => ({
          ...item,
          'licenseKey': item.id,
          'label': item.name ? item.name : item.id
        }),
      },
    ];
    for (const item of licenseEndpoints) {
      try {
        const licenses = await this._fetchLicensesForEndpoint(item.endpoint, item.mapperFunc);
        allLicenses = allLicenses.concat(licenses);
      } catch (e) {
        // ignore error
      }
    }
    return allLicenses;
  }
};

export default LicenseService;
