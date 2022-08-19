/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/URI'],function(U){"use strict";var R={getResourceOriginPath:function(p){var c,o,u=U(p);if(u&&u.is("absolute")){return p;}c=window['sap-ui-documentation-config'];o=(c&&c.demoKitResourceOrigin)||'.';return o+this._formatPath(p);},_formatPath:function(p){p=p.replace(/^\.\//,'/');if(!p.match(/^\//)){p="/"+p;}return p;}};return R;},true);
