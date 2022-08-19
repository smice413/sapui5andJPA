/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/integration/designtime/editor/fields/BaseField",
	"sap/m/DateTimePicker"
], function (
	BaseField, DateTimePicker
) {
	"use strict";

	/**
	 * @class
	 * @extends sap.ui.integration.designtime.editor.fields.BaseField
	 * @alias sap.ui.integration.designtime.editor.fields.DateTimeField
	 * @author SAP SE
	 * @since 1.83.0
	 * @version 1.84.7
	 * @private
	 * @experimental since 1.83.0
	 * @ui5-restricted
	 */
	var DateTimeField = BaseField.extend("sap.ui.integration.designtime.editor.fields.DateTimeField", {
		renderer: BaseField.getMetadata().getRenderer()
	});

	DateTimeField.prototype.initVisualization = function (oConfig) {
		var oVisualization = oConfig.visualization;
		if (!oVisualization) {
			oVisualization = {
				type: DateTimePicker,
				settings: {
					dateValue: {
						path: 'currentSettings>value', formatter: function (v) {
							return new Date(v);
						}
					},
					editable: { path: 'currentSettings>editable' },
					width: "16rem",
					change: function (oEvent) {
						if (oEvent.getParameters().valid) {
							var oSource = oEvent.getSource();
							oSource.getBinding("dateValue").setRawValue(oSource.getDateValue().toISOString());
							oSource.getBinding("dateValue").checkUpdate();
						} else {
							//TODO:show an error
							var oSource = oEvent.getSource();
							oSource.getBinding("dateValue").setRawValue("");
							oSource.getBinding("dateValue").checkUpdate(true);
						}
					}
				}
			};
		}
		this._visualization = oVisualization;
	};

	return DateTimeField;
});