sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function (Controller, UIComponent, JSONModel, MessageBox, MessageToast, Fragment) {
    "use strict";
    
    return Controller.extend("kn.common.controller.BaseController", {
    	/**
		 * Convenience method for getting the manifest.json file entry value.
		 * @public
		 * @returns {string} manifest.json file entry value
		 */
		getManifestEntry : function (sEntry) {
			return this.getOwnerComponent().getManifestEntry(sEntry);
		},
		
		getServerUrl: function() {
            return this.getResourceBundle().getText("server.url");
        },
    	
    	getRouter: function () {
            return UIComponent.getRouterFor(this);
        },
        
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },
 
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },
 
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
        
        getResourceBundleCommon: function () {
            return this.getOwnerComponent().getModel("i18nCommon").getResourceBundle();
        },
        
        /**
		 * Event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack : function() {
			var sPreviousHash = sap.ui.core.routing.History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("DashBaord");
			}
		},
        
        openCommonDialog : function (fra, path, ctr) {
        	var that = this;
			if (!fra) {
				fra = Fragment.load({
					name: path,
					controller: ctr
				}).then(function (oDialog) {
					that.getView().addDependent(oDialog);
					return oDialog;
				});
			}
			fra.then(function(oDialog) {
				oDialog.open();
			});
        },
        
        onCloseDialog : function (e) {
        	e.getSource().getParent().destroy();
        },
        
        showAlert: function(msg) { MessageBox.alert(msg); },
        showWarning: function(msg) { MessageBox.warning(msg); },
        showInfo: function(msg) { MessageBox.information(msg); },
		showConfirm: function(msg, callback) {
			MessageBox.confirm(msg, { onClose: callback });
		},
        
		showToast: function(msg, t) {
			MessageToast.show(msg, {duration:t?t:2000, at:'center center'});
		},
        
        onActive: function() {},
        
        callAjax : function(oParam) {  
            console.log("BaseController callAjax() oParam.url: " + oParam.url);
            
            if (!oParam.callback) { return; }
            var that   = this;
            var _oData = oParam.data || '';
			var _contentType = oParam.contentType || "application/json; charset=utf-8";
			var _sType = oParam.type || 'get';
			var _dataType = oParam.dataType || 'json';
			var _sUrl = this.getServerUrl() + oParam.url;

			if(_sType.toLowerCase() != 'get' && typeof _oData == 'object') {
				_oData = JSON.stringify(_oData);
			}
            
            jQuery.ajax({
                type        : _sType,
                data        : _oData,
                contentType : _contentType,
				mediatype   : "application/json",
                url         : _sUrl,
                dataType    : _dataType,
                async       : true,
                success     : 
                    function(oData, textStatus, jqXHR) {
                		sap.ui.core.BusyIndicator.hide();
                        var oModel = new JSONModel();
                        oModel.setData(oData); 
                    
                        var proxyFunc = jQuery.proxy(that, oParam.callback, oModel);
                        proxyFunc();
                    },
                error       : 
                    function(e) {
                		sap.ui.core.BusyIndicator.hide();
                		
                		// 에러 발생 시 활성화된 모든 busyIndicator 비활성화
                		var aControl = window.root.getModel("busyIndicator").getProperty("/busy");
            			for (var oControl of aControl) {
            				oControl.setBusy(false);
            			}
                		
                        var proxyFunc = jQuery.proxy(that, oParam.error);
                        if(proxyFunc){
                        	proxyFunc();
                        } else{
                        	MessageBox.error( "Error occured" );
                        }
                    }
            });
        },
        
        cellClick : function (e) {
			if(!e.getParameters().rowBindingContext){return;}
			var idx = e.getParameters().rowIndex;
			var table = e.getSource();
			if(table.getSelectedIndices().includes(idx)){
				table.removeSelectionInterval(idx, idx);
			}else{
	        	table.addSelectionInterval(idx, idx);
			}
        },
        
		

        nvl: function(obj){
    		return this.nvlTo(obj,"")
    	},
    	
    	nvlTo: function(obj, s){
    		if(obj || obj === 0){ return s; }
    		return obj;
    	},

		setSession: function(k, v){ window.sessionStorage.setItem(k, v); },
		getSession: function(k){ return window.sessionStorage.getItem(k); }		
    });
});