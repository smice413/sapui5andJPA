/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/ui/documentation/sdk/controller/BaseController","sap/base/Log","sap/ui/documentation/sdk/model/formatter"],function(D,B,L,f){"use strict";return B.extend("sap.ui.documentation.sdk.controller.Tools",{formatter:f,onInit:function(){B.prototype.onInit.call(this);this._onOrientationChange({landscape:D.orientation.landscape});this.getRouter().getRoute("tools").attachPatternMatched(this._onMatched,this);},onBeforeRendering:function(){this._deregisterOrientationChange();},onAfterRendering:function(){this._registerOrientationChange();},onExit:function(){this._deregisterOrientationChange();},_onMatched:function(){try{this.hideMasterSide();}catch(e){L.error(e);}}});});
