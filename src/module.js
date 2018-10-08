import {BitmovinAnalyticsDatasource} from './datasource';
import {BitmovinAnalyticsDatasourceQueryCtrl} from './query_ctrl';

class BitmovinAnalyticsConfigCtrl {
    constructor($scope) {
      this.current.url = this.current.url || 'https://api.bitmovin.com/v1';
    }
}
BitmovinAnalyticsConfigCtrl.templateUrl = 'partials/config.html';

class BitmovinAnalyticsQueryOptionsCtrl {}
BitmovinAnalyticsQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

class BitmovinAnalyticsAnnotationsQueryCtrl {}
BitmovinAnalyticsAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html'

export {
  BitmovinAnalyticsDatasource as Datasource,
  BitmovinAnalyticsDatasourceQueryCtrl as QueryCtrl,
  BitmovinAnalyticsConfigCtrl as ConfigCtrl,
  BitmovinAnalyticsQueryOptionsCtrl as QueryOptionsCtrl,
  BitmovinAnalyticsAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
