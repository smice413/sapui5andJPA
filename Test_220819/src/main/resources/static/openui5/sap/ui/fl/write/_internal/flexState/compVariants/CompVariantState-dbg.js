/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/fl/Layer",
	"sap/ui/fl/Change",
	"sap/ui/fl/Utils",
	"sap/ui/fl/apply/_internal/flexState/FlexState",
	"sap/ui/fl/write/_internal/Storage"
], function(
	Layer,
	Change,
	Utils,
	FlexState,
	Storage
) {
	"use strict";

	function getCategory(oChangeContent) {
		switch (oChangeContent.fileType) {
			case "change":
			case "variant":
				return "changes";
			case "comp_variant_change":
				return "compVariantChanges";
			default:
		}
	}

	function addChange(mPropertyBag, oFlexObjects) {
		var oChangeContent = mPropertyBag.changeToBeAddedOrDeleted.getDefinition();
		var sChangeCategory = getCategory(oChangeContent);
		oFlexObjects[sChangeCategory].push(oChangeContent);
		var sId = oChangeContent.fileName;
		var mCompVariantsMapById = FlexState.getCompEntitiesByIdMap(mPropertyBag.reference);
		mCompVariantsMapById[sId] = oChangeContent;
	}

	function deleteChange(mPropertyBag, oFlexObjects) {
		var oChangeContent = mPropertyBag.changeToBeAddedOrDeleted.getDefinition();
		var sChangeCategory = getCategory(oChangeContent);
		var iChangeContentIndex = -1;
		oFlexObjects[sChangeCategory].some(function(oExistingChangeContent, iIndex) {
			if (oExistingChangeContent.fileName === oChangeContent.fileName) {
				iChangeContentIndex = iIndex;
				return true;
			}
		});
		if (iChangeContentIndex > -1) {
			oFlexObjects[sChangeCategory].splice(iChangeContentIndex, 1);
		}

		var mCompVariantsMapById = FlexState.getCompEntitiesByIdMap(mPropertyBag.reference);
		delete mCompVariantsMapById[oChangeContent.fileName];
	}

	function createOrUpdateChange(mPropertyBag, oContent, sChangeType) {
		var mCompVariantsByIdMap = FlexState.getCompVariantsMap(mPropertyBag.reference)._getOrCreate(mPropertyBag.persistencyKey);
		// only create a new entity in case none exists
		if (!mCompVariantsByIdMap[sChangeType]) {
			var oChangeParameter = {
				fileName: Utils.createDefaultFileName(sChangeType),
				fileType: "change",
				changeType: sChangeType,
				layer: Layer.USER,
				reference: mPropertyBag.reference,
				selector: {
					persistencyKey: mPropertyBag.persistencyKey
				},
				support: {
					generator: mPropertyBag.generator || "CompVariantState." + sChangeType,
					sapui5Version: sap.ui.version
				}
			};
			if (mPropertyBag.compositeCommand) {
				oChangeParameter.support.generator.compositeCommand = mPropertyBag.compositeCommand;
			}

			var oChange = new Change(Change.createInitialFileContent(oChangeParameter));
			mCompVariantsByIdMap[sChangeType] = oChange;
			FlexState.getCompEntitiesByIdMap(mPropertyBag.reference)[oChange.getId()] = oChange;
		}

		//TODO: react accordingly on layering as soon as non-User layers are possible
		mCompVariantsByIdMap[sChangeType].setContent(oContent);

		return mCompVariantsByIdMap[sChangeType];
	}

	function removeFromArrayByName(aObjectArray, oFlexObject) {
		for (var i = 0; i < aObjectArray.length; i++) {
			//aObjectArray can come from either back end response or flex state
			//In the first case, the fileName is a direct property of object
			//In the second case, it can be obtained from getFileName() function
			if ((aObjectArray[i].fileName || aObjectArray[i].getFileName()) === oFlexObject.fileName) {
				aObjectArray.splice(i, 1);
				break;
			}
		}
	}

	function getSubSection(mMap, oFlexObject) {
		if (oFlexObject.isVariant()) {
			return mMap.variants;
		}

		switch (oFlexObject.getChangeType()) {
			case "defaultVariant":
				return mMap.defaultVariants;
			case "standardVariant":
				return mMap.standardVariants;
			default:
				return mMap.changes;
		}
	}

	function writeObjectAndAddToState(oFlexObject, oStoredResponse) {
		// TODO: remove this line as soon as layering and a condensing is in place
		return Storage.write({
			flexObjects : [oFlexObject.getDefinition()],
			layer : oFlexObject.getLayer(),
			transport : oFlexObject.getRequest(),
			isLegacyVariant : oFlexObject.isVariant()
		}).then(function (result) {
			// updateFlexObject
			if (result && result.response && result.response[0]) {
				oFlexObject.setResponse(result.response[0]);
			} else {
				oFlexObject.setState(Change.states.PERSISTED);
			}

			return oStoredResponse;
		}).then(function (oStoredResponse) {
			// update StorageResponse
			getSubSection(oStoredResponse.changes.comp, oFlexObject).push(oFlexObject.getDefinition());
			return oFlexObject.getDefinition();
		});
	}

	function updateArrayByName(aObjectArray, oFlexObject) {
		for (var i = 0; i < aObjectArray.length; i++) {
			if (aObjectArray[i].fileName === oFlexObject.fileName) {
				aObjectArray.splice(i, 1, oFlexObject);
				break;
			}
		}
	}

	function updateObjectAndStorage(oFlexObject, oStoredResponse) {
		return Storage.update({
			flexObject: oFlexObject.getDefinition(),
			layer: oFlexObject.getLayer(),
			transport: oFlexObject.getRequest()
		}).then(function (result) {
			// update FlexObject
			if (result && result.response) {
				oFlexObject.setResponse(result.response);
			} else {
				oFlexObject.setState(Change.states.PERSISTED);
			}

			return oStoredResponse;
		}).then(function (oStoredResponse) {
			// update StorageResponse
			var aObjectArray = getSubSection(oStoredResponse.changes.comp, oFlexObject);
			updateArrayByName(aObjectArray, oFlexObject.getDefinition());
			return oFlexObject.getDefinition();
		});
	}

	function deleteObjectAndRemoveFromStorage(oFlexObject, mCompEntitiesById, mCompVariantsMapByPersistencyKey, oStoredResponse) {
		return Storage.remove({
			flexObject: oFlexObject.getDefinition(),
			layer: oFlexObject.getLayer(),
			transport: oFlexObject.getRequest()
		}).then(function () {
			// update compVariantsMap
			delete mCompEntitiesById[oFlexObject.getId()];
			if (oFlexObject.getChangeType() === "standardVariant") {
				mCompVariantsMapByPersistencyKey.standardVariant = undefined;
			} else if (oFlexObject.getChangeType() === "defaultVariant") {
				mCompVariantsMapByPersistencyKey.defaultVariant = undefined;
			} else {
				removeFromArrayByName(getSubSection(mCompVariantsMapByPersistencyKey, oFlexObject), oFlexObject.getDefinition());
			}
			return oStoredResponse;
		}).then(function (oStoredResponse) {
			// update StorageResponse
			removeFromArrayByName(getSubSection(oStoredResponse.changes.comp, oFlexObject), oFlexObject.getDefinition());
			return oFlexObject.getDefinition();
		});
	}

	function needsPersistencyCall(oFlexObject) {
		return oFlexObject &&
			(oFlexObject.getPendingAction() === "NEW"
				|| oFlexObject.getPendingAction() === "UPDATE"
				|| oFlexObject.getPendingAction() === "DELETE");
	}

	function getAllCompVariantObjects(mCompVariantsMapByPersistencyKey) {
		return mCompVariantsMapByPersistencyKey.variants
			.concat(mCompVariantsMapByPersistencyKey.changes)
			.concat(mCompVariantsMapByPersistencyKey.defaultVariant)
			.concat(mCompVariantsMapByPersistencyKey.standardVariant);
	}

	function getTexts(oChangeSpecificData) {
		var mInternalTexts = {};
		if (typeof (oChangeSpecificData.texts) === "object") {
			Object.keys(oChangeSpecificData.texts).forEach(function (key) {
				mInternalTexts[key] = {
					value: oChangeSpecificData.texts[key],
					type: "XFLD"
				};
			});
		}
		return mInternalTexts;
	}

	/**
	 * CompVariant state class to handle the state of the compVariants and its changes.
	 * This class is in charge of updating the maps stored in the <code>sap.ui.fl.apply._internal.flexState.FlexState</code>.
	 *
	 * @namespace sap.ui.fl.apply._internal.flexState.compVariants.CompVariantState
	 * @since 1.83
	 * @version 1.84.7
	 * @private
	 * @ui5-restricted sap.ui.fl
	 */
	var CompVariantState = {};

	/**
	 * Creates a change to set which variant should be selected at the application start-up.
	 *
	 * @param {object} mPropertyBag - Map of parameters, see below
	 * @param {string} mPropertyBag.reference - Flex reference of the application
	 * @param {string} mPropertyBag.persistencyKey - ID of the variant management internal identifier
	 * @param {string} mPropertyBag.defaultVariantId - ID of the variant which should be selected at start-up
	 * @param {string} [mPropertyBag.generator] - Generator of changes
	 * @param {string} [mPropertyBag.compositeCommand] - Name of the command calling the API
	 * @returns {sap.ui.fl.Change} Created or updated change object in charge for setting the default variant
	 */
	CompVariantState.setDefault = function (mPropertyBag) {
		var oContent = {
			defaultVariantName: mPropertyBag.defaultVariantId
		};

		return createOrUpdateChange(mPropertyBag, oContent, "defaultVariant");
	};

	/**
	 * Creates a change to set if a given standard variant should be executed automatically or not.
	 *
	 * @param {object} mPropertyBag - Map of parameters, see below
	 * @param {string} mPropertyBag.reference - Flex reference of the application
	 * @param {boolean} mPropertyBag.persistencyKey - Flag if the variant should be executed
	 * @param {string} mPropertyBag.executeOnSelect - ID of the variant which should be selected at start-up
	 * @param {string} [mPropertyBag.generator] - Generator of changes
	 * @param {string} [mPropertyBag.compositeCommand] - Name of the command calling the API
	 * @returns {sap.ui.fl.Change} Created or updated change object in charge for setting the executeOnSelect flag in the standard variant
	 */
	CompVariantState.setExecuteOnSelect = function (mPropertyBag) {
		var oContent = {
			executeOnSelect: mPropertyBag.executeOnSelect
		};

		return createOrUpdateChange(mPropertyBag, oContent, "standardVariant");
	};

	/**
	 * Adds a new variant or change (addFavorite & removeFavorite) for a smart variant, such as filter bar or table, and returns the ID of the new change.
	 *
	 * @param {object} mPropertyBag - Map of parameters, see below
	 * @param {string} mPropertyBag.type - Type <filterVariant, tableVariant, etc>
	 * @param {string} mPropertyBag.reference - Flex reference of the application
	 * @param {string} mPropertyBag.persistencyKey - ID of the variant management internal identifier
	 * @param {object} mPropertyBag.changeSpecificData - Data set defining the object to be added
	 * @param {string} mPropertyBag.ODataService - Name of the OData service --> can be null
	 * @param {object} mPropertyBag.texts - A map object containing all translatable texts which are referenced within the file
	 * @param {object} mPropertyBag.content - Content of the new change
	 * @param {boolean} mPropertyBag.isVariant - Indicates if the change is a variant
	 * @param {string} [mPropertyBag.packageName] - Package name for the new entity, <default> is $tmp
	 * @param {boolean} mPropertyBag.isUserDependent - Indicates if a change is only valid for the current user
	 * @param {boolean} [mPropertyBag.id] - ID of the change. The ID has to be globally unique and should only be set in exceptional cases, for example
	 *        downport of variants
	 * @returns {string} The ID of the newly created change or variant
	 * @public
	 */
	CompVariantState.add = function(mPropertyBag) {
		if (!mPropertyBag) {
			return undefined;
		}

		var oChangeSpecificData = mPropertyBag.changeSpecificData;

		var oInfo = {
			changeType: oChangeSpecificData.type,
			service: oChangeSpecificData.ODataService,
			content: oChangeSpecificData.content,
			reference: mPropertyBag.reference,
			isVariant: oChangeSpecificData.isVariant,
			packageName: oChangeSpecificData.packageName,
			isUserDependent: oChangeSpecificData.isUserDependent,
			selector: {
				persistencyKey: mPropertyBag.persistencyKey
			},
			texts: getTexts(oChangeSpecificData)
		};

		var oFile = Change.createInitialFileContent(oInfo);
		var oFlexObject = new Change(oFile); // the class is sap.ui.fl.Change but it may be of the fileType variant

		var mCompVariantsMap = FlexState.getCompVariantsMap(mPropertyBag.reference);
		var oMapOfPersistencyKey = mCompVariantsMap._getOrCreate(mPropertyBag.persistencyKey);

		getSubSection(oMapOfPersistencyKey, oFlexObject).push(oFlexObject);
		var sId = oFlexObject.getId();
		var mCompVariantsMapById = FlexState.getCompEntitiesByIdMap(mPropertyBag.reference);
		mCompVariantsMapById[sId] = oFlexObject;
		return sId;
	};

	/**
	 * Adds the definitions of flex objects to the FlexState in their current state (dirty with NEW or DELETE).
	 * This function must be called after the CompVariantsMap for the given application was created.
	 *
	 * @param {object} mPropertyBag - Map of parameters, see below
	 * @param {string} mPropertyBag.reference - Flex reference of the app
	 * @param {sap.ui.fl.Change} mPropertyBag.changeToBeAddedOrDeleted - Change object which should be modified
	 */
	CompVariantState.updateState = function(mPropertyBag) {
		var oFlexObjects = FlexState.getFlexObjectsFromStorageResponse(mPropertyBag.reference);

		if (mPropertyBag.changeToBeAddedOrDeleted) {
			switch (mPropertyBag.changeToBeAddedOrDeleted.getPendingAction()) {
				case "NEW":
					addChange(mPropertyBag, oFlexObjects);
					break;
				case "DELETE":
					deleteChange(mPropertyBag, oFlexObjects);
					break;
				default:
					break;
			}
		}
	};

	/**
	 * Saves/flushes all current changes and variants of a smart variant.
	 *
	 * @param {object} mPropertyBag - Map of parameters, see below
	 * @param {string} mPropertyBag.reference - Flex reference of the app
	 *
	 * @returns {Promise} Promise resolving with an array of responses or rejecting with the first error
	 * @private
	 */
	CompVariantState.persist = function(mPropertyBag) {
		var sReference = mPropertyBag.reference;
		var sPersistencyKey = mPropertyBag.persistencyKey;
		var mCompVariantsMap = FlexState.getCompVariantsMap(sReference);
		var mCompVariantsMapByPersistencyKey = mCompVariantsMap._getOrCreate(sPersistencyKey);
		var mCompEntitiesById = FlexState.getCompEntitiesByIdMap(sReference);
		var oStoredResponse = FlexState.getStorageResponse(sReference);

		var aPromises = getAllCompVariantObjects(mCompVariantsMapByPersistencyKey)
			.filter(needsPersistencyCall)
			.map(function (oFlexObject) {
				switch (oFlexObject.getPendingAction()) {
					case "NEW":
						return writeObjectAndAddToState(oFlexObject, oStoredResponse);
					case "UPDATE":
						return updateObjectAndStorage(oFlexObject, oStoredResponse);
					case "DELETE":
						return deleteObjectAndRemoveFromStorage(oFlexObject, mCompEntitiesById, mCompVariantsMapByPersistencyKey, oStoredResponse);
					default:
						break;
				}
			});

		// TODO Consider not rejecting with first error, but wait for all promises and collect the results
		return Promise.all(aPromises);
	};


	return CompVariantState;
});