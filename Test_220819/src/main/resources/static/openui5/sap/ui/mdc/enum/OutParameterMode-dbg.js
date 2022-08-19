/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(function() {
	"use strict";

	/**
	 * Defines the mode of the <code>OutParameter</code> element.
	 *
	 * @enum {string}
	 * @private
	 * @ui5-restricted sap.ui.mdc, sap.fe
	 * @since 1.66.0
	 * @alias sap.ui.mdc.enum.OutParameterMode
	 */
	var OutParameterMode = {
		/**
		 * The value in the <code>OutParameter</code> element is always set
		 * @private
		 * @ui5-restricted sap.ui.mdc, sap.fe
		 */
		Always: "Always",
		/**
		 * The value in the<code>OutParameter</code> element is only set if it was empty before
		 * @private
		 * @ui5-restricted sap.ui.mdc, sap.fe
		 */
		WhenEmpty: "WhenEmpty"
	};

	return OutParameterMode;

}, /* bExport= */ true);
