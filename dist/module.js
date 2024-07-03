define(["@grafana/data","@grafana/runtime","lodash","rxjs","react","@grafana/ui"],((e,t,n,r,a,o)=>(()=>{"use strict";var l={781:t=>{t.exports=e},531:e=>{e.exports=t},7:e=>{e.exports=o},241:e=>{e.exports=n},959:e=>{e.exports=a},269:e=>{e.exports=r}},i={};function s(e){var t=i[e];if(void 0!==t)return t.exports;var n=i[e]={exports:{}};return l[e](n,n.exports,s),n.exports}s.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return s.d(t,{a:t}),t},s.d=(e,t)=>{for(var n in t)s.o(t,n)&&!s.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),s.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var c={};return(()=>{s.r(c),s.d(c,{plugin:()=>te});var e=s(781),t=s(531),n=s(241),r=s(269);const a={license:"",orderBy:[],groupBy:[],filter:[],resultFormat:"time_series",interval:"AUTO"},o=[{value:"AUTO",label:"Auto"},{value:"MINUTE",label:"Minute"},{value:"HOUR",label:"Hour"},{value:"DAY",label:"Day"}],l=o[0];function i(e,t,r,a){if(0===e.length)return[];const o=(e=>{switch(e){case"MINUTE":return 6e4;case"HOUR":return 36e5;case"DAY":return 864e5;default:return-1}})(a);if(o<0)throw new Error(`Query interval ${a} is not a valid interval.`);const l=function(e,t,n){const r=new Date(e);switch(t){case"MINUTE":return 0===r.getSeconds()&&0===r.getMilliseconds()?e:r.setMinutes(r.getMinutes()+1,0,0);case"HOUR":return 0===r.getMinutes()&&0===r.getSeconds()&&0===r.getMilliseconds()?e:r.setHours(r.getHours()+1,0,0,0);case"DAY":const t=new Date(n).getHours(),a=new Date(n).getMinutes(),o=new Date(r.getFullYear(),r.getMonth(),r.getDate(),t,a);return o.getTime()>e?o.getTime():new Date(o).setDate(o.getDate()+1)}}(t,a,e[0][0]);let i=[0];const s=[];e[0].length>2&&(i=[...e[0].slice(1,-1),0]);for(let e=l;e<=r;e+=o){const t=[e,...i];s.push(t)}const c=(0,n.differenceWith)(s,e,((e,t)=>e[0]===t[0])),u=e.concat(c),E=(0,n.sortBy)(u,(e=>e[0]));let A=0;for(;E[A][0]<l;)A++;return E.slice(A)}const u=["AVG_CONCURRENTVIEWERS","MAX_CONCURRENTVIEWERS","AVG-DROPPED-FRAMES"],E=u.map((e=>({value:e,label:e}))),A=e=>u.includes(e),T=(e,t,r,a)=>{if((0,n.isEmpty)(e)&&(e=>{switch(e){case"CDN_PROVIDER":case"CUSTOM_DATA_1":case"CUSTOM_DATA_2":case"CUSTOM_DATA_3":case"CUSTOM_DATA_4":case"CUSTOM_DATA_5":case"CUSTOM_DATA_6":case"CUSTOM_DATA_7":case"CUSTOM_DATA_8":case"CUSTOM_DATA_9":case"CUSTOM_DATA_10":case"CUSTOM_DATA_11":case"CUSTOM_DATA_12":case"CUSTOM_DATA_13":case"CUSTOM_DATA_14":case"CUSTOM_DATA_15":case"CUSTOM_DATA_16":case"CUSTOM_DATA_17":case"CUSTOM_DATA_18":case"CUSTOM_DATA_19":case"CUSTOM_DATA_20":case"CUSTOM_DATA_21":case"CUSTOM_DATA_22":case"CUSTOM_DATA_23":case"CUSTOM_DATA_24":case"CUSTOM_DATA_25":case"CUSTOM_DATA_26":case"CUSTOM_DATA_27":case"CUSTOM_DATA_28":case"CUSTOM_DATA_29":case"CUSTOM_DATA_30":case"CUSTOM_USER_ID":case"ERROR_CODE":case"EXPERIMENT_NAME":case"ISP":case"PLAYER_TECH":case"PLAYER_VERSION":case"VIDEO_ID":return!0;default:return!1}})(t))return null;if("IN"===r)try{return(e=>{const t=JSON.parse(e);if(!Array.isArray(t))throw new Error;return t})(e)}catch(e){throw new Error('Couldn\'t parse IN filter, please provide data in JSON array form (e.g.: ["Firefox", "Chrome"]).')}return a?((e,t)=>{switch(t){case"IS_LINEAR":return"true"===e;case"AD_STARTUP_TIME":case"AD_WRAPPER_ADS_COUNT":case"AUDIO_BITRATE":case"CLICK_POSITION":case"CLOSE_POSITION":case"ERROR_CODE":case"MANIFEST_DOWNLOAD_TIME":case"MIN_SUGGESTED_DURATION":case"PAGE_LOAD_TIME":case"PLAYER_STARTUPTIME":case"SCREEN_HEIGHT":case"SCREEN_WIDTH":case"SKIP_POSITION":case"TIME_HOVERED":case"TIME_IN_VIEWPORT":case"TIME_PLAYED":case"TIME_UNTIL_HOVER":case"VIDEO_BITRATE":case"VIDEO_WINDOW_HEIGHT":case"VIDEO_WINDOW_WIDTH":{const t=parseInt(e,10);if(isNaN(t))throw new Error("Couldn't parse filter value, please provide data as an integer number");return t}case"CLICK_PERCENTAGE":case"CLOSE_PERCENTAGE":case"PERCENTAGE_IN_VIEWPORT":case"SKIP_PERCENTAGE":{const t=parseFloat(e);if(isNaN(t))throw new Error("Couldn't parse filter value, please provide data as a floating point number");return t}default:return e}})(e,t):((e,t)=>{switch(t){case"IS_CASTING":case"IS_LIVE":case"IS_MUTED":return"true"===e;case"AUDIO_BITRATE":case"BUFFERED":case"CLIENT_TIME":case"DOWNLOAD_SPEED":case"DRM_LOAD_TIME":case"DROPPED_FRAMES":case"DURATION":case"ERROR_CODE":case"PAGE_LOAD_TIME":case"PAGE_LOAD_TYPE":case"PAUSED":case"PLAYED":case"PLAYER_STARTUPTIME":case"SCREEN_HEIGHT":case"SCREEN_WIDTH":case"SEEKED":case"STARTUPTIME":case"VIDEO_BITRATE":case"VIDEO_DURATION":case"VIDEO_PLAYBACK_HEIGHT":case"VIDEO_PLAYBACK_WIDTH":case"VIDEO_STARTUPTIME":case"VIDEO_WINDOW_HEIGHT":case"VIDEO_WINDOW_WIDTH":case"VIDEOTIME_END":case"VIDEOTIME_START":case"VIEWTIME":{const t=parseInt(e,10);if(isNaN(t))throw new Error("Couldn't parse filter value, please provide data as an integer number");return t}case"ERROR_PERCENTAGE":case"REBUFFER_PERCENTAGE":{const t=parseFloat(e);if(isNaN(t))throw new Error("Couldn't parse filter value, please provide data as a floating point number");return t}default:return e}})(e,t)};function _(e,t,n,r,a,o,l){try{var i=e[o](l),s=i.value}catch(e){return void n(e)}i.done?t(s):Promise.resolve(s).then(r,a)}function O(e){return function(){var t=this,n=arguments;return new Promise((function(r,a){var o=e.apply(t,n);function l(e){_(o,r,a,l,i,"next",e)}function i(e){_(o,r,a,l,i,"throw",e)}l(void 0)}))}}function d(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}class I extends e.DataSourceApi{getDefaultQuery(e){return a}query(t){var a=this;return O((function*(){const{range:o}=t,l=o.from.toDate(),s=o.to.toDate(),c=(t.targets=(0,n.filter)(t.targets,(e=>!e.hide))).map((u=O((function*(t){var o;const c="time_series"===t.resultFormat&&t.interval?((e,t,n)=>{if("AUTO"!==e)return e;const r=n-t;return r<=108e5?"MINUTE":r<=5184e5?"HOUR":"DAY"})(t.interval,l.getTime(),s.getTime()):void 0;let u=t.metric;const E="percentile"===u?t.percentileValue:void 0;let _,O;t.dimension&&(A(t.dimension)?_=t.dimension:O=t.dimension);const d={filters:t.filter.map((e=>({name:e.name,operator:e.operator,value:T(e.value,e.name,e.operator,!!a.adAnalytics)}))),groupBy:t.groupBy,orderBy:t.orderBy,dimension:O,metric:_,start:l,end:s,licenseKey:t.license,interval:c,limit:a.parseLimit(t.limit),percentile:E},I=yield(0,r.lastValueFrom)(a.request(a.getRequestUrl(_,u),"POST",d)),D=I.data.data.result.rows,p=I.data.data.result.rowCount,S=I.data.data.result.columnLabels,C=[];d.interval&&(null===(o=d.groupBy)||void 0===o?void 0:o.length)>0?C.push(...function(t,r,a,o){if(0===t.length)return[];const l=[],s=new Map;t.forEach((e=>{var t;const n=e.slice(1,-1).toString();s.has(n)||s.set(n,[]),null===(t=s.get(n))||void 0===t||t.push(e)}));const c=[];s.forEach((e=>{c.push(i(e,r,a,o))}));const u=(0,n.zip)(...c[0])[0];return l.push({name:"Time",values:u,type:e.FieldType.time}),c.forEach((t=>{const r=t[0].slice(1,-1).join(", "),a=(0,n.zip)(...t).slice(-1);l.push({name:r,values:a[0],type:e.FieldType.number})})),l}(D,l.getTime(),s.getTime(),d.interval)):d.interval?C.push(...function(t,r,a,o,l){if(0===t.length)return[];const s=[],c=i(t,a,o,l),u=(0,n.zip)(...c);return s.push({name:"Time",values:u[0],type:e.FieldType.time}),s.push({name:r,values:u[u.length-1],type:e.FieldType.number}),s}(D,S.length>0?S[S.length-1].label:"Column 1",l.getTime(),s.getTime(),d.interval)):C.push(...function(t,r){if(0===t.length)return[];const a=[],o=(0,n.zip)(...t);let l=[];if(0===r.length)for(let e=0;e<o.length;e++)l.push(`Column ${e+1}`);else l.push(...r.map((e=>e.label)));return t[0].length>1&&o.slice(0,-1).forEach(((t,n)=>{a.push({name:l[n],values:t,type:e.FieldType.string})})),a.push({name:l[l.length-1],values:o[o.length-1],type:e.FieldType.number}),a}(D,S));let R=[];return p>=200&&(R=[{severity:"warning",text:"Your request reached the max row limit of the API. You might see incomplete data. This problem might be caused by the use of high cardinality columns in group by, too small interval, or too big of a time range."}]),(0,e.createDataFrame)({name:t.alias,fields:C,meta:{notices:R}})})),function(e){return u.apply(this,arguments)}));var u;return Promise.all(c).then((e=>({data:e})))}))()}parseLimit(e){if(null!=e)return Number.isInteger(e)?e:parseInt(e,10)}getRequestUrl(e,t){let n="/analytics";return!0===this.adAnalytics&&(n+="/ads"),null!=e?n+"/metrics/"+e:n+"/queries/"+t}request(e,n,r){const a={"X-Api-Key":this.apiKey};null!=this.tenantOrgId&&(a["X-Tenant-Org-Id"]=this.tenantOrgId);const o={url:this.baseUrl+e,headers:a,method:n,data:r};return(0,t.getBackendSrv)().fetch(o)}testDatasource(){var e=this;return O((function*(){return(0,r.lastValueFrom)(e.request("/analytics/licenses","GET").pipe((0,r.map)((()=>({status:"success",message:"Data source successfully setup and connected."}))),(0,r.catchError)((e=>{var t,n,a,o;let l="Bitmovin: ";e.status&&(l+=e.status+" "),e.statusText?l+=e.statusText:l+="Can not connect to Bitmovin API";let i,s=(null===(t=e.data)||void 0===t?void 0:t.message)||(null===(a=e.data)||void 0===a||null===(n=a.data)||void 0===n?void 0:n.message);var c,u;return(null===(o=e.data)||void 0===o?void 0:o.requestId)&&(i="Timestamp: "+(new Date).toISOString(),i+=(null===(c=e.data)||void 0===c?void 0:c.requestId)?"\nRequestId: "+(null===(u=e.data)||void 0===u?void 0:u.requestId):""),(0,r.of)({status:"error",message:l,details:{message:s,verboseMessage:i}})}))))}))()}constructor(e){super(e),d(this,"baseUrl",void 0),d(this,"apiKey",void 0),d(this,"tenantOrgId",void 0),d(this,"adAnalytics",void 0),this.apiKey=e.jsonData.apiKey,this.tenantOrgId=e.jsonData.tenantOrgId,this.adAnalytics=e.jsonData.adAnalytics,this.baseUrl=e.url}}var D=s(959),p=s.n(D),S=s(7);function C(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function R(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){C(e,t,n[t])}))}return e}function m(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n.push.apply(n,r)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function y(e,t,n,r,a,o,l){try{var i=e[o](l),s=i.value}catch(e){return void n(e)}i.done?t(s):Promise.resolve(s).then(r,a)}function h(e){return function(){var t=this,n=arguments;return new Promise((function(r,a){var o=e.apply(t,n);function l(e){y(o,r,a,l,i,"next",e)}function i(e){y(o,r,a,l,i,"throw",e)}l(void 0)}))}}const g=[{endpoint:"/analytics/licenses",mapperFunc:e=>({value:e.licenseKey,label:e.name?e.name:e.licenseKey})},{endpoint:"/analytics/virtual-licenses",mapperFunc:e=>({value:e.id,label:e.name?e.name:e.id})},{endpoint:"/analytics/demo-licenses",mapperFunc:e=>({value:e.id,label:e.name?e.name:e.id})}];function v(e,t,n,r){return M.apply(this,arguments)}function M(){return(M=h((function*(e,n,a,o){const l={"X-Api-Key":n};null!=o&&(l["X-Tenant-Org-Id"]=o);const i={url:e,headers:l,method:"GET"},s=(yield(0,r.lastValueFrom)((0,t.getBackendSrv)().fetch(i))).data.data.result.items,c=[];for(const e of s)c.push(a(e));return c}))).apply(this,arguments)}function f(){return(f=h((function*(e,t,n){const r=[];for(const a of g){const o=yield v(t+a.endpoint,e,a.mapperFunc,n);r.push(...o)}return r}))).apply(this,arguments)}const U=["count","sum","avg","min","max","stddev","percentile","variance","median"].map((e=>({value:e,label:e}))),P=["ADVERTISER_NAME","AD_CLICKTHROUGH_URL","AD_DESCRIPTION","AD_DURATION","AD_FALLBACK_INDEX","AD_ID","AD_ID_PLAYER","AD_IMPRESSION_ID","AD_IS_PERSISTENT","AD_MODULE","AD_OFFSET","AD_PLAYBACK_HEIGHT","AD_PLAYBACK_WIDTH","AD_POSITION","AD_PRELOAD_OFFSET","AD_REPLACE_CONTENT_DURATION","AD_SCHEDULE_TIME","AD_SKIPPABLE","AD_SKIP_AFTER","AD_STARTUP_TIME","AD_SYSTEM","AD_TAG_PATH","AD_TAG_SERVER","AD_TAG_TYPE","AD_TAG_URL","AD_TITLE","AD_WRAPPER_ADS_COUNT","ANALYTICS_VERSION","APIORG_ID","APIUSER_ID","API_FRAMEWORK","AUDIO_BITRATE","AUTOPLAY","BROWSER","BROWSER_IS_BOT","BROWSER_VERSION_MAJOR","BROWSER_VERSION_MINOR","CDN_PROVIDER","CITY","CLICKED","CLICK_PERCENTAGE","CLICK_POSITION","CLICK_RATE","CLIENT_TIME","CLOSED","CLOSE_PERCENTAGE","CLOSE_POSITION","COMPLETED","COUNTRY","CREATIVE_AD_ID","CREATIVE_ID","CUSTOM_DATA_1","CUSTOM_DATA_10","CUSTOM_DATA_11","CUSTOM_DATA_12","CUSTOM_DATA_13","CUSTOM_DATA_14","CUSTOM_DATA_15","CUSTOM_DATA_16","CUSTOM_DATA_17","CUSTOM_DATA_18","CUSTOM_DATA_19","CUSTOM_DATA_2","CUSTOM_DATA_20","CUSTOM_DATA_21","CUSTOM_DATA_22","CUSTOM_DATA_23","CUSTOM_DATA_24","CUSTOM_DATA_25","CUSTOM_DATA_26","CUSTOM_DATA_27","CUSTOM_DATA_28","CUSTOM_DATA_29","CUSTOM_DATA_3","CUSTOM_DATA_30","CUSTOM_DATA_4","CUSTOM_DATA_5","CUSTOM_DATA_6","CUSTOM_DATA_7","CUSTOM_DATA_8","CUSTOM_DATA_9","CUSTOM_USER_ID","DAY","DAYPART","DEAL_ID","DEVICE_TYPE","DOMAIN","ERROR_CODE","ERROR_MESSAGE","EXPERIMENT_NAME","HOUR","IP_ADDRESS","ISP","IS_LINEAR","LANGUAGE","LICENSE_KEY","MANIFEST_DOWNLOAD_TIME","MEDIA_PATH","MEDIA_SERVER","MEDIA_URL","MIDPOINT","MINUTE","MIN_SUGGESTED_DURATION","MONTH","OPERATINGSYSTEM","OPERATINGSYSTEM_VERSION_MAJOR","OPERATINGSYSTEM_VERSION_MINOR","PAGE_LOAD_TIME","PAGE_LOAD_TYPE","PATH","PERCENTAGE_IN_VIEWPORT","PLATFORM","PLAYER","PLAYER_KEY","PLAYER_STARTUPTIME","PLAYER_TECH","PLAYER_VERSION","PLAY_PERCENTAGE","QUARTILE_1","QUARTILE_3","REGION","SCREEN_HEIGHT","SCREEN_WIDTH","SIZE","SKIPPED","SKIP_PERCENTAGE","SKIP_POSITION","STARTED","STREAM_FORMAT","SURVEY_URL","TIME","TIME_HOVERED","TIME_IN_VIEWPORT","TIME_PLAYED","TIME_TO_FIRST_AD","TIME_UNTIL_HOVER","UNIVERSAL_AD_ID_REGISTRY","UNIVERSAL_AD_ID_VALUE","USER_ID","VIDEO_BITRATE","VIDEO_ID","VIDEO_IMPRESSION_ID","VIDEO_TITLE","VIDEO_WINDOW_HEIGHT","VIDEO_WINDOW_WIDTH","YEAR"].map((e=>({value:e,label:e}))),N=["AD","ANALYTICS_VERSION","AUDIO_BITRATE","AUDIO_CODEC","AUDIO_LANGUAGE","AUTOPLAY","BROWSER","BROWSER_IS_BOT","BROWSER_VERSION_MAJOR","BROWSER_VERSION_MINOR","BUFFERED","CAST_TECH","CDN_PROVIDER","CITY","CLIENT_TIME","CONTEXT","COUNTRY","CUSTOM_DATA_1","CUSTOM_DATA_10","CUSTOM_DATA_11","CUSTOM_DATA_12","CUSTOM_DATA_13","CUSTOM_DATA_14","CUSTOM_DATA_15","CUSTOM_DATA_16","CUSTOM_DATA_17","CUSTOM_DATA_18","CUSTOM_DATA_19","CUSTOM_DATA_2","CUSTOM_DATA_20","CUSTOM_DATA_21","CUSTOM_DATA_22","CUSTOM_DATA_23","CUSTOM_DATA_24","CUSTOM_DATA_25","CUSTOM_DATA_26","CUSTOM_DATA_27","CUSTOM_DATA_28","CUSTOM_DATA_29","CUSTOM_DATA_3","CUSTOM_DATA_30","CUSTOM_DATA_4","CUSTOM_DATA_5","CUSTOM_DATA_6","CUSTOM_DATA_7","CUSTOM_DATA_8","CUSTOM_DATA_9","CUSTOM_USER_ID","DAY","DAYPART","DEVICE_CLASS","DEVICE_TYPE","DOMAIN","DOWNLOAD_SPEED","DRM_LOAD_TIME","DRM_TYPE","DROPPED_FRAMES","DURATION","ERROR_CODE","ERROR_MESSAGE","ERROR_PERCENTAGE","EXPERIMENT_NAME","FUNCTION","HOUR","ID","IMPRESSION_ID","INITIAL_TIME_TO_TARGET_LATENCY","IP_ADDRESS","ISP","IS_CASTING","IS_LIVE","IS_LOW_LATENCY","IS_MUTED","LANGUAGE","LATENCY","LICENSE_KEY","M3U8_URL","MINUTE","MONTH","MPD_URL","OPERATINGSYSTEM","OPERATINGSYSTEM_VERSION_MAJOR","OPERATINGSYSTEM_VERSION_MINOR","ORGANIZATION","PAGE_LOAD_TIME","PAGE_LOAD_TYPE","PATH","PAUSED","PLATFORM","PLAYED","PLAYER","PLAYER_STARTUPTIME","PLAYER_TECH","PLAYER_VERSION","PLAY_ATTEMPTS","PROG_URL","REBUFFER_PERCENTAGE","REGION","SCALE_FACTOR","SCREEN_HEIGHT","SCREEN_ORIENTATION","SCREEN_WIDTH","SEEKED","SIZE","STARTUPTIME","STATE","STREAM_FORMAT","SUBTITLE_ENABLED","SUBTITLE_LANGUAGE","SUPPORTED_VIDEO_CODECS","TARGET_LATENCY","TARGET_LATENCY_DELTA","TIME","TIME_TO_TARGET_LATENCY","USER_ID","VIDEOSTART_FAILED","VIDEOSTART_FAILED_REASON","VIDEOTIME_END","VIDEOTIME_START","VIDEO_BITRATE","VIDEO_CODEC","VIDEO_CODEC_TYPE","VIDEO_DURATION","VIDEO_ID","VIDEO_PLAYBACK_HEIGHT","VIDEO_PLAYBACK_WIDTH","VIDEO_SEGMENTS_DOWNLOADED","VIDEO_SEGMENTS_DOWNLOAD_SIZE","VIDEO_STARTUPTIME","VIDEO_TITLE","VIDEO_WINDOW_HEIGHT","VIDEO_WINDOW_WIDTH","VIEWTIME","YEAR"].map((e=>({value:e,label:e})));var b;function L(e){return p().createElement(S.HorizontalGroup,null,p().createElement(S.Select,{value:(0,n.isEmpty)(e.groupBy)?void 0:e.groupBy,onChange:t=>e.onChange(t.value),options:e.selectableGroupBys,width:30}),p().createElement(S.IconButton,{tooltip:"Move down",onClick:()=>e.onReorderGroupBy(1),name:"arrow-down",disabled:e.isLast}),p().createElement(S.IconButton,{tooltip:"Move up",onClick:()=>e.onReorderGroupBy(0),name:"arrow-up",disabled:e.isFirst}),p().createElement(S.IconButton,{tooltip:"Delete Group By",name:"trash-alt",onClick:e.onDelete,size:"lg",variant:"destructive"}))}!function(e){e[e.UP=0]="UP",e[e.DOWN=1]="DOWN"}(b||(b={}));const B=(e,t)=>t?(0,n.differenceWith)(P,e,((e,t)=>e.value===t)):(0,n.differenceWith)(N,e,((e,t)=>e.value===t));function V(e){return p().createElement(S.VerticalGroup,null,e.groupBys.map(((t,n,r)=>{return p().createElement(L,{key:n,groupBy:(a=t,o=e.isAdAnalytics,o?P.filter((e=>e.value===a)):N.filter((e=>e.value===a))),onChange:t=>((t,n)=>{const r=[...e.groupBys];r.splice(t,1,n),e.onChange(r)})(n,t),selectableGroupBys:B(r,e.isAdAnalytics),onDelete:()=>(t=>{const n=[...e.groupBys];n.splice(t,1),e.onChange(n)})(n),isFirst:0===n,isLast:n===r.length-1,onReorderGroupBy:t=>((t,n)=>{const r=[...e.groupBys],a=r[n];r.splice(n,1);const o=t===b.UP?n-1:n+1;r.splice(o,0,a),e.onChange(r)})(t,n)});var a,o})),p().createElement(S.Box,{paddingTop:0===e.groupBys.length?.5:0},p().createElement(S.IconButton,{name:"plus-square",tooltip:"Add Group By",onClick:()=>(()=>{const t=B(e.groupBys,e.isAdAnalytics)[0].value;e.onChange([...e.groupBys,t])})(),size:"xl"})))}const w=[{value:"ASC",description:"Sort by ascending",icon:"sort-amount-up"},{value:"DESC",description:"Sort by descending",icon:"sort-amount-down"}];function G(e){return p().createElement(S.HorizontalGroup,{spacing:"xs"},p().createElement(S.Select,{value:(0,n.isEmpty)(e.attribute)?void 0:e.attribute,onChange:t=>e.onAttributeChange(t),options:e.selectableOrderByAttributes,width:30}),p().createElement(S.RadioButtonGroup,{options:w,value:e.sortOrder,onChange:t=>e.onSortOrderChange(t)}),p().createElement(S.IconButton,{tooltip:"Move down",onClick:()=>e.onReorderOrderBy(b.DOWN),name:"arrow-down",disabled:e.isLast}),p().createElement(S.IconButton,{tooltip:"Move up",onClick:()=>e.onReorderOrderBy(b.UP),name:"arrow-up",disabled:e.isFirst}),p().createElement(S.IconButton,{tooltip:"Delete Order By",name:"trash-alt",onClick:e.onDelete,size:"lg",variant:"destructive"}))}const F=(e,t)=>t?(0,n.differenceWith)(P,e,((e,t)=>e.value===t.name)):(0,n.differenceWith)(N,e,((e,t)=>e.value===t.name));function W(e){return p().createElement(S.VerticalGroup,null,e.orderBys.map(((t,n,r)=>{return p().createElement(G,{key:n,isAdAnalytics:e.isAdAnalytics,selectableOrderByAttributes:F(r,e.isAdAnalytics),attribute:(a=t.name,o=e.isAdAnalytics,o?P.filter((e=>e.value===a)):N.filter((e=>e.value===a))),onAttributeChange:t=>((t,n)=>{const r=[...e.orderBys],a={name:n.value,order:r[t].order};r.splice(t,1,a),e.onChange(r)})(n,t),sortOrder:t.order,onSortOrderChange:t=>((t,n)=>{const r=[...e.orderBys],a={name:r[t].name,order:n};r.splice(t,1,a),e.onChange(r)})(n,t),onDelete:()=>(t=>{const n=[...e.orderBys];n.splice(t,1),e.onChange(n)})(n),isFirst:0===n,isLast:n===r.length-1,onReorderOrderBy:t=>((t,n)=>{const r=t===b.UP?n-1:n+1,a=[...e.orderBys],o=a[n];a.splice(n,1),a.splice(r,0,o),e.onChange(a)})(t,n)});var a,o})),p().createElement(S.Box,{paddingTop:0===e.orderBys.length?.5:0},p().createElement(S.IconButton,{name:"plus-square",tooltip:"Add Order By",onClick:()=>(()=>{const t=F(e.orderBys,e.isAdAnalytics)[0].value;e.onChange([...e.orderBys,{name:t,order:"ASC"}])})(),size:"xl"})))}const Y=["GT","GTE","LT","LTE","EQ","NE","CONTAINS","NOTCONTAINS","IN"].map((e=>({value:e,label:e})));function H(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function j(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){H(e,t,n[t])}))}return e}function K(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n.push.apply(n,r)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}function x(e){const t=null==e.value,[n,r]=(0,D.useState)(z(e.value));(0,D.useEffect)((()=>r(z(e.value))),[e.value]);const a=(0,D.useMemo)((()=>function(e,t){if(null!=e)return(t?P:N).find((t=>t.value===e))}(n.attribute,e.isAdAnalytics)),[n.attribute,e.isAdAnalytics]),o=(0,D.useMemo)((()=>function(e){if(null!=e)return Y.find((t=>t.value===e))}(n.operator)),[n.operator]);var l,i,s;return p().createElement(S.HorizontalGroup,{spacing:"xs"},p().createElement(S.Tooltip,{content:null!==(l=n.attributeError)&&void 0!==l?l:"",show:null!=n.attributeError,theme:"error"},p().createElement("div",null,p().createElement(S.Select,{value:a,onChange:function(e){r((t=>K(j({},t),{dirty:!0,attribute:e.value,attributeError:void 0})))},options:e.isAdAnalytics?P:N,width:k,invalid:null!=n.attributeError}))),p().createElement(S.Tooltip,{content:null!==(i=n.operatorError)&&void 0!==i?i:"",show:null!=n.operatorError,theme:"error"},p().createElement("div",null,p().createElement(S.Select,{value:o,onChange:function(e){r((t=>K(j({},t),{dirty:!0,operator:e.value,operatorError:void 0})))},options:Y,width:q,invalid:null!=n.operatorError}))),p().createElement(S.Tooltip,{content:null!==(s=n.inputValueError)&&void 0!==s?s:"",show:null!=n.inputValueError,theme:"error"},p().createElement(S.Input,{value:n.value,onChange:e=>{return t=e.currentTarget.value,void r((e=>K(j({},e),{dirty:!0,value:t,inputValueError:void 0})));var t},invalid:null!=n.inputValueError,type:"text",width:Q})),p().createElement(S.IconButton,{variant:"destructive",name:"trash-alt",size:"lg",tooltip:"Delete Filter",onClick:e.onDelete}),(t||n.dirty)&&p().createElement(S.IconButton,{variant:"primary",name:t?"plus-square":"save",size:"lg",tooltip:t?"Add new filter":"Save changes",onClick:function(){if(null!=n.attribute)if(null!=n.operator)try{T(n.value,n.attribute,n.operator,e.isAdAnalytics),e.onChange({name:n.attribute,operator:n.operator,value:n.value})}catch(e){r((t=>K(j({},t),{inputValueError:e instanceof Error?e.message:"Could not save value"})))}else r((e=>K(j({},e),{operatorError:"Filter operator has to be selected"})));else r((e=>K(j({},e),{attributeError:"Filter attribute has to be selected"})))}}),!t&&n.dirty&&p().createElement(S.IconButton,{variant:"secondary",name:"history",size:"lg",tooltip:"Revert changes",onClick:function(){r(z(e.value))}}))}const k=30,q=15,Q=30;function z(e){return{attribute:null==e?void 0:e.name,attributeError:void 0,operator:null==e?void 0:e.operator,operatorError:void 0,value:null==e?void 0:e.value,dirty:!1,inputValueError:void 0}}function X(e){const[t,n]=(0,D.useState)(!1);return p().createElement(S.VerticalGroup,null,(e.filters.length>0||t)&&p().createElement(S.HorizontalGroup,{spacing:"none"},p().createElement(S.InlineLabel,{width:k,tooltip:""},"Attribute"),p().createElement(S.InlineLabel,{width:q,tooltip:""},"Operator"),p().createElement(S.InlineLabel,{width:Q,tooltip:""},"Value")),e.filters.map(((t,n)=>p().createElement(x,{isAdAnalytics:e.isAdAnalytics,value:t,onChange:t=>function(t,n){const r=[...e.filters];r.splice(t,1,n),e.onQueryFilterChange(r)}(n,t),onDelete:()=>function(t){const n=[...e.filters];n.splice(t,1),e.onQueryFilterChange(n)}(n),selectedQueryFilters:e.filters,key:n}))),p().createElement(S.Box,{paddingTop:0===e.filters.length?.5:0},t?p().createElement(x,{isAdAnalytics:e.isAdAnalytics,value:void 0,onChange:function(t){const r=[...e.filters,t];e.onQueryFilterChange(r),n(!1)},onDelete:()=>n(!1),selectedQueryFilters:e.filters}):p().createElement(S.IconButton,{name:"plus-square",tooltip:"Add Filter",onClick:()=>n(!0),size:"xl"})))}function J(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Z(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){J(e,t,n[t])}))}return e}function $(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n.push.apply(n,r)}return n}(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))})),e}var ee;!function(e){e.Default="DEFAULT",e.Loading="LOADING",e.Success="SUCCESS",e.Error="ERROR"}(ee||(ee={}));const te=new e.DataSourcePlugin(I).setConfigEditor((function(e){const{onOptionsChange:t,options:n}=e;(0,D.useEffect)((()=>{""!==n.url&&null!=n.url||t(m(R({},n),{url:"https://api.bitmovin.com/v1"}))}),[]);const{jsonData:r}=n;return p().createElement(p().Fragment,null,p().createElement(S.DataSourceHttpSettings,{defaultUrl:"https://api.bitmovin.com/v1",dataSourceConfig:n,onChange:t,showAccessOptions:!0}),p().createElement(S.FieldSet,{label:"Bitmovin Analytics Details"},p().createElement(S.InlineField,{required:!0,label:"API Key",labelWidth:26},p().createElement(S.Input,{required:!0,onChange:e=>{const r=m(R({},n.jsonData),{apiKey:e.currentTarget.value});t(m(R({},n),{jsonData:r}))},value:r.apiKey||"",placeholder:"Analytics API Key",width:40})),p().createElement(S.InlineField,{label:"Tenant Org Id",labelWidth:26},p().createElement(S.Input,{onChange:e=>{const r=m(R({},n.jsonData),{tenantOrgId:e.currentTarget.value});t(m(R({},n),{jsonData:r}))},value:r.tenantOrgId||"",placeholder:"Tenant Org Id",width:40})),p().createElement(S.InlineField,{label:"Ad Analytics",tooltip:"Check if you want to query ads data",labelWidth:26},p().createElement(S.InlineSwitch,{value:r.adAnalytics||!1,onChange:e=>{const r=m(R({},n.jsonData),{adAnalytics:e.currentTarget.checked});t(m(R({},n),{jsonData:r}))}}))))})).setQueryEditor((function(e){const t=(0,n.defaults)(e.query,a),[r,i]=(0,D.useState)([]),[s,c]=(0,D.useState)("DEFAULT"),[u,T]=(0,D.useState)(""),[_,O]=(0,D.useState)("time_series"===t.resultFormat),[d,I]=(0,D.useState)(t.percentileValue),C=(0,D.useMemo)((()=>!!t.dimension&&A(t.dimension)),[t.dimension]),R=(0,D.useMemo)((()=>"percentile"===t.metric),[t.metric]);return(0,D.useEffect)((()=>{c("LOADING"),function(e,t,n){return f.apply(this,arguments)}(e.datasource.apiKey,e.datasource.baseUrl,e.datasource.tenantOrgId).then((e=>{i(e),c("SUCCESS")})).catch((e=>{c("ERROR"),T(e.status+" "+e.statusText)}))}),[e.datasource.apiKey,e.datasource.baseUrl,e.datasource.tenantOrgId]),p().createElement("div",{className:"gf-form"},p().createElement(S.FieldSet,null,p().createElement(S.InlineField,{label:"License",labelWidth:20,invalid:"ERROR"===s,error:`Error when fetching Analytics Licenses: ${u}`,disabled:"ERROR"===s,required:!0},p().createElement(S.Select,{value:t.license,onChange:n=>{e.onChange($(Z({},t),{license:n.value})),e.onRunQuery()},width:30,options:r,noOptionsMessage:"No Analytics Licenses found",isLoading:"LOADING"===s,placeholder:"LOADING"===s?"Loading Licenses":"Choose License"})),p().createElement(S.HorizontalGroup,{spacing:"xs"},!C&&p().createElement(S.InlineField,{label:"Metric",labelWidth:20,required:!0},p().createElement(S.Select,{value:t.metric,onChange:n=>(n=>{e.onChange($(Z({},t),{metric:n.value})),e.onRunQuery()})(n),width:30,options:U})),R&&p().createElement(S.Input,{value:d,onChange:e=>{let t=parseInt(e.target.value,10);t<0?t=0:t>99&&(t=99),I(t)},onBlur:()=>{e.onChange($(Z({},t),{percentileValue:d})),e.onRunQuery()},type:"number",placeholder:"value",width:10})),p().createElement(S.InlineField,{label:"Dimension",labelWidth:20,required:!0},p().createElement(S.Select,{value:t.dimension,onChange:n=>{e.onChange($(Z({},t),{dimension:n.value})),e.onRunQuery()},width:30,options:e.datasource.adAnalytics?P:N.concat(E)})),p().createElement(S.InlineField,{label:"Filter",labelWidth:20},p().createElement(X,{isAdAnalytics:!!e.datasource.adAnalytics,onQueryFilterChange:n=>{e.onChange($(Z({},t),{filter:n})),e.onRunQuery()},filters:t.filter})),p().createElement(S.InlineField,{label:"Group By",labelWidth:20},p().createElement(V,{isAdAnalytics:!!e.datasource.adAnalytics,onChange:n=>{e.onChange($(Z({},t),{groupBy:n})),e.onRunQuery()},groupBys:t.groupBy})),p().createElement(S.InlineField,{label:"Order By",labelWidth:20},p().createElement(W,{isAdAnalytics:!!e.datasource.adAnalytics,onChange:n=>{e.onChange($(Z({},t),{orderBy:n})),e.onRunQuery()},orderBys:t.orderBy})),p().createElement(S.InlineField,{label:"Limit",labelWidth:20},p().createElement(S.Input,{defaultValue:t.limit,type:"number",onBlur:n=>{const r=parseInt(n.target.value,10);e.onChange($(Z({},t),{limit:isNaN(r)?void 0:r})),e.onRunQuery()},width:30,placeholder:"No limit"})),p().createElement(S.InlineField,{label:"Format as time series",labelWidth:20},p().createElement(S.InlineSwitch,{value:_,onChange:n=>{O(n.currentTarget.checked),n.currentTarget.checked?e.onChange($(Z({},t),{interval:"AUTO",resultFormat:"time_series"})):e.onChange($(Z({},t),{interval:void 0,resultFormat:"table"})),e.onRunQuery()}})),_&&p().createElement(p().Fragment,null,p().createElement(S.InlineField,{label:"Interval",labelWidth:20},p().createElement(S.Select,{defaultValue:l,onChange:n=>(n=>{e.onChange($(Z({},t),{interval:n.value})),e.onRunQuery()})(n),width:30,options:o}))),p().createElement(S.InlineField,{label:"Alias By",labelWidth:20},p().createElement(S.Input,{defaultValue:t.alias,placeholder:"Naming pattern",onBlur:n=>{e.onChange($(Z({},t),{alias:n.target.value})),e.onRunQuery()}}))))}))})(),c})()));
//# sourceMappingURL=module.js.map