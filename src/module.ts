import {BitmovinAnalyticsDatasource} from './datasource';
import {BitmovinAnalyticsDatasourceQueryCtrl} from './query_ctrl';

class BitmovinAnalyticsConfigCtrl {
    current: any;
    static templateUrl: string;

    constructor($scope) {
      this.current.url = this.current.url || 'https://api.bitmovin.com/v1';
    }
}
BitmovinAnalyticsConfigCtrl.templateUrl = 'partials/config.html';

class BitmovinAnalyticsQueryOptionsCtrl {
    static templateUrl: string;
}
BitmovinAnalyticsQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

class BitmovinAnalyticsAnnotationsQueryCtrl {
    static templateUrl: string;
}
BitmovinAnalyticsAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html'

export {
  BitmovinAnalyticsDatasource as Datasource,
  BitmovinAnalyticsDatasourceQueryCtrl as QueryCtrl,
  BitmovinAnalyticsConfigCtrl as ConfigCtrl,
  BitmovinAnalyticsQueryOptionsCtrl as QueryOptionsCtrl,
  BitmovinAnalyticsAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
