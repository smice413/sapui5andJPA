/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/ResizeHandler","sap/ui/documentation/sdk/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/documentation/sdk/controller/util/XML2JSONUtils","sap/ui/Device","sap/ui/documentation/sdk/util/ToggleFullScreenHandler","sap/ui/documentation/sdk/util/Resources","sap/ui/documentation/sdk/controller/util/ResponsiveImageMap","sap/ui/core/HTML","sap/base/Log","sap/m/LightBox","sap/m/LightBoxItem","./util/DataTableHelper","./util/DataTable"],function(q,R,B,J,X,D,T,a,b,H,L,c,d,e,f){"use strict";var G="https://sap.github.io/openui5-docs/#/",g={SPECIAL_CHARS:/[\\\/:*\?"<>|]/g,SPACES:/\s+/g};return B.extend("sap.ui.documentation.sdk.controller.TopicDetail",{onInit:function(){var h,C;this.oPage=this.byId("topicDetailPage");this.oPage.addStyleClass('docuPage');this.oHtml=this.byId("staticContent");this.aWaitingDatatables=[];this.aResponsiveImageMaps=[];this.oLayout=this.byId("staticContentLayout");this.oHtml.attachEvent("afterRendering",this._onHtmlRendered.bind(this));this._oConfig=C=this.getConfig();this.oMatchedTopicDataTablesConfig={};if(!window.prettyPrint){q.sap.require("sap.ui.documentation.sdk.thirdparty.google-code-prettify.prettify");}q.sap.includeStyleSheet("resources/sap/ui/documentation/sdk/thirdparty/DataTables/DataTables-1.10.15/css/dataTables.jqueryui.css");q.sap.includeStyleSheet("resources/sap/ui/documentation/sdk/thirdparty/DataTables/Buttons-1.4.0/css/buttons.jqueryui.css");q.sap.includeScript({url:"resources/sap/ui/documentation/sdk/thirdparty/DataTables/DataTables-1.10.15/js/jquery.dataTables.js"}).then(function(){return q.sap.includeScript({url:"resources/sap/ui/documentation/sdk/thirdparty/DataTables/DataTables-1.10.15/js/dataTables.jqueryui.js"});}).then(function(){return q.sap.includeScript({url:"resources/sap/ui/documentation/sdk/thirdparty/DataTables/Buttons-1.4.0/js/dataTables.buttons.js"});}).then(function(){return q.sap.includeScript({url:"resources/sap/ui/documentation/sdk/thirdparty/DataTables/Buttons-1.4.0/js/buttons.jqueryui.js"});}).then(function(){return q.sap.includeScript({url:"resources/sap/ui/documentation/sdk/thirdparty/DataTables/Buttons-1.4.0/js/buttons.html5.js"});}).then(function(){return q.sap.includeScript({url:"resources/sap/ui/documentation/sdk/thirdparty/DataTables/Buttons-1.4.0/js/buttons.colVis.js"});}).then(function(){h=a.getResourceOriginPath(C.docuPath+'dataTablesConfig.json');return q.ajax({url:h});}).then(function(i){this.oDataTablesConfig=i;this.bDataTablesPluginLoaded=true;this._getDataTableHelper().addMiddlewares();if(this.aWaitingDatatables.length>0){this.aWaitingDatatables.forEach(function(t){this._enableDataTable(t);},this);this.aWaitingDatatables=[];}}.bind(this));this.getRouter().getRoute("topicId").attachPatternMatched(this._onTopicMatched,this);this.getRouter().getRoute("subTopicId").attachPatternMatched(this._onTopicMatched,this);this.jsonDefModel=new J();this.getView().setModel(this.jsonDefModel);},onBeforeRendering:function(){var v=this.getView().getDomRef();if(v&&this.fnOnPageClickListener){v.removeEventListener('click',this.fnOnPageClickListener);}R.deregister(this._onResize.bind(this));D.orientation.detachHandler(this._onOrientationChange,this);},onAfterRendering:function(){var v=this.getView().getDomRef();this.fnOnPageClickListener=this._onPageClick.bind(this);if(v){v.addEventListener('click',this.fnOnPageClickListener);}R.register(this.getView().getDomRef(),this._onResize.bind(this));D.orientation.attachHandler(this._onOrientationChange,this);},onExit:function(){R.deregister(this._onResize.bind(this));D.orientation.detachHandler(this._onOrientationChange,this);},_onResize:function(){this.aResponsiveImageMaps.forEach(function(i){i.resize();});},_onPageClick:function(E){var t=E.target,C=t.classList,h=C.contains('collapsible-icon'),i=C.contains('lightbox-img'),s;if(i){this._onThumbnailClicked(t);}if(h){s=t.parentNode;s.classList.toggle("expanded");}},_onThumbnailClicked:function(t){var l=this._getLightBox(),o=l.getImageContent()[0],s=t.getAttribute('src'),h=t.getAttribute('title'),A=t.getAttribute('alt');o.setImageSrc(s);o.setTitle(h);o.setAlt(A);l.open();},_getLightBox:function(){if(!this._oLightBox){this._oLightBox=new c({imageContent:new d()});}return this._oLightBox;},_getDataTableHelper:function(){return e.getInstance();},_onHtmlResourceLoaded:function(h){var j;if(!h){setTimeout(function(){this.getRouter().myNavToWithoutHash("sap.ui.documentation.sdk.view.NotFound","XML",false);}.bind(this),0);return;}j=X.XML2JSON(h,this._oConfig);j.bIsPhone=D.system.phone;j.topicURL=this.sTopicURL;if(j.shortdesc){j.shortdesc=j.shortdesc.trim().replace(/(\r\n|\n|\r)/gm,' ');}this.jsonDefModel.setData(j);this.oHtml.setContent(j.html);this.oLayout.invalidate();this._scrollContentToTop();setTimeout(window.prettyPrint,0);this.searchResultsButtonVisibilitySwitch(this.byId("topicDetailBackToSearch"));},_onTopicMatched:function(h){var i=decodeURIComponent(h.getParameter("arguments").id),u=i.split("#"),t=u[0],s=u[1];this.sTopicId=t;this.sSubTopicId=s;this.sTopicURL=a.getResourceOriginPath(this._oConfig.docuPath+t+(t.match(/\.html/)?"":".html"));this.sSubTopicId=h.getParameter("arguments").subId||s;q.ajax(this.sTopicURL).done(this._onHtmlResourceLoaded.bind(this)).fail(L.err);},_onHtmlRendered:function(){this._getDataTableHelper().destroyDatatables();var s,i=this.oPage.$().find('#d4h5-main-container .imagemap'),h=this.oPage.$().find('#d4h5-main-container table.datatable'),o=this.oLayout.getDomRef();this._fixExternalLinks(o);this._computeColumnGroupValues(o);if(this.sSubTopicId){s=document.getElementById(this.sSubTopicId);if(s){s.scrollIntoView(true);}}this.aResponsiveImageMaps=[];if(h.length){h.each(function(j,t){if(this.bDataTablesPluginLoaded){this._enableDataTable(t);}else{this.aWaitingDatatables.push(t);}}.bind(this));}i.each(function(j,k){this._enableImageMap(k);}.bind(this));},_enableImageMap:function(i){var n,s,r=/<img[^>]+src="([^">]+)/g;if(i.complete){this._addResponsiveImageMap(i);}else{n=new Image();n.onload=function(){this._addResponsiveImageMap(i);}.bind(this);s=r.exec(i.innerHTML);if(s){n.src=s&&s[1];}}},_enableDataTable:function(t){var s=t.id,C=this._getDataTableConfig(s),o;if(C){o=new f().init(s,t,C);this._getDataTableHelper().addDatatable(o);}},_getDataTableConfig:function(t){var o=this.oDataTablesConfig[this.sSubTopicId]||this.oDataTablesConfig[this.sTopicId]||{};return o[t];},_addResponsiveImageMap:function(h){this.aResponsiveImageMaps.push(new b(h.querySelector('map'),h.querySelector('img')));},_fixExternalLinks:function(E){var l=E.querySelectorAll("a.external-link"),i,o,h,s="http://help.sap.com/disclaimer?site=";for(i=0;i<l.length;i++){o=l[i];h=o.getAttribute("href");o.setAttribute("href",s+h);this._addIconToExternalUrl(o,h);}},_computeColumnGroupValues:function(E){var s,w,S,p,C,o=E.querySelectorAll("colgroup");o=[].slice.call(o);o.forEach(function(h){s=0;S=[];C=[].slice.call(h.children);C.forEach(function(i,j){w=parseInt(i.getAttribute('width'));S[j]=w;s+=w;});C.forEach(function(i,j){p=(S[j]/s)*100;i.setAttribute('width',p+"%");});});},_addIconToExternalUrl:function(h,s){var S=/^https?:\/\/(?:www.)?[\w.]*(?:sap|hana\.ondemand|sapfioritrial)\.com/.test(s),t='Information published on '+(S?'':'non ')+'SAP site',n=new Image(),i=S?'link-sap':'link-external';n.onload=function(){h.appendChild(n);};n.src='./resources/sap/ui/documentation/sdk/images/'+i+'.png';n.setAttribute("title",t);n.className="sapUISDKExternalLink";},_scrollContentToTop:function(){if(this.oPage&&this.oPage.$().length>0){this.oPage.getScrollDelegate().scrollTo(0,1);}},_formatHTML:function(h){return'<div>'+h+'</div>';},backToSearch:function(t){this.onNavBack();},onToggleFullScreen:function(E){T.updateMode(E,this.getView(),this);},onEditGitHubPress:function(E){var u=this.jsonDefModel.getProperty("/topicURL"),t=this.jsonDefModel.getProperty("/topictitle1"),s=this._formatToGitHubUrl(u,t);window.open(s,"_blank");},_formatToGitHubUrl:function(u,t){var s=t.trim().replace(g.SPECIAL_CHARS,"").replace(g.SPACES,"_");s+="_";s+=u.split("/").pop().substring(0,7);s+=".md";return G+s;}});});
