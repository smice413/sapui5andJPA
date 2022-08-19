/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/RegistrationDelegator","sap/ui/fl/Utils","sap/ui/fl/Layer","sap/ui/core/library","sap/m/library"],function(R,U,L){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.fl",version:"1.84.7",controls:["sap.ui.fl.variants.VariantManagement","sap.ui.fl.util.IFrame"],dependencies:["sap.ui.core","sap.m"],designtime:"sap/ui/fl/designtime/library.designtime",extensions:{flChangeHandlers:{"sap.ui.fl.util.IFrame":"sap/ui/fl/util/IFrame"},"sap.ui.support":{diagnosticPlugins:["sap/ui/fl/support/Flexibility"],publicRules:true}}});sap.ui.fl.Scenario={AppVariant:"APP_VARIANT",VersionedAppVariant:"VERSIONED_APP_VARIANT",AdaptationProject:"ADAPTATION_PROJECT",FioriElementsFromScratch:"FE_FROM_SCRATCH",UiAdaptation:"UI_ADAPTATION"};sap.ui.fl.Versions={Original:-1,Draft:0,UrlParameter:"sap-ui-fl-version"};sap.ui.fl.condenser={Classification:{LastOneWins:"lastOneWins",Reverse:"reverse",Move:"move",Create:"create",Destroy:"destroy"}};R.registerAll();function _(){var u=U.getUshellContainer();if(u){return u.getLogonSystem().isTrial();}return false;}if(_()){sap.ui.getCore().getConfiguration().setFlexibilityServices([{connector:"LrepConnector",url:"/sap/bc/lrep",layers:[]},{connector:"LocalStorageConnector",layers:[L.CUSTOMER,L.USER]}]);}return sap.ui.fl;});
