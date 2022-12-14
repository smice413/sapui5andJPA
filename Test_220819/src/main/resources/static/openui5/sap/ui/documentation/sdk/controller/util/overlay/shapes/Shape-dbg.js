/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([], function () {
	"use strict";

	/**
	 *
	 * @constructor
	 */
	function Shape() {
		this.oContainer = null;
	}

	Shape.extend = function () {
		var fnConstructor = function () {};
		fnConstructor.prototype = new Shape();
		fnConstructor.prototype.constructor = fnConstructor;

		return fnConstructor;
	};

	/**
	 *
	 * @param sSvgNamespace {string} namespace to the svg library
	 * @param sShape {string} shape type
	 * @return {Shape} SVGSVGElement
	 */
	Shape.prototype.createShape = function (sSvgNamespace, sShape) {
		this.oContainer = document.createElementNS(sSvgNamespace, sShape);
		this.oContainer.classList.add('shape');
		this.oContainer.classList.add(sShape);

		return this;
	};

	/**
	 * Changes the shape coordinates
	 * @param sCoords {string} shape's new coordinates
	 */
	Shape.prototype.setPosition = function (sCoords) {
		// override
	};

	Shape.prototype.show = function () {
		this.oContainer.style.opacity = '1';
	};

	Shape.prototype.hide = function () {
		this.oContainer.style.opacity = '0';
	};

	return Shape;
});