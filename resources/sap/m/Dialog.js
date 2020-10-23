/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Bar","./InstanceManager","./AssociativeOverflowToolbar","./ToolbarSpacer","./Title","./library","./TitleAlignmentMixin","sap/m/Image","sap/ui/core/Control","sap/ui/core/IconPool","sap/ui/core/Popup","sap/ui/core/delegate/ScrollEnablement","sap/ui/core/RenderManager","sap/ui/core/InvisibleText","sap/ui/core/ResizeHandler","sap/ui/core/util/ResponsivePaddingsEnablement","sap/ui/Device","sap/ui/base/ManagedObject","sap/ui/core/library","sap/ui/events/KeyCodes","./TitlePropagationSupport","./DialogRenderer","sap/base/Log","sap/ui/thirdparty/jquery","sap/ui/core/Core","sap/ui/core/Configuration","sap/ui/dom/jquery/control","sap/ui/dom/jquery/Focusable"],function(B,I,A,T,a,l,b,c,C,d,P,S,R,f,g,h,D,M,j,K,k,m,L,q,n,o){"use strict";var O=j.OpenState;var p=l.DialogType;var r=l.DialogRoleType;var V=j.ValueState;var s=l.TitleAlignment;var t=n.getConfiguration().getAnimationMode();var u=t!==o.AnimationMode.none&&t!==o.AnimationMode.minimal;var v=u?300:10;var w=17;var x=C.extend("sap.m.Dialog",{metadata:{interfaces:["sap.ui.core.PopupInterface"],library:"sap.m",properties:{icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},title:{type:"string",group:"Appearance",defaultValue:null},showHeader:{type:"boolean",group:"Appearance",defaultValue:true},type:{type:"sap.m.DialogType",group:"Appearance",defaultValue:p.Standard},state:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:V.None},stretchOnPhone:{type:"boolean",group:"Appearance",defaultValue:false,deprecated:true},stretch:{type:"boolean",group:"Appearance",defaultValue:false},contentWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},contentHeight:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},horizontalScrolling:{type:"boolean",group:"Behavior",defaultValue:true},verticalScrolling:{type:"boolean",group:"Behavior",defaultValue:true},resizable:{type:"boolean",group:"Behavior",defaultValue:false},draggable:{type:"boolean",group:"Behavior",defaultValue:false},escapeHandler:{type:"any",group:"Behavior",defaultValue:null},role:{type:"sap.m.DialogRoleType",group:"Data",defaultValue:r.Dialog,visibility:"hidden"},closeOnNavigation:{type:"boolean",group:"Behavior",defaultValue:true},titleAlignment:{type:"sap.m.TitleAlignment",group:"Misc",defaultValue:s.Auto}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},subHeader:{type:"sap.m.IBar",multiple:false},customHeader:{type:"sap.m.IBar",multiple:false},beginButton:{type:"sap.m.Button",multiple:false},endButton:{type:"sap.m.Button",multiple:false},buttons:{type:"sap.m.Button",multiple:true,singularName:"button"},_header:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_icon:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_toolbar:{type:"sap.m.OverflowToolbar",multiple:false,visibility:"hidden"},_valueState:{type:"sap.ui.core.InvisibleText",multiple:false,visibility:"hidden"}},associations:{leftButton:{type:"sap.m.Button",multiple:false,deprecated:true},rightButton:{type:"sap.m.Button",multiple:false,deprecated:true},initialFocus:{type:"sap.ui.core.Control",multiple:false},ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{beforeOpen:{},afterOpen:{},beforeClose:{parameters:{origin:{type:"sap.m.Button"}}},afterClose:{parameters:{origin:{type:"sap.m.Button"}}}},designtime:"sap/m/designtime/Dialog.designtime"}});h.call(x.prototype,{header:{suffix:"header"},subHeader:{selector:".sapMDialogSubHeader .sapMIBar"},content:{selector:".sapMDialogScrollCont"},footer:{suffix:"footer"}});k.call(x.prototype,"content",function(){return this._headerTitle?this._headerTitle.getId():false;});x._bPaddingByDefault=(n.getConfiguration().getCompatibilityVersion("sapMDialogWithPadding").compareTo("1.16")<0);x._mIcons={};x._mIcons[V.Success]=d.getIconURI("message-success");x._mIcons[V.Warning]=d.getIconURI("message-warning");x._mIcons[V.Error]=d.getIconURI("message-error");x._mIcons[V.Information]=d.getIconURI("hint");x.prototype.init=function(){var e=this;this._oManuallySetSize=null;this._oManuallySetPosition=null;this._bRTL=n.getConfiguration().getRTL();this._scrollContentList=["sap.m.NavContainer","sap.m.Page","sap.m.ScrollContainer","sap.m.SplitContainer","sap.m.MultiInput","sap.m.SimpleFixFlex"];this.oPopup=new P();this.oPopup.setShadow(true);this.oPopup.setNavigationMode("SCOPE");this.oPopup.setModal(true);this.oPopup.setAnimations(q.proxy(this._openAnimation,this),q.proxy(this._closeAnimation,this));this.oPopup._applyPosition=function(i,F){e._setDimensions();e._adjustScrollingPane();if(e._oManuallySetPosition){i.at={left:e._oManuallySetPosition.x,top:e._oManuallySetPosition.y};}else{i.at=e._calcCenter();}e._deregisterContentResizeHandler();P.prototype._applyPosition.call(this,i);e._registerContentResizeHandler();};if(x._bPaddingByDefault){this.addStyleClass("sapUiPopupWithPadding");}this._initTitlePropagationSupport();this._initResponsivePaddingsEnablement();this._sAriaRoleDescription=n.getLibraryResourceBundle("sap.m").getText("DIALOG_ROLE_DESCRIPTION");};x.prototype.onBeforeRendering=function(){if(this._hasSingleScrollableContent()){this.setVerticalScrolling(false);this.setHorizontalScrolling(false);L.info("VerticalScrolling and horizontalScrolling in sap.m.Dialog with ID "+this.getId()+" has been disabled because there's scrollable content inside");}else if(!this._oScroller){this._oScroller=new S(this,this.getId()+"-scroll",{horizontal:this.getHorizontalScrolling(),vertical:this.getVerticalScrolling()});}if(this._oScroller){this._oScroller.setVertical(this.getVerticalScrolling());this._oScroller.setHorizontal(this.getHorizontalScrolling());}this._createToolbarButtons();if(n.getConfiguration().getAccessibility()&&this.getState()!=V.None){var e=new f({text:this.getValueStateString(this.getState())});this.setAggregation("_valueState",e);this.addAriaLabelledBy(e.getId());}};x.prototype.onAfterRendering=function(){this._$scrollPane=this.$("scroll");this._$content=this.$("cont");this._$dialog=this.$();if(this.isOpen()){this._setInitialFocus();}};x.prototype.exit=function(){I.removeDialogInstance(this);this._deregisterContentResizeHandler();this._deregisterResizeHandler();if(this.oPopup){this.oPopup.detachOpened(this._handleOpened,this);this.oPopup.detachClosed(this._handleClosed,this);this.oPopup.destroy();this.oPopup=null;}if(this._oScroller){this._oScroller.destroy();this._oScroller=null;}if(this._header){this._header.destroy();this._header=null;}if(this._headerTitle){this._headerTitle.destroy();this._headerTitle=null;}if(this._iconImage){this._iconImage.destroy();this._iconImage=null;}if(this._toolbarSpacer){this._toolbarSpacer.destroy();this._toolbarSpacer=null;}};x.prototype.open=function(){var e=this.oPopup;e.setInitialFocusId(this.getId());var i=e.getOpenState();switch(i){case O.OPEN:case O.OPENING:return this;case O.CLOSING:this._bOpenAfterClose=true;break;default:}this._oCloseTrigger=null;this.fireBeforeOpen();e.attachOpened(this._handleOpened,this);this._iLastWidthAndHeightWithScroll=null;e.setContent(this);e.open();this._registerResizeHandler();I.addDialogInstance(this);return this;};x.prototype.close=function(){this._bOpenAfterClose=false;this.$().removeClass('sapDialogDisableTransition');this._deregisterResizeHandler();var e=this.oPopup;var i=this.oPopup.getOpenState();if(!(i===O.CLOSED||i===O.CLOSING)){l.closeKeyboard();this.fireBeforeClose({origin:this._oCloseTrigger});e.attachClosed(this._handleClosed,this);this._bDisableRepositioning=false;this._oManuallySetPosition=null;this._oManuallySetSize=null;e.close();this._deregisterContentResizeHandler();}return this;};x.prototype.isOpen=function(){return!!this.oPopup&&this.oPopup.isOpen();};x.prototype.setIcon=function(i){this._bHasCustomIcon=true;return this.setProperty("icon",i);};x.prototype.setState=function(e){var i;this.setProperty("state",e);if(this._bHasCustomIcon){return this;}if(e===V.None){i="";}else{i=x._mIcons[e];}this.setProperty("icon",i);return this;};x.prototype._handleOpened=function(){this.oPopup.detachOpened(this._handleOpened,this);this._setInitialFocus();this.fireAfterOpen();};x.prototype._handleClosed=function(){if(!this.oPopup){return;}this.oPopup.detachClosed(this._handleClosed,this);if(this.getDomRef()){R.preserveContent(this.getDomRef());this.$().remove();}I.removeDialogInstance(this);this.fireAfterClose({origin:this._oCloseTrigger});if(this._bOpenAfterClose){this._bOpenAfterClose=false;this.open();}};x.prototype.onfocusin=function(e){var i=e.target;if(i.id===this.getId()+"-firstfe"){var z=this.$("footer").lastFocusableDomRef()||this.$("cont").lastFocusableDomRef()||(this.getSubHeader()&&this.getSubHeader().$().firstFocusableDomRef())||(this._getAnyHeader()&&this._getAnyHeader().$().lastFocusableDomRef());if(z){z.focus();}}else if(i.id===this.getId()+"-lastfe"){var F=(this._getAnyHeader()&&this._getAnyHeader().$().firstFocusableDomRef())||(this.getSubHeader()&&this.getSubHeader().$().firstFocusableDomRef())||this.$("cont").firstFocusableDomRef()||this.$("footer").firstFocusableDomRef();if(F){F.focus();}}};x.prototype._getPromiseWrapper=function(){var e=this;return{reject:function(){e.currentPromise.reject();},resolve:function(){e.currentPromise.resolve();}};};x.prototype.onsapescape=function(e){var E=this.getEscapeHandler(),i={},z=this;if(this._isSpaceOrEnterPressed){return;}if(e.originalEvent&&e.originalEvent._sapui_handledByControl){return;}this._oCloseTrigger=null;if(typeof E==='function'){new window.Promise(function(F,G){i.resolve=F;i.reject=G;z.currentPromise=i;E(z._getPromiseWrapper());}).then(function(F){z.close();}).catch(function(){L.info("Disallow dialog closing");});}else{this.close();}e.stopPropagation();};x.prototype.onkeyup=function(e){if(this._isSpaceOrEnter(e)){this._isSpaceOrEnterPressed=false;}};x.prototype.onkeydown=function(e){if(this._isSpaceOrEnter(e)){this._isSpaceOrEnterPressed=true;}};x.prototype._isSpaceOrEnter=function(e){var i=e.which||e.keyCode;return i==K.SPACE||i==K.ENTER;};x.prototype._openAnimation=function($,i,e){$.addClass("sapMDialogOpen");$.css("display","block");setTimeout(e,v);};x.prototype._closeAnimation=function($,i,e){$.removeClass("sapMDialogOpen");setTimeout(e,v);};x.prototype._setDimensions=function(){var $=this.$(),e=this.getStretch(),i=this.getStretchOnPhone()&&D.system.phone,z=this.getType()===p.Message,E={};if(!e){if(!this._oManuallySetSize){E.width=this.getContentWidth()||undefined;E.height=this.getContentHeight()||undefined;}else{E.width=this._oManuallySetSize.width;E.height=this._oManuallySetSize.height;}}if(E.width=='auto'){E.width=undefined;}if(E.height=='auto'){E.height=undefined;}if((e&&!z)||(i)){this.$().addClass('sapMDialogStretched');}$.css(E);if(!e&&!this._oManuallySetSize&&!this._bDisableRepositioning){this._centerDialog();}if(window.navigator.userAgent.toLowerCase().indexOf("chrome")!==-1&&this.getStretch()){$.find('> footer').css({bottom:'0.001px'});}};x.prototype._adjustScrollingPane=function(){if(this._oScroller){this._oScroller.refresh();}};x.prototype._reposition=function(){};x.prototype._repositionAfterOpen=function(){};x.prototype._reapplyPosition=function(){this._adjustScrollingPane();};x.prototype._onResize=function(){var $=this.$(),e=this.$('cont'),i,z=this.getContentHeight(),E=this.getContentWidth(),F,G=Math.floor(window.innerWidth*0.9),H=2,J=D.browser,N=0;if(this._oManuallySetSize){e.css({width:'auto'});return;}if(!z||z=='auto'){i=e.scrollTop();e.css({height:'auto'});$.children().each(function(){N+=q(this).outerHeight(true);});if(this.getStretch()||N>$.innerHeight()){F=parseFloat($.height())+H;e.height(Math.round(F));}e.scrollTop(i);}if(D.system.desktop&&!J.chrome){var Q=e.width()+"x"+e.height(),U=$.css("min-width")!==$.css("width");if(Q!==this._iLastWidthAndHeightWithScroll&&U){if(this._hasVerticalScrollbar()&&(!E||E=='auto')&&!this.getStretch()&&e.width()<G){$.addClass("sapMDialogVerticalScrollIncluded");e.css({"padding-right":w});this._iLastWidthAndHeightWithScroll=Q;}else{$.removeClass("sapMDialogVerticalScrollIncluded");e.css({"padding-right":""});this._iLastWidthAndHeightWithScroll=null;}}}if(!this.getStretch()&&!this._oManuallySetSize&&!this._bDisableRepositioning){this._centerDialog();}};x.prototype._hasVerticalScrollbar=function(){var $=this.$('cont');if(D.browser.msie){return $[0].clientWidth<$.outerWidth();}return $[0].clientHeight<$[0].scrollHeight;};x.prototype._centerDialog=function(){this.$().css(this._calcCenter());};x.prototype._calcCenter=function(){var e=window.innerWidth,i=window.innerHeight,$=this.$(),z=$.outerWidth(),E=$.outerHeight();return{left:Math.round((e-z)/2),top:Math.round((i-E)/2)};};x.prototype._createHeader=function(){if(!this._header){this._header=new B(this.getId()+"-header");this._header._setRootAccessibilityRole("heading");this._header._setRootAriaLevel("2");this._setupBarTitleAlignment(this._header,this.getId()+"_header");this.setAggregation("_header",this._header);}};x.prototype._applyTitleToHeader=function(){var e=this.getProperty("title");if(this._headerTitle){this._headerTitle.setText(e);}else{this._headerTitle=new a(this.getId()+"-title",{text:e,level:"H2"}).addStyleClass("sapMDialogTitle");this._header.addContentMiddle(this._headerTitle);}};x.prototype._hasSingleScrollableContent=function(){var e=this.getContent();while(e.length===1&&e[0]instanceof C&&e[0].isA("sap.ui.core.mvc.View")){e=e[0].getContent();}if(e.length===1&&e[0]instanceof C&&e[0].isA(this._scrollContentList)){return true;}return false;};x.prototype._getFocusDomRef=function(){var i=this.getInitialFocus();if(i){return document.getElementById(i);}return this._getFirstFocusableContentSubHeader()||this._getFirstFocusableContentElement()||this._getFirstVisibleButtonDomRef()||this.getDomRef();};x.prototype._getFirstVisibleButtonDomRef=function(){var e=this.getBeginButton(),E=this.getEndButton(),z=this.getButtons(),F;if(e&&e.getVisible()){F=e.getDomRef();}else if(E&&E.getVisible()){F=E.getDomRef();}else if(z&&z.length>0){for(var i=0;i<z.length;i++){if(z[i].getVisible()){F=z[i].getDomRef();break;}}}return F;};x.prototype._getFirstFocusableContentSubHeader=function(){var $=this.$().find('.sapMDialogSubHeader');return $.firstFocusableDomRef();};x.prototype._getFirstFocusableContentElement=function(){var $=this.$("cont");return $.firstFocusableDomRef();};x.prototype._setInitialFocus=function(){var F=this._getFocusDomRef(),e;if(F&&F.id){e=n.byId(F.id);}if(e){if(e.getVisible&&!e.getVisible()){this.focus();return;}F=e.getFocusDomRef();}if(!F){this.setInitialFocus("");F=this._getFocusDomRef();}if(!this.getInitialFocus()){this.setAssociation('initialFocus',F?F.id:this.getId(),true);}if(D.system.desktop||(F&&!/input|textarea|select/i.test(F.tagName))){if(F){F.focus();}}else{this.focus();}};x.prototype.getScrollDelegate=function(){return this._oScroller;};x.prototype._composeAggreNameInHeader=function(e){var H;if(e==="Begin"){H="contentLeft";}else if(e==="End"){H="contentRight";}else{H="content"+e;}return H;};x.prototype._isToolbarEmpty=function(){var e=this._oToolbar.getContent().filter(function(i){return i.getMetadata().getName()!=='sap.m.ToolbarSpacer';});return e.length===0;};x.prototype._setButton=function(e,i,z){return this;};x.prototype._getButton=function(e){var i=e.toLowerCase()+"Button",z="_o"+this._firstLetterUpperCase(e)+"Button";if(D.system.phone){return this.getAggregation(i,null,true);}else{return this[z];}};x.prototype._getButtonFromHeader=function(e){if(this._header){var H=this._composeAggreNameInHeader(this._firstLetterUpperCase(e)),i=this._header.getAggregation(H);return i&&i[0];}else{return null;}};x.prototype._firstLetterUpperCase=function(e){return e.charAt(0).toUpperCase()+e.slice(1);};x.prototype._getAnyHeader=function(){var e=this.getCustomHeader();if(e){e._setRootAriaLevel("2");return e._setRootAccessibilityRole("heading");}else{var i=this.getShowHeader();if(!i){return null;}this._createHeader();this._applyTitleToHeader();this._applyIconToHeader();return this._header;}};x.prototype._deregisterResizeHandler=function(){if(this._resizeListenerId){g.deregister(this._resizeListenerId);this._resizeListenerId=null;}D.resize.detachHandler(this._onResize,this);};x.prototype._registerResizeHandler=function(){var _=this.$("scroll");this._resizeListenerId=g.register(_.get(0),q.proxy(this._onResize,this));D.resize.attachHandler(this._onResize,this);this._onResize();};x.prototype._deregisterContentResizeHandler=function(){if(this._sContentResizeListenerId){g.deregister(this._sContentResizeListenerId);this._sContentResizeListenerId=null;}};x.prototype._registerContentResizeHandler=function(){if(!this._sContentResizeListenerId){this._sContentResizeListenerId=g.register(this.getDomRef("scrollCont"),q.proxy(this._onResize,this));}this._onResize();};x.prototype._attachHandler=function(e){var i=this;if(!this._oButtonDelegate){this._oButtonDelegate={ontap:function(){i._oCloseTrigger=this;},onkeyup:function(){i._oCloseTrigger=this;},onkeydown:function(){i._oCloseTrigger=this;}};}if(e){e.addDelegate(this._oButtonDelegate,true,e);}};x.prototype._createToolbarButtons=function(){var e=this._getToolbar();var i=this.getButtons();var z=this.getBeginButton();var E=this.getEndButton(),F=this,G=[z,E];G.forEach(function(H){if(H&&F._oButtonDelegate){H.removeDelegate(F._oButtonDelegate);}});e.removeAllContent();if(!("_toolbarSpacer"in this)){this._toolbarSpacer=new T();}e.addContent(this._toolbarSpacer);G.forEach(function(H){F._attachHandler(H);});if(i&&i.length){i.forEach(function(H){e.addContent(H);});}else{if(z){e.addContent(z);}if(E){e.addContent(E);}}};x.prototype._getToolbar=function(){if(!this._oToolbar){this._oToolbar=new A(this.getId()+"-footer").addStyleClass("sapMTBNoBorders");this._oToolbar.addDelegate({onAfterRendering:function(){if(this.getType()===p.Message){this.$("footer").removeClass("sapContrast sapContrastPlus");}}},false,this);this.setAggregation("_toolbar",this._oToolbar);}return this._oToolbar;};x.prototype.getValueStateString=function(e){var i=n.getLibraryResourceBundle("sap.m");switch(e){case(V.Success):return i.getText("LIST_ITEM_STATE_SUCCESS");case(V.Warning):return i.getText("LIST_ITEM_STATE_WARNING");case(V.Error):return i.getText("LIST_ITEM_STATE_ERROR");case(V.Information):return i.getText("LIST_ITEM_STATE_INFORMATION");default:return"";}};x.prototype.setSubHeader=function(e){this.setAggregation("subHeader",e);if(e){e.setVisible=function(i){e.setProperty("visible",i);this.invalidate();}.bind(this);}return this;};x.prototype.setLeftButton=function(e){if(typeof e==="string"){e=n.byId(e);}this.setBeginButton(e);return this.setAssociation("leftButton",e);};x.prototype.setRightButton=function(e){if(typeof e==="string"){e=n.byId(e);}this.setEndButton(e);return this.setAssociation("rightButton",e);};x.prototype.getLeftButton=function(){var e=this.getBeginButton();return e?e.getId():null;};x.prototype.getRightButton=function(){var e=this.getEndButton();return e?e.getId():null;};x.prototype.setBeginButton=function(e){if(e&&e.isA("sap.m.Button")){e.addStyleClass("sapMDialogBeginButton");}return this.setAggregation("beginButton",e);};x.prototype.setEndButton=function(e){if(e&&e.isA("sap.m.Button")){e.addStyleClass("sapMDialogEndButton");}return this.setAggregation("endButton",e);};x.prototype.getAggregation=function(e,i,z){var E=C.prototype.getAggregation.apply(this,Array.prototype.slice.call(arguments,0,2));if(e==='buttons'&&E&&E.length===0){this.getBeginButton()&&E.push(this.getBeginButton());this.getEndButton()&&E.push(this.getEndButton());}return E;};x.prototype.getAriaLabelledBy=function(){var H=this._getAnyHeader(),e=this.getAssociation("ariaLabelledBy",[]).slice();var i=this.getSubHeader();if(i){e.unshift(i.getId());}if(H){var z=H.findAggregatedObjects(true,function(E){return E.isA("sap.m.Title");});if(z.length){e=z.map(function(E){return E.getId();}).concat(e);}else{e.unshift(H.getId());}}return e;};x.prototype._applyIconToHeader=function(){var i=this.getIcon();if(!i){if(this._iconImage){this._iconImage.destroy();this._iconImage=null;}return;}if(!this._iconImage){this._iconImage=d.createControlByURI({id:this.getId()+"-icon",src:i,useIconTooltip:false},c).addStyleClass("sapMDialogIcon");this._header.insertAggregation("contentMiddle",this._iconImage,0);}this._iconImage.setSrc(i);};x.prototype.setInitialFocus=function(i){return this.setAssociation("initialFocus",i,true);};x.prototype.forceInvalidate=C.prototype.invalidate;x.prototype.invalidate=function(e){if(this.isOpen()){this.forceInvalidate(e);}};function y(e){var $=q(e);var i=$.control(0);if($.parents('.sapMDialogSection').length){return false;}if(!i||i.getMetadata().getInterfaces().indexOf("sap.m.IBar")>-1){return true;}return $.hasClass('sapMDialogTitle');}if(D.system.desktop){x.prototype.ondblclick=function(e){if(y(e.target)){var $=this.$('cont');this._bDisableRepositioning=false;this._oManuallySetPosition=null;this._oManuallySetSize=null;this.oPopup&&this.oPopup._applyPosition(this.oPopup._oLastPosition,true);$.css({height:'100%'});}};x.prototype.onmousedown=function(e){if(e.which===3){return;}if(this.getStretch()||(!this.getDraggable()&&!this.getResizable())){return;}var i;var z=this;var $=q(document);var E=q(e.target);var F=E.hasClass('sapMDialogResizeHandler')&&this.getResizable();var G=function(a1){i=i?clearTimeout(i):setTimeout(function(){a1();},0);};var H=window.innerWidth;var J=window.innerHeight;var N={x:e.pageX,y:e.pageY,width:z._$dialog.width(),height:z._$dialog.height(),outerHeight:z._$dialog.outerHeight(),offset:{x:e.offsetX?e.offsetX:e.originalEvent.layerX,y:e.offsetY?e.offsetY:e.originalEvent.layerY},position:{x:z._$dialog.offset().left,y:z._$dialog.offset().top}};var Q;function U(){var a1=z.$(),b1=z.$('cont'),c1,d1;$.off("mouseup",U);$.off("mousemove",Q);if(F){z._$dialog.removeClass('sapMDialogResizing');c1=parseInt(a1.height());d1=parseInt(a1.css("border-top-width"))+parseInt(a1.css("border-bottom-width"));b1.height(c1+d1);}}if((y(e.target)&&this.getDraggable())||F){z._bDisableRepositioning=true;z._$dialog.addClass('sapDialogDisableTransition');z._oManuallySetPosition={x:N.position.x,y:N.position.y};z._$dialog.css({left:Math.min(Math.max(0,z._oManuallySetPosition.x),H-N.width),top:Math.min(Math.max(0,z._oManuallySetPosition.y),J-N.height),width:N.width});}if(y(e.target)&&this.getDraggable()){Q=function(a1){if(a1.buttons===0){U();return;}G(function(){z._bDisableRepositioning=true;z._oManuallySetPosition={x:a1.pageX-e.pageX+N.position.x,y:a1.pageY-e.pageY+N.position.y};z._$dialog.css({left:Math.min(Math.max(0,z._oManuallySetPosition.x),H-N.width),top:Math.min(Math.max(0,z._oManuallySetPosition.y),J-N.outerHeight)});});};$.on("mousemove",Q);}else if(F){z._$dialog.addClass('sapMDialogResizing');var W={};var X=parseInt(z._$dialog.css('min-width'));var Y=N.x+N.width-X;var Z=E.width()-e.offsetX;var _=E.height()-e.offsetY;Q=function(a1){G(function(){z._bDisableRepositioning=true;z.$('cont').height('').width('');if(a1.pageY+_>J){a1.pageY=J-_;}if(a1.pageX+Z>H){a1.pageX=H-Z;}z._oManuallySetSize={width:N.width+a1.pageX-N.x,height:N.height+a1.pageY-N.y};if(z._bRTL){W.left=Math.min(Math.max(a1.pageX,0),Y);z._oManuallySetSize.width=N.width+N.x-Math.max(a1.pageX,0);}W.width=z._oManuallySetSize.width;W.height=z._oManuallySetSize.height;z._$dialog.css(W);});};$.on("mousemove",Q);}else{return;}$.on("mouseup",U);e.preventDefault();e.stopPropagation();};}x.prototype._applyContextualSettings=function(){M.prototype._applyContextualSettings.call(this,M._defaultContextualSettings);};b.mixInto(x.prototype);return x;});
