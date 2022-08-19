/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";function T(p){this.oContainer=document.createElement('div');this.oContainer.classList.add("area-tooltip");if(p){this.attachTo(p);}}T.prototype.attachTo=function(p){this.oParent=p;this.oParent.appendChild(this.oContainer);};T.prototype.setText=function(t){this.oContainer.innerText=t;};T.prototype.getBounds=function(){return{offsetHeight:this.oContainer.offsetHeight,offsetWidth:this.oContainer.offsetWidth};};T.prototype.setPosition=function(p){this.oContainer.style.top=p.top+'px';this.oContainer.style.left=p.left+'px';};T.prototype.show=function(){this.oContainer.style.opacity="1";};T.prototype.hide=function(){this.oContainer.style.opacity="0";};return T;});
