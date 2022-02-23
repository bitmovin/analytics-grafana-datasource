class LicenseService {
  constructor(requestHandler, baseURL) {
    this.requestHandler = requestHandler;
    this.baseURL = baseURL;
  }

  async fetchLicenses() {
    const requestOptions = {
      url: this.baseURL + '/analytics/licenses',
      method: 'GET',
    };
    try {
      const licensesResponse = await this.requestHandler.doRequest(requestOptions);

      if (licensesResponse.status !== 200) {
        return [];
      }

      const licenses = [];
      for (var item of licensesResponse.data.data.result.items) {
        item['label'] = item.name ? item.name : item.licenseKey;
        licenses.push(item);
      }
      return licenses;
    } catch (e) {
      return [];
    }
  }
};

export default LicenseService;
