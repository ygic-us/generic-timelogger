/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/VersionInfo","sap/ui/support/supportRules/RuleSet","sap/ui/support/supportRules/CommunicationBus","sap/ui/support/supportRules/WCBChannels","sap/ui/support/supportRules/RuleSerializer","sap/ui/support/supportRules/Constants","sap/ui/support/supportRules/util/Utils"],function(q,V,R,C,c,b,d,U){"use strict";var g=(function(){var a;return function(u){if(!a){a=document.createElement('a');}a.href=u;return a.href.replace(/\/$/,'');};})();var s="sprt";var S=q.sap.getModulePath("sap.ui.support");var f=S.replace('/sap/ui/support','');var A=g(f);var h={};h._mRuleSets={};h._mRuleSets[d.TEMP_RULESETS_NAME]={lib:{name:d.TEMP_RULESETS_NAME},ruleset:new R({name:d.TEMP_RULESETS_NAME})};h.getRuleSets=function(){return this._mRuleSets;};h.addRuleSet=function(l,r){this._mRuleSets[l]=r;};h.getRuleSet=function(l){return this._mRuleSets[l];};h._fetchSupportRuleSets=function(r,l){var t=this,L=l||sap.ui.getCore().getLoadedLibraries(),o=this._fetchLibraryNamesWithSupportRules(L);var m=new Promise(function(a){V.load({library:"sap.ui.core"}).then(function(e){R.versionInfo=e;o.then(function(i){var j=t._fetchLibraryFiles(i,h._fetchRuleSet);Promise.all(j).then(function(){t._bRulesCreated=true;C.publish(c.UPDATE_SUPPORT_RULES,{sRuleSet:b.serialize(t._mRuleSets),oVersionInfo:R.versionInfo});a();if(r&&typeof r==="function"){r();}});});});});return m;};h.loadAdditionalRuleSets=function(l){var t=this,L=t._fetchLibraryFiles(l,t._fetchRuleSet);Promise.all(L).then(function(){t._bRulesCreated=true;C.publish(c.UPDATE_SUPPORT_RULES,{sRuleSet:b.serialize(t._mRuleSets)});});};h._fetchLibraryNamesWithSupportRules=function(l){return new Promise(function(m){U.canLoadInternalRulesAsync().then(function(a){var L={publicRules:[],internalRules:[],allRules:[]};l=l||{};var e=[];Object.keys(l).forEach(function(i){var M=new Promise(function(r){var j=A+"/"+i.replace(/\./g,'/')+"/.supportrc";q.ajax({type:"GET",dataType:"json",url:j,success:function(k){r({lib:i,rcData:k});},error:function(){r({lib:i,rcData:null});}});});e.push(M);});Promise.all(e).then(function(i){i.forEach(function(j){if(j.rcData){var H=false;if(j.rcData.publicRules){L.publicRules.push(j.lib);H=true;}if(a&&j.rcData.internalRules){L.internalRules.push(j.lib);H=true;}if(H&&L.allRules.indexOf(j.lib)<0){L.allRules.push(j.lib);}}m(L);});});});});};h._fetchLibraryFiles=function(l,p,a){var e=[],t=this,i=q.sap.getModulePath("sap.ui.support"),j=i.replace("sap/ui/support",""),k=U.canLoadInternalRules(),H=k&&l.internalRules.length>0,P=0,r=l.publicRules.length;var m=sap.ui.getCore().getConfiguration().getSupportMode();var n=m&&m.indexOf("silent")>-1;if(H){r+=l.internalRules.length;}function o(){P+=1;var u=Math.ceil((P/r)*100);C.publish(c.CURRENT_LOADING_PROGRESS,{value:u});}if(l.publicRules.length>0){l.publicRules.forEach(function(L){var u=t._registerLibraryPath(L,i,j);if(u){var v=t._requireRuleSet(u.customizableLibName,p);if(!n&&!a){v.then(function(){o();});}e.push(v);}});}if(k&&l.internalRules.length>0){l.internalRules.forEach(function(L){var u=t._registerLibraryPath(L,i,j);if(u){var v=t._requireRuleSet(u.internalLibName,p);if(!n&&!a){v.then(function(){o();});}e.push(v);}});}return e;};h._registerLibraryPath=function(l,a,e){if(this._mRuleSets[l]){return null;}var i=l.replace(/\./g,"/");var j=l;var k=this._getLoadFromSupportOrigin();if(k){j+='.'+s;q.sap.registerModulePath(j,e+l.replace(/\./g,"/"));}var m=j+'.internal';var n=e.replace('resources/','')+'test-resources/'+i+'/internal';q.sap.registerModulePath(m,n);return{internalLibName:m,customizableLibName:j};};h._requireRuleSet=function(l,p){var t=this;return new Promise(function(r){try{sap.ui.require([l.replace(/\./g,"/")+"/library.support"],function(){p.call(t,l);r();},r);}catch(e){r();}});};h._fetchRuleSet=function(l){try{var n,L,o,a=q.sap.getObject(l).library.support;if(!a){throw"The library.support file was not fetched successfully.";}n=l.replace("."+s,"").replace(".internal","");L=q.extend({},a);o=this._mRuleSets[n];if(!(L.ruleset instanceof R)){L=this._createRuleSet(L);}if(o){o.ruleset._mRules=q.extend(o.ruleset._mRules,L.ruleset._mRules);}else{o=L;}this._mRuleSets[n]=o;}catch(e){q.sap.log.error("["+d.SUPPORT_ASSISTANT_NAME+"] Failed to load RuleSet for "+l+" library",e);}};h._getLoadFromSupportOrigin=function(){var l=false;var a=new window.URI(q.sap.getModulePath("sap.ui.core"));var e=new window.URI(q.sap.getModulePath("sap.ui.support"));if(a.protocol()!==e.protocol()||a.host()!==e.host()){l=true;}return l;};h.fetchNonLoadedRuleSets=function(l){var n=[],L={};sap.ui.getVersionInfo().libraries.forEach(function(o){L[o.name]=o;});this._fetchLibraryNamesWithSupportRules(L).then(function(o){o.allRules.forEach(function(a){if(l.indexOf(a)<0){n.push(a);}});C.publish(c.POST_AVAILABLE_LIBRARIES,{libNames:n});});};h._onLibraryChanged=function(e){var t=this;if(e.getParameter("stereotype")==="library"&&h._bRulesCreated){t._oMainPromise=h._fetchSupportRuleSets();}};h.updateRuleSets=function(r){this._oMainPromise=h._fetchSupportRuleSets(r);};h._createRuleSet=function(l){var L={name:l.name,niceName:l.niceName};var r=new R(L);for(var i=0;i<l.ruleset.length;i++){var a=l.ruleset[i];if(q.isArray(a)){for(var k=0;k<a.length;k++){r.addRule(a[k]);}}else{r.addRule(a);}}return{lib:L,ruleset:r};};h.getAllRules=function(){var r={};Object.keys(this._mRuleSets).map(function(l){r=q.extend(r,this._mRuleSets[l].ruleset.getRules());},this);return r;};h.getAllRuleDescriptors=function(){var r=this.getAllRules();return Object.keys(r).map(function(a){return{libName:r[a].libName,ruleId:a};});};return h;},true);
