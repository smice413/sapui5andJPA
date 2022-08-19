/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/core/mvc/Controller","sap/ui/core/library","sap/ui/rta/Utils","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/rta/plugin/iframe/urlCleaner"],function(L,C,c,U,F,a,u){"use strict";var V=c.ValueState;var _=["frameUrl"];var b=["frameWidth","frameHeight"];var d=["asNewSection","frameWidthUnit","frameHeightUnit"];return C.extend("sap.ui.rta.plugin.iframe.AddIFrameDialogController",{constructor:function(j,s){this._oJSONModel=j;this._importSettings(s);this._mParameterHashMap=this._buildParameterHashMap(s);},onValidationSuccess:function(e){e.getSource().setValueState(V.None);this._oJSONModel.setProperty("/areAllFieldsValid",this._areAllTextFieldsValid()&&this._areAllValueStateNones());},onValidationError:function(e){e.getSource().setValueState(V.Error);this._oJSONModel.setProperty("/areAllFieldsValid",false);this._setFocusOnInvalidInput();},onSizeUnitChange:function(){var w=sap.ui.getCore().byId("sapUiRtaAddIFrameDialog_WidthUnit").getSelectedKey();var h=sap.ui.getCore().byId("sapUiRtaAddIFrameDialog_HeightUnit").getSelectedKey();var i=sap.ui.getCore().byId("sapUiRtaAddIFrameDialog_PercentText");if(w!=="%"&&h!=="%"){i.addStyleClass("sapUiRtaAddIFrameDialogPercentText-invisible");}else{i.removeStyleClass("sapUiRtaAddIFrameDialogPercentText-invisible");}},onURLChange:function(){var p=this._oJSONModel.getProperty("/previewUrl/value");var f=this._oJSONModel.getProperty("/frameUrl/value");var P=sap.ui.getCore().byId("sapUiRtaAddIFrameDialog_PreviewButton");if(f===""&&p!==""){var i=sap.ui.getCore().byId("sapUiRtaAddIFrameDialog_PreviewFrame");i.setUrl("about:blank");this._oJSONModel.setProperty("/previewUrl/value",f);var o=sap.ui.getCore().byId("sapUiRtaAddIFrameDialog_PreviewLinkPanel");var e=o.getDependents()[0];o.setExpanded(false);e.setEnabled(false);P.setText(this._oJSONModel.getProperty("/text/showPreviewButton"));P.setType("Emphasized");}else if(f!==""&&p!==""){if(f===p){P.setText(this._oJSONModel.getProperty("/text/showPreviewButton"));P.setType("Default");}else{P.setText(this._oJSONModel.getProperty("/text/updatePreviewButton"));P.setType("Emphasized");}}},onSavePress:function(){if(this._areAllTextFieldsValid()&&this._areAllValueStateNones()){this._close(this._buildReturnedSettings());}else{this._setFocusOnInvalidInput();}},onShowPreview:function(e){var s=encodeURI(this._buildPreviewURL(this._buildReturnedURL()));var i=sap.ui.getCore().byId("sapUiRtaAddIFrameDialog_PreviewFrame");i.setUrl("about:blank");var p=sap.ui.getCore().byId("sapUiRtaAddIFrameDialog_PreviewLinkPanel");var P=p.getDependents()[0];if(s){P.setEnabled(true);}else{p.setExpanded(false);P.setEnabled(false);}try{this._oJSONModel.setProperty("/previewUrl/value",s);i.setUrl(s);e.getSource().setType("Default");}catch(E){L.error("Error previewing the URL: ",E);}},onParameterPress:function(e){var k=e.getSource().getBindingContext().getObject().key;this._oJSONModel.setProperty("/frameUrl/value",this._addURLParameter(k));},onSearch:function(e){var f=new F("label",a.Contains,e.getParameter("query"));var B=sap.ui.getCore().byId("sapUiRtaAddIFrameDialog_ParameterTable").getBinding("items");B.filter([f]);},_buildPreviewURL:function(e){return e.replace(/{(.*?)}/g,function(m){return this._mParameterHashMap[m];}.bind(this));},_addURLParameter:function(p){return this._buildReturnedURL()+p;},_buildReturnedURL:function(){return u(this._oJSONModel.getProperty("/frameUrl/value"));},_buildParameterHashMap:function(p){if(p&&p.parameters){return U.buildHashMapFromArray(p.parameters,"key","value");}return{};},onCancelPress:function(){this._close();},_close:function(s){var A=sap.ui.getCore().byId("sapUiRtaAddIFrameDialog");this._mSettings=s;A.close();},getSettings:function(){return this._mSettings;},_areAllValueStateNones:function(){var D=this._oJSONModel.getData();return _.concat(b).every(function(f){return D[f]["valueState"]===V.None;},this);},_areAllTextFieldsValid:function(){var j=this._oJSONModel;return _.reduce(function(A,f){var v="/"+f+"/value";var s;if(j.getProperty(v).trim()===""){s=V.Error;}else{s=V.None;}j.setProperty(v+"State",s);return A&&s===V.None;},true);},_buildReturnedSettings:function(){var s={};var D=this._oJSONModel.getData();_.concat(b,d).forEach(function(f){var v=D[f].value;if(f==="frameUrl"){v=u(v);}s[f]=v;});return s;},_importSettings:function(s){if(s){Object.keys(s).forEach(function(f){if(f==="frameWidth"||f==="frameHeight"){this._importIFrameSize(f,s[f]);}else{this._oJSONModel.setProperty("/"+f+"/value",s[f]);}},this);}},_importIFrameSize:function(f,s){var r=s.split(/(px|rem|%)/);if(r.length>=2){this._oJSONModel.setProperty("/"+f+"/value",parseFloat(r[0]));this._oJSONModel.setProperty("/"+f+"Unit/value",r[1]);}},_setFocusOnInvalidInput:function(){var D=this._oJSONModel.getData();return b.some(function(f){if(D[f]["valueState"]===V.Error){var e=sap.ui.getCore().byId(D[f]["id"]);e.focus();return true;}},this);}});});
