/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"./BindingHelper",
	"./CardActions",
	"sap/ui/base/Object",
	"sap/base/util/merge",
	"sap/ui/integration/cards/AdaptiveContent",
	"sap/ui/integration/cards/AnalyticalContent",
	"sap/ui/integration/cards/AnalyticsCloudContent",
	"sap/ui/integration/cards/CalendarContent",
	"sap/ui/integration/cards/ComponentContent",
	"sap/ui/integration/cards/ListContent",
	"sap/ui/integration/cards/ObjectContent",
	"sap/ui/integration/cards/TableContent",
	"sap/ui/integration/cards/TimelineContent"
], function (
	BindingHelper,
	CardActions,
	BaseObject,
	merge,
	AdaptiveContent,
	AnalyticalContent,
	AnalyticsCloudContent,
	CalendarContent,
	ComponentContent,
	ListContent,
	ObjectContent,
	TableContent,
	TimelineContent
) {
	"use strict";

	/**
	 * Constructor for a new <code>ContentFactory</code>.
	 *
	 * @class
	 *
	 * @extends sap.ui.base.Object
	 *
	 * @author SAP SE
	 * @version 1.84.7
	 *
	 * @constructor
	 * @private
	 * @alias sap.ui.integration.util.ContentFactory
	 */
	var ContentFactory = BaseObject.extend("sap.ui.integration.util.ContentFactory", {
		constructor: function (oCard) {
			BaseObject.call(this);

			this._oCard = oCard;
		}
	});

	ContentFactory.prototype.create = function (mConfig) {
		var oCard = this._oCard,
			sType = mConfig.cardType;

		return new Promise(function (resolve, reject) {
			var Content = this.getClass(sType);

			if (!Content) {
				reject(sType.toUpperCase() + " content type is not supported.");
				return;
			}

			var oContent = new Content();

			// Set the card ID as association to the content
			oContent.setCard(oCard);

			if (oContent instanceof AdaptiveContent) {
				oContent.setCardDataProvider(oCard._oDataProvider);
			}

			oContent.loadDependencies(mConfig.contentManifest)
				.then(function () {
					if ((mConfig.cardManifest && mConfig.cardManifest.isDestroyed()) ||
						(mConfig.dataProviderFactory && mConfig.dataProviderFactory.isDestroyed())) {
						// reject creating of the content if a new manifest is loaded meanwhile
						reject();
						return;
					}

					var oActions = new CardActions({
						card: oCard
					});

					oContent._sAppId = mConfig.appId;
					oContent.setServiceManager(mConfig.serviceManager);
					oContent.setDataProviderFactory(mConfig.dataProviderFactory);
					oContent.setIconFormatter(mConfig.iconFormatter);
					oContent.setActions(oActions);

					if (sType.toLowerCase() !== "adaptivecard") {
						oContent.setConfiguration(this._createBindingInfos(mConfig.contentManifest), sType);
					} else {
						oContent.setConfiguration(mConfig.contentManifest);
					}
					resolve(oContent);
				}.bind(this))
				.catch(function (sError) {
					reject(sError);
				});
		}.bind(this));
	};

	/**
	 * Returns the class that represents the content of the given type.
	 * @param {string} sType The type.
	 * @returns {sap.ui.integration.cards.BaseContent} The corresponding class.
	 */
	ContentFactory.prototype.getClass = function (sType) {
		switch (sType.toLowerCase()) {
			case "adaptivecard":
				return AdaptiveContent;
			case "analytical":
				return AnalyticalContent;
			case "analyticscloud":
				return AnalyticsCloudContent;
			case "calendar":
				return CalendarContent;
			case "component":
				return ComponentContent;
			case "list":
				return ListContent;
			case "object":
				return ObjectContent;
			case "table":
				return TableContent;
			case "timeline":
				return TimelineContent;
			default:
				return null;
		}
	};

	ContentFactory.prototype._createBindingInfos = function (oContentManifest) {
		var oResult = merge({}, oContentManifest),
			oDataSettings = oResult.data;

		// do not create binding info for data at this point, it will be done later
		delete oResult.data;
		oResult = BindingHelper.createBindingInfos(oResult);
		if (oDataSettings) {
			oResult.data = oDataSettings;
		}

		return oResult;
	};

	return ContentFactory;
});
