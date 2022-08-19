/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library"],function(c){"use strict";var O=c.Orientation;var S={};S.render=function(r,C){var i=C.getId();var v=C.getOrientation()==O.Vertical;r.write("<div");r.writeControlData(C);r.addClass("sapUiUfdSpltCont");r.addClass("sapUiUfdSpltCont"+(v?"V":"H"));if(sap.ui.getCore().getConfiguration().getAnimation()){r.addClass("sapUiUfdSpltContAnim");}if(!C.getShowSecondaryContent()){r.addClass("sapUiUfdSpltContPaneHidden");}r.writeClasses();r.write(">");var s=i+"-canvas";r.write("<section id='",s,"' class='sapUiUfdSpltContCanvas'>");this.renderContent(r,s,C.getContent(),C._bRootContent);r.write("</section>");var a=i+"-pane";var w=C.getShowSecondaryContent()?C.getSecondaryContentSize():"0";r.write("<aside id='",a,"' style='width:",w,"'");r.addClass("sapUiUfdSpltContPane");if(!C.getShowSecondaryContent()){r.addClass("sapUiUfdSplitContSecondClosed");}r.writeClasses();r.write(">");this.renderContent(r,a,C.getSecondaryContent(),C._bRootContent);r.write("</aside>");r.write("</div>");};S.renderContent=function(r,I,C,R){r.write("<div id='",I,"cntnt' class='sapUiUfdSpltContCntnt'");if(R){r.writeAttribute("data-sap-ui-root-content","true");}r.write(">");for(var i=0;i<C.length;i++){r.renderControl(C[i]);}r.write("</div>");};return S;},true);
