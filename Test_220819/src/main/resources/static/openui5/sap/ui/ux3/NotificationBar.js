/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery",'sap/ui/core/Control','sap/ui/core/delegate/ItemNavigation','sap/ui/core/theming/Parameters','./library',"./NotificationBarRenderer","sap/ui/core/Message","sap/ui/core/library","sap/ui/Device","sap/base/Log"],function(q,C,I,P,l,N,M,c,D,L){"use strict";var a=c.MessageType;var b=l.NotificationBarStatus;var d=C.extend("sap.ui.ux3.NotificationBar",{metadata:{library:"sap.ui.ux3",properties:{visibleStatus:{type:"sap.ui.ux3.NotificationBarStatus",group:"Misc",defaultValue:b.Default},resizeEnabled:{type:"boolean",group:"Misc",defaultValue:true},alwaysShowToggler:{type:"boolean",defaultValue:false,since:"1.24.5"}},aggregations:{messageNotifier:{type:"sap.ui.core.Element",multiple:false},notifiers:{type:"sap.ui.core.Element",multiple:true,singularName:"notifier"}},events:{display:{parameters:{show:{type:"boolean"}}},resize:{parameters:{status:{type:"sap.ui.ux3.NotificationBarStatus"}}}}}});C.extend("sap.ui.ux3.NotificationBar.NotifierView",{renderMessages:function(j){j.write("<div");j.writeAttribute("id",this.getId()+"-content");j.addClass("sapUiNotifierContent");j.writeClasses();j.write(">");var u=this.getMessages();var i=u.length-1;var F=true;for(;i>=0;i--){if(!F||(i==0&&u.length>1)){j.write("<div");j.addClass("sapUiNotificationBarCltSep");j.writeClasses();j.write(">");j.write("</div>");}else{F=false;}var v=u[i];if(v._message&&v._message.getReadOnly()){v.addStyleClass("sapUiNotifierMessageReadOnly");}j.renderControl(v);}j.write("</div>");},metadata:{library:"sap.ui.ux3",properties:{"title":"string","visibleItems":"int","renderMode":{type:"string",defaultValue:"callout"}},aggregations:{"messages":"sap.ui.ux3.NotificationBar.MessageView"}},init:function(){this._oResBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");},exit:function(){if(this._renderedControl){delete this._renderedControl;}delete this._oResBundle;},getTitle:function(){var T=this.getProperty("title");var i=this.getMessages().length;if(i>0){var K="NOTIBAR_NOTIFIER_VIEW_TITLE";T=this._oResBundle.getText(K,[T,i]);}return T;},renderer:function(i,j){i.write("<div");i.addClass("sapUiNotifierContainer");i.writeControlData(j);i.writeClasses();i.write(">");i.write("<div");i.writeAttribute("id",j.getId()+"-title");i.addClass("sapUiNotifierTitle");i.writeClasses();i.write(">");i.writeEscaped(j.getTitle());i.write("</div>");if(j.getMessages().length>0){j.renderMessages(i);}i.write("</div>");},onAfterRendering:function(){var $=this.$("content"),i=$.children(".sapUiNotifierMessage"),j=i.length,v=this.getVisibleItems();if(j>v){setTimeout(this._fnAfterRenderingCallback.bind(this,i,$,v),0);}},_fnAfterRenderingCallback:function($,i,v){var T=v-1,j=0;$.each(function(){if(j===v){i.css("max-height",T);return;}T+=q(this).outerHeight();j++;});}});C.extend("sap.ui.ux3.NotificationBar.MessageView",{metadata:{library:"sap.ui.ux3",properties:{"text":"string","timestamp":"string","icon":"sap.ui.core.URI"}},renderer:function(i,j){var u=j.getId();i.write("<div");i.writeControlData(j);i.addClass("sapUiNotifierMessage");i.writeClasses();i.writeAttribute("tabindex","0");i.write(">");if(j.getIcon()){i.write("<div");i.writeAttribute("id",u+"-icon");i.addClass("sapUiNotifierMessageIcon");i.writeClasses();i.write(">");i.write("<img");i.writeAttributeEscaped("src",j.getIcon());i.write(">");i.write("</div>");}i.write("<div");i.writeAttribute("id",u+"-text");i.addClass("sapUiNotifierMessageText");i.writeClasses();i.write(">");i.writeEscaped(j.getText());i.write("</div>");i.write("<div");i.writeAttribute("id",u+"-timestamp");i.addClass("sapUiNotifierMessageTimestamp");i.writeClasses();i.write(">");i.writeEscaped(j.getTimestamp());i.write("</div>");i.write("</div>");},onclick:function(i){if(!this._message.getReadOnly()){var j=this._message.getParent();j.fireMessageSelected({message:this._message,notifier:j});}},onsapselect:function(i){this.onclick(i);},exit:function(i){if(this._message){delete this._message;}}});var f=function(i){var j=i.hasItems();var u=i.getVisibleStatus();if(j&&u==="None"){return true;}else if(!j&&u!=="None"){return true;}else if(!j&&u!=="Min"){return true;}else{return false;}};var s=function(i,j){var u=j.getMessages().concat([]);if(u.length>0){u.sort(M.compareByType);var v=u.length-1;i._sSeverestMessageLevel=u[v].getLevel();}};var e=function(j){var u=j.getParameter("callout");switch(j.getParameter("type")){case"added":case"removed":var v=j.getParameter("notifier");if(this.getMessageNotifier()&&this.getMessageNotifier().getId()===v.getId()){s(this,this.getMessageNotifier());}if(f(this)){var x=this.hasItems();this.fireDisplay({show:x});}else{this.invalidate();if(j.getParameter("type")==="removed"){if(u.getContent().length>0){var y=u.getContent()[0];var z=j.getParameter("message");var A=y.getMessages();var B;for(var i=0;i<A.length;i++){B=A[i];if(z.getId()===B._message.getId()){B.destroy();u.rerender();u.adjustPosition();break;}}}}}break;case"openCallout":u.destroyContent();var v=j.getParameter("notifier");v.destroyAggregation("views",true);var F=v.getId();var G=this.getMessageNotifier();if(G&&F===G.getId()){F+="-messageNotifierView";}else{F+="-messageView";}var H=new d.NotifierView(F,{title:v.getTitle(),visibleItems:this._visibleItems});if(v._bEnableMessageSelect){H.addStyleClass("sapUiNotifierSelectable");}var J=v.getMessages();for(var i=0;i<J.length;i++){var V=g(J[i],v,this);H.addMessage(V);}v.addAggregation("views",H,true);u.addContent(H);break;}};d.HOVER_ITEM_HEIGHT=16;d.prototype.init=function(){this._oItemNavigation=new I();this._oItemNavigation.setCycling(true);this.addDelegate(this._oItemNavigation);this._iCalloutWidth=parseInt(250);this._iCalloutHeight=parseInt(200);this._visibleItems=5;this._eventListener=q.proxy(e,this);this._oResBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");this._togglerPosition="50%";this._gapMessageArea="5";this._sSeverestMessageLevel=a.None;q(window).on("resize",q.proxy(O,this));this._proxyEnableMessageSelect=q.proxy(E,this);this.data("sap-ui-fastnavgroup","true",true);this.setAlwaysShowToggler(false);};d.prototype.exit=function(){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation;delete this._iCalloutWidth;delete this._iCalloutHeight;delete this._visibleItems;delete this._eventListener;if(this.getMessageNotifier()){var i=this.getMessageNotifier();i._oMessageArea.destroy();delete i._oMessageArea;}delete this._resizeFrom;delete this._resizeTo;delete this._oResBundle;delete this._formerVisibleStatus;delete this._togglerPosition;delete this._gapMessageArea;delete this._isHovered;delete this._togglerClicked;delete this._sSeverestMessageLevel;q(window).off("resize",O);delete this._proxyEnableMessageSelect;};var g=function(i,j,u){var v=new d.MessageView(j.getId()+"-messageView-"+i.getId(),{text:i.getText(),timestamp:i.getTimestamp()});v._message=i;if(j.sParentAggregationName=="messageNotifier"){if(u.getVisibleStatus()==b.Max){v.setIcon(i.getIcon()||i.getDefaultIcon("32x32"));}else{v.setIcon(i.getIcon()||i.getDefaultIcon());}}else{v.setIcon(i.getIcon());}return v;};var r=function(i,j){j.attachEvent("_childControlCalling",i._eventListener,i);};var h=function(i,j){j.detachEvent("_childControlCalling",i._eventListener,i);};d.prototype.addNotifier=function(i){if(i){var j=(this.getVisibleStatus()==b.None)?true:false;this.addAggregation("notifiers",i,j);r(this,i);}return this;};d.prototype.insertNotifier=function(i,j){if(i){this.insertAggregation("notifiers",i,j);r(this,i);}return this;};d.prototype.removeNotifier=function(i){var j=this.removeAggregation("notifiers",i);h(this,j);return j;};d.prototype.removeAllNotifiers=function(){var j=this.removeAllAggregation("notifiers");for(var i=0;i<j.length;i++){var u=j[i];h(this,u);}return j;};d.prototype.destroyNotifiers=function(){var j=this.getNotifiers();for(var i=0;i<j.length;i++){var u=j[i];h(this,u);}this.destroyAggregation("notifiers");return this;};var E=function(i){var j=this.getMessageNotifier();if(j&&j.getId()===i.getParameter("notifier").getId()){j.invalidate();}};d.prototype.setMessageNotifier=function(i){var j=this.getMessageNotifier();if(j){j._oMessageArea.destroy();delete j._oMessageArea;j.detachEvent("_enableMessageSelect",this._proxyEnableMessageSelect);h(this,j);}this.setAggregation("messageNotifier",i);if(i){i._oMessageArea=new d.MessageView(this.getId()+"-inplaceMessage");i._oMessageArea.setParent(i);i.attachEvent("_enableMessageSelect",this._proxyEnableMessageSelect);r(this,i);}return this;};d.prototype.destroyMessageNotifier=function(i){var j=this.getMessageNotifier();if(j){j._oMessageArea.destroy();delete j._oMessageArea;j.detachEvent("_enableMessageSelect",this._proxyEnableMessageSelect);h(this,j);}this.destroyAggregation("messageNotifier");return this;};var S=function(i,j){var T=i.$();switch(j){case b.Min:T.addClass("sapUiNotificationBarMinimized");break;case b.Max:var H=i.getHeightOfStatus(i.getVisibleStatus());T.addClass("sapUiNotificationBarMaximized");T.css("height",H);var $=i.$("containers");$.css("max-height",H);break;case b.None:if(!i._resizeTo){T.css("display","none");}break;case b.Default:default:T.removeClass("sapUiNotificationBarMaximized");T.removeClass("sapUiNotificationBarMinimized");break;}};var R=function(T){if(w(T)){var F=T.getHeightOfStatus(T._resizeFrom);var $=T.$();$.css("height",F);var j=T.getHeightOfStatus(T._resizeTo);$.stop(true,true).animate({height:j},"fast",function(){var u=T.getVisibleStatus();if(u==="None"){$.css("display","none");if(T.hasItems()){if(T.getMessageNotifier()){var v=T.getMessageNotifier();v.$().css("display","none");}if(T.getNotifiers().length>0){var x=T.getNotifiers();for(var i=0;i<x.length;i++){x[i].$().css("display","none");}}}}S(T,u);p(T,u);});}else{var u=T.getVisibleStatus();S(T,u);}delete T._resizeFrom;delete T._resizeTo;};var k=function(j){if(j.getMessageNotifier()&&j.getMessageNotifier().hasItems()){var $;var u=j.getId()+"-notifiers";var v=q(document.getElementById(u));if(v.length>0){var T=parseInt(v.width());var x=v.children();for(var i=0;i<x.length;i++){var y=q(x[i]);if(y.hasClass("sapUiNotifier")){T-=y.width();}else if(y.hasClass("sapUiNotifierSeparator")){T-=y.width();}else if(y.hasClass("sapUiInPlaceMessage")){$=y;}}if($){T-=j._gapMessageArea+2;$.css("width",T+"px");}}}};d.prototype.onAfterRendering=function(){this._oItemNavigation.setRootDomRef(this.getDomRef());var u=[];var v=this.getVisibleStatus()===b.Max;if(v){var x=this.getMessageNotifier();if(x!=null){var y=x.getMessages();var z=x.getId()+"-messageNotifierView-messageView-";for(var i=y.length-1;i>=0;i--){var A=document.getElementById(z+y[i].getId());if(A){u.push(A);}}}var B=this.getNotifiers();for(var i=0;i<B.length;i++){var y=B[i].getMessages();var z=B[i].getId()+"-notifierView-messageView-";for(var j=y.length-1;j>=0;j--){var A=document.getElementById(z+y[j].getId());if(A){u.push(A);}}}}else{var B=this.getNotifiers();for(var i=0;i<B.length;i++){var A=B[i].getDomRef();if(A){u.push(A);}}var x=this.getMessageNotifier();if(x!=null){var A=x.getDomRef();if(A){u.push(A);}A=this.getDomRef("inplaceMessage");if(A&&q(A).hasClass("sapUiInPlaceMessageSelectable")){u.push(A);}}}this._oItemNavigation.setItemDomRefs(u);R(this);k(this);m(this,this.getMessageNotifier());n(this);if(D.browser.mobile){var $=this.$("toggler");if(this.getVisibleStatus()!==b.None){$.css("display","block");}else{$.css("display","none");}}};var m=function(T,i){if(i&&i.hasItems()){var $=i.$("counter");$.removeClass("sapUiMessageInformation");$.removeClass("sapUiMessageSuccess");$.removeClass("sapUiMessageWarning");$.removeClass("sapUiMessageError");s(T,i);var j=T._sSeverestMessageLevel;$.addClass("sapUiMessage"+j);var u=i.getMessages().length;var K="NOTIBAR_MESSAGE_NOTIFIER_DESC_LEVEL_"+j.toUpperCase()+(u===1?"_SING":"_PL");o(T,i,K,u);}};var n=function(T){var j=T.getNotifiers();for(var i=0;i<j.length;i++){var u=j[i].getMessages().length;var K="NOTIBAR_NOTIFIER_COUNT_TEXT_"+(u===1?"SING":"PL");o(T,j[i],K,u);}};var o=function(T,i,K,j){var $=i.$("description");var u=T._oResBundle.getText(K,[j]);$.html(u);};var O=function(i){k(this);};var w=function(i){if(i._resizeFrom&&i._resizeTo){if(i._resizeFrom!=i._resizeTo){return true;}}return false;};d.prototype.hasItems=function(){var j=this.getNotifiers();if(j.length>0){for(var i=0;i<j.length;i++){var u=j[i];if(u.hasItems()){return true;}}}if(this.getMessageNotifier()){if(this.getMessageNotifier().hasItems()){return true;}}return false;};var p=function(i,j){var u="none";var $=i.$();switch(j){case b.Max:case b.None:break;case b.Min:$.stop().animate({height:i.getHeightOfStatus(j)},{duration:"fast",queue:true});$.addClass("sapUiNotificationBarMinimized");i.$("notifiers").css("display","none");u="block";break;default:case b.Default:$.stop().animate({height:i.getHeightOfStatus(j)},{duration:"fast",queue:true});$.removeClass("sapUiNotificationBarMaximized");$.removeClass("sapUiNotificationBarMinimized");break;}var v=i.$("hoverItem");v.css("display",u);};d.prototype.onfocusin=function(i){if(this._togglerClicked){delete this._togglerClicked;i.stopImmediatePropagation(true);}};d.prototype.onclick=function(i){this._togglerClicked=true;this.$().trigger("blur");var $=q(document.activeElement);t(this);var j=i.target.id;var u=j.split("-");if(u){var v=this.getVisibleStatus();var x=u.length-1;switch(u[x]){case"ArrowUp":if(v==="Min"){this.setVisibleStatus("Default");}else{this.setVisibleStatus("Max");}break;case"ArrowDown":if(v==="Max"){this.setVisibleStatus("Default");}else{this.setVisibleStatus("Min");}i.preventDefault();break;case"BarUp":if(this._formerVisibleStatus){this.setVisibleStatus(this._formerVisibleStatus);}else{this.setVisibleStatus("Default");}break;case"BarDown":this._formerVisibleStatus=v;this.setVisibleStatus("Min");$.trigger("blur");break;default:if($.hasClass("sapUiNotifier")){$.trigger("focus");}else{if(this.hasItems()){var y=this.getNotifiers();if(y.length>0){var z=q(y[0]);z.trigger("focus");}else{var A=this.getMessageNotifier();if(A){q(A).trigger("focus");}}}}break;}}};d.prototype.onThemeChanged=function(i){if(this.getDomRef()){this.invalidate();}};var t=function(j){var u=j.getNotifiers();for(var i=0;i<u.length;i++){var v=u[i];v._oCallout.close();}if(j.getMessageNotifier()){j.getMessageNotifier()._oCallout.close();}};d.prototype.getHeightOfStatus=function(i){var j="";if(i==b.Min){j="sapUiNotificationBarHeightMinimized";}else if(i==b.Default){j="sapUiNotificationBarHeight";}else if(i==b.Max){j="sapUiNotificationBarHeightMaximized";j=P.get(j);var u=j.indexOf("%");if(u!=-1){var v=j.substring(0,u);var H=q(window).height();H=parseInt(H/100*v);var _=parseInt(this.getHeightOfStatus(b.Default));if(H<_){H=_+1;}}else{var x="No valid percantage value given for maximized size. 400px is used";L.warning(x);H=400;}return H+"px";}else{return"0px";}j=P.get(j);return j;};d.prototype.setVisibleStatus=function(i){this._resizeFrom=this.getVisibleStatus();this._resizeTo=i;if(this._resizeFrom!==this._resizeTo){if(i===b.None){t(this);if(this.getDomRef()){p(this,i);}else{this.$().css({"height":"0px","display":"none"});}}this.setProperty("visibleStatus",i);this.fireResize({status:i});}return this;};d.prototype.setAlwaysShowToggler=function(A){if(D.browser.mobile){A=true;}this.setProperty("alwaysShowToggler",A,true);var $=this.$("toggler");if(A){$.css("display","block");}else{$.css("display","none");}return this;};return d;});
