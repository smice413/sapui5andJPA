/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/ui/base/ManagedObjectObserver','sap/ui/core/ResizeHandler','sap/ui/layout/library','./Form','./FormContainer','./FormElement','./FormLayout','./SimpleFormRenderer',"sap/base/Log","sap/ui/thirdparty/jquery"],function(C,M,R,l,F,a,b,c,S,L,q){"use strict";var B=l.BackgroundDesign;var d=l.form.SimpleFormLayout;var e;var f;var g;var G;var h;var m;var n;var o=C.extend("sap.ui.layout.form.SimpleForm",{metadata:{library:"sap.ui.layout",properties:{maxContainerCols:{type:"int",group:"Appearance",defaultValue:2},minWidth:{type:"int",group:"Appearance",defaultValue:-1},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},editable:{type:"boolean",group:"Misc",defaultValue:null},labelMinWidth:{type:"int",group:"Misc",defaultValue:192},layout:{type:"sap.ui.layout.form.SimpleFormLayout",group:"Misc",defaultValue:d.ResponsiveLayout},labelSpanXL:{type:"int",group:"Misc",defaultValue:-1},labelSpanL:{type:"int",group:"Misc",defaultValue:4},labelSpanM:{type:"int",group:"Misc",defaultValue:2},labelSpanS:{type:"int",group:"Misc",defaultValue:12},adjustLabelSpan:{type:"boolean",group:"Misc",defaultValue:true},emptySpanXL:{type:"int",group:"Misc",defaultValue:-1},emptySpanL:{type:"int",group:"Misc",defaultValue:0},emptySpanM:{type:"int",group:"Misc",defaultValue:0},emptySpanS:{type:"int",group:"Misc",defaultValue:0},columnsXL:{type:"int",group:"Misc",defaultValue:-1},columnsL:{type:"int",group:"Misc",defaultValue:2},columnsM:{type:"int",group:"Misc",defaultValue:1},singleContainerFullSize:{type:"boolean",group:"Misc",defaultValue:true},breakpointXL:{type:"int",group:"Misc",defaultValue:1440},breakpointL:{type:"int",group:"Misc",defaultValue:1024},breakpointM:{type:"int",group:"Misc",defaultValue:600},backgroundDesign:{type:"sap.ui.layout.BackgroundDesign",group:"Appearance",defaultValue:B.Translucent}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Element",multiple:true,singularName:"content"},form:{type:"sap.ui.layout.form.Form",multiple:false,visibility:"hidden"},title:{type:"sap.ui.core.Title",altTypes:["string"],multiple:false},toolbar:{type:"sap.ui.core.Toolbar",multiple:false}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},designtime:"sap/ui/layout/designtime/form/SimpleForm.designtime"}});o.prototype.init=function(){this._iMaxWeight=8;this._iLabelWeight=3;this._iCurrentWidth=0;var i=new F(this.getId()+"--Form");i.getTitle=function(){return this.getParent().getTitle();};i._origInvalidate=i.invalidate;i.invalidate=function(j){if(this.bOutput){this._origInvalidate(j);}if(this._bIsBeingDestroyed){return;}var k=this.getParent();if(k){k._formInvalidated(j);}};i.getAriaLabelledBy=function(){var j=this.getParent();if(j){return j.getAriaLabelledBy();}else{return null;}};i._origOnLayoutDataChange=i.onLayoutDataChange;i.onLayoutDataChange=function(j){this._origOnLayoutDataChange(j);var k=this.getParent();if(k){k._onLayoutDataChange(j);}};this.setAggregation("form",i);this._aElements=null;this._aLayouts=[];this._changedFormContainers=[];this._changedFormElements=[];this._oObserver=new M(W.bind(this));};o.prototype.exit=function(){var j=this.getAggregation("form");j.invalidate=j._origInvalidate;U.call(this);for(var i=0;i<this._aLayouts.length;i++){var k=sap.ui.getCore().byId(this._aLayouts[i]);if(k&&k.destroy){k.destroy();}}this._aLayouts=[];this._aElements=null;this._changedFormContainers=[];this._changedFormElements=[];this._oObserver.disconnect();this._oObserver=undefined;};o.prototype.onBeforeRendering=function(){U.call(this);var i=this.getAggregation("form");var j=this.getLayout();if((!this._bResponsiveLayoutRequested&&j===d.ResponsiveLayout)||(!this._bGridLayoutRequested&&j===d.GridLayout)||(!this._bResponsiveGridLayoutRequested&&j===d.ResponsiveGridLayout)||(!this._bColumnLayoutRequested&&j===d.ColumnLayout)){var k=true;if(!i.getLayout()){k=_.call(this);}if(k){x.call(this);}}};o.prototype.onAfterRendering=function(){if(this.getLayout()==d.ResponsiveLayout){this._bChangedByMe=true;this.$().css("visibility","hidden");this._applyLinebreaks();this._sResizeListenerId=R.register(this.getDomRef(),q.proxy(this._resize,this));this._bChangedByMe=false;}};o.prototype.setEditable=function(i){this._bChangedByMe=true;this.setProperty("editable",i,true);var j=this.getAggregation("form");j.setEditable(i);this._bChangedByMe=false;return this;};o.prototype.setToolbar=function(i){this._bChangedByMe=true;var j=this.getAggregation("form");j.setToolbar(i);this._bChangedByMe=false;return this;};o.prototype.getToolbar=function(){var i=this.getAggregation("form");return i.getToolbar();};o.prototype.destroyToolbar=function(){this._bChangedByMe=true;var i=this.getAggregation("form");i.destroyToolbar();this._bChangedByMe=false;return this;};o.prototype.setLabelMinWidth=function(j){this.setProperty("labelMinWidth",j,true);if(this.getLayout()==d.ResponsiveLayout){this._bLayoutDataChangedByMe=true;var k=this.getContent();for(var i=0;i<k.length;i++){var Y=k[i];if(Y.isA("sap.ui.core.Label")){var Z=A.call(this,Y);if(Z&&Z.isA("sap.ui.layout.ResponsiveFlowLayoutData")&&y.call(this,Z)){Z.setMinWidth(j);}}}this._bLayoutDataChangedByMe=false;}return this;};o.prototype.indexOfContent=function(j){var k=this._aElements;if(k){for(var i=0;i<k.length;i++){if(k[i]==j){return i;}}}return-1;};o.prototype.addContent=function(i){i=this.validateAggregation("content",i,true);if(this.indexOfContent(i)>=0){L.warning("SimpleForm.addContent: Content element '"+i+"' already assigned. Please remove before adding!",this);this.removeContent(i);}if(!this._aElements){this._aElements=[];}this._bChangedByMe=true;var j=this._aElements.length;var k;var Y=this.getAggregation("form");var Z;var $;var a1;var b1;if(i.isA(["sap.ui.core.Title","sap.ui.core.Toolbar"])){Z=P.call(this,i);Y.addFormContainer(Z);this._changedFormContainers.push(Z);}else if(i.isA("sap.ui.core.Label")){if(j>0){k=this._aElements[j-1];a1=k.getParent();if(a1 instanceof b){Z=a1.getParent();}else if(a1 instanceof a){Z=a1;}}if(!Z){Z=P.call(this);Y.addFormContainer(Z);this._changedFormContainers.push(Z);}$=K.call(this,Z,i);}else{if(j>0){k=this._aElements[j-1];a1=k.getParent();if(a1 instanceof b){Z=a1.getParent();$=a1;b1=A.call(this,i);if(b1&&b1.isA("sap.ui.layout.ResponsiveFlowLayoutData")&&!y.call(this,b1)&&b1.getLinebreak()){$=K.call(this,Z);}}else if(a1 instanceof a){Z=a1;$=K.call(this,Z);}}else{Z=P.call(this);Y.addFormContainer(Z);this._changedFormContainers.push(Z);$=K.call(this,Z);}E.call(this,i,5,false,true);$.addField(i);V(this._changedFormElements,$);}this._aElements.push(i);this._oObserver.observe(i,{properties:["visible"]});this.invalidate();this._bChangedByMe=false;return this;};o.prototype.insertContent=function(j,k){j=this.validateAggregation("content",j,true);if(this.indexOfContent(j)>=0){L.warning("SimpleForm.insertContent: Content element '"+j+"' already assigned. Please remove before insert!",this);this.removeContent(j);}if(!this._aElements){this._aElements=[];}var Y=this._aElements.length;var Z;if(k<0){Z=0;}else if(k>Y){Z=Y;}else{Z=k;}if(Z!==k){L.warning("SimpleForm.insertContent: index '"+k+"' out of range [0,"+Y+"], forced to "+Z);}if(Z==Y){this.addContent(j);return this;}this._bChangedByMe=true;var $=this._aElements[Z];var a1=this.getAggregation("form");var b1;var c1;var d1;var e1;var f1;var g1=0;var h1;var i1;var j1;var k1;var i=0;var l1;var m1;if(j.isA(["sap.ui.core.Title","sap.ui.core.Toolbar"])){if(k==0&&!($.isA(["sap.ui.core.Title","sap.ui.core.Toolbar"]))){b1=$.getParent().getParent();if(j.isA("sap.ui.core.Title")){b1.setTitle(j);}else{b1.setToolbar(j);}}else{b1=P.call(this,j);if($.isA(["sap.ui.core.Title","sap.ui.core.Toolbar"])){d1=$.getParent();f1=a1.indexOfFormContainer(d1);}else{e1=$.getParent();d1=e1.getParent();f1=a1.indexOfFormContainer(d1)+1;g1=d1.indexOfFormElement(e1);if(!$.isA("sap.ui.core.Label")){h1=e1.indexOfField($);if(h1>0||e1.getLabel()){c1=K.call(this,b1);this._changedFormElements.push(c1);V(this._changedFormElements,e1);i1=e1.getFields();for(i=h1;i<i1.length;i++){l1=i1[i];c1.addField(l1);}g1++;}}j1=d1.getFormElements();for(i=g1;i<j1.length;i++){b1.addFormElement(j1[i]);}}a1.insertFormContainer(b1,f1);}this._changedFormContainers.push(b1);}else if(j.isA("sap.ui.core.Label")){if($.isA(["sap.ui.core.Title","sap.ui.core.Toolbar"])){d1=$.getParent();f1=a1.indexOfFormContainer(d1);k1=a1.getFormContainers();if(f1==0){b1=P.call(this);a1.insertFormContainer(b1,f1);this._changedFormContainers.push(b1);}else{b1=k1[f1-1];}c1=K.call(this,b1,j);}else if($.isA("sap.ui.core.Label")){d1=$.getParent().getParent();g1=d1.indexOfFormElement($.getParent());c1=N.call(this,d1,j,g1);}else{e1=$.getParent();d1=e1.getParent();g1=d1.indexOfFormElement(e1)+1;h1=e1.indexOfField($);if(h1==0&&!e1.getLabel()){c1=e1;c1.setLabel(j);E.call(this,j,this._iLabelWeight,false,true,this.getLabelMinWidth());}else{c1=N.call(this,d1,j,g1);V(this._changedFormElements,e1);i1=e1.getFields();for(i=h1;i<i1.length;i++){l1=i1[i];c1.addField(l1);}}}this._changedFormElements.push(c1);}else{m1=A.call(this,j);if($.isA(["sap.ui.core.Title","sap.ui.core.Toolbar"])){d1=$.getParent();f1=a1.indexOfFormContainer(d1);if(f1==0){b1=P.call(this);a1.insertFormContainer(b1,f1);this._changedFormContainers.push(b1);}else{k1=a1.getFormContainers();b1=k1[f1-1];}j1=b1.getFormElements();if(j1.length==0){c1=K.call(this,b1);}else if(m1&&m1.isA("sap.ui.layout.ResponsiveFlowLayoutData")&&!y.call(this,m1)&&m1.getLinebreak()){c1=K.call(this,b1);}else{c1=j1[j1.length-1];}c1.addField(j);}else if($.isA("sap.ui.core.Label")){e1=$.getParent();b1=e1.getParent();g1=b1.indexOfFormElement(e1);if(g1==0){c1=N.call(this,b1,null,0);}else if(m1&&m1.isA("sap.ui.layout.ResponsiveFlowLayoutData")&&!y.call(this,m1)&&m1.getLinebreak()){c1=N.call(this,b1,null,g1);}else{j1=b1.getFormElements();c1=j1[g1-1];}c1.addField(j);}else{c1=$.getParent();h1=c1.indexOfField($);if(m1&&m1.isA("sap.ui.layout.ResponsiveFlowLayoutData")&&!y.call(this,m1)&&m1.getLinebreak()&&h1>0){b1=c1.getParent();g1=b1.indexOfFormElement(c1);V(this._changedFormElements,c1);i1=c1.getFields();c1=N.call(this,b1,undefined,g1+1);c1.addField(j);for(i=h1;i<i1.length;i++){l1=i1[i];c1.addField(l1);}}else{c1.insertField(j,h1);}}V(this._changedFormElements,c1);E.call(this,j,5,false,true);}this._aElements.splice(Z,0,j);this._oObserver.observe(j,{properties:["visible"]});this.invalidate();this._bChangedByMe=false;return this;};o.prototype.removeContent=function(j){var k=null;var Y=-1;var i=0;if(this._aElements){if(typeof(j)=="string"){j=sap.ui.getCore().byId(j);}if(typeof(j)=="object"){for(i=0;i<this._aElements.length;i++){if(this._aElements[i]==j){j=i;break;}}}if(typeof(j)=="number"){if(j<0||j>=this._aElements.length){L.warning("Element.removeAggregation called with invalid index: Items, "+j);}else{Y=j;k=this._aElements[Y];}}}if(k){this._bChangedByMe=true;var Z=this.getAggregation("form");var $;var a1;var b1;var c1;if(k.isA(["sap.ui.core.Title","sap.ui.core.Toolbar"])){$=k.getParent();$.setTitle(null);$.setToolbar(null);if(Y>0){b1=$.getFormElements();var d1=Z.indexOfFormContainer($);var e1=Z.getFormContainers()[d1-1];if(b1.length>0&&!b1[0].getLabel()){var f1=e1.getFormElements();var g1=f1[f1.length-1];c1=b1[0].getFields();for(i=0;i<c1.length;i++){g1.addField(c1[i]);}V(this._changedFormElements,g1);$.removeFormElement(b1[0]);b1[0].destroy();b1.splice(0,1);}for(i=0;i<b1.length;i++){e1.addFormElement(b1[i]);}V(this._changedFormContainers,e1);Z.removeFormContainer($);$.destroy();}else if($.getFormElements().length==0){Z.removeFormContainer($);$.destroy();}}else if(k.isA("sap.ui.core.Label")){a1=k.getParent();$=a1.getParent();a1.setLabel(null);var h1=$.indexOfFormElement(a1);if(h1==0){if(a1.getFields().length==0){$.removeFormElement(a1);a1.destroy();if($.getFormElements().length==0&&!$.getTitle()&&!$.getToolbar()){Z.removeFormContainer($);$.destroy();}}else{V(this._changedFormElements,a1);}}else{b1=$.getFormElements();var i1=b1[h1-1];c1=a1.getFields();for(i=0;i<c1.length;i++){i1.addField(c1[i]);}V(this._changedFormElements,i1);$.removeFormElement(a1);a1.destroy();}}else{a1=k.getParent();a1.removeField(k);if(a1.getFields().length==0&&!a1.getLabel()){$=a1.getParent();$.removeFormElement(a1);a1.destroy();if($.getFormElements().length==0&&!$.getTitle()&&!$.getToolbar()){Z.removeFormContainer($);$.destroy();}}else{V(this._changedFormElements,a1);}}this._aElements.splice(Y,1);k.setParent(null);this._oObserver.unobserve(k);J.call(this,k);this.invalidate();this._bChangedByMe=false;return k;}return null;};o.prototype.removeAllContent=function(){var i=0;if(this._aElements){this._bChangedByMe=true;var k=this.getAggregation("form");var Y=k.getFormContainers();for(i=0;i<Y.length;i++){var Z=Y[i];Z.setTitle(null);Z.setToolbar(null);var $=Z.getFormElements();for(var j=0;j<$.length;j++){var a1=$[j];a1.setLabel(null);a1.removeAllFields();}Z.destroyFormElements();}k.destroyFormContainers();for(i=0;i<this._aElements.length;i++){var b1=this._aElements[i];J.call(this,b1);this._oObserver.unobserve(b1);}var c1=this._aElements;this._aElements=null;this.invalidate();this._bChangedByMe=false;return c1;}else{return[];}};o.prototype.destroyContent=function(){var j=this.removeAllContent();if(j){this._bChangedByMe=true;for(var i=0;i<j.length;i++){j[i].destroy();}this.invalidate();this._bChangedByMe=false;}return this;};o.prototype.getContent=function(){if(!this._aElements){this._aElements=this.getAggregation("content",[]);}return this._aElements.slice();};o.prototype.setLayout=function(i){var j=this.getLayout();if(i!=j){v.call(this);}this.setProperty("layout",i);if(i!=j){var k=_.call(this);if(k){w.call(this);}}return this;};o.prototype.clone=function(k){this._bChangedByMe=true;var Y=C.prototype.clone.apply(this,arguments);var Z=this.getContent();for(var i=0;i<Z.length;i++){var $=Z[i];var a1=$.getLayoutData();this._oObserver.unobserve($);var b1=$.clone(k);this._oObserver.observe($,{properties:["visible"]});if(a1){if(a1.isA("sap.ui.core.VariantLayoutData")){var c1=a1.getMultipleLayoutData();for(var j=0;j<c1.length;j++){if(y.call(this,c1[j])){Y._aLayouts.push(b1.getLayoutData().getMultipleLayoutData()[j].getId());}}}else if(y.call(this,a1)){Y._aLayouts.push(b1.getLayoutData().getId());}}Y.addContent(b1);}this._bChangedByMe=false;return Y;};function _(){var i=this.getAggregation("form");if(i.getLayout()){this._bChangedByMe=true;i.destroyLayout();U.call(this);this._bChangedByMe=false;}var j;switch(this.getLayout()){case d.ResponsiveLayout:if((!e||!f)&&!this._bResponsiveLayoutRequested){e=sap.ui.require("sap/ui/layout/form/ResponsiveLayout");f=sap.ui.require("sap/ui/layout/ResponsiveFlowLayoutData");if(!e||!f){sap.ui.require(["sap/ui/layout/form/ResponsiveLayout","sap/ui/layout/ResponsiveFlowLayoutData"],p.bind(this));this._bResponsiveLayoutRequested=true;}}if(e&&f){j=new e(this.getId()+"--Layout");}break;case d.GridLayout:if((!G||!h||!m)&&!this._bGridLayoutRequested){G=sap.ui.require("sap/ui/layout/form/GridLayout");h=sap.ui.require("sap/ui/layout/form/GridContainerData");m=sap.ui.require("sap/ui/layout/form/GridElementData");if(!G||!h||!m){sap.ui.require(["sap/ui/layout/form/GridLayout","sap/ui/layout/form/GridContainerData","sap/ui/layout/form/GridElementData"],r.bind(this));this._bGridLayoutRequested=true;}}if(G&&h&&m){j=new G(this.getId()+"--Layout");}break;case d.ResponsiveGridLayout:if(!g&&!this._bResponsiveGridLayoutRequested){g=sap.ui.require("sap/ui/layout/form/ResponsiveGridLayout");if(!g){sap.ui.require(["sap/ui/layout/form/ResponsiveGridLayout"],s.bind(this));this._bResponsiveGridLayoutRequested=true;}}if(g){j=new g(this.getId()+"--Layout");}break;case d.ColumnLayout:if(!n&&!this._bColumnLayoutRequested){n=sap.ui.require("sap/ui/layout/form/ColumnLayout");if(!n){sap.ui.require(["sap/ui/layout/form/ColumnLayout"],t.bind(this));this._bColumnLayoutRequested=true;}}if(n){j=new n(this.getId()+"--Layout");}break;}if(j){this._bChangedByMe=true;i.setLayout(j);this._bChangedByMe=false;return true;}return false;}function p(i,j){e=i;f=j;this._bResponsiveLayoutRequested=false;if(this.getLayout()==d.ResponsiveLayout){u.call(this);}}function r(i,j,k){G=i;h=j;m=k;this._bGridLayoutRequested=false;if(this.getLayout()==d.GridLayout){u.call(this);}}function s(i){g=i;this._bResponsiveGridLayoutRequested=false;if(this.getLayout()==d.ResponsiveGridLayout){u.call(this);}}function t(i){n=i;this._bColumnLayoutRequested=false;if(this.getLayout()==d.ColumnLayout){u.call(this);}}function u(){if(!this._bIsBeingDestroyed){_.call(this);w.call(this);if(this.getDomRef()){x.call(this);}}}function v(){this._bChangedByMe=true;var Y=this.getAggregation("form");var Z=Y.getFormContainers();for(var i=0;i<Z.length;i++){var $=Z[i];V(this._changedFormContainers,$);if($.getLayoutData()){$.destroyLayoutData();}var a1=$.getFormElements();for(var j=0;j<a1.length;j++){var b1=a1[j];V(this._changedFormElements,b1);if(b1.getLayoutData()){b1.destroyLayoutData();}var c1=b1.getLabel();if(c1){J.call(this,c1);}var d1=b1.getFields();for(var k=0;k<d1.length;k++){var e1=d1[k];J.call(this,e1);}}}this._bChangedByMe=false;}function w(){this._bChangedByMe=true;var Y=this.getAggregation("form");var Z=Y.getFormContainers();for(var i=0;i<Z.length;i++){var $=Z[i];V(this._changedFormContainers,$);I.call(this,$);var a1=$.getFormElements();for(var j=0;j<a1.length;j++){var b1=a1[j];V(this._changedFormElements,b1);H.call(this,b1);var c1=b1.getLabel();if(c1){E.call(this,c1,this._iLabelWeight,false,true,this.getLabelMinWidth());}var d1=b1.getFields();for(var k=0;k<d1.length;k++){var e1=d1[k];E.call(this,e1,5,false,true);}}}this._bChangedByMe=false;}function x(){this._bChangedByMe=true;this._changedFormContainers=[];var j=this.getLayout();var k=this.getAggregation("form").getLayout();k.setBackgroundDesign(this.getBackgroundDesign());switch(j){case d.ResponsiveLayout:this._applyLinebreaks();for(var i=0;i<this._changedFormElements.length;i++){var Y=this._changedFormElements[i];Q.call(this,Y);}break;case d.GridLayout:T.call(this);break;case d.ResponsiveGridLayout:k.setLabelSpanXL(this.getLabelSpanXL());k.setLabelSpanL(this.getLabelSpanL());k.setLabelSpanM(this.getLabelSpanM());k.setLabelSpanS(this.getLabelSpanS());k.setAdjustLabelSpan(this.getAdjustLabelSpan());k.setEmptySpanXL(this.getEmptySpanXL());k.setEmptySpanL(this.getEmptySpanL());k.setEmptySpanM(this.getEmptySpanM());k.setEmptySpanS(this.getEmptySpanS());k.setColumnsXL(this.getColumnsXL());k.setColumnsL(this.getColumnsL());k.setColumnsM(this.getColumnsM());k.setSingleContainerFullSize(this.getSingleContainerFullSize());k.setBreakpointXL(this.getBreakpointXL());k.setBreakpointL(this.getBreakpointL());k.setBreakpointM(this.getBreakpointM());break;case d.ColumnLayout:k.setColumnsXL(this.getColumnsXL()>0?this.getColumnsXL():this.getColumnsL());k.setColumnsL(this.getColumnsL());k.setColumnsM(this.getColumnsM());k.setLabelCellsLarge(this.getLabelSpanL());k.setEmptyCellsLarge(this.getEmptySpanL());break;}this._changedFormElements=[];this._bChangedByMe=false;}function y(i){var j=i.getId(),k=" "+this._aLayouts.join(" ")+" ";return k.indexOf(" "+j+" ")>-1;}function z(i,j,k,Y){var Z=new f({weight:i,linebreak:j===true,linebreakable:k===true});if(Y){Z.setMinWidth(Y);}this._aLayouts.push(Z.getId());return Z;}function A(i){var j;switch(this.getLayout()){case d.ResponsiveLayout:j=c.prototype.getLayoutDataForElement(i,"sap.ui.layout.ResponsiveFlowLayoutData");break;case d.GridLayout:j=c.prototype.getLayoutDataForElement(i,"sap.ui.layout.form.GridElementData");break;case d.ResponsiveGridLayout:j=c.prototype.getLayoutDataForElement(i,"sap.ui.layout.GridData");break;case d.ColumnLayout:j=c.prototype.getLayoutDataForElement(i,"sap.ui.layout.form.ColumnElementData");break;}return j;}function D(){var i=this.getLayout();if((i===d.ResponsiveLayout&&this._bResponsiveLayoutRequested)||(i===d.GridLayout&&this._bGridLayoutRequested)||(i===d.ResponsiveGridLayout&&this._bResponsiveGridLayoutRequested)||(i===d.ColumnLayout&&this._bColumnLayoutRequested)){return false;}if(!this.getAggregation("form").getLayout()){var j=this._bChangedByMe;var k=_.call(this);this._bChangedByMe=j;if(!k){return false;}}return true;}function E(i,j,k,Y,Z){if(this.getLayout()!=d.ResponsiveLayout){return;}if(!D.call(this)){return;}this._bLayoutDataChangedByMe=true;var $=A.call(this,i);if(!$||!y.call(this,$)){$=i.getLayoutData();if($&&$.isA("sap.ui.core.VariantLayoutData")){$.addMultipleLayoutData(z.call(this,j,k,Y,Z));}else if(!$){i.setLayoutData(z.call(this,j,k,Y,Z));}else{L.warning("ResponsiveFlowLayoutData can not be set on Field "+i.getId(),"_createFieldLayoutData","SimpleForm");}}this._bLayoutDataChangedByMe=false;}function H(i){if(this.getLayout()!=d.ResponsiveLayout){return;}if(!D.call(this)){return;}this._bLayoutDataChangedByMe=true;i.setLayoutData(new f({linebreak:true,margin:false}));this._bLayoutDataChangedByMe=false;}function I(i){var j=this.getLayout();if(j!=d.ResponsiveLayout&&j!=d.GridLayout){return;}if(!D.call(this)){return;}this._bLayoutDataChangedByMe=true;switch(j){case d.ResponsiveLayout:i.setLayoutData(new f({minWidth:280}));break;case d.GridLayout:if(this.getMaxContainerCols()>1){i.setLayoutData(new h({halfGrid:true}));}else{i.setLayoutData(new h({halfGrid:false}));}break;}this._bLayoutDataChangedByMe=false;}function J(j){this._bLayoutDataChangedByMe=true;var k=A.call(this,j);if(k){var Y=k.getId();for(var i=0;i<this._aLayouts.length;i++){var Z=this._aLayouts[i];if(Y==Z){k.destroy();this._aLayouts.splice(i,1);break;}}}this._bLayoutDataChangedByMe=false;}function K(i,j){var k=O.call(this,j);i.addFormElement(k);return k;}function N(i,j,k){var Y=O.call(this,j);i.insertFormElement(Y,k);return Y;}function O(j){var k=new b();H.call(this,k);if(j){j.addStyleClass("sapUiFormLabel-CTX");k.setLabel(j);if(!A.call(this,j)){E.call(this,j,this._iLabelWeight,false,true,this.getLabelMinWidth());}}k.isVisible=function(){var Y=this.getFields();var Z=false;for(var i=0;i<Y.length;i++){var $=Y[i];if($.getVisible()){Z=true;break;}}return Z;};return k;}function P(i){var j=new a();I.call(this,j);j.getAriaLabelledBy=function(){var k=this.getToolbar();if(k){return k.getAriaLabelledBy();}else{return[];}};if(i){if(i.isA("sap.ui.core.Title")){j.setTitle(i);}else if(i.isA("sap.ui.core.Toolbar")){j.setToolbar(i);}}return j;}function Q(j){var k=this._iMaxWeight;var Y=j.getFields();var Z;var $=Y.length;var a1=j.getLabel();var b1;var i=0;this._bLayoutDataChangedByMe=true;if(a1&&A.call(this,a1)){k=k-A.call(this,a1).getWeight();}for(i=0;i<Y.length;i++){Z=Y[i];b1=A.call(this,Z);if(b1&&b1.isA("sap.ui.layout.ResponsiveFlowLayoutData")&&!y.call(this,b1)){k=k-b1.getWeight();$--;}}var c1=Math.floor(k/$);var d1=k%$;for(i=0;i<Y.length;i++){Z=Y[i];b1=A.call(this,Z);var e1=c1;if(!b1){E.call(this,Z,e1,false,i==0);}else if(y.call(this,b1)&&b1.isA("sap.ui.layout.ResponsiveFlowLayoutData")){if(d1>0){e1++;d1--;}b1.setWeight(e1);}}this._bLayoutDataChangedByMe=false;}o.prototype._applyLinebreaks=function(){if(!e||this._bResponsiveLayoutRequested){return;}this._bLayoutDataChangedByMe=true;var j=this.getAggregation("form"),k=j.getFormContainers();var Y=this.getDomRef();var Z=this.$();for(var i=1;i<k.length;i++){var $=k[i],a1=$.getLayoutData();if(!Y||Z.outerWidth(true)>this.getMinWidth()){if(i%this.getMaxContainerCols()==0){a1.setLinebreak(true);}else{a1.setLinebreak(false);}}else{a1.setLinebreak(true);}}if(Y&&Z.css("visibility")=="hidden"){var b1=this;setTimeout(function(){if(b1.getDomRef()){b1.$().css("visibility","");}},10);}this._bLayoutDataChangedByMe=false;};function T(){this._bLayoutDataChangedByMe=true;var j=this.getAggregation("form");var k=j.getFormContainers();var Y=k.length;for(var i=0;i<Y;i++){var Z=k[i];if((this.getMaxContainerCols()<=1)||((i==Y-1)&&(Y%2>0))){Z.getLayoutData().setHalfGrid(false);}else if(!Z.getLayoutData().getHalfGrid()){Z.getLayoutData().setHalfGrid(true);}}this._bLayoutDataChangedByMe=false;}o.prototype._resize=function(i){this._bChangedByMe=true;if(this._iCurrentWidth==i.size.width){return;}this._iCurrentWidth=i.size.width;this._applyLinebreaks();this._bChangedByMe=false;};function U(){if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}}function V(j,k){var Y=false;for(var i=0;i<j.length;i++){var Z=j[i];if(Z==k){Y=true;break;}}if(!Y){j.push(k);}}function W(i){if(i.name=="visible"){var j=i.object.getParent();j.invalidate();}}function X(Y){var Z=[];var $=Y.getFormContainers();for(var i=0;i<$.length;i++){var a1=$[i];var b1=a1.getTitle();if(b1){Z.push(b1);}else{var c1=a1.getToolbar();if(c1){Z.push(c1);}}var d1=a1.getFormElements();for(var j=0;j<d1.length;j++){var e1=d1[j];var f1=e1.getLabel();if(f1){Z.push(f1);}var g1=e1.getFields();for(var k=0;k<g1.length;k++){var h1=g1[k];Z.push(h1);}}}return Z;}o.prototype._formInvalidated=function(k){if(!this._bChangedByMe){var Y=X(this.getAggregation("form"));var i=0;var j=0;var Z=false;if(!this._aElements||Y.length<this._aElements.length){Z=true;}else{for(i=0;i<Y.length;i++){var $=Y[i];var a1=this._aElements[j];if($===a1){j++;}else{var b1=Y[i+1];if(b1===a1){this.insertContent($,i);break;}b1=this._aElements[j+1];if(b1===$){Z=true;break;}break;}}}if(Z){this.removeAllContent();for(i=0;i<Y.length;i++){var c1=Y[i];this.addContent(c1);}}}};o.prototype._onLayoutDataChange=function(i){if(!this._bLayoutDataChangedByMe&&!this._bIsBeingDestroyed){switch(this.getLayout()){case d.ResponsiveLayout:var j=i.srcControl;var k=j.getParent();if(k instanceof b){var Y=this.indexOfContent(j);this.removeContent(j);this.insertContent(j,Y);}break;}}};o.prototype._suggestTitleId=function(i){var j=this.getAggregation("form");j._suggestTitleId(i);return this;};return o;});
