/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/core/postmessage/Bus","sap/base/util/uid","sap/base/util/merge","sap/ui/rta/util/ServiceEventBus","sap/ui/thirdparty/URI"],function(M,P,u,m,S,U){"use strict";var C='sap.ui.rta.service.receiver';var a='pending';var b='accepted';var c='declined';var d=M.extend("sap.ui.rta.Client",{metadata:{library:"sap.ui.rta",properties:{window:"object",origin:"string"}},_bInit:false,constructor:function(){M.apply(this,arguments);if(!this.getWindow()){throw new TypeError("sap.ui.rta.Client: window parameter is required");}if(!this.getOrigin()){throw new TypeError("sap.ui.rta.Client: origin parameter is required");}this._oPostMessageBus=P.getInstance();this._sStatus=a;this._mPendingRequests={};this._aRequestQueue=[];this._oServiceEventBus=null;this._mEventHandlerIds={};this._oPostMessageBus.subscribeOnce(C,P.event.READY,function(e){if(!this._isValidMessage(e)){return;}this._oPostMessageBus.subscribeOnce(C,P.event.ACCEPTED,function(e){if(!this._isValidMessage(e)){return;}this._sStatus=b;var r=this._aRequestQueue.slice();this._aRequestQueue=[];r.forEach(this._sendRequest,this);this._oPostMessageBus.subscribe(C,'getService',this._receiverMethods,this);this._oPostMessageBus.subscribe(C,'callMethod',this._receiverMethods,this);this._oPostMessageBus.subscribe(C,'subscribe',this._receiverMethods,this);this._oPostMessageBus.subscribe(C,'unsubscribe',this._receiverMethods,this);this._oPostMessageBus.subscribe(C,'event',this._receiverEvents,this);},this);this._oPostMessageBus.subscribeOnce(C,P.event.DECLINED,function(e){if(!this._isValidMessage(e)){return;}this._sStatus=c;var r=this._aRequestQueue.slice();this._aRequestQueue=[];r.forEach(function(R){R.reject(new Error('sap.ui.rta.Client.getService(): connection to RuntimeAuthoring instance has been refused'));});},this);this._oPostMessageBus.publish({target:this.getWindow(),origin:this.getOrigin(),channelId:C,eventId:P.event.CONNECT,data:sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta").getText("SERVICE_NAME")});},this);this._bInit=true;}});d.prototype.destroy=function(){this._oPostMessageBus.unsubscribe(C,'getService',this._receiverMethods,this);this._oPostMessageBus.unsubscribe(C,'callMethod',this._receiverMethods,this);this._oPostMessageBus.unsubscribe(C,'subscribe',this._receiverMethods,this);this._oPostMessageBus.unsubscribe(C,'unsubscribe',this._receiverMethods,this);this._oPostMessageBus.unsubscribe(C,'event',this._receiverEvents,this);M.prototype.destroy.apply(this,arguments);};d.prototype.getService=function(s){if(typeof s!=="string"){throw new TypeError('sap.ui.rta.Client.getService(): invalid service name specified');}return this._sendRequest(this._createRequest({target:this.getWindow(),origin:this.getOrigin(),channelId:C,eventId:'getService',data:{arguments:[s]}}));};d.prototype._createRequest=function(p){var r=u();var R={id:r,request:{target:p.target,origin:p.origin,channelId:C,eventId:p.eventId,data:{id:r,type:'request',body:p.data}}};R.promise=new Promise(function(f,e){R.resolve=f;R.reject=e;});return R;};d.prototype._sendRequest=function(r){switch(this._sStatus){case b:this._mPendingRequests[r.id]=r;this._oPostMessageBus.publish(r.request);break;case a:this._aRequestQueue.push(r);break;case c:r.reject(new Error('sap.ui.rta.Client.getService(): connection to RuntimeAuthoring instance has been refused'));break;}return r.promise;};d.prototype._isValidMessage=function(e){return this.getWindow()===e.source&&this.getOrigin()===e.origin;};d.prototype._receiverMethods=function(e){if(!this._isValidMessage(e)){return;}var D=e.data;if(D.type!=='response'){return;}var r=this._mPendingRequests[D.id];switch(e.eventId){case'getService':var s=r.request.data.body.arguments[0];var f=D.body.methods||[];var E=D.body.events;var g=m(f.reduce(function(R,h){R[h]=function(){return this._sendRequest(this._createRequest({target:e.source,origin:e.origin,channelId:C,eventId:'callMethod',data:{service:s,method:h,arguments:Array.prototype.slice.call(arguments)}}));}.bind(this);return R;}.bind(this),{}),D.body.properties);if(Array.isArray(E)&&E.length>0){if(!this._oServiceEventBus){this._oServiceEventBus=new S();}m(g,{attachEvent:function(h,i,o){if(typeof(h)!=="string"||!h){throw new TypeError("sap.ui.rta.Client: sEventName must be a non-empty string when calling attachEvent() for a service");}if(typeof i!=="function"){throw new TypeError("sap.ui.rta.Client: fnFunction must be a function when calling attachEvent() for a service");}var j=this._oServiceEventBus.getChannel(s);var k=!j||!j.hasListeners(h);this._oServiceEventBus.subscribe(s,h,i,o);if(k){this._sendRequest(this._createRequest({target:e.source,origin:e.origin,channelId:C,eventId:'subscribe',data:{service:s,event:h}})).then(function(R){this._mEventHandlerIds[s+','+h]=R.id;this._checkIfEventAlive(s,h);}.bind(this));}}.bind(this),detachEvent:function(h,i,o){if(typeof(h)!=="string"||!h){throw new TypeError("sap.ui.rta.Client: sEventName must be a non-empty string when calling detachEvent() for a service");}if(typeof i!=="function"){throw new TypeError("sap.ui.rta.Client: fnFunction must be a function when calling detachEvent() for a service");}this._oServiceEventBus.unsubscribe(s,h,i,o);this._checkIfEventAlive(s,h);}.bind(this),attachEventOnce:function(h,i,o){function O(){g.detachEvent(h,O);i.apply(o,arguments);}g.attachEvent(h,O);}});}r.resolve(g);delete this._mPendingRequests[D.id];break;case'callMethod':if(D.status==='success'){r.resolve(D.body);}else{r.reject(D.body);}delete this._mPendingRequests[D.id];break;case'subscribe':case'unsubscribe':r.resolve(D.body);delete this._mPendingRequests[D.id];break;}};d.prototype._checkIfEventAlive=function(s,e){var E=this._oServiceEventBus.getChannel(s);var f=this._mEventHandlerIds[s+','+e];if((!E||!E.hasListeners(e))&&f){this._sendRequest(this._createRequest({target:this.getWindow(),origin:this.getOrigin(),channelId:C,eventId:'unsubscribe',data:{service:s,event:e,id:f}}));}};d.prototype._receiverEvents=function(e){if(!this._isValidMessage(e)){return;}var r=e.data.body;this._oServiceEventBus.publish(r.service,r.event,r.data);};d.prototype.setWindow=function(v){if(this._bInit){throw new TypeError("sap.ui.rta.Client: Window parameter cannot be changed at runtime; recreate instance of the Client.");}if(!v){throw new TypeError("sap.ui.rta.Client: Window parameter is required");}if(v===window){throw new TypeError("sap.ui.rta.Client: Window object has to be different from the one where Client is running");}this.setProperty('window',v);return this;};d.prototype.setOrigin=function(v){if(this._bInit){throw new TypeError("sap.ui.rta.Client: Cannot change origin parameter at runtime; recreate instance of the Client.");}if(!v){throw new TypeError("sap.ui.rta.Client: Origin parameter is required");}if(typeof v!=='string'){throw new TypeError("sap.ui.rta.Client: Origin parameter has to be a string");}if(new U(v).origin()!==v){throw new TypeError("sap.ui.rta.Client: Origin string is invalid");}this.setProperty('origin',v);return this;};return d;});