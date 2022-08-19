/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(
	[
		"sap/m/library",
		"sap/ui/mdc/filterbar/FilterBarBase",
		"sap/ui/mdc/filterbar/FilterBarBaseRenderer",
		"sap/ui/mdc/filterbar/aligned/FilterItemLayout",
		"sap/ui/mdc/filterbar/vh/FilterContainer",
		"sap/m/Button"
	],
	function (
		mLibrary,
		FilterBarBase,
		FilterBarBaseRenderer,
		FilterItemLayout,
		FilterContainer,
		Button
	) {
		"use strict";

		/**
		 * Constructor for a new FilterBar.
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSettings] initial settings for the new control
		 * @class The <code>FilterBar</code> control is used to display filter properties in a user-friendly manner to populate values for a query.
		 * The filters are arranged in a logical row that is divided depending on the space available and the width of the filters.
		 * The Go button triggers the search event, and the Show Filters button shows the additional filter field.<br>
		 * The <code>FilterBar</code> control creates and handles the filters based on the provided metadata information.
		 * The metadata information is provided via the {@link sap.ui.mdc.FilterBarDelegate FilterBarDelegate} implementation. This implementation has to be provided by the application.
		 * @extends sap.ui.mdc.filterbar.FilterBarBase
		 * @author SAP SE
		 * @version 1.84.7
		 * @constructor
		 * @protected
		 * @since 1.84.0
		 * @alias sap.ui.mdc.filterbar.vh.FilterBar
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var FilterBar = FilterBarBase.extend(
			"sap.ui.mdc.filterbar.vh.FilterBar",
			{
				metadata: {
					properties: {
						/**
						 * Determines whether the Filters button is visible in the filter bar.<br>
						 */
						showFilterFields: {
							type: "boolean",
							defaultValue: true
						}
					}
				},

				renderer: FilterBarBaseRenderer
			}
		);

		var ButtonType = mLibrary.ButtonType;

		FilterBar.prototype._createInnerLayout = function () {
			this._cLayoutItem = FilterItemLayout;

			this._oFilterBarLayout = new FilterContainer(this.getId() + "-innerLayout");
			this.setAggregation("layout", this._oFilterBarLayout, true);


			this._oBtnFilters = new Button(this.getId() + "-btnShowFilters", {
				type: ButtonType.Transparent,
				press: this._onToggleFilters.bind(this)
			}).setText(
				this._oRb.getText("valuehelp." + (this.getProperty("showFilterFields") ? "HIDE" : "SHOW") + "ADVSEARCH")
			);

			this._oFilterBarLayout.addControl(this._oBtnFilters);


			this._oFilterBarLayout.addControl(
				this._getSearchButton().bindProperty("visible", "{$sap.ui.filterbar.mdc.FilterBarBase>/liveMode}")
			);


			// this._oShowAllFiltersBtn = new Button(this.getId() + "-btnShowAllFilters", {
			// 	type: ButtonType.Transparent,
			// 	press: this._onShowAllFilters.bind(this)
			// }).setText(
			// 	"Show All Filters" //this._oRb.getText("valuehelp.SHOWADVSEARCH")
			// );
			// this._oFilterBarLayout.addEndContent(this._oShowAllFiltersBtn);
		};

		FilterBar.prototype.exit = function() {
			FilterBarBase.prototype.exit.apply(this, arguments);
			this._oBasicSearchField = null;
			this._oBtnFilters = null;
		};

		FilterBar.prototype._onToggleFilters = function (oEvent) {
			this.setProperty("showFilterFields", !this.getProperty("showFilterFields"), true);

			this._oBtnFilters.setText(
				this._oRb.getText("valuehelp." + (this.getProperty("showFilterFields") ? "HIDE" : "SHOW") + "ADVSEARCH")
			);

		};

		// FilterBar.prototype._onShowAllFilters = function (oEvent) {
		// 	this._bShowAllFilters = true;

		// 	// Fake example for ShowAllfilters
		// 	this.addFilterItem(new sap.ui.mdc.FilterField({
		// 		delegate: { name: "sap/ui/mdc/odata/v4/FieldBaseDelegate", payload: {} },
		// 		label: "ID 2",
		// 		dataType: "Edm.Int32",
		// 		conditions: "{$filters>/conditions/ID}"
		// 	}));

		// 	// Hide the endContent button
		// 	this._oShowAllFiltersBtn.setVisible(!this._bShowAllFilters);
		// };

		FilterBar.prototype.setBasicSearchField = function (oBasicSearchField) {
			if (this._oBasicSearchField) {
				if (this._oFilterBarLayout) {
					this._oFilterBarLayout.removeControl(this._oBasicSearchField);
				}
			}
			this._oBasicSearchField = oBasicSearchField;
			if (this._oFilterBarLayout) {
				this._oFilterBarLayout.insertControl(oBasicSearchField, 0);
			}
		};

		FilterBar.prototype.getBasicSearchField = function () {
			return this._oBasicSearchField;
		};

		return FilterBar;
	}
);
