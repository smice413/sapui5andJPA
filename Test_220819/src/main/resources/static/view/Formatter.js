sap.ui.define([], function() {
	"use strict";
	return {
		comSubCdNm : function (code) {
			if(!code){return;}
			var oData = window.index.getModel("address").getProperty("/");
			for(var data of oData){
				if(code == data.subCd) return data.subCdNm;
			}
			
			
		}
	};
});