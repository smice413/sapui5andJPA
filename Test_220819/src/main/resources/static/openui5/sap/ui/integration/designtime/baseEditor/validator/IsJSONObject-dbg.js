/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/integration/designtime/baseEditor/validator/IsValidBinding",
	"sap/base/util/restricted/_isNil"
], function (
	IsValidBinding,
	_isNil
) {
	"use strict";

	/**
	 * Validates if the provided value is a boolean or binding string.
	 *
	 * @namespace sap.ui.integration.designtime.baseEditor.validator.IsJSONObject
	 * @author SAP SE
	 * @version 1.84.7
	 *
	 * @static
	 * @since 1.85
	 * @public
	 * @experimental 1.85
	 */
	return {
		async: false,
		errorMessage: "BASE_EDITOR.VALIDATOR.NOT_A_JSONOBJECT",
		/**
		 * Validator function
		 *
		 * @param {object} vValue - Value to validate
		 * @returns {boolean} Validation result
		 *
		 * @public
		 * @function
		 * @name sap.ui.integration.designtime.baseEditor.validator.IsJSONObject.validate
		 */
		validate: function (vValue) {
			var isJSONObject = false;
			if (typeof vValue === "object" && Object.prototype.toString.call(vValue).toLowerCase() === "[object object]" && !vValue.length) {
				isJSONObject = true;
			}
			return _isNil(vValue)
				|| isJSONObject
				|| IsValidBinding.validate(vValue, { allowPlainStrings: false });
		}
	};
});
