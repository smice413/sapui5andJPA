/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/DataType","sap/ui/Global","sap/ui/core/library","sap/m/library","sap/f/library"],function(D){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.integration",version:"1.84.7",dependencies:["sap.ui.core","sap.f","sap.m"],types:["sap.ui.integration.CardActionType","sap.ui.integration.CardDataMode","sap.ui.integration.CardMenuAction"],controls:["sap.ui.integration.widgets.Card","sap.ui.integration.cards.Header","sap.ui.integration.cards.NumericHeader","sap.ui.integration.controls.ListContentItem"],elements:["sap.ui.integration.Host"],customElements:{"card":"sap/ui/integration/customElements/CustomElementCard"}});var t=sap.ui.integration;t.CardActionType={Navigation:"Navigation",Submit:"Submit",Custom:'Custom'};t.CardDataMode={Active:"Active",Inactive:"Inactive"};t.AreaType={None:'None',ContentItem:'ContentItem',Content:'Content',Header:'Header'};t.CardMenuAction=D.createType("sap.ui.integration.CardMenuAction",{isValid:function(v){var p=["type","text","icon","tooltip","buttonType","enabled","visible","action","parameters","target","url"];return Object.keys(v).every(function(k){return p.indexOf(k)!==-1;});}},"object");return t;});
