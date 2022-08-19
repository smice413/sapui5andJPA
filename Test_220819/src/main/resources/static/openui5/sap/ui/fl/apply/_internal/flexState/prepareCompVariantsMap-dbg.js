/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/base/util/ObjectPath",
	"sap/base/util/isEmptyObject",
	"sap/ui/fl/Change"
], function(
	ObjectPath,
	isEmptyObject,
	Change
) {
	"use strict";

	function getOrCreate(mMap, sKey) {
		mMap[sKey] = mMap[sKey] || {
			variants: [],
			changes: [],
			defaultVariant: undefined,
			standardVariant: undefined
		};

		return mMap[sKey];
	}

	function buildSectionMap(mCompSection, sSubSection, mById, mCompVariants) {
		var aFlexObjects = mCompSection[sSubSection].map(function (oCompVariantChangeDefinition) {
			var oChange = new Change(oCompVariantChangeDefinition);
			oChange.setState(Change.states.PERSISTED); // prevent persisting these anew
			return oChange;
		});

		aFlexObjects.forEach(function (oFlexObject) {
			mById[oFlexObject.getId()] = oFlexObject;
			var sPersistencyKey = oFlexObject.getSelector().persistencyKey;

			switch (sSubSection) {
				case "defaultVariants":
					getOrCreate(mCompVariants, sPersistencyKey)["defaultVariant"] = oFlexObject;
					break;
				case "standardVariants":
					getOrCreate(mCompVariants, sPersistencyKey)["standardVariant"] = oFlexObject;
					break;
				default:
					getOrCreate(mCompVariants, sPersistencyKey)[sSubSection].push(oFlexObject);
			}
		});
	}

	/**
	 * Prepares the CompVariants from the flex response.
	 *
	 * @function
	 * @since 1.83
	 * @private
	 * @ui5-restricted sap/ui/fl/apply/_internal/flexState/FlexState
	 * @alias module:sap/ui/fl/apply/_internal/flexState/prepareChangesMap
	 *
	 * @param {object} mPropertyBag - Contains additional data needed for preparing the map
	 * @param {object} mPropertyBag.storageResponse - Storage response with the flex data
	 * @returns {object} The prepared map for compVariants
	 */
	return function(mPropertyBag) {
		var mById = {};
		var mCompVariants = {};

		// provide the function for fl-internal consumers reuse
		mCompVariants._getOrCreate = getOrCreate.bind(undefined, mCompVariants);

		// check for the existence due to test mocks
		if (mPropertyBag.storageResponse.changes.comp) {
			["variants", "changes", "defaultVariants", "standardVariants"].forEach(function (sSection) {
				buildSectionMap(mPropertyBag.storageResponse.changes.comp, sSection, mById, mCompVariants);
			});
		}

		return {
			map: mCompVariants,
			byId: mById
		};
	};
});
