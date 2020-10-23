/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","./library","sap/ui/Device","sap/ui/core/ResizeHandler","sap/ui/core/Control","sap/m/library","sap/m/Button","sap/m/NavContainer","sap/ui/core/Configuration","sap/ui/core/theming/Parameters",'sap/ui/dom/units/Rem',"./FlexibleColumnLayoutRenderer","sap/base/Log","sap/base/assert","sap/base/util/merge"],function(q,l,D,R,C,m,B,N,a,P,b,F,L,c,d){"use strict";var e=l.LayoutType;var f=C.extend("sap.f.FlexibleColumnLayout",{metadata:{properties:{autoFocus:{type:"boolean",group:"Behavior",defaultValue:true},layout:{type:"sap.f.LayoutType",defaultValue:e.OneColumn},defaultTransitionNameBeginColumn:{type:"string",group:"Appearance",defaultValue:"slide"},defaultTransitionNameMidColumn:{type:"string",group:"Appearance",defaultValue:"slide"},defaultTransitionNameEndColumn:{type:"string",group:"Appearance",defaultValue:"slide"},backgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:m.BackgroundDesign.Transparent},restoreFocusOnBackNavigation:{type:"boolean",group:"Behavior",defaultValue:false}},aggregations:{beginColumnPages:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getBeginColumn",aggregation:"pages"}},midColumnPages:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getMidColumn",aggregation:"pages"}},endColumnPages:{type:"sap.ui.core.Control",multiple:true,forwarding:{getter:"_getEndColumn",aggregation:"pages"}},_beginColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_midColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_endColumnNav:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"},_beginColumnBackArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_midColumnForwardArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_midColumnBackArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_endColumnForwardArrow:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},associations:{initialBeginColumnPage:{type:"sap.ui.core.Control",multiple:false},initialMidColumnPage:{type:"sap.ui.core.Control",multiple:false},initialEndColumnPage:{type:"sap.ui.core.Control",multiple:false}},events:{stateChange:{parameters:{layout:{type:"sap.f.LayoutType"},maxColumnsCount:{type:"int"},isNavigationArrow:{type:"boolean"},isResize:{type:"boolean"}}},beginColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterBeginColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},midColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterMidColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},endColumnNavigate:{allowPreventDefault:true,parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},afterEndColumnNavigate:{parameters:{from:{type:"sap.ui.core.Control"},fromId:{type:"string"},to:{type:"sap.ui.core.Control"},toId:{type:"string"},firstTime:{type:"boolean"},isTo:{type:"boolean"},isBack:{type:"boolean"},isBackToTop:{type:"boolean"},isBackToPage:{type:"boolean"},direction:{type:"string"}}},columnResize:{parameters:{beginColumn:{type:"boolean"},midColumn:{type:"boolean"},endColumn:{type:"boolean"}}}}}});f.COLUMN_RESIZING_ANIMATION_DURATION=560;f.PINNED_COLUMN_CLASS_NAME="sapFFCLPinnedColumn";f.COLUMN_ORDER=["begin","mid","end"];f.prototype.init=function(){this._iWidth=0;this._oColumnFocusInfo={begin:{},mid:{},end:{}};this._initNavContainers();this._initButtons();this._oLayoutHistory=new g();this._oAnimationEndListener=new A();this._oRenderedColumnPagesBoolMap={};this._iNavigationArrowWidth=b.toPx(P.get("_sap_f_FCL_navigation_arrow_width"));this._oColumnWidthInfo={begin:0,mid:0,end:0};};f.prototype._onNavContainerRendered=function(E){var o=E.srcControl,h=o.getPages().length>0,H=this._hasAnyColumnPagesRendered();this._setColumnPagesRendered(o.getId(),h);if(this._hasAnyColumnPagesRendered()!==H){this._hideShowArrows();}};f.prototype._createNavContainer=function(s){var h=s.charAt(0).toUpperCase()+s.slice(1);var n=new N(this.getId()+"-"+s+"ColumnNav",{autoFocus:this.getAutoFocus(),navigate:function(E){this._handleNavigationEvent(E,false,s);}.bind(this),afterNavigate:function(E){this._handleNavigationEvent(E,true,s);}.bind(this),defaultTransitionName:this["getDefaultTransitionName"+h+"Column"]()});n.addDelegate({"onAfterRendering":this._onNavContainerRendered},this);this["_"+s+'ColumnFocusOutDelegate']={onfocusout:function(E){this._oColumnFocusInfo[s]=E.target;}};n.addEventDelegate(this["_"+s+'ColumnFocusOutDelegate'],this);return n;};f.prototype._handleNavigationEvent=function(E,h,s){var i,j;if(h){i="after"+(s.charAt(0).toUpperCase()+s.slice(1))+"ColumnNavigate";}else{i=s+"ColumnNavigate";}j=this.fireEvent(i,E.mParameters,true);if(!j){E.preventDefault();}};f.prototype._getColumnByStringName=function(s){if(s==='end'){return this._getEndColumn();}else if(s==='mid'){return this._getMidColumn();}else{return this._getBeginColumn();}};f.prototype._getBeginColumn=function(){return this.getAggregation("_beginColumnNav");};f.prototype._getMidColumn=function(){return this.getAggregation("_midColumnNav");};f.prototype._getEndColumn=function(){return this.getAggregation("_endColumnNav");};f.prototype._flushColumnContent=function(s){var o=this.getAggregation("_"+s+"ColumnNav"),r=sap.ui.getCore().createRenderManager();r.renderControl(o);r.flush(this._$columns[s].find(".sapFFCLColumnContent")[0],undefined,true);r.destroy();};f.prototype.setLayout=function(n){n=this.validateProperty("layout",n);var s=this.getLayout();if(s===n){return this;}var r=this.setProperty("layout",n,true);this._oLayoutHistory.addEntry(n);this._hideShowArrows();this._resizeColumns();return r;};f.prototype.setAutoFocus=function(n){n=this.validateProperty("autoFocus",n);var h=this.getAutoFocus();if(h===n){return this;}this._getNavContainers().forEach(function(o){o.setAutoFocus(n);});return this.setProperty("autoFocus",n,true);};f.prototype.onBeforeRendering=function(){this._deregisterResizeHandler();this._oAnimationEndListener.cancelAll();};f.prototype.onAfterRendering=function(){this._measureControlWidth();this._registerResizeHandler();this._cacheDOMElements();this._hideShowArrows();this._resizeColumns();this._flushColumnContent("begin");this._flushColumnContent("mid");this._flushColumnContent("end");this._fireStateChange(false,false);};f.prototype._restoreFocusToColumn=function(s){var E=this._oColumnFocusInfo[s];if(!E||q.isEmptyObject(E)){E=this._getFirstFocusableElement(s);}q(E).trigger("focus");};f.prototype._getFirstFocusableElement=function(s){var o=this._getColumnByStringName(s),h=o.getCurrentPage();if(h){return h.$().firstFocusableDomRef();}return null;};f.prototype._isFocusInSomeOfThePreviousColumns=function(){var i=f.COLUMN_ORDER.indexOf(this._sPreviuosLastVisibleColumn)-1,o;for(;i>=0;i--){o=this._getColumnByStringName(f.COLUMN_ORDER[i]);if(o&&o._isFocusInControl(o)){return true;}}return false;};f.prototype._getControlWidth=function(){if(this._iWidth===0){this._measureControlWidth();}return this._iWidth;};f.prototype._measureControlWidth=function(){if(this.$().is(":visible")){this._iWidth=this.$().width();}else{this._iWidth=0;}};f.prototype.exit=function(){this._removeNavContainersFocusOutDelegate();this._oRenderedColumnPagesBoolMap=null;this._oColumnFocusInfo=null;this._deregisterResizeHandler();this._handleEvent(q.Event("Destroy"));};f.prototype._removeNavContainersFocusOutDelegate=function(){f.COLUMN_ORDER.forEach(function(s){this._getColumnByStringName(s).removeEventDelegate(this["_"+s+"ColumnFocusOutDelegate"]);},this);};f.prototype._registerResizeHandler=function(){c(!this._iResizeHandlerId,"Resize handler already registered");this._iResizeHandlerId=R.register(this,this._onResize.bind(this));};f.prototype._deregisterResizeHandler=function(){if(this._iResizeHandlerId){R.deregister(this._iResizeHandlerId);this._iResizeHandlerId=null;}};f.prototype._initNavContainers=function(){this.setAggregation("_beginColumnNav",this._createNavContainer("begin"),true);this.setAggregation("_midColumnNav",this._createNavContainer("mid"),true);this.setAggregation("_endColumnNav",this._createNavContainer("end"),true);};f.prototype._getNavContainers=function(){return[this._getBeginColumn(),this._getMidColumn(),this._getEndColumn()];};f.prototype._initButtons=function(){var o=new B(this.getId()+"-beginBack",{icon:"sap-icon://slim-arrow-left",tooltip:f._getResourceBundle().getText("FCL_BEGIN_COLUMN_BACK_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"left")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonRight");this.setAggregation("_beginColumnBackArrow",o,true);var M=new B(this.getId()+"-midForward",{icon:"sap-icon://slim-arrow-right",tooltip:f._getResourceBundle().getText("FCL_MID_COLUMN_FORWARD_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"right")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonLeft");this.setAggregation("_midColumnForwardArrow",M,true);var h=new B(this.getId()+"-midBack",{icon:"sap-icon://slim-arrow-left",tooltip:f._getResourceBundle().getText("FCL_MID_COLUMN_BACK_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"left")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonRight");this.setAggregation("_midColumnBackArrow",h,true);var E=new B(this.getId()+"-endForward",{icon:"sap-icon://slim-arrow-right",tooltip:f._getResourceBundle().getText("FCL_END_COLUMN_FORWARD_ARROW"),type:"Transparent",press:this._onArrowClick.bind(this,"right")}).addStyleClass("sapFFCLNavigationButton").addStyleClass("sapFFCLNavigationButtonLeft");this.setAggregation("_endColumnForwardArrow",E,true);};f.prototype._cacheDOMElements=function(){this._cacheColumns();if(!D.system.phone){this._cacheArrows();}};f.prototype._cacheColumns=function(){this._$columns={begin:this.$("beginColumn"),mid:this.$("midColumn"),end:this.$("endColumn")};};f.prototype._cacheArrows=function(){this._oColumnSeparatorArrows={beginBack:this.$("beginBack"),midForward:this.$("midForward"),midBack:this.$("midBack"),endForward:this.$("endForward")};};f.prototype._getVisibleColumnsCount=function(){return f.COLUMN_ORDER.filter(function(s){return this._getColumnSize(s)>0;},this).length;};f.prototype._getVisibleArrowsCount=function(){if(!this._oColumnSeparatorArrows){return 0;}return Object.keys(this._oColumnSeparatorArrows).filter(function(s){return this._oColumnSeparatorArrows[s].data("visible");},this).length;};f.prototype._getTotalColumnsWidth=function(h){var s=this._getVisibleArrowsCount();if(h){s++;}return this._getControlWidth()-s*this._iNavigationArrowWidth;};f.prototype._resizeColumns=function(){var p,i,h=f.COLUMN_ORDER.slice(),r=sap.ui.getCore().getConfiguration().getRTL(),s=sap.ui.getCore().getConfiguration().getAnimationMode(),H=s!==a.AnimationMode.none&&s!==a.AnimationMode.minimal,j,v,k,n,o,I,t,u={};if(!this.isActive()){return;}v=this._getVisibleColumnsCount();if(v===0){return;}n=this.getLayout();k=this._getMaxColumnsCountForLayout(n,f.DESKTOP_BREAKPOINT);o=h[k-1];t=this.getRestoreFocusOnBackNavigation()&&this._isNavigatingBackward(o)&&!this._isFocusInSomeOfThePreviousColumns();I=(v===3)&&(n===e.ThreeColumnsEndExpanded);i=this._getTotalColumnsWidth(I);if(H){h.forEach(function(w){var S=this._shouldConcealColumn(k,w),x=this._shouldRevealColumn(k,w===o),y=this._$columns[w];y.toggleClass(f.PINNED_COLUMN_CLASS_NAME,S||x);},this);h.forEach(function(w){u[w]=this._oAnimationEndListener.isWaitingForColumnResizeEnd(this._$columns[w]);},this);this._oAnimationEndListener.cancelAll();}h.forEach(function(w){var x=this._$columns[w],y=x.get(0),z,E,S,G,J,K,O;p=this._getColumnSize(w);z=Math.round(i*(p/100));if([100,0].indexOf(p)!==-1){E=p+"%";}else{E=z+"px";}O={previousAnimationCompleted:!u[x],iNewWidth:z,shouldRestoreFocus:t&&(w===o),hidden:p===0&&this._oColumnWidthInfo[w]===0};if(H){S=this._shouldRevealColumn(k,w===o);G=this._shouldConcealColumn(k,w);J=S||G;O=d(O,{hasAnimations:true,shouldConcealColumn:G,pinned:J});K=this._canResizeColumnWithAnimation(w,O);}if(!G){x.toggleClass("sapFFCLColumnActive",p>0);}x.toggleClass("sapFFCLColumnInset",I&&(w==="mid"));x.removeClass("sapFFCLColumnHidden");x.removeClass("sapFFCLColumnOnlyActive");x.removeClass("sapFFCLColumnLastActive");x.removeClass("sapFFCLColumnFirstActive");if(K){R.suspend(y);this._oAnimationEndListener.waitForColumnResizeEnd(x).then(function(){R.resume(y);}).catch(function(){R.resume(y);});}if(!G){x.width(E);}else{this._oAnimationEndListener.waitForAllColumnsResizeEnd().then(function(){x.width(E);}).catch(function(){});}if(K||J){this._oAnimationEndListener.waitForAllColumnsResizeEnd().then(this._afterColumnResize.bind(this,w,O)).catch(function(){});}else{this._afterColumnResize(w,O);}if(!D.system.phone){this._updateColumnContextualSettings(w,z);this._updateColumnCSSClasses(w,z);}},this);j=h.filter(function(w){return this._getColumnSize(w)>0;},this);if(r){h.reverse();}if(j.length===1){this._$columns[j[0]].addClass("sapFFCLColumnOnlyActive");}if(j.length>1){this._$columns[j[0]].addClass("sapFFCLColumnFirstActive");this._$columns[j[j.length-1]].addClass("sapFFCLColumnLastActive");}this._storePreviousResizingInfo(k,o);};f.prototype._afterColumnResize=function(s,o){var h=this._$columns[s],S=o.shouldConcealColumn,n=o.iNewWidth,i=o.shouldRestoreFocus;h.toggleClass(f.PINNED_COLUMN_CLASS_NAME,false);if(S){h.removeClass("sapFFCLColumnActive");}h.toggleClass("sapFFCLColumnHidden",n===0);this._cacheColumnWidth(s,n);if(i){this._restoreFocusToColumn(s);}};f.prototype._getColumnWidth=function(s){var o=this._$columns[s].get(0),h=o.style.width,i=parseInt(h),p;if(/px$/.test(h)){return i;}p=/%$/.test(h);if(p&&(i===100)){return this._getControlWidth();}if(p&&(i===0)){return 0;}return o.offsetWidth;};f.prototype._cacheColumnWidth=function(s,n){var E;if(this._oColumnWidthInfo[s]!==n){E={};f.COLUMN_ORDER.forEach(function(h){E[h+"Column"]=h===s;});this.fireColumnResize(E);}this._oColumnWidthInfo[s]=n;};f.prototype._storePreviousResizingInfo=function(v,s){var o=this.getLayout();this._iPreviousVisibleColumnsCount=v;this._bWasFullScreen=o===e.MidColumnFullScreen||o===e.EndColumnFullScreen;this._sPreviuosLastVisibleColumn=s;};f.prototype._isNavigatingBackward=function(s){return this._bWasFullScreen||f.COLUMN_ORDER.indexOf(this._sPreviuosLastVisibleColumn)>f.COLUMN_ORDER.indexOf(s);};f.prototype._shouldRevealColumn=function(v,i){return(v>this._iPreviousVisibleColumnsCount)&&!this._bWasFullScreen&&i;};f.prototype._shouldConcealColumn=function(v,s){return(v<this._iPreviousVisibleColumnsCount&&s===this._sPreviuosLastVisibleColumn&&!this._bWasFullScreen&&this._getColumnSize(s)===0);};f.prototype._canResizeColumnWithAnimation=function(s,o){var h,i,n=o.iNewWidth,H=o.hasAnimations,p=o.pinned,j=o.hidden,w=!o.previousAnimationCompleted;if(!H||p||j){return false;}h=this._$columns[s];if(w){return h.width()!==n;}i=!h.get(0).style.width;if(i){return false;}return this._getColumnWidth(s)!==n;};f.prototype._propagateContextualSettings=function(){};f.prototype._updateColumnContextualSettings=function(s,w){var o,h;o=this.getAggregation("_"+s+"ColumnNav");if(!o){return;}h=o._getContextualSettings();if(!h||h.contextualWidth!==w){o._applyContextualSettings({contextualWidth:w});}};f.prototype._updateColumnCSSClasses=function(s,w){var n="";this._$columns[s].removeClass("sapUiContainer-Narrow sapUiContainer-Medium sapUiContainer-Wide sapUiContainer-ExtraWide");if(w<D.media._predefinedRangeSets[D.media.RANGESETS.SAP_STANDARD_EXTENDED].points[0]){n="Narrow";}else if(w<D.media._predefinedRangeSets[D.media.RANGESETS.SAP_STANDARD_EXTENDED].points[1]){n="Medium";}else if(w<D.media._predefinedRangeSets[D.media.RANGESETS.SAP_STANDARD_EXTENDED].points[2]){n="Wide";}else{n="ExtraWide";}this._$columns[s].addClass("sapUiContainer-"+n);};f.prototype._getColumnSize=function(s){var h=this.getLayout(),i=this._getColumnWidthDistributionForLayout(h),S=i.split("/"),M={begin:0,mid:1,end:2},j=S[M[s]];return parseInt(j);};f.prototype.getMaxColumnsCount=function(){return this._getMaxColumnsCountForWidth(this._getControlWidth());};f.prototype._getMaxColumnsCountForWidth=function(w){if(w>=f.DESKTOP_BREAKPOINT){return 3;}if(w>=f.TABLET_BREAKPOINT&&w<f.DESKTOP_BREAKPOINT){return 2;}if(w>0){return 1;}return 0;};f.prototype._getMaxColumnsCountForLayout=function(s,w){var i=this._getMaxColumnsCountForWidth(w),h=this._getColumnWidthDistributionForLayout(s,false,i),S=h.split("/"),M={begin:0,mid:1,end:2},j,k,n=0;Object.keys(M).forEach(function(o){j=S[M[o]];k=parseInt(j);if(k){n++;}});return n;};f.prototype._onResize=function(E){var o=E.oldSize.width,n=E.size.width,O,M;this._iWidth=n;if(n===0){return;}O=this._getMaxColumnsCountForWidth(o);M=this._getMaxColumnsCountForWidth(n);this._resizeColumns();if(M!==O){this._hideShowArrows();this._fireStateChange(false,true);}};f.prototype._setColumnPagesRendered=function(i,h){this._oRenderedColumnPagesBoolMap[i]=h;};f.prototype._hasAnyColumnPagesRendered=function(){return Object.keys(this._oRenderedColumnPagesBoolMap).some(function(k){return this._oRenderedColumnPagesBoolMap[k];},this);};f.prototype._onArrowClick=function(s){var h=this.getLayout(),i=typeof f.SHIFT_TARGETS[h]!=="undefined"&&typeof f.SHIFT_TARGETS[h][s]!=="undefined",n;c(i,"An invalid layout was used for determining arrow behavior");n=i?f.SHIFT_TARGETS[h][s]:e.OneColumn;this.setLayout(n);if(f.ARROWS_NAMES[n][s]!==f.ARROWS_NAMES[h][s]&&i){var o=s==='right'?'left':'right';this._oColumnSeparatorArrows[f.ARROWS_NAMES[n][o]].focus();}this._fireStateChange(true,false);};f.prototype._hideShowArrows=function(){var s=this.getLayout(),M={},n=[],i,I;if(!this.isActive()||D.system.phone){return;}i=this.getMaxColumnsCount();if(i>1){M[e.TwoColumnsBeginExpanded]=["beginBack"];M[e.TwoColumnsMidExpanded]=["midForward"];M[e.ThreeColumnsMidExpanded]=["midForward","midBack"];M[e.ThreeColumnsEndExpanded]=["endForward"];M[e.ThreeColumnsMidExpandedEndHidden]=["midForward","midBack"];M[e.ThreeColumnsBeginExpandedEndHidden]=["beginBack"];if(typeof M[s]==="object"){n=M[s];}}I=this._hasAnyColumnPagesRendered();Object.keys(this._oColumnSeparatorArrows).forEach(function(k){this._toggleButton(k,n.indexOf(k)!==-1,I);},this);};f.prototype._toggleButton=function(s,S,r){this._oColumnSeparatorArrows[s].toggle(S&&r);this._oColumnSeparatorArrows[s].data("visible",S);};f.prototype._fireStateChange=function(i,I){if(this._getControlWidth()===0){return;}this.fireStateChange({isNavigationArrow:i,isResize:I,layout:this.getLayout(),maxColumnsCount:this.getMaxColumnsCount()});};f.prototype.setInitialBeginColumnPage=function(p){this._getBeginColumn().setInitialPage(p);this.setAssociation('initialBeginColumnPage',p,true);return this;};f.prototype.setInitialMidColumnPage=function(p){this._getMidColumn().setInitialPage(p);this.setAssociation('initialMidColumnPage',p,true);return this;};f.prototype.setInitialEndColumnPage=function(p){this._getEndColumn().setInitialPage(p);this.setAssociation('initialEndColumnPage',p,true);return this;};f.prototype.to=function(p,t,o,T){if(this._getBeginColumn().getPage(p)){this._getBeginColumn().to(p,t,o,T);}else if(this._getMidColumn().getPage(p)){this._getMidColumn().to(p,t,o,T);}else{this._getEndColumn().to(p,t,o,T);}return this;};f.prototype.backToPage=function(p,o,t){if(this._getBeginColumn().getPage(p)){this._getBeginColumn().backToPage(p,o,t);}else if(this._getMidColumn().getPage(p)){this._getMidColumn().backToPage(p,o,t);}else{this._getEndColumn().backToPage(p,o,t);}return this;};f.prototype._safeBackToPage=function(p,t,h,T){if(this._getBeginColumn().getPage(p)){this._getBeginColumn()._safeBackToPage(p,t,h,T);}else if(this._getMidColumn().getPage(p)){this._getMidColumn()._safeBackToPage(p,t,h,T);}else{this._getEndColumn()._safeBackToPage(p,t,h,T);}};f.prototype.toBeginColumnPage=function(p,t,o,T){this._getBeginColumn().to(p,t,o,T);return this;};f.prototype.toMidColumnPage=function(p,t,o,T){this._getMidColumn().to(p,t,o,T);return this;};f.prototype.toEndColumnPage=function(p,t,o,T){this._getEndColumn().to(p,t,o,T);return this;};f.prototype.backBeginColumn=function(h,t){return this._getBeginColumn().back(h,t);};f.prototype.backMidColumn=function(h,t){return this._getMidColumn().back(h,t);};f.prototype.backEndColumn=function(h,t){return this._getEndColumn().back(h,t);};f.prototype.backBeginColumnToPage=function(p,h,t){return this._getBeginColumn().backToPage(p,h,t);};f.prototype.backMidColumnToPage=function(p,h,t){return this._getMidColumn().backToPage(p,h,t);};f.prototype.backEndColumnToPage=function(p,h,t){return this._getEndColumn().backToPage(p,h,t);};f.prototype.backToTopBeginColumn=function(o,t){this._getBeginColumn().backToTop(o,t);return this;};f.prototype.backToTopMidColumn=function(o,t){this._getMidColumn().backToTop(o,t);return this;};f.prototype.backToTopEndColumn=function(o,t){this._getEndColumn().backToTop(o,t);return this;};f.prototype.getCurrentBeginColumnPage=function(){return this._getBeginColumn().getCurrentPage();};f.prototype.getCurrentMidColumnPage=function(){return this._getMidColumn().getCurrentPage();};f.prototype.getCurrentEndColumnPage=function(){return this._getEndColumn().getCurrentPage();};f.prototype.setDefaultTransitionNameBeginColumn=function(t){this.setProperty("defaultTransitionNameBeginColumn",t,true);this._getBeginColumn().setDefaultTransitionName(t);return this;};f.prototype.setDefaultTransitionNameMidColumn=function(t){this.setProperty("defaultTransitionNameMidColumn",t,true);this._getMidColumn().setDefaultTransitionName(t);return this;};f.prototype.setDefaultTransitionNameEndColumn=function(t){this.setProperty("defaultTransitionNameEndColumn",t,true);this._getEndColumn().setDefaultTransitionName(t);return this;};f.prototype._getLayoutHistory=function(){return this._oLayoutHistory;};f.prototype._getColumnWidthDistributionForLayout=function(s,h,M){var o={},r;M||(M=this.getMaxColumnsCount());if(M===0){r="0/0/0";}else{o[e.OneColumn]="100/0/0";o[e.MidColumnFullScreen]="0/100/0";o[e.EndColumnFullScreen]="0/0/100";if(M===1){o[e.TwoColumnsBeginExpanded]="0/100/0";o[e.TwoColumnsMidExpanded]="0/100/0";o[e.ThreeColumnsMidExpanded]="0/0/100";o[e.ThreeColumnsEndExpanded]="0/0/100";o[e.ThreeColumnsMidExpandedEndHidden]="0/0/100";o[e.ThreeColumnsBeginExpandedEndHidden]="0/0/100";}else{o[e.TwoColumnsBeginExpanded]="67/33/0";o[e.TwoColumnsMidExpanded]="33/67/0";o[e.ThreeColumnsMidExpanded]=M===2?"0/67/33":"25/50/25";o[e.ThreeColumnsEndExpanded]=M===2?"0/33/67":"25/25/50";o[e.ThreeColumnsMidExpandedEndHidden]="33/67/0";o[e.ThreeColumnsBeginExpandedEndHidden]="67/33/0";}r=o[s];}if(h){r=r.split("/").map(function(i){return parseInt(i);});}return r;};f.DESKTOP_BREAKPOINT=1280;f.TABLET_BREAKPOINT=960;f.ARROWS_NAMES={TwoColumnsBeginExpanded:{"left":"beginBack"},TwoColumnsMidExpanded:{"right":"midForward"},ThreeColumnsMidExpanded:{"left":"midBack","right":"midForward"},ThreeColumnsEndExpanded:{"right":"endForward"},ThreeColumnsMidExpandedEndHidden:{"left":"midBack","right":"midForward"},ThreeColumnsBeginExpandedEndHidden:{"left":"beginBack"}};f._getResourceBundle=function(){return sap.ui.getCore().getLibraryResourceBundle("sap.f");};f.SHIFT_TARGETS={TwoColumnsBeginExpanded:{"left":e.TwoColumnsMidExpanded},TwoColumnsMidExpanded:{"right":e.TwoColumnsBeginExpanded},ThreeColumnsMidExpanded:{"left":e.ThreeColumnsEndExpanded,"right":e.ThreeColumnsMidExpandedEndHidden},ThreeColumnsEndExpanded:{"right":e.ThreeColumnsMidExpanded},ThreeColumnsMidExpandedEndHidden:{"left":e.ThreeColumnsMidExpanded,"right":e.ThreeColumnsBeginExpandedEndHidden},ThreeColumnsBeginExpandedEndHidden:{"left":e.ThreeColumnsMidExpandedEndHidden}};function g(){this._aLayoutHistory=[];}g.prototype.addEntry=function(s){if(typeof s!=="undefined"){this._aLayoutHistory.push(s);}};g.prototype.getClosestEntryThatMatches=function(h){var i;for(i=this._aLayoutHistory.length-1;i>=0;i--){if(h.indexOf(this._aLayoutHistory[i])!==-1){return this._aLayoutHistory[i];}}};function A(){this._oListeners={};this._aPendingPromises=[];this._oPendingPromises={};this._oCancelPromises={};this._oPendingPromiseAll=null;}A.prototype.waitForColumnResizeEnd=function($){var i=$.get(0).id,p;if(!this._oPendingPromises[i]){p=new Promise(function(r,h){L.debug("FlexibleColumnLayout","wait for column "+i+" to resize");this._attachTransitionEnd($,function(){L.debug("FlexibleColumnLayout","completed column "+i+" resize");this._cleanUp($);r();}.bind(this));this._oCancelPromises[i]={cancel:function(){L.debug("FlexibleColumnLayout","cancel column "+i+" resize");this._cleanUp($);h();}.bind(this)};}.bind(this));this._aPendingPromises.push(p);this._oPendingPromises[i]=p;}return this._oPendingPromises[i];};A.prototype.waitForAllColumnsResizeEnd=function(){if(!this._oPendingPromiseAll){this._oPendingPromiseAll=new Promise(function(r,h){this.iTimer=setTimeout(function(){Promise.all(this._aPendingPromises).then(function(){L.debug("FlexibleColumnLayout","completed all columns resize");r();},0).catch(function(){h();});this.iTimer=null;}.bind(this));}.bind(this));}return this._oPendingPromiseAll;};A.prototype.isWaitingForColumnResizeEnd=function($){var i=$.get(0).id;return!!this._oListeners[i];};A.prototype.cancelAll=function(){Object.keys(this._oCancelPromises).forEach(function(i){this._oCancelPromises[i].cancel();},this);this._oPendingPromises={};this._aPendingPromises=[];this._oCancelPromises={};this._oPendingPromiseAll=null;if(this.iTimer){clearTimeout(this.iTimer);this.iTimer=null;}L.debug("FlexibleColumnLayout","detached all listeners for columns resize");};A.prototype._attachTransitionEnd=function($,h){var i=$.get(0).id;if(!this._oListeners[i]){$.on("webkitTransitionEnd transitionend",h);this._oListeners[i]=h;}};A.prototype._detachTransitionEnd=function($){var i=$.get(0).id;if(this._oListeners[i]){$.off("webkitTransitionEnd transitionend",this._oListeners[i]);this._oListeners[i]=null;}};A.prototype._cleanUp=function($){if($.length){var i=$.get(0).id;this._detachTransitionEnd($);delete this._oPendingPromises[i];delete this._oCancelPromises[i];}};return f;});