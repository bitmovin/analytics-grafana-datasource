class RequestHandler {
  backendService: any;
  headers: {
    'Content-Type': string,
    'X-Api-Key': string,
    'X-Tenant-Org-Id'?: string,
    'Authorization'?: string,
  };
  withCredentials: boolean;

  constructor(backendService, headers, withCredentials) {
    this.backendService = backendService;
    this.headers = headers;
    this.withCredentials = withCredentials;
  }

  doRequest(options) {
    options.withCredentials = this.withCredentials;
    options.headers = this.headers;

    return this.backendService.datasourceRequest(options);
  }
}

export default RequestHandler;
