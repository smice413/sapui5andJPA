/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/base/util/restricted/_omit",
	"sap/base/Log",
	"sap/ui/fl/Layer",
	"sap/ui/fl/LayerUtils",
	"sap/ui/fl/Utils",
	"sap/ui/fl/Change",
	"sap/ui/fl/ChangePersistenceFactory",
	"sap/ui/fl/write/_internal/flexState/compVariants/CompVariantState",
	"sap/ui/fl/apply/_internal/flexState/ManifestUtils",
	"sap/ui/fl/apply/_internal/flexState/FlexState",
	"sap/ui/fl/apply/_internal/ChangesController"
], function(
	_omit,
	Log,
	Layer,
	LayerUtils,
	Utils,
	Change,
	ChangePersistenceFactory,
	CompVariantState,
	ManifestUtils,
	FlexState,
	ChangesController
) {
	"use strict";

	/**
	 *
	 *
	 * @namespace sap.ui.fl.apply._internal.flexState.FlexObjectState
	 * @since 1.83
	 * @version 1.84.7
	 * @private
	 * @ui5-restricted sap.ui.fl
	 */
	var FlexObjectState = {};

	function initFlexStateAndSetReference(mPropertyBag) {
		mPropertyBag.reference = ManifestUtils.getFlexReferenceForControl(mPropertyBag.selector);

		return FlexState.initialize({
			componentId: Utils.getAppComponentForControl(mPropertyBag.selector).getId(),
			reference: mPropertyBag.reference,
			componentData: {},
			manifest: {}
		});
	}

	function getCompVariantEntities(mPropertyBag) {
		var mCompEntities = FlexState.getCompEntitiesByIdMap(mPropertyBag.reference);
		return Object.keys(mCompEntities).map(function (sKey) {
			return mCompEntities[sKey];
		});
	}

	function getChangePersistence(mPropertyBag) {
		if (!mPropertyBag.reference) {
			var oAppComponent = ChangesController.getAppComponentForSelector(mPropertyBag.selector);
			mPropertyBag.reference = ManifestUtils.getFlexReferenceForControl(oAppComponent);
		}
		return ChangePersistenceFactory.getChangePersistenceForComponent(mPropertyBag.reference);
	}

	function getChangePersistenceEntities(mPropertyBag) {
		var oChangePersistence = getChangePersistence(mPropertyBag);
		return oChangePersistence.getChangesForComponent(_omit(mPropertyBag, ["invalidateCache", "selector"]), mPropertyBag.invalidateCache);
	}

	/**
	 * Collects changes from the different states within the <code>sap.ui.fl</code>-library.
	 * This includes the flexState entities as well as the <code>sap.ui.fl.ChangePersistence</code>.
	 *
	 * @param {object} mPropertyBag - Object with parameters as properties
	 * @param {sap.ui.fl.Control} mPropertyBag.control - Retrieves the associated flex persistence
	 * @param {boolean} mPropertyBag.invalidateCache - Flag if the cache should be invalidated
	 * @returns {Promise<sap.ui.fl.Change[]>} Flex objects, containing changes, compVariants & changes as well as ctrl_variant and changes
	 */
	FlexObjectState.getFlexObjects = function (mPropertyBag) {
		return initFlexStateAndSetReference(mPropertyBag)
			.then(function () {
				var aCompVariantEntities = getCompVariantEntities(mPropertyBag);
				var aChangePersistenceEntities = getChangePersistenceEntities(mPropertyBag);

				return Promise.all([
					aCompVariantEntities,
					aChangePersistenceEntities
				]).then(function (aEntities) {
					return aEntities[0] // compVariant entities (changes of type defaultVariant / standardVariant, variant)
						.concat(aEntities[1]); // ChangePersistence entities (change, ctrl_variant, ctrl_variant_change, ctrl_variant_management_change)
				});
			});
	};

	return FlexObjectState;
});