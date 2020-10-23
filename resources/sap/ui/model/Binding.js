/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/EventProvider','./ChangeReason','./DataState',"sap/base/Log","sap/base/util/each"],function(E,C,D,L,e){"use strict";var t;var d=[];var B=E.extend("sap.ui.model.Binding",{constructor:function(m,p,c,P){E.apply(this);this.oModel=m;this.bRelative=!p.startsWith('/');this.sPath=p;this.oContext=c;this.vMessages=undefined;this.mParameters=P;this.bInitial=false;this.bSuspended=false;this.oDataState=null;this.bIgnoreMessages=undefined;},metadata:{"abstract":true,publicMethods:["getPath","getContext","getModel","attachChange","detachChange","refresh","isInitial","attachDataStateChange","detachDataStateChange","attachAggregatedDataStateChange","detachAggregatedDataStateChange","attachDataRequested","detachDataRequested","attachDataReceived","detachDataReceived","suspend","resume","isSuspended"]}});B.prototype.getPath=function(){return this.sPath;};B.prototype.getContext=function(){return this.oContext;};B.prototype.setContext=function(c,s){var p;if(this.oContext!=c){sap.ui.getCore().getMessageManager().removeMessages(this.getDataState().getControlMessages(),true);this.oContext=c;this.oDataState=null;p={reason:C.Context};if(s){p.detailedReason=s;}this._fireChange(p);}};B.prototype.getMessages=function(){return this.vMessages;};B.prototype.getDataState=function(){if(!this.oDataState){this.oDataState=new D();}return this.oDataState;};B.prototype.getModel=function(){return this.oModel;};B.prototype.getIgnoreMessages=function(){if(this.bIgnoreMessages===undefined){return undefined;}return this.bIgnoreMessages&&this.supportsIgnoreMessages();};B.prototype.setIgnoreMessages=function(i){this.bIgnoreMessages=i;};B.prototype.supportsIgnoreMessages=function(){return false;};B.prototype.attachChange=function(F,l){if(!this.hasListeners("change")){this.oModel.addBinding(this);}this.attachEvent("change",F,l);};B.prototype.detachChange=function(F,l){this.detachEvent("change",F,l);if(!this.hasListeners("change")){this.oModel.removeBinding(this);}};B.prototype.attachDataStateChange=function(F,l){this.attachEvent("DataStateChange",F,l);};B.prototype.detachDataStateChange=function(F,l){this.detachEvent("DataStateChange",F,l);};B.prototype.attachAggregatedDataStateChange=function(F,l){this.attachEvent("AggregatedDataStateChange",F,l);};B.prototype.detachAggregatedDataStateChange=function(F,l){this.detachEvent("AggregatedDataStateChange",F,l);};B.prototype._fireChange=function(p){this.fireEvent("change",p);};B.prototype.attachDataRequested=function(F,l){this.attachEvent("dataRequested",F,l);};B.prototype.detachDataRequested=function(F,l){this.detachEvent("dataRequested",F,l);};B.prototype.fireDataRequested=function(p){this.fireEvent("dataRequested",p);};B.prototype.attachDataReceived=function(F,l){this.attachEvent("dataReceived",F,l);};B.prototype.detachDataReceived=function(F,l){this.detachEvent("dataReceived",F,l);};B.prototype.fireDataReceived=function(p){this.fireEvent("dataReceived",p);};B.prototype.updateRequired=function(m){return m&&this.getModel()===m;};B.prototype.hasValidation=function(){return!!this.getType();};B.prototype.checkUpdate=function(F){if(this.bSuspended&&!F){return;}this._fireChange({reason:C.Change});};B.prototype.refresh=function(F){if(this.bSuspended&&!F){return;}this.checkUpdate(F);};B.prototype.initialize=function(){if(!this.bSuspended){this.checkUpdate(true);}return this;};B.prototype._refresh=function(F){this.refresh(F);};B.prototype.isResolved=function(){return!this.bRelative||!!this.oContext;};B.prototype.isInitial=function(){return this.bInitial;};B.prototype.isRelative=function(){return this.bRelative;};B.prototype.attachEvents=function(o){if(!o){return this;}var a=this;e(o,function(s,h){var m="attach"+s.substring(0,1).toUpperCase()+s.substring(1);if(a[m]){a[m](h);}else{L.warning(a.toString()+" has no handler for event '"+s+"'");}});return this;};B.prototype.detachEvents=function(o){if(!o){return this;}var a=this;e(o,function(s,h){var m="detach"+s.substring(0,1).toUpperCase()+s.substring(1);if(a[m]){a[m](h);}else{L.warning(a.toString()+" has no handler for event '"+s+"'");}});return this;};B.prototype.attachRefresh=function(F,l){this.attachEvent("refresh",F,l);};B.prototype.detachRefresh=function(F,l){this.detachEvent("refresh",F,l);};B.prototype._fireRefresh=function(p){this.fireEvent("refresh",p);};B.prototype.suspend=function(){this.bSuspended=true;};B.prototype.isSuspended=function(){return this.bSuspended;};B.prototype.resume=function(){this.bSuspended=false;this.checkUpdate();};B.prototype.destroy=function(){this.bIsBeingDestroyed=true;sap.ui.getCore().getMessageManager().removeMessages(this.getDataState().getControlMessages(),true);E.prototype.destroy.apply(this,arguments);this.bIsBeingDestroyed=false;};B.prototype.checkDataState=function(p){var r=this.oModel?this.oModel.resolve(this.sPath,this.oContext):null;this._checkDataState(r,p);};B.prototype._checkDataState=function(r,p){if(!p||r&&r in p){var a=this;var o=this.getDataState();var b=function(){a.fireEvent("AggregatedDataStateChange",{dataState:o});o.changed(false);a.bFiredAsync=false;};if(!this.getIgnoreMessages()){this._checkDataStateMessages(o,r);}if(o&&o.changed()){if(this.mEventRegistry["DataStateChange"]){this.fireEvent("DataStateChange",{dataState:o});}if(this.bIsBeingDestroyed){b();}else if(this.mEventRegistry["AggregatedDataStateChange"]&&!this.bFiredAsync){f(b);this.bFiredAsync=true;}}}};B.prototype._checkDataStateMessages=function(o,r){if(r){o.setModelMessages(this.oModel.getMessagesByPath(r));}};function f(c){if(!t){t=setTimeout(function(){t=undefined;var a=d;d=[];a.forEach(function(b){b();});},0);}d.push(c);}return B;});
