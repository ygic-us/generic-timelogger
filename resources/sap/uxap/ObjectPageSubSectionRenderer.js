/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(function(){"use strict";var O={apiVersion:2};O.render=function(r,c){var a,h,s,H,b,u,d,A=sap.ui.getCore().getConfiguration().getAccessibility();if(!c.getVisible()||!c._getInternalVisible()){return;}a=c.getActions()||[];b=a.length>0;s=c.getShowTitle();h=(c._getInternalTitleVisible()&&(c.getTitle().trim()!==""))&&s;H=h||b;d=c._hasVisibleActions();r.openStart("div",c).attr("role","region").style("height",c._getHeight());if(c._bBlockHasMore){r.class("sapUxAPObjectPageSubSectionWithSeeMore");}r.class("sapUxAPObjectPageSubSection").class("ui-helper-clearfix");if(A){if(h){r.attr("aria-labelledby",c.getId()+"-headerTitle");}else{r.attr("aria-label",sap.uxap.ObjectPageSubSection._getLibraryResourceBundle().getText("SUBSECTION_CONTROL_NAME"));}}r.openEnd();if(H){r.openStart("div",c.getId()+"-header").class("sapUxAPObjectPageSubSectionHeader");if(!h&&!d){r.class("sapUiHidden");}u=c._getUseTitleOnTheLeft();if(u){r.class("titleOnLeftLayout");}r.openEnd();r.openStart("div",c.getId()+"-headerTitle");if(h){r.attr("role","heading").attr("aria-level",c._getARIALevel());}r.class('sapUxAPObjectPageSubSectionHeaderTitle');if(c.getTitleUppercase()){r.class("sapUxAPObjectPageSubSectionHeaderTitleUppercase");}r.attr("data-sap-ui-customfastnavgroup",true).openEnd();if(h){r.text(c.getTitle());}r.close("div");if(b){r.openStart("div").class('sapUxAPObjectPageSubSectionHeaderActions').attr("data-sap-ui-customfastnavgroup",true).openEnd();a.forEach(r.renderControl,r);r.close("div");}r.close("div");}r.openStart("div").class("ui-helper-clearfix").class("sapUxAPBlockContainer");if(c._isHidden){r.style("display","none");}r.openEnd();r.renderControl(c._getGrid());r.close("div");r.openStart("div").class("sapUxAPSubSectionSeeMoreContainer");if(c._isHidden){r.style("display","none");}r.openEnd();r.renderControl(c._getSeeMoreButton());r.renderControl(c._getSeeLessButton());r.close("div");r.close("div");};return O;},true);
