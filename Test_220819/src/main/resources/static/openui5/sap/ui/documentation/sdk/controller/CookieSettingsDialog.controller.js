/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/documentation/sdk/controller/BaseController","	sap/ui/documentation/sdk/model/formatter","sap/m/library","sap/ui/model/json/JSONModel","sap/ui/core/Fragment","sap/ui/core/Core"],function(B,g,m,J,F,C){"use strict";return B.extend("sap.ui.documentation.sdk.controller.CookieSettingsDialog",{formatter:g,constructor:function(){this._oConfigUtil=null;this._oRootView=null;this._oModel=new J({showCookieDetails:false,allowShowHideCookieDetails:true});},openCookieSettingsDialog:function(c,r){if(this._oCookieSettingsDialog){this._oCookieSettingsDialog.open();}else{this._initData(c,r);F.load({name:"sap.ui.documentation.sdk.view.CookieSettingsDialog",controller:this}).then(this._initDialog.bind(this)).then(function(d){this._oCookieSettingsDialog=d;this._oCookieSettingsDialog.open();}.bind(this));}},_initDialog:function(d){var i;d.setModel(this._oModel,"cookieData");this._oRootView.addDependent(d);d.attachBeforeOpen(function(){i=this._bAlreadyRequestedCookiesApproval;this._oModel.setProperty("/showCookieDetails",i);this._oCookieSettingsDialog.toggleStyleClass("cookiesDetailedView",i);this._oModel.setProperty("/allowShowHideCookieDetails",!i);},this);d.attachAfterOpen(function(){C.byId("btnSetPreferences").$().focus();});if(!this._bAlreadyRequestedCookiesApproval){d.attachEventOnce("afterClose",function(){this._bAlreadyRequestedCookiesApproval=true;this._oConfigUtil.setCookie(this._oConfigUtil.COOKIE_NAMES.APPROVAL_REQUESTED,"1");},this);}return d;},onAcceptAllCookies:function(){this._saveCookiePreference(this._oCookieNames.ALLOW_REQUIRED_COOKIES,true);this._saveCookiePreference(this._oCookieNames.ALLOW_USAGE_TRACKING,true);this._oCookieSettingsDialog.close();},onRejectAllCookies:function(){this._saveCookiePreference(this._oCookieNames.ALLOW_REQUIRED_COOKIES,false);this._saveCookiePreference(this._oCookieNames.ALLOW_USAGE_TRACKING,false);this._oCookieSettingsDialog.close();},onSaveCookies:function(){var h=C.byId("requiredCookiesSwitch").getState(),H=C.byId("functionalCookiesSwitch").getState();this._saveCookiePreference(this._oCookieNames.ALLOW_REQUIRED_COOKIES,h);this._saveCookiePreference(this._oCookieNames.ALLOW_USAGE_TRACKING,H);this._oCookieSettingsDialog.close();},showCookieDetails:function(){this._oModel.setProperty("/showCookieDetails",true);this._oCookieSettingsDialog.addStyleClass("cookiesDetailedView");this._focusButton(C.byId("btnSavePreferences"));},hideCookieDetails:function(){this._oModel.setProperty("/showCookieDetails",false);this._oCookieSettingsDialog.removeStyleClass("cookiesDetailedView");this._focusButton(C.byId("btnSetPreferences"));},onCancelEditCookies:function(){this._oCookieSettingsDialog.close();C.byId("requiredCookiesSwitch").setState(this._oConfigUtil.getCookieValue(this._oCookieNames.ALLOW_REQUIRED_COOKIES)==="1");C.byId("functionalCookiesSwitch").setState(this._oConfigUtil.getCookieValue(this._oCookieNames.ALLOW_USAGE_TRACKING)==="1");},_saveCookiePreference:function(c,e){var v=e?"1":"0";if((c===this._oCookieNames.ALLOW_USAGE_TRACKING)&&e&&this._oConfigUtil.getCookieValue(this._oCookieNames.ALLOW_USAGE_TRACKING)!=="1"){this._oConfigUtil.enableUsageTracking();}this._oConfigUtil.setCookie(c,v);this._oModel.setProperty("/"+c,v);},_initData:function(c,r){this._oConfigUtil=c;this._oRootView=r;this._oCookieNames=this._oConfigUtil.COOKIE_NAMES;this._bAlreadyRequestedCookiesApproval=this._oConfigUtil.getCookieValue(this._oCookieNames.APPROVAL_REQUESTED)==="1";this._setInitialCookieValues();},_setInitialCookieValues:function(){var d={};if(!this._bAlreadyRequestedCookiesApproval){d[this._oCookieNames.ALLOW_REQUIRED_COOKIES]="1";d[this._oCookieNames.ALLOW_USAGE_TRACKING]="1";}else{d[this._oCookieNames.ALLOW_REQUIRED_COOKIES]=this._oConfigUtil.getCookieValue(this._oCookieNames.ALLOW_REQUIRED_COOKIES);d[this._oCookieNames.ALLOW_USAGE_TRACKING]=this._oConfigUtil.getCookieValue(this._oCookieNames.ALLOW_USAGE_TRACKING);}this._oModel.setData(d,true);},_focusButton:function(b){if(b.$().length){b.$().focus();return;}b.addEventDelegate({"onAfterRendering":function(){b.$().focus();b.removeEventDelegate(this);}});}});});
