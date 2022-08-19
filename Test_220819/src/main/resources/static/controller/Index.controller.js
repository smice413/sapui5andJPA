sap.ui.define([
	"root/controller/BaseController",
	'sap/ui/model/json/JSONModel',
	"sap/ui/core/Fragment",
	"view/Formatter",
], function(BaseController, JSONModel, Fragment, Formatter){
    "use strict";
	
	return BaseController.extend("kn.farm.controller.contents.fmi.Fmi", {
		onInit : function () {
			window.index = this;
			this.onfindBySub1();
			this.onfindAll();
			this.table= this.byId("table");

		},
		comSubCdNm : function(code) {return Formatter.comSubCdNm(code)},
		
		//메인화면 list 구해오기
		onfindAll: function() {
			this.callAjax({
				url : "/findAll",
				type: "post",
				dataType: "json",
				callback: "onCallList"
			});
		},
		
			// 콤보박스에 나올 sub1지역 DB에서 구해오기
		onfindBySub1 : function(){
			
			this.callAjax({
				url : "/findBySub1",
				type : "post",
				callback : "sub1List"
			});
		},
		
		// 구해온 sub1 또는 comsubcd 콤보박스에 뿌려주기
		sub1List : function(sub1list){
			
			console.log(sub1list)
			this.setModel(new JSONModel(sub1list.oData), "address"); 
			this.getModel("address");
		
		},
		
		//comSubCdNm : function(code) {return Formatter.comSubCdNm(code)},
		
		//메인화면 구해온 list 뿌려주기
		onCallList: function(olist){
			this.setModel(olist, "test");
			//var col111=this.getModel("test").getProperty("/0/col1");
			//console.log(col111)
			var array = [];
			var data = olist.getData();
			
			
			/*for(let oData of data){
				array.push(oData.col1);
			}
			console.log(array);*/
			data.forEach(function(e){
				array.push(e.col1);
			});
			//console.log(array);
			this.setModel(new JSONModel(array), "checkCol1");
			
		},
		
			
		
		
// cellClick: 이 이벤트는 class sap.ui.table.Table에 있는 것으로 getSource, getParameters의 매개변수가 있고, getParameters의 매개변수에 cellControl, cellDomRef,rowIndex, columnIndex, columnId, rowBindingContext가 있다.
		cellClick : function (e) {
			if(!e.getParameters().rowBindingContext){return;} 
			//rowBindingContext: 선택한 셀의 행 바인딩 컨텍스트
			var idx = e.getParameters().rowIndex; // 행의 인덱스 값을 구해옴
			console.log(idx);
			var table = e.getSource();
			if(table.getSelectedIndices().includes(idx)){ 
				this.onPressDetailDialog();
// getSelectedIndices: 배열에 래핑된 선택된 항목의 0부터 시작하는 인덱스입니다. 빈 배열은 "선택 사항 없음"을 의미합니다. 선택한 인덱스를 배열로 반환합니다.
// includes(idx) : includes()메서드는 배열이 항목 사이에 특정 값을 포함하는지 여부를 확인하여 적절하게 반환합니다 true/false.
				table.removeSelectionInterval(idx, idx);
// .removeSelectionInterval(iIndexFrom, iIndexTo) : 선택 항목에서 지정된 선택 간격을 제거합니다. 단일 선택의 경우 선택에서만 iIndexTo제거됩니다.
// iIndexFrom: 선택 해제를 시작해야 하는 인덱스 iIndexTo: 선택을 취소할 최대 인덱스
			}else{
	        	table.addSelectionInterval(idx, idx);
//.addSelectionInterval(iIndexFrom, iIndexTo) : 지정된 선택 간격을 선택 항목에 추가합니다. 단일 선택의 경우 선택 항목에만 iIndexTo추가됩니다.
			}
			var testdata = this.getModel("test").getProperty("/"+idx);
			//var testdata= this.getModel("test").getProperty("/"+[idx]);
			console.log(testdata);
			this.setModel(new JSONModel(testdata), "detail");
			
        },
		
		// 상세보기 Dialog open
		onPressDetailDialog: function(){
			var oView = this.getView();
			var that = this;
			if(!this._detailDialog){
				this._detailDialog = Fragment.load({
					id : oView.getId(),
					name : "view.DetailDialog",
					controller : this
				}).then(function (oDialog) {
					that.getView().addDependent(oDialog);
					
					return oDialog;
				});
			}
			this._detailDialog.then(function(oDialog) {
				oDialog.open();
			});
		},
		// 상세보기 Dialog X버튼 클릭이벤트 close
		onPressCloseDetailDialog : function(){
			var that = this;
			this._detailDialog.then(function(oDialog){
				that.table.clearSelection();
				that.setModel(new JSONModel(), "detail");
				//oDialog.removeContent(__dialog0);
				oDialog.close();
			});
		},




		/*onfindById : function () {
			this.callAjax({
				url : "/findBy",
				type : "post",
				data : "col1",
				callback : "detail"				
				
			});
		},
		
		detail : function (detailview) {
				 this.setModel(new JSONModel(detailview), "detail");
				
		},*/
		
	
		
		
		// 등록버튼 클릭 이벤트
		onPressInsert: function() {
			
			/*if(this.table.getSelectedIndex() != -1){
				// 인덱스 값이 하나만 뜨는 메소드, -1은 선택이 되지 않았을 때를 의미한다.
			}else{
				alert("row 노 선택");
			}*/
		
			//this.onfindById();
			var index =this.table.getSelectedIndices();
			
			if(index==''){
			this.type = "insert";
			this.onPressReg();
			
			}else{
			 	//this.showAlert("이미 등록되어 있습니다."); // 확인버튼을 클릭하지 않았는데 밑의 함수가 실행됨.
				alert("이미 등록되어 있습니다.");
				this.setModel(new JSONModel(), "detail");
				this.table.clearSelection();
				return false;
				
				//location.reload();
				//location.href = "../index.html"
				//window.setTimeout(function(){location.reload();}, 5000);
			}
			
			
		},
		
		// 수정버튼 클릭 이벤트
		onPressUpdate: function() {
			
			var index =this.table.getSelectedIndices();
			console.log(index);
			
			
			
			if(index != ''){
			this.type = "update";
			this.onPressReg();
			this.setModel(this.getModel("detail"), "updateData");
			//this.getModel("updateData").getProperty("/");
			
			
			}else if(index == ''){
				alert("수정할 리스트를 지정해주세요");
				//this.setModel(new JSONModel(), "detail");
				this.table.clearSelection();
				return false;
				
				
			}
		},
		
		
		
		// 등록 및 수정 Dialog open
		onPressReg : function(){
			var oView = this.getView();
			//console.log("oView==="+oView); //sap.ui.core.mvc.XMLView#__xmlview0
			var that = this;
			
			if (!this._oDialog) {	
			 	this._oDialog = Fragment.load({
					id : oView.getId(),
					name : "view.RegDialog",
					controller : this
				}).then(function (oDialog) {
					 // connect dialog to the root view of this component (models, lifecycle)
					that.getView().addDependent(oDialog);
					return oDialog;
				});
			}
			this._oDialog.then(function(oDialog) {
				
				
				/*var testdata=that.getModel("test").getProperty("/");
				var array = [];
				for(var d of testdata){
					 array.push(d.col3);
				}
				let arrayset = [...new Set(array)];
				console.log(arrayset);
				that.setModel(new JSONModel(arrayset), "address"); // 콤보박스값 모델화*/
				
				
				console.log(that.type);
				if(that.type == "update"){
						that.byId("col1").setEditable(false); // 수정 불가 상태	
						/*var col3data = that.getModel("updateData").getProperty("/col3");
						that.byId("col3").setProperty("selectedKey", col3data);*/
//						that.byId("col3").setSelectedKey(col3data);
						
						
					}
				if(that.type == "insert"){
						that.setModel(new JSONModel(), "updateData");
						that.byId("col3").setProperty("selectedKey", "seoul");
						that.byId("col1").setEditable(true);  // 수정 가능 상태
						
						
					}
				oDialog.open();
				
			});
			
			
			
		},
		
		//저장 버튼
		onPressSaveBtn: function(){
			var colData = {
				'col1': this.byId("col1").getValue().trim(),
				'col2': this.byId("col2").getValue().trim(),
				'col3': this.byId("col3").getSelectedKey()
			}
			//var colData = this.getModel("updateData").getProperty("/");
			// byId로 값을 따로 적용해서 보낸 이유는 combobox의 값의 모델이 다르기 때문에 updateData모델에 col3이 입력되지 않음
			
			// trim(): 앞뒤 공백 제거
			//alert(colData);
			//this.setModel(new JSONModel(colData), "colDataModel");
			
		
			var col1 = this.byId("col1").getValue();
			var col11 = '';
			//var index = this.table.getSelectedIndices();
			//var checkCol = this.getModel("test").getProperty("/"+col1);
			var checkCol =this.getModel("checkCol1").getData();
			//this.onfindById(col1);
			//var checkCol = this.getModel("detail").oData;
			//console.log(checkCol);
			/*for(var i=0; i<checkCol.length; i++){
				var col11= checkCol[i];
			}*/
			
			if(col1 == '' && (this.type == "insert" || this.type == "update")){
				this.showAlert("col1에 반드시 값을 입력해주세요");
				//this.byId("col1").focus();
				return false;	
			}else if(checkCol != '' && this.type == "insert"){
				for(var i=0; i<checkCol.length; i++){	
					var col11= checkCol[i];
						if(col1 === col11){
						this.showAlert("col1이 중복입니다.");
						//this.byId("col1").focus();
						return false;
						}
				}
			}	
			
			this.callAjax({
				url:"/save",
				type: "post",
				data: colData,
				//data: JSON.stringify(colData),
				//dataType: "json",
				callback: "savecallback"
				
			});
			//location.reload();
			/*var testdata = this.getModel("updateData")
			this.setModel(new JSONModel(testdata), "detail");*/
			this._oDialog.then(function(oDialog) {
				oDialog.close();
			});
		},
		
		// 저장버튼 클릭시 콜백으로 메세지 뿌려주기
		savecallback: function() {
			
			if(this.type=="insert"){
				this.showInfo("저장되었습니다.");
				
			}else if(this.type=="update"){
				this.showInfo("수정되었습니다.");
			}
			this.table.clearSelection();
			this.onfindAll();
			this.setModel(new JSONModel(), "detail");
			// 등록 후 다시 등록버튼을 눌렀을 때 캐시가 남아 있다.!!
			
		},
		
		// 등록 및 저장 Dialog에서 X버튼 클릭 이벤트
		onPressClose : function(){
			var that = this;
			/*console.log(that.type);
			console.log(that.byId("col1"));*/
			this._oDialog.then(function(oDialog) {
				/*if(that.type === "update"){
					that.byId("col1").setEditable(false);
				}
				if(that.type === "insert"){
					that.byId("col1").setEditable(true);
				}*/
				that.table.clearSelection();
				that.setModel(new JSONModel(), "detail");
				//oDialog.removeContent(__dialog0); 
				oDialog.close();
			});
			
		},
		
		// 삭제버튼 클릭 이벤트
		onPressDelete : function(){
			
			var index =this.table.getSelectedIndices(), that = this;
			console.log(index);
			
			
			
			if(index != ''){
			
			var data1 =this.getModel("detail").oData;
			/*this.callAjax({
				url : "/delete",
				type : "post",
				data: JSON.stringify(data1),
				callback: "deletesuccess"
			});*/
			
			this.showConfirm("삭제하시겠습니까?", function(action){
				if(action.search(/OK/i) > -1){ //삭제 확인 버튼 클릭시 진행
					that.callAjax({
						url : "/delete",
						type : "post",
						data: JSON.stringify(data1),
						callback: "deletesuccess"
					});	
					
				}else{	// 삭제 취소 버튼 클릭시 진행
				that.table.clearSelection();
				that.setModel(new JSONModel(), "detail");
				}
				
			});
			
			
			}else if(index == ''){
				alert("삭제할 리스트를 지정해주세요");
				
			}
			
		},
		
		// 삭제 후 콜백으로 메세지 뿌려주기
		deletesuccess : function(){
			this.table.clearSelection();
			this.setModel(new JSONModel(), "detail");
			this.showToast("삭제되었습니다.");
			this.onfindAll();
			
			},
		
		// 조회 버튼 이벤트 pk값과 이름값 검색 필터
		onSearch : function(){
			var searchdata = {	'col1': this.byId("keyId").getValue().trim(),
                                'col2': this.byId("name").getValue().trim()}
			
			this.callAjax({
				url: "/search",
				type: "post",
				data: searchdata,
				callback : "searchResult"
				
			});
			
		},
		
		// 검색 후 DB에서 값이 넘어 오는지 확인
		searchResult : function(searchList){
			console.log(searchList);
			this.onCallList(searchList);
		},
		
		// 초기화 버튼 클릭 이벤트
		onClear : function(){
			this.byId("keyId").setValue('');
			this.byId("name").setValue('');
			this.onfindAll();
			this.setModel(new JSONModel(), "detail");
		}
		
		
		
		
	});
}, true);