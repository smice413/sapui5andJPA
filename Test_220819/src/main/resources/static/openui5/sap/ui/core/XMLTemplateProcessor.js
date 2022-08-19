/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','sap/ui/base/DataType','sap/ui/base/ManagedObject','sap/ui/core/CustomData','./mvc/View','./mvc/EventHandlerResolver','./ExtensionPoint','./StashedControlSupport','sap/ui/base/SyncPromise','sap/base/Log','sap/base/util/ObjectPath','sap/base/util/values','sap/base/assert','sap/base/security/encodeXML','sap/base/util/LoaderExtensions','sap/base/util/JSTokenizer','sap/base/util/isEmptyObject'],function(q,D,M,C,V,E,a,S,b,L,O,v,c,d,f,J,g){"use strict";function h(e,i,N,j,R){var B=M.bindingParser(i,j,true,false,false,false,R);if(B&&typeof B==="object"){return B;}var p=i=B||i;var y=D.getType(e);if(y){if(y instanceof D){p=y.parseValue(i,{context:j,locals:R});if(!y.isValid(p)){L.error("Value '"+i+"' is not valid for type '"+y.getName()+"'.");}}}else{throw new Error("Property "+N+" has unknown type "+e);}return typeof p==="string"?M.bindingParser.escape(p):p;}function l(e){return e.localName||e.baseName||e.nodeName;}var X="http://www.w3.org/1999/xhtml";var k="http://www.w3.org/2000/svg";var m="sap.ui.core";var n="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1";var o="http://schemas.sap.com/sapui5/extension/sap.ui.core.support.Support.info/1";var r="http://schemas.sap.com/sapui5/extension/sap.ui.core.xmlcomposite/1";var I="http://schemas.sap.com/sapui5/extension/sap.ui.core.Internal/1";var P="http://schemas.sap.com/sapui5/preprocessorextension/";function s(A,e){function i(p,y,z,B,F){var G,H,K=[];for(G=p.firstChild;G;G=G.nextSibling){H=e(p,y,z,G,false,B,F);if(H){K.push(H.unwrap());}}return b.resolve(K);}function j(p,y,z,B,F){var G,H=Promise.resolve(),K=[B];for(G=p.firstChild;G;G=G.nextSibling){H=H.then(e.bind(null,p,y,z,G,false,B,F));K.push(H);}return Promise.all(K);}return A?j:i;}var t={};t.loadTemplate=function(e,i){var R=e.replace(/\./g,"/")+("."+(i||"view")+".xml");return f.loadResource(R).documentElement;};t.loadTemplatePromise=function(e,i){var R=e.replace(/\./g,"/")+("."+(i||"view")+".xml");return f.loadResource(R,{async:true}).then(function(j){return j.documentElement;});};t.parseViewAttributes=function(e,j,p){var A=j.getMetadata().getAllProperties();for(var i=0;i<e.attributes.length;i++){var y=e.attributes[i];if(y.name==='controllerName'){j._controllerName=y.value;}else if(y.name==='resourceBundleName'){j._resourceBundleName=y.value;}else if(y.name==='resourceBundleUrl'){j._resourceBundleUrl=y.value;}else if(y.name==='resourceBundleLocale'){j._resourceBundleLocale=y.value;}else if(y.name==='resourceBundleAlias'){j._resourceBundleAlias=y.value;}else if(y.name==='class'){j.addStyleClass(y.value);}else if(!p[y.name]&&A[y.name]){p[y.name]=h(A[y.name].type,y.value,y.name,j._oContainingView.oController);}}};t.enrichTemplateIds=function(e,i){t.enrichTemplateIdsPromise(e,i,false);return e;};t.enrichTemplateIdsPromise=function(e,i,A){return x(e,i,true,A).then(function(){return e;});};t.parseTemplate=function(e,i){return t.parseTemplatePromise(e,i,false).unwrap();};t.parseTemplatePromise=function(i,j,A,y){return x(i,j,false,A,y).then(function(){var p=b.resolve(arguments[0]);if(j.isA("sap.ui.core.Fragment")){return p;}var z=arguments;if(j.isA("sap.ui.core.mvc.View")&&j._epInfo&&j._epInfo.all.length>0){p=T(A,j,{"content":j._epInfo.all});}return p.then(function(){if(Array.isArray(z[0])){z[0]=z[0].filter(function(e){return!e._isExtensionPoint;});}return z[0];});});};function u(R){var e,i=/^[a-zA-Z_$][a-zA-Z0-9_$]*$/;if(!R||typeof R!=="object"){e="core:require in XMLView can't be parsed to a valid object";}else{Object.keys(R).some(function(K){if(!i.test(K)){e="core:require in XMLView contains invalid identifier: '"+K+"'";return true;}if(!R[K]||typeof R[K]!=="string"){e="core:require in XMLView contains invalide value '"+R[K]+"'under key '"+K+"'";return true;}});}return e;}function w(j,A){var p=j.getAttributeNS(m,"require"),R,y,z;if(p){try{R=J.parseJS(p);}catch(e){L.error("Require attribute can't be parsed on Node: ",j.nodeName);throw e;}z=u(R);if(z){throw new Error(z+" on Node: "+j.nodeName);}if(!g(R)){y={};if(A){return new Promise(function(B,F){var G=Object.keys(R).reduce(function(i,K){y[K]=sap.ui.require(R[K]);return i&&y[K]!==undefined;},true);if(G){B(y);return;}sap.ui.require(v(R),function(){var H=arguments;Object.keys(R).forEach(function(K,i){y[K]=H[i];});B(y);},F);});}else{Object.keys(R).forEach(function(K){y[K]=sap.ui.requireSync(R[K]);});return b.resolve(y);}}}}function T(A,e,i){var j=b.resolve();if(!g(i)){var y=[];var R;if(A){j=new Promise(function(p){R=p;});}Object.keys(i).forEach(function(z){var B=i[z];B.forEach(function(F){F.targetControl=e;var G=sap.ui.require(F.providerClass);if(G){y.push(G.applyExtensionPoint(F));}else{var p=new Promise(function(H,K){sap.ui.require([F.providerClass],function(N){H(N);},K);}).then(function(H){return H.applyExtensionPoint(F);});y.push(p);}});});if(A){Promise.all(y).then(R);}}return j;}function x(p,y,z,A,B){var R=[],F=w(p,A)||b.resolve();A=A&&y._sProcessingMode==="sequential";L.debug("XML processing mode is "+(A?"sequential":"default"),"","XMLTemplateProcessor");var G=sap.ui.getCore().getConfiguration().getDesignMode();if(G){y._sapui_declarativeSourceInfo={xmlNode:p,xmlRootNode:y._oContainingView===y?p:y._oContainingView._sapui_declarativeSourceInfo.xmlRootNode};}var H=y.sViewName||y._sFragmentName;if(!H){var K=y;var N=0;while(++N<1000&&K&&K!==K._oContainingView){K=K._oContainingView;}H=K.sViewName;}if(y.isSubView()){Z(p,true,false,F);}else{if(p.localName==="View"&&p.namespaceURI!=="sap.ui.core.mvc"){L.warning("XMLView root node must have the 'sap.ui.core.mvc' namespace, not '"+p.namespaceURI+"'"+(H?" (View name: "+H+")":""));}$(p,false,false,F);}var i=0;function Q(){for(;i<R.length;i++){var e=R[i];if(e&&typeof e.then==='function'){return e.then(U).then(Q);}}return R;}function U(e){var j=[i,1].concat(e);Array.prototype.splice.apply(R,j);}return F.then(Q);function W(e){return e;}function Y(e){return y._oContainingView.createId(e);}function Z(p,e,j,f1){if(p.nodeType===1){var g1=l(p);if(p.namespaceURI===X||p.namespaceURI===k){R.push("<"+g1+" ");var h1=false;for(var i=0;i<p.attributes.length;i++){var i1=p.attributes[i];var j1=i1.value;if(i1.name==="id"){h1=true;j1=d1(y,p);}R.push(i1.name+"=\""+d(j1)+"\" ");}if(e===true){R.push("data-sap-ui-preserve"+"=\""+y.getId()+"\" ");if(!h1){R.push("id"+"=\""+y.getId()+"\" ");}}R.push(">");var k1=p;if(window.HTMLTemplateElement&&p instanceof HTMLTemplateElement&&p.content instanceof DocumentFragment){k1=p.content;}$(k1,false,false,f1);R.push("</"+g1+">");}else if(g1==="FragmentDefinition"&&p.namespaceURI===m){$(p,false,true,f1);}else{F=F.then(function(){return b1(p,f1).then(function(n1){for(var i=0;i<n1.length;i++){var o1=n1[i];if(y.getMetadata().hasAggregation("content")){y._epInfo=y._epInfo||{contentControlsCount:0,last:null,all:[]};if(o1._isExtensionPoint){o1.index=y._epInfo.contentControlsCount;o1.targetControl=y;o1.aggregationName="content";if(y._epInfo.last){y._epInfo.last._nextSibling=o1;}y._epInfo.last=o1;y._epInfo.all.push(o1);}else{y._epInfo.contentControlsCount++;y.addAggregation("content",o1);}}else if(y.getMetadata().hasAssociation(("content"))){y.addAssociation("content",o1);}}return n1;});});R.push(F);}}else if(p.nodeType===3&&!j){var l1=p.textContent||p.text,m1=l(p.parentNode);if(l1){if(m1!="style"){l1=d(l1);}R.push(l1);}}}function $(p,e,j,f1){var g1=p.childNodes;for(var i=0;i<g1.length;i++){Z(g1[i],e,j,f1);}}function _(e,j){var f1;var g1=sap.ui.getCore().getLoadedLibraries();q.each(g1,function(k1,l1){if(e===l1.namespace||e===l1.name){f1=l1.name+"."+((l1.tagNames&&l1.tagNames[j])||j);}});f1=f1||e+"."+j;function h1(j1){if(!j1){L.error("Control '"+f1+"' did not return a class definition from sap.ui.define.","","XMLTemplateProcessor");j1=O.get(f1);}if(!j1){L.error("Can't find object class '"+f1+"' for XML-view","","XMLTemplateProcessor");}return j1;}var i1=f1.replace(/\./g,"/");var j1=sap.ui.require(i1);if(!j1){if(A){return new Promise(function(k1,l1){sap.ui.require([i1],function(j1){j1=h1(j1);k1(j1);},l1);});}else{j1=sap.ui.requireSync(i1);j1=h1(j1);}}return j1;}function a1(e,j,f1){if(e.namespaceURI===X||e.namespaceURI===k){var id=e.attributes['id']?e.attributes['id'].textContent||e.attributes['id'].text:null;if(z){return t.enrichTemplateIdsPromise(e,y,A).then(function(){return[];});}else{var h1=function(g1){var j1={id:id?d1(y,e,id):undefined,xmlNode:e,containingView:y._oContainingView,processingMode:y._sProcessingMode};if(y.fnScopedRunWithOwner){return y.fnScopedRunWithOwner(function(){return new g1(j1);});}return new g1(j1);};if(A){return new Promise(function(g1,j1){sap.ui.require(["sap/ui/core/mvc/XMLView"],function(i1){g1([h1(i1)]);},j1);});}else{var i1=sap.ui.requireSync("sap/ui/core/mvc/XMLView");return b.resolve([h1(i1)]);}}}else{return b1(e,j,f1);}}function b1(e,j,f1){if(l(e)==="ExtensionPoint"&&e.namespaceURI===m){if(z){return b.resolve([]);}else{var g1=y instanceof V?y._oContainingView:y;var h1=a._factory.bind(null,g1,e.getAttribute("name"),function(){var j1=b.resolve();var k1=[];var l1=e.childNodes;for(var i=0;i<l1.length;i++){var m1=l1[i];if(m1.nodeType===1){j1=j1.then(a1.bind(null,m1,j,f1));k1.push(j1);}}return b.all(k1).then(function(n1){var o1=[];n1.forEach(function(p1){o1=o1.concat(p1);});return o1;});});return b.resolve(y.fnScopedRunWithOwner?y.fnScopedRunWithOwner(h1):h1());}}else{var i1=_(e.namespaceURI,l(e));if(i1&&typeof i1.then==='function'){return i1.then(function(j1){return c1(e,j1,j,f1);});}else{return c1(e,i1,j,f1);}}}function c1(f1,g1,h1,i1){var ns=f1.namespaceURI,k1={},l1={},m1="",n1=[],o1=null,p1=null,q1=f1.getAttribute("stashed")==="true";if(!z){f1.removeAttribute("stashed");}if(!g1){return b.resolve([]);}var r1=g1.getMetadata();var s1=r1.getAllSettings();var t1=w(f1,A);if(t1){h1=b.all([h1,t1]).then(function(e){return Object.assign({},e[0],e[1]);});}h1=h1.then(function(j){if(g(j)){j=null;}if(!z){for(var i=0;i<f1.attributes.length;i++){var j1=f1.attributes[i],y1=j1.name,z1,A1=s1[y1],B1=j1.value;if(y1==="id"){k1[y1]=d1(y,f1,B1);}else if(y1==="class"){m1+=B1;}else if(y1==="viewName"){k1[y1]=B1;}else if(y1==="fragmentName"){k1[y1]=B1;k1['containingView']=y._oContainingView;}else if((y1==="binding"&&!A1)||y1==='objectBindings'){if(!q1){var C1=M.bindingParser(B1,y._oContainingView.oController);if(C1){k1.objectBindings=k1.objectBindings||{};k1.objectBindings[C1.model||undefined]=C1;}}}else if(y1==='metadataContexts'){if(!q1){var D1=null;try{D1=t._calculatedModelMapping(B1,y._oContainingView.oController,true);}catch(e){L.error(y+":"+e.message);}if(D1){k1.metadataContexts=D1;if(t._preprocessMetadataContexts){t._preprocessMetadataContexts(g1.getMetadata().getName(),k1,y._oContainingView.oController);}}}}else if(y1.indexOf(":")>-1){z1=j1.namespaceURI;if(z1===n){var E1=l(j1);n1.push(new C({key:E1,value:h("any",B1,E1,y._oContainingView.oController)}));}else if(z1===o){p1=B1;}else if(z1&&z1.startsWith(P)){L.debug(y+": XMLView parser ignored preprocessor attribute '"+y1+"' (value: '"+B1+"')");}else if(z1===m||z1===I||y1.startsWith("xmlns:")){}else{if(!o1){o1={};}if(!o1.hasOwnProperty(j1.namespaceURI)){o1[j1.namespaceURI]={};}o1[j1.namespaceURI][l(j1)]=j1.nodeValue;L.debug(y+": XMLView parser encountered unknown attribute '"+y1+"' (value: '"+B1+"') with unknown namespace, stored as sap-ui-custom-settings of customData");}}else if(A1&&A1._iKind===0){k1[y1]=h(A1.type,B1,y1,y._oContainingView.oController,j);}else if(A1&&A1._iKind===1&&A1.altTypes){if(!q1){k1[y1]=h(A1.altTypes[0],B1,y1,y._oContainingView.oController,j);}}else if(A1&&A1._iKind===2){if(!q1){var C1=M.bindingParser(B1,y._oContainingView.oController,false,false,false,false,j);if(C1){k1[y1]=C1;}else{L.error(y+": aggregations with cardinality 0..n only allow binding paths as attribute value (wrong value: "+y1+"='"+B1+"')");}}}else if(A1&&A1._iKind===3){if(!q1){k1[y1]=Y(B1);}}else if(A1&&A1._iKind===4){if(!q1){k1[y1]=B1.split(/[\s,]+/g).filter(W).map(Y);}}else if(A1&&A1._iKind===5){if(!q1){var F1=[];E.parse(B1).forEach(function(G1){var H1=E.resolveEventHandler(G1,y._oContainingView.oController,j);if(H1){F1.push(H1);}else{L.warning(y+": event handler function \""+G1+"\" is not a function or does not exist in the controller.");}});if(F1.length){k1[y1]=F1;}}}else if(A1&&A1._iKind===-1){if(V.prototype.isPrototypeOf(g1.prototype)&&y1=="async"){k1[y1]=h(A1.type,B1,y1,y._oContainingView.oController,j);}else{L.warning(y+": setting '"+y1+"' for class "+r1.getName()+" (value:'"+B1+"') is not supported");}}else{c(y1==='xmlns',y+": encountered unknown setting '"+y1+"' for class "+r1.getName()+" (value:'"+B1+"')");if(t._supportInfo){t._supportInfo({context:f1,env:{caller:"createRegularControls",error:true,info:"unknown setting '"+y1+"' for class "+r1.getName()}});}}}if(o1){n1.push(new C({key:"sap-ui-custom-settings",value:o1}));}if(n1.length>0){k1.customData=n1;}}return j;});var u1=s(A,v1);function v1(f1,w1,x1,e,j1,h1,i1){var y1,z1;if(e.nodeType===1){if(e.namespaceURI===r){k1[l(e)]=e.querySelector("*");return;}y1=e.namespaceURI===ns&&x1&&x1[l(e)];if(y1){return u1(e,y1,false,h1,i1);}else if(w1){if(!j1&&e.getAttribute("stashed")==="true"&&!z){var A1=e;e=e.cloneNode();A1.removeAttribute("stashed");z1=function(){var j=d1(y,e);S.createStashedControl({wrapperId:j,fnCreate:function(){var C1=A;A=false;try{return v1(f1,w1,x1,A1,true,h1,i1).unwrap();}finally{A=C1;}}});};if(y.fnScopedRunWithOwner){y.fnScopedRunWithOwner(z1);}else{z1();}e.setAttribute("visible","false");}if(k1[w1.name]&&k1[w1.name].path&&typeof k1[w1.name].path==="string"){i1={aggregation:w1.name,id:k1.id};}return a1(e,h1,i1).then(function(C1){for(var j=0;j<C1.length;j++){var D1=C1[j];var E1=w1.name;if(D1._isExtensionPoint){if(!k1[E1]){k1[E1]=[];}var F1=l1[E1];if(!F1){F1=l1[E1]=[];}D1.index=k1[E1].length;D1.aggregationName=E1;D1.closestAggregationBindingCarrier=i1&&i1.id;D1.closestAggregationBinding=i1&&i1.aggregation;var G1=F1[F1.length-1];if(G1){G1._nextSibling=D1;}F1.push(D1);}else if(w1.multiple){if(!k1[E1]){k1[E1]=[];}if(typeof k1[E1].path==="string"){c(!k1[E1].template,"list bindings support only a single template object");k1[E1].template=D1;}else{k1[E1].push(D1);}}else{c(!k1[E1],"multiple aggregates defined for aggregation with cardinality 0..1");k1[E1]=D1;}}return C1;});}else if(l(f1)!=="FragmentDefinition"||f1.namespaceURI!==m){throw new Error("Cannot add direct child without default aggregation defined for control "+r1.getElementName());}}else if(e.nodeType===3){var B1=e.textContent||e.text;if(B1&&B1.trim()){throw new Error("Cannot add text nodes as direct child of an aggregation. For adding text to an aggregation, a surrounding html tag is needed: "+B1.trim());}}}var w1=r1.getDefaultAggregation();var x1=r1.getAllAggregations();return u1(f1,w1,x1,h1,i1).then(function(){var e;var j=b.resolve();var j1=b.resolve();if(z&&f1.hasAttribute("id")){e1(y,f1);}else if(!z){if(g1.getMetadata().isA("sap.ui.core.Fragment")&&f1.getAttribute("type")!=="JS"&&y._sProcessingMode==="sequential"){k1.processingMode="sequential";}if(V.prototype.isPrototypeOf(g1.prototype)&&typeof g1._sType==="string"){var y1=function(){if(g1.getMetadata().isA("sap.ui.core.mvc.XMLView")&&y._sProcessingMode==="sequential"){k1.processingMode="sequential";}return V._legacyCreate(k1,undefined,g1._sType);};if(y.fnScopedRunWithOwner){e=y.fnScopedRunWithOwner(y1);}else{e=y1();}}else if(g1.getMetadata().isA("sap.ui.core.Fragment")&&A&&["XML","JS","HTML"].indexOf(k1.type)>-1){var z1="sap/ui/core/Fragment";var A1=sap.ui.require(z1);k1.name=k1.name||k1.fragmentName;if(A1){j1=A1.load(k1);}else{j1=new Promise(function(C1,D1){sap.ui.require([z1],function(A1){A1.load(k1).then(function(E1){C1(E1);});},D1);});}}else{var B1=function(){var C1;if(y.fnScopedRunWithOwner){C1=y.fnScopedRunWithOwner(function(){var C1=new g1(k1);return C1;});}else{C1=new g1(k1);}j=T(A,C1,l1);return C1;};if(B&&B.fnRunWithPreprocessor){e=B.fnRunWithPreprocessor(B1);}else{e=B1();}}}return j1.then(function(C1){return C1||e;}).then(function(C1){if(m1&&C1.addStyleClass){C1.addStyleClass(m1);}if(!C1){C1=[];}else if(!Array.isArray(C1)){C1=[C1];}if(t._supportInfo&&C1){for(var i=0,D1=C1.length;i<D1;i++){var E1=C1[i];if(E1&&E1.getId()){var F1=t._supportInfo({context:f1,env:{caller:"createRegularControls",nodeid:f1.getAttribute("id"),controlid:E1.getId()}}),G1=p1?p1+",":"";G1+=F1;t._supportInfo.addSupportInfo(E1.getId(),G1);}}}if(G){C1.forEach(function(E1){if(r1.getCompositeAggregationName){var H1=f1.getElementsByTagName(E1.getMetadata().getCompositeAggregationName());for(var i=0;i<H1.length;i++){f1.removeChild(H1[0]);}}E1._sapui_declarativeSourceInfo={xmlNode:f1,xmlRootNode:y._sapui_declarativeSourceInfo.xmlRootNode,fragmentName:r1.getName()==='sap.ui.core.Fragment'?k1['fragmentName']:null};});}return j.then(function(){return C1;});});});}function d1(y,p,e){if(p.getAttributeNS(I,"id")){return p.getAttribute("id");}else{return Y(e?e:p.getAttribute("id"));}}function e1(y,p){p.setAttribute("id",Y(p.getAttribute("id")));p.setAttributeNS(I,"id",true);}}t._preprocessMetadataContexts=null;t._calculatedModelMapping=function(B,e,A){var j,p={},y=M.bindingParser(B,e);function z(F){if(F.length%2===0){throw new Error("The last entry is no binding");}for(var i=1;i<=F.length;i=i+2){if(typeof F[i-1]=='string'){throw new Error("Binding expected not a string");}if(F[i]){if((typeof F[i]!='string')||(F[i]!=",")){throw new Error("Missing delimiter ','");}}}}if(y){if(!y.formatter){j=y;y={parts:[j]};}else{z(y.formatter.textFragments);}for(var i=0;i<y.parts.length;i++){j=y.parts[i];p[j.model]=p[j.model]||(A?[]:null);if(Array.isArray(p[j.model])){p[j.model].push(j);}else{p[j.model]=j;}}}return p;};return t;},true);
