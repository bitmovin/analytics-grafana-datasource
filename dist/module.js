define(["@grafana/data","@grafana/runtime","lodash","moment","rxjs","react","@grafana/ui"],((e,t,r,n,a,o,i)=>(()=>{"use strict";var l={781:t=>{t.exports=e},531:e=>{e.exports=t},7:e=>{e.exports=i},241:e=>{e.exports=r},468:e=>{e.exports=n},959:e=>{e.exports=o},269:e=>{e.exports=a}},s={};function u(e){var t=s[e];if(void 0!==t)return t.exports;var r=s[e]={exports:{}};return l[e](r,r.exports,u),r.exports}u.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return u.d(t,{a:t}),t},u.d=(e,t)=>{for(var r in t)u.o(t,r)&&!u.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},u.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),u.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var c={};u.r(c),u.d(c,{plugin:()=>Oe});var E=u(781),A=u(531),d=u(241),_=u(468),T=u.n(_),O=u(269);const I={license:"",orderBy:[],groupBy:[],filter:[],resultFormat:"time_series",interval:"AUTO"},D=[{value:"AUTO",label:"Auto"},{value:"MINUTE",label:"Minute"},{value:"HOUR",label:"Hour"},{value:"DAY",label:"Day"},{value:"MONTH",label:"Month"}],p=D[0],S=["MINUTE","HOUR","DAY","MONTH"],y=(e,t,r)=>{if("AUTO"!==e)return e;const n=r-t;return n<=108e5?"MINUTE":n<=5184e5?"HOUR":n<=2592e6?"DAY":"MONTH"},R=e=>{switch(e){case"MINUTE":return"minute";case"HOUR":return"hour";case"DAY":return"day";case"MONTH":return"month";default:return null}};function C(e,t,r){const n=new Date(e),a=new Date(t);switch(r){case"MINUTE":return a.setSeconds(0,0);case"HOUR":return a.setMinutes(0,0,0);case"DAY":return a.setHours(n.getHours(),n.getMinutes(),0,0);case"MONTH":return 1===n.getDate()?a.setDate(n.getDate()):a.setDate(0),a.setHours(n.getHours(),n.getMinutes(),0,0)}}function m(e,t,r,n){if(0===e.length)return[];const a=R(n);if(null==a)throw new Error(`Query interval ${n} is not a valid interval.`);const o=[],i=e[0].length>2?[...e[0].slice(1,-1),0]:[0];let l=T()(t);for(;l.valueOf()<=r;){const e=[l.valueOf(),...i];o.push(e),l.add(1,a),"MONTH"===n&&1!==l.date()&&l.set("date",l.daysInMonth())}const s=(0,d.differenceWith)(o,e,((e,t)=>e[0]===t[0])),u=e.concat(s);return(0,d.sortBy)(u,(e=>e[0]))}const f=["AVG_CONCURRENTVIEWERS","MAX_CONCURRENTVIEWERS","AVG-DROPPED-FRAMES"],v=f.map((e=>({value:e,label:e}))),h=e=>f.includes(e),g=(e,t,r,n)=>{if((0,d.isEmpty)(e)&&(e=>{switch(e){case"AD_TYPE":case"CDN_PROVIDER":case"CUSTOM_DATA_1":case"CUSTOM_DATA_2":case"CUSTOM_DATA_3":case"CUSTOM_DATA_4":case"CUSTOM_DATA_5":case"CUSTOM_DATA_6":case"CUSTOM_DATA_7":case"CUSTOM_DATA_8":case"CUSTOM_DATA_9":case"CUSTOM_DATA_10":case"CUSTOM_DATA_11":case"CUSTOM_DATA_12":case"CUSTOM_DATA_13":case"CUSTOM_DATA_14":case"CUSTOM_DATA_15":case"CUSTOM_DATA_16":case"CUSTOM_DATA_17":case"CUSTOM_DATA_18":case"CUSTOM_DATA_19":case"CUSTOM_DATA_20":case"CUSTOM_DATA_21":case"CUSTOM_DATA_22":case"CUSTOM_DATA_23":case"CUSTOM_DATA_24":case"CUSTOM_DATA_25":case"CUSTOM_DATA_26":case"CUSTOM_DATA_27":case"CUSTOM_DATA_28":case"CUSTOM_DATA_29":case"CUSTOM_DATA_30":case"CUSTOM_USER_ID":case"ERROR_CODE":case"EXPERIMENT_NAME":case"ISP":case"PLAYER_TECH":case"PLAYER_VERSION":case"VIDEO_ID":return!0;default:return!1}})(t))return null;if("IN"===r)try{return(e=>{const t=JSON.parse(e);if(!Array.isArray(t))throw new Error;return t})(e)}catch(e){throw new Error('Couldn\'t parse IN filter, please provide data in JSON array form (e.g.: ["Firefox", "Chrome"]).')}return n?((e,t)=>{switch(t){case"IS_LINEAR":return"true"===e;case"AD_INDEX":case"AD_TYPE":case"AD_STARTUP_TIME":case"AD_WRAPPER_ADS_COUNT":case"AUDIO_BITRATE":case"CLICK_POSITION":case"CLOSE_POSITION":case"ERROR_CODE":case"MANIFEST_DOWNLOAD_TIME":case"MIN_SUGGESTED_DURATION":case"PAGE_LOAD_TIME":case"PLAYER_STARTUPTIME":case"SCREEN_HEIGHT":case"SCREEN_WIDTH":case"SKIP_POSITION":case"TIME_HOVERED":case"TIME_IN_VIEWPORT":case"TIME_PLAYED":case"TIME_UNTIL_HOVER":case"VIDEO_BITRATE":case"VIDEO_WINDOW_HEIGHT":case"VIDEO_WINDOW_WIDTH":{const t=parseInt(e,10);if(isNaN(t))throw new Error("Couldn't parse filter value, please provide data as an integer number");return t}case"CLICK_PERCENTAGE":case"CLOSE_PERCENTAGE":case"PERCENTAGE_IN_VIEWPORT":case"SKIP_PERCENTAGE":{const t=parseFloat(e);if(isNaN(t))throw new Error("Couldn't parse filter value, please provide data as a floating point number");return t}default:return e}})(e,t):((e,t)=>{switch(t){case"IS_CASTING":case"IS_LIVE":case"IS_MUTED":return"true"===e;case"AUDIO_BITRATE":case"AD_INDEX":case"BUFFERED":case"CLIENT_TIME":case"DOWNLOAD_SPEED":case"DRM_LOAD_TIME":case"DROPPED_FRAMES":case"DURATION":case"ERROR_CODE":case"PAGE_LOAD_TIME":case"PAGE_LOAD_TYPE":case"PAUSED":case"PLAYED":case"PLAYER_STARTUPTIME":case"SCREEN_HEIGHT":case"SCREEN_WIDTH":case"SEEKED":case"STARTUPTIME":case"VIDEO_BITRATE":case"VIDEO_DURATION":case"VIDEO_PLAYBACK_HEIGHT":case"VIDEO_PLAYBACK_WIDTH":case"VIDEO_STARTUPTIME":case"VIDEO_WINDOW_HEIGHT":case"VIDEO_WINDOW_WIDTH":case"VIDEOTIME_END":case"VIDEOTIME_START":case"VIEWTIME":{const t=parseInt(e,10);if(isNaN(t))throw new Error("Couldn't parse filter value, please provide data as an integer number");return t}case"ERROR_PERCENTAGE":case"REBUFFER_PERCENTAGE":{const t=parseFloat(e);if(isNaN(t))throw new Error("Couldn't parse filter value, please provide data as a floating point number");return t}default:return e}})(e,t)};function M(e,t,r,n,a,o,i){try{var l=e[o](i),s=l.value}catch(e){return void r(e)}l.done?t(s):Promise.resolve(s).then(n,a)}function N(e){return function(){var t=this,r=arguments;return new Promise((function(n,a){var o=e.apply(t,r);function i(e){M(o,n,a,i,l,"next",e)}function l(e){M(o,n,a,i,l,"throw",e)}i(void 0)}))}}function U(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}class b extends E.DataSourceApi{getDefaultQuery(e){return I}query(e){var t=this;return N((function*(){const{range:r}=e,n=t.isRelativeRangeFrom(r.raw);let a;const o=e.targets=(0,d.filter)(e.targets,(e=>!e.hide)),i=(0,d.filter)(o,(e=>t.isQueryComplete(e))).map((l=N((function*(e){var o;const i="time_series"===e.resultFormat&&e.interval?y(e.interval,r.from.valueOf(),r.to.valueOf()):void 0;let l=T()(r.from.valueOf());const s=r.to;if(n){let e=y("AUTO",l.valueOf(),s.valueOf());null!=i&&(u=i,c=e,e=S.indexOf(u)<S.indexOf(c)?u:c),a=R(e),null!=a&&l.startOf(a)}var u,c;let A=e.metric;const _="percentile"===A?e.percentileValue:void 0;let I,D;e.dimension&&(h(e.dimension)?I=e.dimension:D=e.dimension);const p={filters:e.filter.map((e=>({name:e.name,operator:e.operator,value:g(e.value,e.name,e.operator,!!t.isAdAnalytics)}))),groupBy:e.groupBy,orderBy:e.orderBy,dimension:D,metric:I,start:l.toDate(),end:s.toDate(),licenseKey:e.license,interval:i,limit:t.parseLimit(e.limit),percentile:_},f=yield(0,O.lastValueFrom)(t.request(t.getRequestUrl(I,A),"POST",p)),v=f.data.data.result.rows,M=f.data.data.result.rowCount,N=f.data.data.result.columnLabels,U=[];p.interval&&(null===(o=p.groupBy)||void 0===o?void 0:o.length)>0?U.push(...function(e,t,r,n){if(0===e.length)return[];const a=[],o=new Map;e.forEach((e=>{var t;const r=e.slice(1,-1).toString();o.has(r)||o.set(r,[]),null===(t=o.get(r))||void 0===t||t.push(e)}));const i=[];o.forEach((e=>{i.push(m(e,C(e[0][0],t,n),r,n))}));const l=(0,d.zip)(...i[0])[0];return a.push({name:"Time",values:l,type:E.FieldType.time}),i.forEach((e=>{const t=e[0].slice(1,-1).join(", "),r=(0,d.zip)(...e).slice(-1);a.push({name:t,values:r[0],type:E.FieldType.number})})),a}(v,l.valueOf(),s.valueOf(),p.interval)):p.interval?U.push(...function(e,t,r,n,a){if(0===e.length)return[];const o=[],i=m(e,C(e[0][0],r,a),n,a),l=(0,d.zip)(...i);return o.push({name:"Time",values:l[0],type:E.FieldType.time}),o.push({name:t,values:l[l.length-1],type:E.FieldType.number}),o}(v,N.length>0?N[N.length-1].label:"Column 1",l.valueOf(),s.valueOf(),p.interval)):U.push(...function(e,t){if(0===e.length)return[];const r=[],n=(0,d.zip)(...e);let a=[];if(0===t.length)for(let e=0;e<n.length;e++)a.push(`Column ${e+1}`);else a.push(...t.map((e=>e.label)));return e[0].length>1&&n.slice(0,-1).forEach(((e,t)=>{r.push({name:a[t],values:e,type:E.FieldType.string})})),r.push({name:a[a.length-1],values:n[n.length-1],type:E.FieldType.number}),r}(v,N));let b=[];return M>=200&&(b=[{severity:"warning",text:"Your request reached the max row limit of the API. You might see incomplete data. This problem might be caused by the use of high cardinality columns in group by, too small interval, or too big of a time range."}]),(0,E.createDataFrame)({name:e.alias,fields:U,meta:{notices:b}})})),function(e){return l.apply(this,arguments)}));var l;return null!=a&&r.from.startOf(a),Promise.all(i).then((e=>({data:e})))}))()}isRelativeRangeFrom(e){return"string"==typeof e.from}parseLimit(e){if(null!=e)return Number.isInteger(e)?e:parseInt(e,10)}isQueryComplete(e){return!((0,d.isEmpty)(e.license)||(0,d.isEmpty)(e.dimension)||null!=e.dimension&&!h(e.dimension)&&(0,d.isEmpty)(e.metric))}getRequestUrl(e,t){let r="/analytics";return!0===this.isAdAnalytics&&(r+="/ads"),null!=e?r+"/metrics/"+e:r+"/queries/"+t}request(e,t,r){const n={"X-Api-Key":this.apiKey,"X-Api-Client":"analytics-grafana-datasource"};null!=this.tenantOrgId&&(n["X-Tenant-Org-Id"]=this.tenantOrgId);const a={url:this.baseUrl+e,headers:n,method:t,data:r};return(0,A.getBackendSrv)().fetch(a)}testDatasource(){var e=this;return N((function*(){return(0,O.lastValueFrom)(e.request("/analytics/licenses","GET").pipe((0,O.map)((()=>({status:"success",message:"Data source successfully setup and connected."}))),(0,O.catchError)((e=>{var t,r,n,a;let o="Bitmovin: ";e.status&&(o+=e.status+" "),e.statusText?o+=e.statusText:o+="Can not connect to Bitmovin API";let i,l=(null===(t=e.data)||void 0===t?void 0:t.message)||(null===(n=e.data)||void 0===n||null===(r=n.data)||void 0===r?void 0:r.message);var s,u;return(null===(a=e.data)||void 0===a?void 0:a.requestId)&&(i="Timestamp: "+(new Date).toISOString(),i+=(null===(s=e.data)||void 0===s?void 0:s.requestId)?"\nRequestId: "+(null===(u=e.data)||void 0===u?void 0:u.requestId):""),(0,O.of)({status:"error",message:o,details:{message:l,verboseMessage:i}})}))))}))()}constructor(e){super(e),U(this,"baseUrl",void 0),U(this,"apiKey",void 0),U(this,"tenantOrgId",void 0),U(this,"isAdAnalytics",void 0),this.apiKey=e.jsonData.apiKey,this.tenantOrgId=e.jsonData.tenantOrgId,this.isAdAnalytics=e.jsonData.isAdAnalytics,this.baseUrl=e.url}}var P=u(959),L=u.n(P),B=u(7);function V(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function w(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),n.forEach((function(t){V(e,t,r[t])}))}return e}function G(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t.push.apply(t,r)}return t}(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})),e}function F(e,t,r,n,a,o,i){try{var l=e[o](i),s=l.value}catch(e){return void r(e)}l.done?t(s):Promise.resolve(s).then(n,a)}function q(e){return function(){var t=this,r=arguments;return new Promise((function(n,a){var o=e.apply(t,r);function i(e){F(o,n,a,i,l,"next",e)}function l(e){F(o,n,a,i,l,"throw",e)}i(void 0)}))}}const Y=[{endpoint:"/analytics/licenses",mapperFunc:e=>({value:e.licenseKey,label:e.name?e.name:e.licenseKey})},{endpoint:"/analytics/virtual-licenses",mapperFunc:e=>({value:e.id,label:e.name?e.name:e.id})},{endpoint:"/analytics/demo-licenses",mapperFunc:e=>({value:e.id,label:e.name?e.name:e.id})}];function H(e,t,r,n){return W.apply(this,arguments)}function W(){return(W=q((function*(e,t,r,n){const a={"X-Api-Key":t,"X-Api-Client":"analytics-grafana-datasource"};null!=n&&(a["X-Tenant-Org-Id"]=n);const o={url:e,headers:a,method:"GET"},i=(yield(0,O.lastValueFrom)((0,A.getBackendSrv)().fetch(o))).data.data.result.items,l=[];for(const e of i)l.push(r(e));return l}))).apply(this,arguments)}function j(){return(j=q((function*(e,t,r){const n=[];for(const a of Y){const o=yield H(t+a.endpoint,e,a.mapperFunc,r);n.push(...o)}return n}))).apply(this,arguments)}const K=["count","sum","avg","min","max","stddev","percentile","variance","median"].map((e=>({value:e,label:e}))),x=["ADVERTISER_NAME","AD_ABANDONMENT_RATE","AD_CLICKTHROUGH_URL","AD_DESCRIPTION","AD_DURATION","AD_FALLBACK_INDEX","AD_ID","AD_ID_PLAYER","AD_IMPRESSION_ID","AD_INDEX","AD_IS_PERSISTENT","AD_MODULE","AD_OFFSET","AD_PLAYBACK_HEIGHT","AD_PLAYBACK_WIDTH","AD_POSITION","AD_PRELOAD_OFFSET","AD_REPLACE_CONTENT_DURATION","AD_SCHEDULE_TIME","AD_SKIPPABLE","AD_SKIP_AFTER","AD_STARTUP_TIME","AD_SYSTEM","AD_TAG_PATH","AD_TAG_SERVER","AD_TAG_TYPE","AD_TAG_URL","AD_TITLE","AD_TYPE","AD_WRAPPER_ADS_COUNT","ANALYTICS_VERSION","APIORG_ID","APIUSER_ID","API_FRAMEWORK","AUDIO_BITRATE","AUTOPLAY","BROWSER","BROWSER_IS_BOT","BROWSER_VERSION_MAJOR","BROWSER_VERSION_MINOR","CDN_PROVIDER","CITY","CLICKED","CLICK_PERCENTAGE","CLICK_POSITION","CLICK_RATE","CLIENT_TIME","CLOSED","CLOSE_PERCENTAGE","CLOSE_POSITION","COMPLETED","COMPLETED_FAILED_BEACON_URL","COUNTRY","CREATIVE_AD_ID","CREATIVE_ID","CUSTOM_DATA_1","CUSTOM_DATA_10","CUSTOM_DATA_11","CUSTOM_DATA_12","CUSTOM_DATA_13","CUSTOM_DATA_14","CUSTOM_DATA_15","CUSTOM_DATA_16","CUSTOM_DATA_17","CUSTOM_DATA_18","CUSTOM_DATA_19","CUSTOM_DATA_2","CUSTOM_DATA_20","CUSTOM_DATA_21","CUSTOM_DATA_22","CUSTOM_DATA_23","CUSTOM_DATA_24","CUSTOM_DATA_25","CUSTOM_DATA_26","CUSTOM_DATA_27","CUSTOM_DATA_28","CUSTOM_DATA_29","CUSTOM_DATA_3","CUSTOM_DATA_30","CUSTOM_DATA_4","CUSTOM_DATA_5","CUSTOM_DATA_6","CUSTOM_DATA_7","CUSTOM_DATA_8","CUSTOM_DATA_9","CUSTOM_USER_ID","DAY","DAYPART","DEAL_ID","DEVICE_TYPE","DOMAIN","ERROR_CODE","ERROR_MESSAGE","EXPERIMENT_NAME","HOUR","IP_ADDRESS","ISP","IS_LINEAR","LANGUAGE","LICENSE_KEY","MANIFEST_DOWNLOAD_TIME","MEDIA_PATH","MEDIA_SERVER","MEDIA_URL","MIDPOINT","MIDPOINT_FAILED_BEACON_URL","MINUTE","MIN_SUGGESTED_DURATION","MONTH","OPERATINGSYSTEM","OPERATINGSYSTEM_VERSION_MAJOR","OPERATINGSYSTEM_VERSION_MINOR","PAGE_LOAD_TIME","PAGE_LOAD_TYPE","PATH","PERCENTAGE_IN_VIEWPORT","PLATFORM","PLAYER","PLAYER_KEY","PLAYER_STARTUPTIME","PLAYER_TECH","PLAYER_VERSION","PLAY_PERCENTAGE","QUARTILE_1","QUARTILE1_FAILED_BEACON_URL","QUARTILE_3","QUARTILE3_FAILED_BEACON_URL","REGION","SCREEN_HEIGHT","SCREEN_WIDTH","SIZE","SKIPPED","SKIP_PERCENTAGE","SKIP_POSITION","STARTED","STREAM_FORMAT","SURVEY_URL","TIME","TIME_HOVERED","TIME_IN_VIEWPORT","TIME_PLAYED","TIME_TO_FIRST_AD","TIME_UNTIL_HOVER","UNIVERSAL_AD_ID_REGISTRY","UNIVERSAL_AD_ID_VALUE","USER_ID","VIDEO_BITRATE","VIDEO_ID","VIDEO_IMPRESSION_ID","VIDEO_TITLE","VIDEO_WINDOW_HEIGHT","VIDEO_WINDOW_WIDTH","YEAR"].map((e=>({value:e,label:e}))),$=["AD","AD_ID","AD_INDEX","AD_POSITION","AD_SYSTEM","ANALYTICS_VERSION","AUDIO_BITRATE","AUDIO_CODEC","AUDIO_LANGUAGE","AUTOPLAY","BROWSER","BROWSER_IS_BOT","BROWSER_VERSION_MAJOR","BROWSER_VERSION_MINOR","BUFFERED","CAST_TECH","CDN_PROVIDER","CITY","CLIENT_TIME","CONTEXT","COUNTRY","CUSTOM_DATA_1","CUSTOM_DATA_10","CUSTOM_DATA_11","CUSTOM_DATA_12","CUSTOM_DATA_13","CUSTOM_DATA_14","CUSTOM_DATA_15","CUSTOM_DATA_16","CUSTOM_DATA_17","CUSTOM_DATA_18","CUSTOM_DATA_19","CUSTOM_DATA_2","CUSTOM_DATA_20","CUSTOM_DATA_21","CUSTOM_DATA_22","CUSTOM_DATA_23","CUSTOM_DATA_24","CUSTOM_DATA_25","CUSTOM_DATA_26","CUSTOM_DATA_27","CUSTOM_DATA_28","CUSTOM_DATA_29","CUSTOM_DATA_3","CUSTOM_DATA_30","CUSTOM_DATA_4","CUSTOM_DATA_5","CUSTOM_DATA_6","CUSTOM_DATA_7","CUSTOM_DATA_8","CUSTOM_DATA_9","CUSTOM_USER_ID","DAY","DAYPART","DEVICE_CLASS","DEVICE_TYPE","DOMAIN","DOWNLOAD_SPEED","DRM_LOAD_TIME","DRM_TYPE","DROPPED_FRAMES","DURATION","ERROR_CODE","ERROR_MESSAGE","ERROR_PERCENTAGE","EXPERIMENT_NAME","FUNCTION","HOUR","ID","IMPRESSION_ID","INITIAL_TIME_TO_TARGET_LATENCY","IP_ADDRESS","ISP","IS_CASTING","IS_LIVE","IS_LOW_LATENCY","IS_MUTED","LANGUAGE","LATENCY","LICENSE_KEY","M3U8_URL","MINUTE","MONTH","MPD_URL","OPERATINGSYSTEM","OPERATINGSYSTEM_VERSION_MAJOR","OPERATINGSYSTEM_VERSION_MINOR","ORGANIZATION","PAGE_LOAD_TIME","PAGE_LOAD_TYPE","PATH","PAUSED","PLATFORM","PLAYED","PLAYER","PLAYER_STARTUPTIME","PLAYER_TECH","PLAYER_VERSION","PLAY_ATTEMPTS","PROG_URL","REBUFFER_PERCENTAGE","REGION","SCALE_FACTOR","SCREEN_HEIGHT","SCREEN_ORIENTATION","SCREEN_WIDTH","SEEKED","SIZE","STARTUPTIME","STATE","STREAM_FORMAT","SUBTITLE_ENABLED","SUBTITLE_LANGUAGE","SUPPORTED_VIDEO_CODECS","TARGET_LATENCY","TARGET_LATENCY_DELTA","TIME","TIME_TO_TARGET_LATENCY","USER_ID","VIDEOSTART_FAILED","VIDEOSTART_FAILED_REASON","VIDEOTIME_END","VIDEOTIME_START","VIDEO_BITRATE","VIDEO_CODEC","VIDEO_CODEC_TYPE","VIDEO_DURATION","VIDEO_ID","VIDEO_PLAYBACK_HEIGHT","VIDEO_PLAYBACK_WIDTH","VIDEO_SEGMENTS_DOWNLOADED","VIDEO_SEGMENTS_DOWNLOAD_SIZE","VIDEO_STARTUPTIME","VIDEO_TITLE","VIDEO_WINDOW_HEIGHT","VIDEO_WINDOW_WIDTH","VIEWTIME","YEAR"].map((e=>({value:e,label:e})));var k;function Q(e){return L().createElement(B.HorizontalGroup,null,L().createElement(B.Select,{id:`query-editor-${e.queryEditorId}_group-by-select`,value:(0,d.isEmpty)(e.groupBy)?void 0:e.groupBy,onChange:t=>e.onChange(t.value),options:e.selectableGroupBys,width:30}),L().createElement(B.IconButton,{"data-testid":`query-editor-${e.queryEditorId}_group-by-move-down-button`,tooltip:"Move down",onClick:()=>e.onReorderGroupBy(1),name:"arrow-down",disabled:e.isLast}),L().createElement(B.IconButton,{tooltip:"Move up",onClick:()=>e.onReorderGroupBy(0),name:"arrow-up",disabled:e.isFirst}),L().createElement(B.IconButton,{"data-testid":`query-editor-${e.queryEditorId}_delete-group-by-button`,tooltip:"Delete Group By",name:"trash-alt",onClick:e.onDelete,size:"lg",variant:"destructive"}))}!function(e){e[e.UP=0]="UP",e[e.DOWN=1]="DOWN"}(k||(k={}));const z=(e,t)=>t?(0,d.differenceWith)(x,e,((e,t)=>e.value===t)):(0,d.differenceWith)($,e,((e,t)=>e.value===t));function X(e){const t=0===e.groupBys.length?4:0;return L().createElement(B.VerticalGroup,null,e.groupBys.map(((t,r,n)=>{return L().createElement(Q,{key:r,groupBy:(a=t,o=e.isAdAnalytics,o?x.filter((e=>e.value===a)):$.filter((e=>e.value===a))),onChange:t=>((t,r)=>{const n=[...e.groupBys];n.splice(t,1,r),e.onChange(n)})(r,t),selectableGroupBys:z(n,e.isAdAnalytics),onDelete:()=>(t=>{const r=[...e.groupBys];r.splice(t,1),e.onChange(r)})(r),isFirst:0===r,isLast:r===n.length-1,onReorderGroupBy:t=>((t,r)=>{const n=[...e.groupBys],a=n[r];n.splice(r,1);const o=t===k.UP?r-1:r+1;n.splice(o,0,a),e.onChange(n)})(t,r),queryEditorId:e.queryEditorId});var a,o})),L().createElement("div",{style:{paddingTop:t}},L().createElement(B.IconButton,{"data-testid":`query-editor-${e.queryEditorId}_add-group-by-button`,name:"plus-square",tooltip:"Add Group By",onClick:()=>(()=>{const t=z(e.groupBys,e.isAdAnalytics)[0].value;e.onChange([...e.groupBys,t])})(),size:"xl"})))}const J=[{value:"ASC",description:"Sort by ascending",icon:"sort-amount-up"},{value:"DESC",description:"Sort by descending",icon:"sort-amount-down"}];function Z(e){return L().createElement(B.HorizontalGroup,{spacing:"xs"},L().createElement(B.Select,{id:`query-editor-${e.queryEditorId}_order-by-select`,value:(0,d.isEmpty)(e.attribute)?void 0:e.attribute,onChange:t=>e.onAttributeChange(t),options:e.selectableOrderByAttributes,width:30}),L().createElement(B.RadioButtonGroup,{id:`query-editor-${e.queryEditorId}_order-by-button-group`,options:J,value:e.sortOrder,onChange:t=>e.onSortOrderChange(t)}),L().createElement(B.IconButton,{"data-testid":`query-editor-${e.queryEditorId}_order-by-move-down-button`,tooltip:"Move down",onClick:()=>e.onReorderOrderBy(k.DOWN),name:"arrow-down",disabled:e.isLast}),L().createElement(B.IconButton,{tooltip:"Move up",onClick:()=>e.onReorderOrderBy(k.UP),name:"arrow-up",disabled:e.isFirst}),L().createElement(B.IconButton,{"data-testid":`query-editor-${e.queryEditorId}_order-by-delete-button`,tooltip:"Delete Order By",name:"trash-alt",onClick:e.onDelete,size:"lg",variant:"destructive"}))}const ee=(e,t)=>t?(0,d.differenceWith)(x,e,((e,t)=>e.value===t.name)):(0,d.differenceWith)($,e,((e,t)=>e.value===t.name));function te(e){const t=0===e.orderBys.length?4:0;return L().createElement(B.VerticalGroup,null,e.orderBys.map(((t,r,n)=>{return L().createElement(Z,{key:r,isAdAnalytics:e.isAdAnalytics,selectableOrderByAttributes:ee(n,e.isAdAnalytics),attribute:(a=t.name,o=e.isAdAnalytics,o?x.filter((e=>e.value===a)):$.filter((e=>e.value===a))),onAttributeChange:t=>((t,r)=>{const n=[...e.orderBys],a={name:r.value,order:n[t].order};n.splice(t,1,a),e.onChange(n)})(r,t),sortOrder:t.order,onSortOrderChange:t=>((t,r)=>{const n=[...e.orderBys],a={name:n[t].name,order:r};n.splice(t,1,a),e.onChange(n)})(r,t),onDelete:()=>(t=>{const r=[...e.orderBys];r.splice(t,1),e.onChange(r)})(r),isFirst:0===r,isLast:r===n.length-1,onReorderOrderBy:t=>((t,r)=>{const n=t===k.UP?r-1:r+1,a=[...e.orderBys],o=a[r];a.splice(r,1),a.splice(n,0,o),e.onChange(a)})(t,r),queryEditorId:e.queryEditorId});var a,o})),L().createElement("div",{style:{paddingTop:t}},L().createElement(B.IconButton,{"data-testid":`query-editor-${e.queryEditorId}_add-order-by-button`,name:"plus-square",tooltip:"Add Order By",onClick:()=>(()=>{const t=ee(e.orderBys,e.isAdAnalytics)[0].value;e.onChange([...e.orderBys,{name:t,order:"ASC"}])})(),size:"xl"})))}const re=["GT","GTE","LT","LTE","EQ","NE","CONTAINS","NOTCONTAINS","IN"].map((e=>({value:e,label:e})));function ne(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function ae(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),n.forEach((function(t){ne(e,t,r[t])}))}return e}function oe(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t.push.apply(t,r)}return t}(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})),e}function ie(e){const t=null==e.value,[r,n]=(0,P.useState)(ce(e.value));(0,P.useEffect)((()=>n(ce(e.value))),[e.value]);const a=(0,P.useMemo)((()=>function(e,t){if(null!=e)return(t?x:$).find((t=>t.value===e))}(r.attribute,e.isAdAnalytics)),[r.attribute,e.isAdAnalytics]),o=(0,P.useMemo)((()=>function(e){if(null!=e)return re.find((t=>t.value===e))}(r.operator)),[r.operator]);var i,l,s;return L().createElement(B.HorizontalGroup,{spacing:"xs"},L().createElement(B.Tooltip,{content:null!==(i=r.attributeError)&&void 0!==i?i:"",show:null!=r.attributeError,theme:"error"},L().createElement("div",null,L().createElement(B.Select,{id:`query-editor-${e.queryEditorId}_filter-attribute-select`,value:a,onChange:function(e){n((t=>oe(ae({},t),{dirty:!0,attribute:e.value,attributeError:void 0})))},options:e.isAdAnalytics?x:$,width:le,invalid:null!=r.attributeError}))),L().createElement(B.Tooltip,{content:null!==(l=r.operatorError)&&void 0!==l?l:"",show:null!=r.operatorError,theme:"error"},L().createElement("div",null,L().createElement(B.Select,{id:`query-editor-${e.queryEditorId}_filter-operator-select`,value:o,onChange:function(e){n((t=>oe(ae({},t),{dirty:!0,operator:e.value,operatorError:void 0})))},options:re,width:se,invalid:null!=r.operatorError}))),L().createElement(B.Tooltip,{content:null!==(s=r.inputValueError)&&void 0!==s?s:"",show:null!=r.inputValueError,theme:"error"},L().createElement(B.Input,{"data-testid":`query-editor-${e.queryEditorId}_filter-value-input`,value:r.value,onChange:e=>{return t=e.currentTarget.value,void n((e=>oe(ae({},e),{dirty:!0,value:t,inputValueError:void 0})));var t},invalid:null!=r.inputValueError,type:"text",width:ue})),L().createElement(B.IconButton,{"data-testid":`query-editor-${e.queryEditorId}_filter-delete-button`,variant:"destructive",name:"trash-alt",size:"lg",tooltip:"Delete Filter",onClick:e.onDelete}),(t||r.dirty)&&L().createElement(B.IconButton,{"data-testid":`query-editor-${e.queryEditorId}_filter-save-button`,variant:"primary",name:t?"plus-square":"save",size:"lg",tooltip:t?"Add new filter":"Save changes",onClick:function(){if(null!=r.attribute)if(null!=r.operator)try{g(r.value,r.attribute,r.operator,e.isAdAnalytics),e.onChange({name:r.attribute,operator:r.operator,value:r.value})}catch(e){n((t=>oe(ae({},t),{inputValueError:e instanceof Error?e.message:"Could not save value"})))}else n((e=>oe(ae({},e),{operatorError:"Filter operator has to be selected"})));else n((e=>oe(ae({},e),{attributeError:"Filter attribute has to be selected"})))}}),!t&&r.dirty&&L().createElement(B.IconButton,{"data-testid":`query-editor-${e.queryEditorId}_filter-revert-changes-button`,variant:"secondary",name:"history",size:"lg",tooltip:"Revert changes",onClick:function(){n(ce(e.value))}}))}const le=30,se=15,ue=30;function ce(e){return{attribute:null==e?void 0:e.name,attributeError:void 0,operator:null==e?void 0:e.operator,operatorError:void 0,value:null==e?void 0:e.value,dirty:!1,inputValueError:void 0}}function Ee(e){const[t,r]=(0,P.useState)(!1),n=0===e.filters.length?4:0;return L().createElement(B.VerticalGroup,null,(e.filters.length>0||t)&&L().createElement(B.HorizontalGroup,{spacing:"none"},L().createElement(B.InlineLabel,{width:le,tooltip:""},"Attribute"),L().createElement(B.InlineLabel,{width:se,tooltip:""},"Operator"),L().createElement(B.InlineLabel,{width:ue,tooltip:""},"Value")),e.filters.map(((t,r)=>L().createElement(ie,{isAdAnalytics:e.isAdAnalytics,value:t,onChange:t=>function(t,r){const n=[...e.filters];n.splice(t,1,r),e.onQueryFilterChange(n)}(r,t),onDelete:()=>function(t){const r=[...e.filters];r.splice(t,1),e.onQueryFilterChange(r)}(r),selectedQueryFilters:e.filters,key:r,queryEditorId:e.queryEditorId}))),L().createElement("div",{style:{paddingTop:n}},t?L().createElement(ie,{isAdAnalytics:e.isAdAnalytics,value:void 0,onChange:function(t){const n=[...e.filters,t];e.onQueryFilterChange(n),r(!1)},onDelete:()=>r(!1),selectedQueryFilters:e.filters,queryEditorId:e.queryEditorId}):L().createElement(B.IconButton,{"data-testid":`query-editor-${e.queryEditorId}_add-new-filter-button`,name:"plus-square",tooltip:"Add Filter",onClick:()=>r(!0),size:"xl"})))}function Ae(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function de(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),n.forEach((function(t){Ae(e,t,r[t])}))}return e}function _e(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t.push.apply(t,r)}return t}(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})),e}var Te;!function(e){e.Default="DEFAULT",e.Loading="LOADING",e.Success="SUCCESS",e.Error="ERROR"}(Te||(Te={}));const Oe=new E.DataSourcePlugin(b).setConfigEditor((function(e){const{onOptionsChange:t,options:r}=e;(0,P.useEffect)((()=>{""!==r.url&&null!=r.url||t(G(w({},r),{url:"https://api.bitmovin.com/v1"}))}),[]);const{jsonData:n}=r;return L().createElement(L().Fragment,null,L().createElement(B.DataSourceHttpSettings,{defaultUrl:"https://api.bitmovin.com/v1",dataSourceConfig:r,onChange:t,showAccessOptions:!0}),L().createElement(B.FieldSet,{label:"Bitmovin Analytics Details"},L().createElement(B.InlineField,{required:!0,label:"API Key",labelWidth:26},L().createElement(B.Input,{required:!0,onChange:e=>{const n=G(w({},r.jsonData),{apiKey:e.currentTarget.value});t(G(w({},r),{jsonData:n}))},value:n.apiKey||"",placeholder:"Analytics API Key",width:40,"data-testid":`config-editor-${e.options.name}_api-key-input`})),L().createElement(B.InlineField,{label:"Tenant Org Id",labelWidth:26},L().createElement(B.Input,{onChange:e=>{const n=G(w({},r.jsonData),{tenantOrgId:e.currentTarget.value});t(G(w({},r),{jsonData:n}))},value:n.tenantOrgId||"",placeholder:"Tenant Org Id",width:40,"data-testid":`config-editor-${e.options.name}_tenant-org-id-input`})),L().createElement(B.InlineField,{label:"Ad Analytics",tooltip:"Check if you want to query ads data",labelWidth:26},L().createElement(B.InlineSwitch,{value:n.isAdAnalytics||!1,onChange:e=>{const n=G(w({},r.jsonData),{isAdAnalytics:e.currentTarget.checked});t(G(w({},r),{jsonData:n}))}}))))})).setQueryEditor((function(e){const t=(0,d.defaults)(e.query,I),[r,n]=(0,P.useState)([]),[a,o]=(0,P.useState)("DEFAULT"),[i,l]=(0,P.useState)(""),[s,u]=(0,P.useState)("time_series"===t.resultFormat),[c,E]=(0,P.useState)(t.percentileValue),A=(0,P.useMemo)((()=>!!t.dimension&&h(t.dimension)),[t.dimension]),_=(0,P.useMemo)((()=>"percentile"===t.metric),[t.metric]);return(0,P.useEffect)((()=>{o("LOADING"),function(e,t,r){return j.apply(this,arguments)}(e.datasource.apiKey,e.datasource.baseUrl,e.datasource.tenantOrgId).then((e=>{n(e),o("SUCCESS")})).catch((e=>{o("ERROR"),l(e.status+" "+e.statusText)}))}),[e.datasource.apiKey,e.datasource.baseUrl,e.datasource.tenantOrgId]),L().createElement("div",{className:"gf-form"},L().createElement(B.FieldSet,null,L().createElement(B.InlineField,{label:"License",labelWidth:20,invalid:"ERROR"===a,error:`Error when fetching Analytics Licenses: ${i}`,disabled:"ERROR"===a,required:!0},L().createElement(B.Select,{id:`query-editor-${e.query.refId}_license-select`,value:t.license,onChange:r=>{e.onChange(_e(de({},t),{license:r.value})),e.onRunQuery()},width:30,options:r,noOptionsMessage:"No Analytics Licenses found",isLoading:"LOADING"===a,placeholder:"LOADING"===a?"Loading Licenses":"Choose License"})),L().createElement(B.HorizontalGroup,{spacing:"xs"},!A&&L().createElement(B.InlineField,{label:"Metric",labelWidth:20,required:!0},L().createElement(B.Select,{value:t.metric,onChange:r=>(r=>{let n;"percentile"===r.value&&null==c?(E(95),n=95):E(void 0),e.onChange(_e(de({},t),{metric:r.value,percentileValue:n})),e.onRunQuery()})(r),width:30,options:K,id:`query-editor-${e.query.refId}_aggregation-method-select`})),_&&L().createElement(B.Input,{"data-testid":`query-editor-${e.query.refId}_percentile-value-input`,value:c,onChange:e=>{let t=parseInt(e.target.value,10);t<0?t=0:t>99&&(t=99),E(t)},onBlur:()=>{e.onChange(_e(de({},t),{percentileValue:c})),e.onRunQuery()},type:"number",placeholder:"value",width:10})),L().createElement(B.InlineField,{label:"Dimension",labelWidth:20,required:!0},L().createElement(B.Select,{value:t.dimension,onChange:r=>{e.onChange(_e(de({},t),{dimension:r.value})),e.onRunQuery()},width:30,options:e.datasource.isAdAnalytics?x:$.concat(v),id:`query-editor-${e.query.refId}_dimension-select`})),L().createElement(B.InlineField,{label:"Filter",labelWidth:20},L().createElement(Ee,{isAdAnalytics:!!e.datasource.isAdAnalytics,onQueryFilterChange:r=>{e.onChange(_e(de({},t),{filter:r})),e.onRunQuery()},filters:t.filter,queryEditorId:e.query.refId})),L().createElement(B.InlineField,{label:"Group By",labelWidth:20},L().createElement(X,{isAdAnalytics:!!e.datasource.isAdAnalytics,onChange:r=>{e.onChange(_e(de({},t),{groupBy:r})),e.onRunQuery()},groupBys:t.groupBy,queryEditorId:e.query.refId})),L().createElement(B.InlineField,{label:"Order By",labelWidth:20},L().createElement(te,{isAdAnalytics:!!e.datasource.isAdAnalytics,onChange:r=>{e.onChange(_e(de({},t),{orderBy:r})),e.onRunQuery()},orderBys:t.orderBy,queryEditorId:e.query.refId})),L().createElement(B.InlineField,{label:"Limit",labelWidth:20},L().createElement(B.Input,{"data-testid":`query-editor-${e.query.refId}_limit-input`,defaultValue:t.limit,type:"number",onBlur:r=>{const n=parseInt(r.target.value,10);e.onChange(_e(de({},t),{limit:isNaN(n)?void 0:n})),e.onRunQuery()},width:30,placeholder:"No limit"})),L().createElement(B.InlineField,{label:"Format as time series",labelWidth:20},L().createElement(B.InlineSwitch,{"data-testid":`query-editor-${e.query.refId}_format-as-time-series-switch`,value:s,onChange:r=>{u(r.currentTarget.checked),r.currentTarget.checked?e.onChange(_e(de({},t),{interval:"AUTO",resultFormat:"time_series"})):e.onChange(_e(de({},t),{interval:void 0,resultFormat:"table"})),e.onRunQuery()}})),s&&L().createElement(L().Fragment,null,L().createElement(B.InlineField,{label:"Interval",labelWidth:20},L().createElement(B.Select,{id:`query-editor-${e.query.refId}_interval-select`,defaultValue:p,value:t.interval,onChange:r=>(r=>{e.onChange(_e(de({},t),{interval:r.value})),e.onRunQuery()})(r),width:30,options:D}))),L().createElement(B.InlineField,{label:"Alias By",labelWidth:20},L().createElement(B.Input,{"data-testid":`query-editor-${e.query.refId}_alias-by-input`,defaultValue:t.alias,placeholder:"Naming pattern",onBlur:r=>{e.onChange(_e(de({},t),{alias:r.target.value})),e.onRunQuery()}}))))}));return c})()));
//# sourceMappingURL=module.js.map