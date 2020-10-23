/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Dialog','./Popover','./SelectList','./library','sap/ui/core/Core','sap/ui/core/Control','sap/ui/core/EnabledPropagator','sap/ui/core/Icon','sap/ui/core/IconPool','./Button','./Bar','./Title','./delegate/ValueStateMessage','sap/ui/core/message/MessageMixin','sap/ui/core/library','sap/ui/core/Item','sap/ui/Device','sap/ui/core/InvisibleText','./SelectRenderer',"sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes",'./Text','sap/m/SimpleFixFlex','sap/base/Log'],function(D,P,S,l,C,a,E,I,b,B,c,T,V,M,d,f,g,h,j,k,K,m,n,L){"use strict";var o=l.SelectListKeyboardNavigationMode;var p=l.PlacementType;var q=d.ValueState;var r=d.TextDirection;var s=d.TextAlign;var t=l.SelectType;var u=a.extend("sap.m.Select",{metadata:{interfaces:["sap.ui.core.IFormContent","sap.m.IOverflowToolbarContent","sap.f.IShellBar"],library:"sap.m",properties:{name:{type:"string",group:"Misc",defaultValue:""},enabled:{type:"boolean",group:"Behavior",defaultValue:true},editable:{type:"boolean",group:"Behavior",defaultValue:true},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"auto"},maxWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"},selectedKey:{type:"string",group:"Data",defaultValue:""},selectedItemId:{type:"string",group:"Misc",defaultValue:""},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:""},type:{type:"sap.m.SelectType",group:"Appearance",defaultValue:t.Default},autoAdjustWidth:{type:"boolean",group:"Appearance",defaultValue:false},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:s.Initial},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:r.Inherit},valueState:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:q.None},valueStateText:{type:"string",group:"Misc",defaultValue:""},showSecondaryValues:{type:"boolean",group:"Misc",defaultValue:false},resetOnMissingKey:{type:"boolean",group:"Behavior",defaultValue:false},forceSelection:{type:"boolean",group:"Behavior",defaultValue:true},wrapItemsText:{type:"boolean",group:"Behavior",defaultValue:false},required:{type:"boolean",group:"Misc",defaultValue:false}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.core.Item",multiple:true,singularName:"item",bindable:"bindable",forwarding:{getter:"getList",aggregation:"items"}},picker:{type:"sap.ui.core.PopupInterface",multiple:false,visibility:"hidden"},_valueIcon:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"},_pickerHeader:{type:"sap.m.Bar",multiple:false,visibility:"hidden"},_pickerValueStateContent:{type:"sap.m.Text",multiple:false,visibility:"hidden"}},associations:{selectedItem:{type:"sap.ui.core.Item",multiple:false},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{change:{parameters:{selectedItem:{type:"sap.ui.core.Item"}}}},designtime:"sap/m/designtime/Select.designtime"}});b.insertFontFaceStyle();E.apply(u.prototype,[true]);M.call(u.prototype);function H(i){if(i){this.setSelection(i);this.setValue(i.getText());this.scrollToItem(i);}}u.prototype._attachHiddenSelectHandlers=function(){var e=this._getHiddenSelect();e.on("focusin",this._addFocusClass.bind(this));e.on("focusout",this._removeFocusClass.bind(this));};u.prototype._addFocusClass=function(){this.$().addClass("sapMSltFocused");};u.prototype._removeFocusClass=function(){this.$().removeClass("sapMSltFocused");};u.prototype._detachHiddenSelectHandlers=function(){var e=this._getHiddenSelect();if(e){e.off("focusin");e.off("focusout");}};u.prototype._getHiddenSelect=function(){return this.$("hiddenSelect");};u.prototype._handleFocusout=function(e){this._bFocusoutDueRendering=this.bRenderingPhase;if(this._bFocusoutDueRendering){this._bProcessChange=false;return;}if(this._bProcessChange){if(!this.isOpen()||e.target===this.getAggregation("picker")){this._checkSelectionChange();}else{this._revertSelection();}this._bProcessChange=false;}else{this._bProcessChange=true;}};u.prototype._checkSelectionChange=function(){var i=this.getSelectedItem();if(this._oSelectionOnFocus!==i){this.fireChange({selectedItem:i});}};u.prototype._revertSelection=function(){var i=this.getSelectedItem();if(this._oSelectionOnFocus!==i){this.setSelection(this._oSelectionOnFocus);this.setValue(this._getSelectedItemText());}};u.prototype._getSelectedItemText=function(i){i=i||this.getSelectedItem();if(!i){i=this.getDefaultSelectedItem();}if(i){return i.getText();}return"";};u.prototype.getOverflowToolbarConfig=function(){var e=["enabled","selectedKey"];if(!this.getAutoAdjustWidth()||this._bIsInOverflow){e.push("selectedItemId");}var i={canOverflow:true,autoCloseEvents:["change"],invalidationEvents:["_itemTextChange"],propsUnrelatedToSize:e};i.onBeforeEnterOverflow=function(v){var w=v.getParent();if(!w.isA("sap.m.OverflowToolbar")){return;}v._prevSelectType=v.getType();v._bIsInOverflow=true;if(v.getType()!==t.Default){v.setProperty("type",t.Default,true);}};i.onAfterExitOverflow=function(v){var w=v.getParent();if(!w.isA("sap.m.OverflowToolbar")){return;}v._bIsInOverflow=false;if(v.getType()!==v._prevSelectType){v.setProperty("type",v._prevSelectType,true);}};return i;};u.prototype.getList=function(){if(this.bIsDestroyed){return null;}return this._oList;};u.prototype.findFirstEnabledItem=function(i){var e=this.getList();return e?e.findFirstEnabledItem(i):null;};u.prototype.findLastEnabledItem=function(i){var e=this.getList();return e?e.findLastEnabledItem(i):null;};u.prototype.setSelectedIndex=function(i,_){var e;_=_||this.getItems();i=(i>_.length-1)?_.length-1:Math.max(0,i);e=_[i];if(e){this.setSelection(e);}};u.prototype.scrollToItem=function(i){var e=this.getPicker().getDomRef(),v=i&&i.getDomRef();if(!e||!v){return;}var w=e.querySelector('.sapUiSimpleFixFlexFlexContent'),x=e.querySelector('.sapMSltPickerValueState'),y=x?x.clientHeight:0,z=w.scrollTop,A=v.offsetTop-y,F=w.clientHeight,G=v.offsetHeight;if(z>A){w.scrollTop=A;}else if((A+G)>(z+F)){w.scrollTop=Math.ceil(A+G-F);}};u.prototype.setValue=function(v){var e=this.getDomRef(),i=e&&e.querySelector(".sapMSelectListItemText");if(i){i.textContent=v;}this._setHiddenSelectValue();this._getValueIcon();};u.prototype._setHiddenSelectValue=function(){var e=this._getHiddenSelect(),i=this.getSelectedItem(),v;if(i){v=i.getText();e.attr("value",this.getSelectedKey());e.val(v);}};u.prototype._getValueIcon=function(){if(this.bIsDestroyed){return null;}var v=this.getAggregation("_valueIcon"),e=this.getSelectedItem(),i=!!(e&&e.getIcon&&e.getIcon()),w=i?e.getIcon():"sap-icon://pull-down";if(!v){v=new I(this.getId()+"-labelIcon",{src:w,visible:false});this.setAggregation("_valueIcon",v,true);}if(v.getVisible()!==i){v.setVisible(i);v.toggleStyleClass("sapMSelectListItemIcon",i);}if(i&&e.getIcon()!==v.getSrc()){v.setSrc(w);}return v;};u.prototype._isShadowListRequired=function(){if(this.getAutoAdjustWidth()){return false;}else if(this.getWidth()==="auto"){return true;}return false;};u.prototype._handleAriaActiveDescendant=function(i){var e=this.getFocusDomRef(),v=i&&i.getDomRef(),A="aria-activedescendant";if(!e){return;}if(v&&this.isOpen()){e.setAttribute(A,i.getId());}else{e.removeAttribute(A);}};u.prototype.updateItems=function(R){S.prototype.updateItems.apply(this,arguments);this._oSelectionOnFocus=this.getSelectedItem();};u.prototype.refreshItems=function(){S.prototype.refreshItems.apply(this,arguments);};u.prototype.onBeforeOpen=function(e){var i=this["_onBeforeOpen"+this.getPickerType()],v=this.getRenderer().CSS_CLASS;this.addStyleClass(v+"Pressed");this.addStyleClass(v+"Expanded");this.closeValueStateMessage();this.addContent();this.addContentToFlex();i&&i.call(this);};u.prototype.onAfterOpen=function(e){var i=this.getFocusDomRef(),v=null;if(!i){return;}v=this.getSelectedItem();i.setAttribute("aria-expanded","true");i.setAttribute("aria-controls",this.getList().getId());if(v){i.setAttribute("aria-activedescendant",v.getId());this.scrollToItem(v);}};u.prototype.onBeforeClose=function(e){var i=this.getFocusDomRef(),v=this.getRenderer().CSS_CLASS;if(i){i.removeAttribute("aria-controls");i.removeAttribute("aria-activedescendant");if(this.shouldValueStateMessageBeOpened()&&(document.activeElement===i)){this.openValueStateMessage();}}this.removeStyleClass(v+"Expanded");};u.prototype.onAfterClose=function(e){var i=this.getFocusDomRef(),v=this.getRenderer().CSS_CLASS,w=v+"Pressed";if(i){i.setAttribute("aria-expanded","false");i.removeAttribute("aria-activedescendant");}this.removeStyleClass(w);};u.prototype.getPicker=function(){if(this.bIsDestroyed){return null;}return this.createPicker(this.getPickerType());};u.prototype.getSimpleFixFlex=function(){if(this.bIsDestroyed){return null;}else if(this.oSimpleFixFlex){return this.oSimpleFixFlex;}this.oSimpleFixFlex=new n({id:this.getPickerValueStateContentId(),fixContent:this._getPickerValueStateContent().addStyleClass(this.getRenderer().CSS_CLASS+"PickerValueState"),flexContent:this.createList()});return this.oSimpleFixFlex;};u.prototype.setPickerType=function(e){this._sPickerType=e;};u.prototype.getPickerType=function(){return this._sPickerType;};u.prototype._getPickerValueStateContent=function(){if(!this.getAggregation("_pickerValueStateContent")){this.setAggregation("_pickerValueStateContent",new m({wrapping:true,text:this._getTextForPickerValueStateContent()}));}return this.getAggregation("_pickerValueStateContent");};u.prototype._updatePickerValueStateContentText=function(){var e=this.getPicker().getContent()[0].getFixContent(),i;if(e){i=this._getTextForPickerValueStateContent();e.setText(i);}};u.prototype._getTextForPickerValueStateContent=function(){var v=this.getValueStateText(),e;if(v){e=v;}else{e=this._getDefaultTextForPickerValueStateContent();}return e;};u.prototype._getDefaultTextForPickerValueStateContent=function(){var v=this.getValueState(),R,e;if(v===q.None){e="";}else{R=C.getLibraryResourceBundle("sap.ui.core");e=R.getText("VALUE_STATE_"+v.toUpperCase());}return e;};u.prototype._updatePickerValueStateContentStyles=function(){var v=this.getValueState(),e=q,i=this.getRenderer().CSS_CLASS,w=i+"Picker",x=w+v+"State",y=w+"WithSubHeader",z=this.getPicker(),A=z.getContent()[0].getFixContent();if(A){this._removeValueStateClassesForPickerValueStateContent(z);A.addStyleClass(x);if(v!==e.None){z.addStyleClass(y);}else{z.removeStyleClass(y);}}};u.prototype._removeValueStateClassesForPickerValueStateContent=function(e){var v=q,i=this.getRenderer().CSS_CLASS,w=i+"Picker",x=e.getContent()[0].getFixContent();Object.keys(v).forEach(function(y){var O=w+y+"State";x.removeStyleClass(O);});};u.prototype._createPopover=function(){var e=this;var i=new P({showArrow:false,showHeader:false,placement:p.VerticalPreferredBottom,offsetX:0,offsetY:0,initialFocus:this,bounce:false,ariaLabelledBy:this._getPickerHiddenLabelId()});i.addEventDelegate({ontouchstart:function(v){var w=this.getDomRef("cont");if((v.target===w)||(v.srcControl instanceof f)){e._bProcessChange=false;}}},i);this._decoratePopover(i);return i;};u.prototype._decoratePopover=function(e){var i=this;e.open=function(){return this.openBy(i);};};u.prototype._onBeforeRenderingPopover=function(){var e=this.getPicker(),w=this.$().outerWidth()+"px";if(e){e.setContentMinWidth(w);}};u.prototype._createDialog=function(){var e=this,i=this._getPickerHeader(),v=new D({stretch:true,ariaLabelledBy:this._getPickerHiddenLabelId(),customHeader:i,beforeOpen:function(){e.updatePickerHeaderTitle();}});v._setupBarTitleAlignment(i,this.getId()+"_pickerHeader");return v;};u.prototype._getPickerTitle=function(){var e=this.getPicker(),i=e&&e.getCustomHeader();if(i){return i.getContentMiddle()[0];}return null;};u.prototype._getPickerHeader=function(){var i=b.getIconURI("decline"),R;if(!this.getAggregation("_pickerHeader")){R=C.getLibraryResourceBundle("sap.m");this.setAggregation("_pickerHeader",new c({contentMiddle:new T({text:R.getText("SELECT_PICKER_TITLE_TEXT")}),contentRight:new B({icon:i,press:this.close.bind(this)})}));}return this.getAggregation("_pickerHeader");};u.prototype._getPickerHiddenLabelId=function(){return h.getStaticId("sap.m","INPUT_AVALIABLE_VALUES");};u.prototype.getPickerValueStateContentId=function(){return this.getId()+"-valueStateText";};u.prototype.updatePickerHeaderTitle=function(){var e=this.getPicker();if(!e){return;}var i=this.getLabels();if(i.length){var v=i[0],w=this._getPickerTitle();if(v&&(typeof v.getText==="function")){w&&w.setText(v.getText());}}};u.prototype._onBeforeOpenDialog=function(){};u.prototype.init=function(){this.setPickerType(g.system.phone?"Dialog":"Popover");this.createPicker(this.getPickerType());this._oSelectionOnFocus=null;this.bRenderingPhase=false;this._bFocusoutDueRendering=false;this._bProcessChange=false;this.sTypedChars="";this.iTypingTimeoutID=-1;this._oValueStateMessage=new V(this);this._bValueStateMessageOpened=false;this._sAriaRoleDescription=C.getLibraryResourceBundle("sap.m").getText("SELECT_ROLE_DESCRIPTION");};u.prototype.onBeforeRendering=function(){this.bRenderingPhase=true;this.synchronizeSelection({forceSelection:this.getForceSelection()});this._updatePickerValueStateContentText();this._updatePickerValueStateContentStyles();this._detachHiddenSelectHandlers();};u.prototype.onAfterRendering=function(){this.bRenderingPhase=false;this._setHiddenSelectValue();this._attachHiddenSelectHandlers();};u.prototype.exit=function(){var v=this.getValueStateMessage(),e=this._getValueIcon();this._oSelectionOnFocus=null;if(v){this.closeValueStateMessage();v.destroy();}if(e){e.destroy();}this._oValueStateMessage=null;this._bValueStateMessageOpened=false;};u.prototype.ontouchstart=function(e){e.setMarked();if(this.getEnabled()&&this.getEditable()&&this.isOpenArea(e.target)){this.addStyleClass(this.getRenderer().CSS_CLASS+"Pressed");}};u.prototype.ontouchend=function(e){e.setMarked();if(this.getEnabled()&&this.getEditable()&&!this.isOpen()&&this.isOpenArea(e.target)){this.removeStyleClass(this.getRenderer().CSS_CLASS+"Pressed");}};u.prototype.ontap=function(e){var i=this.getRenderer().CSS_CLASS;e.setMarked();if(!this.getEnabled()||!this.getEditable()){return;}if(this.isOpenArea(e.target)){if(this.isOpen()){this.close();this.removeStyleClass(i+"Pressed");return;}if(g.system.phone){this.focus();}this.open();}if(this.isOpen()){this.addStyleClass(i+"Pressed");}};u.prototype.onSelectionChange=function(e){var i=e.getParameter("selectedItem");this.close();this.setSelection(i);this.fireChange({selectedItem:i});this.setValue(this._getSelectedItemText());};u.prototype.onkeypress=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();var i=String.fromCharCode(e.which),v;this.sTypedChars+=i;v=(/^(.)\1+$/i).test(this.sTypedChars)?i:this.sTypedChars;clearTimeout(this.iTypingTimeoutID);this.iTypingTimeoutID=setTimeout(function(){this.sTypedChars="";this.iTypingTimeoutID=-1;}.bind(this),1000);H.call(this,this.searchNextItemByText(v));};u.prototype.onsapshow=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();if(e.which===K.F4){e.preventDefault();}this.toggleOpenState();};u.prototype.onsaphide=u.prototype.onsapshow;u.prototype.onmousedown=function(e){e.preventDefault();};u.prototype.onsapescape=function(e){if(!this.getEnabled()||!this.getEditable()||this._bSpaceDown){return;}if(this.isOpen()){e.setMarked();this.close();this._revertSelection();}};u.prototype.onsapenter=function(e){if(!this.getEnabled()||!this.getEditable()){return;}if(this.isOpen()){e.setMarked();}this.close();this._checkSelectionChange();};u.prototype.onkeydown=function(e){if(e.which===K.SPACE){this._bSpaceDown=true;}if([K.ARROW_DOWN,K.ARROW_UP,K.SPACE].indexOf(e.which)>-1){e.preventDefault();}if(e.which===K.SHIFT||e.which===K.ESCAPE){this._bSupressNextAction=this._bSpaceDown;}};u.prototype.onkeyup=function(e){if(!this.getEnabled()||!this.getEditable()){return;}if(e.which===K.SPACE){if(!e.shiftKey&&!this._bSupressNextAction){e.setMarked();if(this.isOpen()){this._checkSelectionChange();}this.toggleOpenState();}this._bSpaceDown=false;this._bSupressNextAction=false;}};u.prototype.onsapdown=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();e.preventDefault();var N,i=this.getSelectableItems();N=i[i.indexOf(this.getSelectedItem())+1];H.call(this,N);};u.prototype.onsapup=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();e.preventDefault();var i,v=this.getSelectableItems();i=v[v.indexOf(this.getSelectedItem())-1];H.call(this,i);};u.prototype.onsaphome=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();e.preventDefault();var F=this.getSelectableItems()[0];H.call(this,F);};u.prototype.onsapend=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();e.preventDefault();var i=this.findLastEnabledItem(this.getSelectableItems());H.call(this,i);};u.prototype.onsappagedown=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();e.preventDefault();var i=this.getSelectableItems(),v=this.getSelectedItem();this.setSelectedIndex(i.indexOf(v)+10,i);v=this.getSelectedItem();if(v){this.setValue(v.getText());}this.scrollToItem(v);};u.prototype.onsappageup=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();e.preventDefault();var i=this.getSelectableItems(),v=this.getSelectedItem();this.setSelectedIndex(i.indexOf(v)-10,i);v=this.getSelectedItem();if(v){this.setValue(v.getText());}this.scrollToItem(v);};u.prototype.onsaptabnext=function(e){if(!this.getEnabled()){return;}if(this.isOpen()){this.close();this._checkSelectionChange();}};u.prototype.onsaptabprevious=u.prototype.onsaptabnext;u.prototype.onfocusin=function(e){if(!this._bFocusoutDueRendering&&!this._bProcessChange){this._oSelectionOnFocus=this.getSelectedItem();}this._bProcessChange=true;setTimeout(function(){if(!this.isOpen()&&this.shouldValueStateMessageBeOpened()&&(document.activeElement===this.getFocusDomRef())){this.openValueStateMessage();}}.bind(this),100);if(g.browser.msie&&(e.target!==this.getFocusDomRef())){this.focus();}};u.prototype.onfocusout=function(e){this._handleFocusout(e);if(this.bRenderingPhase){return;}this.closeValueStateMessage();};u.prototype.onsapfocusleave=function(e){var i=this.getAggregation("picker");if(!e.relatedControlId||!i){return;}var v=C.byId(e.relatedControlId),F=v&&v.getFocusDomRef();if(g.system.desktop&&k(i.getFocusDomRef(),F)){this.focus();}};u.prototype.getFocusDomRef=function(){return this._getHiddenSelect()[0];};u.prototype.getPopupAnchorDomRef=function(){return this.getDomRef();};u.prototype.setSelection=function(i){var e=this.getList(),v;if(e){e.setSelection(i);}this.setAssociation("selectedItem",i,true);this.setProperty("selectedItemId",(i instanceof f)?i.getId():i,true);if(typeof i==="string"){i=C.byId(i);}v=i?i.getKey():"";this.setProperty("selectedKey",v,true);this._handleAriaActiveDescendant(i);};u.prototype.isSelectionSynchronized=function(){return S.prototype.isSelectionSynchronized.apply(this,arguments);};u.prototype.synchronizeSelection=function(){S.prototype.synchronizeSelection.apply(this,arguments);};u.prototype.addContent=function(e){};u.prototype.addContentToFlex=function(){};u.prototype.createPicker=function(e){var i=this.getAggregation("picker"),v=this.getRenderer().CSS_CLASS;if(i){return i;}i=this["_create"+e]();this.setAggregation("picker",i,true);i.setHorizontalScrolling(false).setVerticalScrolling(false).addStyleClass(v+"Picker").addStyleClass(v+"Picker-CTX").addStyleClass("sapUiNoContentPadding").attachBeforeOpen(this.onBeforeOpen,this).attachAfterOpen(this.onAfterOpen,this).attachBeforeClose(this.onBeforeClose,this).attachAfterClose(this.onAfterClose,this).addEventDelegate({onBeforeRendering:this.onBeforeRenderingPicker,onAfterRendering:this.onAfterRenderingPicker},this).addContent(this.getSimpleFixFlex());return i;};u.prototype.searchNextItemByText=function(e){var v=this.getItems(),w=this.getSelectedIndex(),x=v.splice(w+1,v.length-w),y=v.splice(0,v.length-1);v=x.concat(y);for(var i=0,z;i<v.length;i++){z=v[i];var A=typeof e==="string"&&e!=="";if(z.getEnabled()&&!(z instanceof sap.ui.core.SeparatorItem)&&z.getText().toLowerCase().startsWith(e.toLowerCase())&&A){return z;}}return null;};u.prototype.createList=function(){var e=o,i=g.system.phone?e.Delimited:e.None;this._oList=new S({width:"100%",keyboardNavigationMode:i}).addStyleClass(this.getRenderer().CSS_CLASS+"List-CTX").addEventDelegate({ontap:function(v){this._checkSelectionChange();this.close();}},this).attachSelectionChange(this.onSelectionChange,this);this._oList.toggleStyleClass("sapMSelectListWrappedItems",this.getWrapItemsText());return this._oList;};u.prototype.setWrapItemsText=function(w){var e=this.getPicker();if(this._oList){this._oList.toggleStyleClass("sapMSelectListWrappedItems",w);}if(e&&this.getPickerType()==="Popover"){e.toggleStyleClass("sapMPickerWrappedItems",w);}return this.setProperty("wrapItemsText",w,true);};u.prototype.hasContent=function(){return this.getItems().length>0;};u.prototype.onBeforeRenderingPicker=function(){var O=this["_onBeforeRendering"+this.getPickerType()];O&&O.call(this);};u.prototype.onAfterRenderingPicker=function(){var O=this["_onAfterRendering"+this.getPickerType()];O&&O.call(this);};u.prototype.open=function(){var e=this.getPicker();if(e){e.open();}return this;};u.prototype.toggleOpenState=function(){if(this.isOpen()){this.close();}else{this.open();}return this;};u.prototype.getVisibleItems=function(){var e=this.getList();return e?e.getVisibleItems():[];};u.prototype.isItemSelected=function(i){return i&&(i.getId()===this.getAssociation("selectedItem"));};u.prototype.getSelectedIndex=function(){var e=this.getSelectedItem();return e?this.indexOfItem(this.getSelectedItem()):-1;};u.prototype.getDefaultSelectedItem=function(i){return this.getForceSelection()?this.findFirstEnabledItem():null;};u.prototype.getSelectableItems=function(){var e=this.getList();return e?e.getSelectableItems():[];};u.prototype.getOpenArea=function(){return this.getDomRef();};u.prototype.isOpenArea=function(e){var O=this.getOpenArea();return O&&O.contains(e);};u.prototype.findItem=function(e,v){var i=this.getList();return i?i.findItem(e,v):null;};u.prototype.clearSelection=function(){this.setSelection(null);};u.prototype.onItemChange=function(e){var i=this.getAssociation("selectedItem"),v=e.getParameter("id"),w=e.getParameter("name"),N=e.getParameter("newValue"),O,x,F,y;if(w==="key"&&!this.isBound("selectedKey")){x=this.getSelectedKey();F=this.getItemByKey(N);if(N===x&&i!==v&&F&&v===F.getId()){this.setSelection(F);return;}O=e.getParameter("oldValue");if(i===v&&x===O&&!this.getItemByKey(O)){this.setSelectedKey(N);return;}y=this.getItemByKey(x);if(i===v&&N!==x&&y){this.setSelection(y);return;}}if(w==="text"&&i===v){this.fireEvent("_itemTextChange");this.setValue(N);}};u.prototype.fireChange=function(e){this._oSelectionOnFocus=e.selectedItem;return this.fireEvent("change",e);};u.prototype.addAggregation=function(A,O,e){if(A==="items"&&!e&&!this.isInvalidateSuppressed()){this.invalidate(O);}return a.prototype.addAggregation.apply(this,arguments);};u.prototype.destroyAggregation=function(A,e){if(A==="items"&&!e&&!this.isInvalidateSuppressed()){this.invalidate();}return a.prototype.destroyAggregation.apply(this,arguments);};u.prototype.setAssociation=function(A,i,e){var v=this.getList();if(v&&(A==="selectedItem")){S.prototype.setAssociation.apply(v,arguments);}return a.prototype.setAssociation.apply(this,arguments);};u.prototype.setProperty=function(i,v,w){var x=this.getList();if((i==="selectedKey")||(i==="selectedItemId")){x&&S.prototype.setProperty.apply(x,arguments);}try{a.prototype.setProperty.apply(this,arguments);}catch(e){L.warning('Update failed due to exception. Loggable in support mode log',null,null,function(){return{exception:e};});}return this;};u.prototype.removeAllAssociation=function(A,e){var i=this.getList();if(i&&(A==="selectedItem")){S.prototype.removeAllAssociation.apply(i,arguments);}return a.prototype.removeAllAssociation.apply(this,arguments);};u.prototype.clone=function(){var e=a.prototype.clone.apply(this,arguments),i=this.getSelectedItem(),v=this.getSelectedKey();if(!this.isBound("selectedKey")&&!e.isSelectionSynchronized()){if(i&&(v==="")){e.setSelectedIndex(this.indexOfItem(i));}else{e.setSelectedKey(v);}}return e;};u.prototype.updateValueStateClasses=function(v,O){var $=this.$(),e=this.$("label"),A=this.$("arrow"),i=q,w=this.getRenderer().CSS_CLASS;if(O!==i.None){$.removeClass(w+"State");$.removeClass(w+O);e.removeClass(w+"LabelState");e.removeClass(w+"Label"+O);A.removeClass(w+"ArrowState");}if(v!==i.None){$.addClass(w+"State");$.addClass(w+v);e.addClass(w+"LabelState");e.addClass(w+"Label"+v);A.addClass(w+"ArrowState");}};u.prototype._updatePickerAriaLabelledBy=function(v){var e=this.getPicker(),i=this.getPickerValueStateContentId();if(v===q.None){e.removeAriaLabelledBy(i);}else{e.addAriaLabelledBy(i);}};u.prototype.updateAriaLabelledBy=function(v,O){var $=this._getHiddenSelect(),A=$.attr("aria-labelledby"),i=A?A.split(" "):[],e,N;if(O!==q.None&&O!==q.Error){e=i.indexOf(h.getStaticId("sap.ui.core","VALUE_STATE_"+O.toUpperCase()));i.splice(e,1);}if(v!==q.None&&v!==q.Error){i.push(h.getStaticId("sap.ui.core","VALUE_STATE_"+v.toUpperCase()));}N=i.join(" ");$.attr("aria-labelledby",N);};u.prototype.getLabels=function(){var e=this.getAriaLabelledBy().map(function(v){return C.byId(v);});var i=sap.ui.require("sap/ui/core/LabelEnablement");if(i){e=e.concat(i.getReferencingLabels(this).map(function(v){return C.byId(v);}));}return e;};u.prototype.getDomRefForValueStateMessage=function(){return this.getDomRef();};u.prototype.getValueStateMessageId=function(){return this.getId()+"-message";};u.prototype.getValueStateMessage=function(){return this._oValueStateMessage;};u.prototype.openValueStateMessage=function(){var v=this.getValueStateMessage();if(v&&!this._bValueStateMessageOpened){this._bValueStateMessageOpened=true;v.open();}};u.prototype.closeValueStateMessage=function(){var v=this.getValueStateMessage();if(v&&this._bValueStateMessageOpened){this._bValueStateMessageOpened=false;v.close();}};u.prototype.shouldValueStateMessageBeOpened=function(){return(this.getValueState()!==q.None)&&this.getEnabled()&&this.getEditable()&&!this._bValueStateMessageOpened;};u.prototype.setShowSecondaryValues=function(A){var e=!this._isShadowListRequired();this.setProperty("showSecondaryValues",A,e);var i=this.getList();if(i){i.setShowSecondaryValues(A);}return this;};u.prototype.addItem=function(i){this.addAggregation("items",i);if(i){i.attachEvent("_change",this.onItemChange,this);}return this;};u.prototype.insertItem=function(i,e){this.insertAggregation("items",i,e);if(i){i.attachEvent("_change",this.onItemChange,this);}return this;};u.prototype.findAggregatedObjects=function(){var e=this.getList();if(e){return S.prototype.findAggregatedObjects.apply(e,arguments);}return[];};u.prototype.getItems=function(){var e=this.getList();return e?e.getItems():[];};u.prototype.setSelectedItem=function(i){if(typeof i==="string"){this.setAssociation("selectedItem",i,true);i=C.byId(i);}if(!(i instanceof f)&&i!==null){return this;}if(!i){i=this.getDefaultSelectedItem();}this.setSelection(i);this.setValue(this._getSelectedItemText(i));this._oSelectionOnFocus=i;return this;};u.prototype.setSelectedItemId=function(i){i=this.validateProperty("selectedItemId",i);if(!i){i=this.getDefaultSelectedItem();}this.setSelection(i);this.setValue(this._getSelectedItemText());this._oSelectionOnFocus=this.getSelectedItem();return this;};u.prototype._isKeyAvailable=function(e){var A=this._oList.getItems().map(function(i){return i.getKey();});return A.indexOf(e)>-1;};u.prototype.setSelectedKey=function(e){e=this.validateProperty("selectedKey",e);var i=(e==="");if(!i&&!this._isKeyAvailable(e)&&this.getResetOnMissingKey()){i=true;}if(!this.getForceSelection()&&i){this.setSelection(null);this.setValue("");return this.setProperty("selectedKey",e);}var v=this.getItemByKey(e);if(v||i){if(!v&&i){v=this.getDefaultSelectedItem();}this.setSelection(v);this.setValue(this._getSelectedItemText(v));this._oSelectionOnFocus=v;return this;}return this.setProperty("selectedKey",e);};u.prototype.setValueState=function(v){var O=this.getValueState();this.setProperty("valueState",v,true);v=this.getValueState();if(v===O){return this;}this._updatePickerAriaLabelledBy(v);var e=this.getDomRefForValueState();if(!e){return this;}var i=q;if(v===i.Error){e.setAttribute("aria-invalid",true);}else{e.removeAttribute("aria-invalid");}if(!this.isOpen()&&this.shouldValueStateMessageBeOpened()&&document.activeElement===e){this.openValueStateMessage();}else{this.closeValueStateMessage();}this.updateValueStateClasses(v,O);this.updateAriaLabelledBy(v,O);this._updatePickerValueStateContentText();this._updatePickerValueStateContentStyles();return this;};u.prototype.setValueStateText=function(v){this.setProperty("valueStateText",v,true);if(this.getDomRefForValueState()){this._updatePickerValueStateContentText();this._updatePickerValueStateContentStyles();}return this;};u.prototype.getItemAt=function(i){return this.getItems()[+i]||null;};u.prototype.getSelectedItem=function(){var v=this.getAssociation("selectedItem");return(v===null)?null:C.byId(v)||null;};u.prototype.getFirstItem=function(){return this.getItems()[0]||null;};u.prototype.getLastItem=function(){var i=this.getItems();return i[i.length-1]||null;};u.prototype.getEnabledItems=function(i){var e=this.getList();return e?e.getEnabledItems(i):[];};u.prototype.getItemByKey=function(e){var i=this.getList();return i?i.getItemByKey(e):null;};u.prototype.removeItem=function(i){var e;i=this.removeAggregation("items",i);if(this.getItems().length===0){this.clearSelection();}else if(this.isItemSelected(i)){e=this.findFirstEnabledItem();if(e){this.setSelection(e);}}this.setValue(this._getSelectedItemText());if(i){i.detachEvent("_change",this.onItemChange,this);}return i;};u.prototype.removeAllItems=function(){var e=this.removeAllAggregation("items");this.setValue("");if(this._isShadowListRequired()){this.$().find(".sapMSelectListItemBase").remove();}for(var i=0;i<e.length;i++){e[i].detachEvent("_change",this.onItemChange,this);}return e;};u.prototype.destroyItems=function(){this.destroyAggregation("items");this.setValue("");if(this._isShadowListRequired()){this.$().find(".sapMSelectListItemBase").remove();}return this;};u.prototype.isOpen=function(){var e=this.getAggregation("picker");return!!(e&&e.isOpen());};u.prototype.close=function(){var e=this.getAggregation("picker");if(e){e.close();}return this;};u.prototype.getDomRefForValueState=function(){return this.getDomRef();};u.prototype.getAccessibilityInfo=function(){var i=this.getType()==="IconOnly",e={role:this.getRenderer().getAriaRole(this),focusable:this.getEnabled(),enabled:this.getEnabled(),readonly:i?undefined:this.getEnabled()&&!this.getEditable()};if(i){var v=this.getTooltip_AsString();if(!v){var w=b.getIconInfo(this.getIcon());v=w&&w.text?w.text:"";}e.type=C.getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_BUTTON");e.description=v;}else if(this.getType()==="Default"){e.type=C.getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_COMBO");e.description=this._getSelectedItemText();}return e;};u.prototype.getIdForLabel=function(){return this.getId()+"-hiddenSelect";};return u;});
