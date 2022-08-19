/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/VersionInfo','sap/base/Log','sap/base/assert','sap/base/util/ObjectPath'],function(V,L,a,O){"use strict";if(window.OpenAjax&&window.OpenAjax.hub){OpenAjax.hub.registerLibrary("sap","http://www.sap.com/","0.1",{});}var B;if(typeof window.sap!=="object"&&typeof window.sap!=="function"){window.sap={};}if(typeof window.sap.ui!=="object"){window.sap.ui={};}sap.ui=Object.assign(sap.ui,{version:"1.84.7",buildinfo:{lastchange:"",buildtime:"20210301-1903"}});var c=window["sap-ui-config"]||{};var s=0;if(c['xx-nosync']==='warn'||/(?:\?|&)sap-ui-xx-nosync=(?:warn)/.exec(window.location.search)){s=1;}if(c['xx-nosync']===true||c['xx-nosync']==='true'||/(?:\?|&)sap-ui-xx-nosync=(?:x|X|true)/.exec(window.location.search)){s=2;}sap.ui.getVersionInfo=function(o){if(o&&o.async){L.info("Do not use deprecated function 'sap.ui.getVersionInfo'. Use"+" 'sap/ui/VersionInfo' module's asynchronous .load function instead");}else{L.warning("Do not use deprecated function 'sap.ui.getVersionInfo' synchronously! Use"+" 'sap/ui/VersionInfo' module's asynchronous .load function instead","Deprecation",null,function(){return{type:"sap.ui.getVersionInfo",name:"Global"};});}return V._load(o);};sap.ui.namespace=function(n){a(false,"sap.ui.namespace is long time deprecated and shouldn't be used");return O.create(n);};sap.ui.lazyRequire=function(C,m,M){a(typeof C==="string"&&C,"lazyRequire: sClassName must be a non-empty string");a(!m||typeof m==="string","lazyRequire: sMethods must be empty or a string");if(s===2){L.error("[nosync] lazy stub creation ignored for '"+C+"'");return;}var f=C.replace(/\//gi,"\."),l=f.lastIndexOf("."),p=f.substr(0,l),b=f.substr(l+1),P=O.create(p),o=P[b],d=(m||"new").split(" "),i=d.indexOf("new");M=M||f;if(!o){if(i>=0){o=function(){if(s){if(s===1){L.error("[nosync] lazy stub for constructor '"+f+"' called");}}else{L.debug("lazy stub for constructor '"+f+"' called.");}sap.ui.requireSync(M.replace(/\./g,"/"));var r=P[b];a(typeof r==="function","lazyRequire: oRealClass must be a function after loading");if(r._sapUiLazyLoader){throw new Error("lazyRequire: stub '"+f+"'has not been replaced by module '"+M+"'");}var I=Object.create(r.prototype);if(!(this instanceof o)){B=B||sap.ui.require("sap/ui/base/Object");if(B&&I instanceof B){L.error("Constructor "+C+" has been called without \"new\" operator!",null,null,function(){try{throw new Error();}catch(e){return e;}});}}var R=r.apply(I,arguments);if(R&&(typeof R==="function"||typeof R==="object")){I=R;}return I;};o._sapUiLazyLoader=true;d.splice(i,1);}else{o={};}P[b]=o;}d.forEach(function(e){if(!o[e]){o[e]=function(){if(s){if(s===1){L.error("[no-sync] lazy stub for method '"+f+"."+e+"' called");}}else{L.debug("lazy stub for method '"+f+"."+e+"' called.");}sap.ui.requireSync(M.replace(/\./g,"/"));var r=P[b];a(typeof r==="function"||typeof r==="object","lazyRequire: oRealClass must be a function or object after loading");a(typeof r[e]==="function","lazyRequire: method must be a function");if(r[e]._sapUiLazyLoader){throw new Error("lazyRequire: stub '"+f+"."+e+"' has not been replaced by loaded module '"+M+"'");}return r[e].apply(r,arguments);};o[e]._sapUiLazyLoader=true;}});};sap.ui.lazyRequire._isStub=function(C){a(typeof C==="string"&&C,"lazyRequire._isStub: sClassName must be a non-empty string");var l=C.lastIndexOf("."),b=C.slice(0,l),p=C.slice(l+1),o=O.get(b||"");return!!(o&&typeof o[p]==="function"&&o[p]._sapUiLazyLoader);};sap.ui.resource=function(l,r){a(typeof l==="string","sLibraryName must be a string");a(typeof r==="string","sResourcePath must be a string");return sap.ui.require.toUrl((String(l).replace(/\./g,"/")+'/'+r).replace(/^\/*/,""));};sap.ui.localResources=function(n){a(n,"sNamespace must not be empty");var p={};p[n.replace(/\./g,"/")]="./"+n.replace(/\./g,"/");sap.ui.loader.config({paths:p});};return sap.ui;});
