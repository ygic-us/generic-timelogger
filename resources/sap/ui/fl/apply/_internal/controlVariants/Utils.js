/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/includes","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/fl/Variant","sap/ui/fl/Utils"],function(i,J,V,U){"use strict";function g(A,c){if(!c){return undefined;}if(A.indexOf(c.getId())>-1){return c.getId();}return g(A,c.getParent());}var a={DEFAULT_AUTHOR:"SAP",VARIANT_TECHNICAL_PARAMETER:"sap-ui-fl-control-variant-id",compareVariants:function(v,o){if(v.content.content.title.toLowerCase()<o.content.content.title.toLowerCase()){return-1;}else if(v.content.content.title.toLowerCase()>o.content.content.title.toLowerCase()){return 1;}return 0;},getIndexToSortVariant:function(v,o){var s=v.length;v.some(function(e,b){if(a.compareVariants(o,e)<0){s=b;return true;}});return s;},createVariant:function(p){var v;var o;var s=p.variantSpecificData.content.variantManagementReference;if(s){var b=J.checkControlId(s,p.model.oAppComponent);if(!b){throw new Error("Generated ID attribute found - to offer flexibility a stable VariantManagement ID is needed to assign the changes to, but for this VariantManagement control the ID was generated by SAPUI5 "+s);}}p.variantSpecificData.content.reference=p.model.sFlexReference;p.variantSpecificData.content.packageName="$TMP";p.variantSpecificData.content.validAppVersions=U.getValidAppVersions(p.appVersion,p.variantSpecificData.developerMode,p.variantSpecificData.scenario);o=V.createInitialFileContent(p.variantSpecificData);v=new V(o);return v;},getRelevantVariantManagementControlId:function(c,v){var A={};var b=v.reduce(function(C,d){var o=sap.ui.getCore().byId(d);var f=o.getFor();f.forEach(function(e){A[e]=d;});return C.concat(f);},[]);var s=g(b,c);return A[s];}};return a;});
