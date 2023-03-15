import RequestHandler from "./requestHandler";
import {LicenseViewModel} from "./types/licenses";

class LicenseService {

  requestHandler: RequestHandler;
  baseURL: string;

  constructor(requestHandler, baseURL) {
    this.requestHandler = requestHandler;
    this.baseURL = baseURL;
  }

  async _fetchLicensesForEndpoint(endpoint, mapperFunction): Promise<LicenseViewModel[]> {
    const requestOptions = {
      url: this.baseURL + endpoint,
      method: 'GET',
    };

    const licensesResponse = await this.requestHandler.doRequest(requestOptions);

    if (licensesResponse.status !== 200) {
      return [];
    }

    const licenses: LicenseViewModel[] = [];
    for (const item of licensesResponse.data.data.result.items) {
      const license = mapperFunction(item);
      licenses.push(license);
    }
    return licenses;
  }

  async fetchLicenses(): Promise<LicenseViewModel[]> {
    let allLicenses: LicenseViewModel[] = [];

    const licenseEndpoints = [
      {
        endpoint: '/analytics/licenses',
        mapperFunc: (item): LicenseViewModel => ({
          'licenseKey': item.licenseKey,
          'label': item.name ? item.name : item.licenseKey
        }),
      },
      {
        endpoint: '/analytics/virtual-licenses',
        mapperFunc: (item): LicenseViewModel => ({
          'licenseKey': item.id,
          'label': item.name ? item.name : item.id
        }),
      },
      {
        endpoint: '/analytics/demo-licenses',
        mapperFunc: (item): LicenseViewModel => ({
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
