/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(function() {
	"use strict";

	/**
	 * Defines in what mode a <code>Field</code> or <code>FilterField</code> is rendered.
	 *
	 * @enum {string}
	 * @private
	 * @ui5-restricted sap.ui.mdc, sap.fe
	 * @since 1.48.1
	 * @alias sap.ui.mdc.enum.EditMode
	 */
	var EditMode = {
		/**
		 * <code>Field</code> or <code>FilterField</code> is rendered in display mode
		 * @private
		 * @ui5-restricted sap.ui.mdc, sap.fe
		 */
		Display: "Display",
		/**
		 * <code>Field</code> or <code>FilterField</code> is rendered in editable mode
		 * @private
		 * @ui5-restricted sap.ui.mdc, sap.fe
		 */
		Editable: "Editable",
		/**
		 * <code>Field</code> or <code>FilterField</code> is rendered in read-only mode
		 * @private
		 * @ui5-restricted sap.ui.mdc, sap.fe
		 */
		ReadOnly: "ReadOnly",
		/**
		 * <code>Field</code> or <code>FilterField</code> is rendered in disabled mode
		 * @private
		 * @ui5-restricted sap.ui.mdc, sap.fe
		 */
		Disabled: "Disabled",
		/**
		 * If more then one control is rendered by the <code>Field</code> or <code>FilterField</code> control,
		 * the first part is editable, and the other parts are read-only.
		 * @since 1.72.0
		 * @private
		 * @ui5-restricted sap.ui.mdc, sap.fe
		 */
		EditableReadOnly: "EditableReadOnly",
		/**
		 * If more then one control is rendered by the <code>Field</code> or <code>FilterField</code> control,
		 * the first part is editable, and the other parts are in display mode.
		 * @since 1.72.0
		 * @private
		 * @ui5-restricted sap.ui.mdc, sap.fe
		 */
		EditableDisplay: "EditableDisplay"
	};

	return EditMode;

}, /* bExport= */ true);
