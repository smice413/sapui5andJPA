/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./ComboBoxTextField','./ComboBoxBase','./List','./library','sap/ui/Device','sap/ui/core/Item','./StandardListItem','./ComboBoxRenderer','sap/ui/base/ManagedObjectObserver','sap/ui/base/ManagedObject',"sap/ui/dom/containsOrEquals","sap/m/inputUtils/scrollToItem","sap/m/inputUtils/inputsDefaultFilter","sap/ui/events/KeyCodes","./Toolbar","sap/base/assert","sap/base/security/encodeXML","sap/ui/core/Core","sap/base/Log","sap/ui/dom/jquery/control"],function(C,a,L,l,D,I,S,b,M,c,d,s,f,K,T,g,h,j,k,q){"use strict";var m=l.ListType;var n=l.ListMode;var o=a.extend("sap.m.ComboBox",{metadata:{library:"sap.m",designtime:"sap/m/designtime/ComboBox.designtime",properties:{selectedKey:{type:"string",group:"Data",defaultValue:""},selectedItemId:{type:"string",group:"Misc",defaultValue:""},filterSecondaryValues:{type:"boolean",group:"Misc",defaultValue:false}},associations:{selectedItem:{type:"sap.ui.core.Item",multiple:false}},events:{change:{parameters:{value:{type:"string"},itemPressed:{type:"boolean"}}},selectionChange:{parameters:{selectedItem:{type:"sap.ui.core.Item"}}}},dnd:{draggable:false,droppable:true}}});function H(e,i){if(!i){return;}var t=e.getFocusDomRef(),u=e._getSelectionRange().start,v=t.value.substring(0,t.selectionStart),w=e._shouldResetSelectionStart(i),x=e.getSelectedItem(),G=i.isA("sap.ui.core.SeparatorItem"),y=e.getListItem(i);e.handleListItemsVisualFocus(y);e.setSelection(i);if(i!==x&&!G){e.updateDomValue(i.getText());e.fireSelectionChange({selectedItem:i});i=e.getSelectedItem();y=e.getListItem(i);if(w){u=0;}e.selectText(u,t.value.length);e._bIsLastFocusedItemHeader=false;}if(G){e.setSelectedItem(null);e.fireSelectionChange({selectedItem:null});e.updateDomValue(v);e._bIsLastFocusedItemHeader=true;e._getGroupHeaderInvisibleText().setText(e._oRb.getText("LIST_ITEM_GROUP_HEADER")+" "+i.getText());}if(e.isOpen()){e.removeStyleClass("sapMFocus");e._getList().addStyleClass("sapMListFocus");}else{e.addStyleClass("sapMFocus");}s(y,e.getPicker());}function p(i,e){if(document.activeElement===this.getFocusDomRef()){this.selectText(i,e);}}function r(i){var e=this.getSelectedItem(),t=this.getListItem(e),u=e&&t&&t.getDomRef(),v=u&&u.offsetTop,w=u&&u.offsetHeight,P=this.getPicker(),x=P.getDomRef("cont"),y=x.clientHeight;if(e&&((v+w)>(y))){if(!i){this._getList().$().css("visibility","hidden");}else{x.scrollTop=v-w/2;this._getList().$().css("visibility","visible");}}}o.prototype._getSelectedItemText=function(i){i=i||this.getSelectedItem();if(!i){i=this.getDefaultSelectedItem();}if(i){return i.getText();}return"";};o.prototype.setSelectedIndex=function(i,_){var e;_=_||this.getItems();i=(i>_.length-1)?_.length-1:Math.max(0,i);e=_[i];if(e){this.setSelection(e);}};o.prototype.revertSelection=function(){var P,e=this.getPickerTextField();this.setSelectedItem(this._oSelectedItemBeforeOpen);this.setValue(this._sValueBeforeOpen);if(this.getSelectedItem()===null){P=this._sValueBeforeOpen;}else{P=this._oSelectedItemBeforeOpen.getText();}e&&e.setValue(P);};o.prototype.filterItems=function(O){var e,i=this.getItems(),F=[],t=[],u=O.properties.indexOf("additionalText")>-1,v=this.fnFilter||f,G=[],w=false;this._oFirstItemTextMatched=null;i.forEach(function(x){if(x.isA("sap.ui.core.SeparatorItem")){G.push({header:x,visible:false});w=true;e=this.getListItem(x);e&&e.setVisible(false);return;}var y=v.call(this,O.value,x,u);if(y&&w&&G.length){G[G.length-1].visible=true;w=false;}if(y){t.push(x);F.push(x);}}.bind(this));i.forEach(function(x){if(x.isA("sap.ui.core.SeparatorItem")){return;}var y=F.indexOf(x)>-1;var z=t.indexOf(x)>-1;if(!this._oFirstItemTextMatched&&z){this._oFirstItemTextMatched=x;}e=this.getListItem(x);e&&e.setVisible(y);},this);G.forEach(function(x){if(x.visible){e=this.getListItem(x.header);e&&e.setVisible(true);}}.bind(this));return F;};o.prototype._filterStartsWithItems=function(i,e){var t=i.toLowerCase();var u=this.getItems(),F=u.filter(function(v){return v[e]&&v[e]().toLowerCase().startsWith(t);});return F;};o.prototype._getFilters=function(){return this.getFilterSecondaryValues()?["text","additionalText"]:["text"];};o.prototype.getNextFocusableItem=function(e){var A=this.getSelectableItems(),i=this.getNonSeparatorSelectableItems(A),F=this.hasStyleClass("sapMFocus"),t=this.getSelectedItem()||this._getItemByListItem(this._oLastFocusedListItem),u=this.getFormattedTextFocused(),N;if((F&&this.isOpen())||u){N=A[0];}else if(F&&!this.getValueStateLinks().length){N=i[i.indexOf(t)+(e?1:-1)];}else{N=A[A.indexOf(t)+(e?1:-1)];}if(u||(!u&&t===A[0]&&!e&&this.getValueStateLinks().length)){this.setProperty("formattedTextFocused",!u);}return N;};o.prototype.getNonSeparatorSelectableItems=function(i){return i.filter(function(e){return!e.isA("sap.ui.core.SeparatorItem");});};o.prototype._itemsTextStartsWithTypedValue=function(i,t){if(!i||typeof t!="string"||t==""){return false;}return i.getText().toLowerCase().startsWith(t.toLowerCase());};o.prototype._shouldResetSelectionStart=function(i){var e=this.getFocusDomRef(),t=this._getSelectionRange(),u=t.start!==t.end,v=e.value.substring(0,t.start),w=this._itemsTextStartsWithTypedValue(i,v);return!(w&&(u||this._bIsLastFocusedItemHeader));};o.prototype._getSelectionRange=function(){var e=this.getFocusDomRef(),v=this.getValue(),i=e.selectionStart,t=e.selectionEnd,R={start:i,end:t};if(!(D.browser.msie||D.browser.edge)){return R;}if(this._bIsLastFocusedItemHeader){R.start=v.length;R.end=v.length;}return R;};o.prototype.handleListItemsVisualFocus=function(e){if(this._oLastFocusedListItem){this._oLastFocusedListItem.removeStyleClass("sapMLIBFocused");this._oLastFocusedListItem=null;}else if(this.isOpen()&&this.getFocusDomRef()){this.getFocusDomRef().setAttribute("aria-activedescendant",e.getId());}if(e){this._oLastFocusedListItem=e;e.addStyleClass("sapMLIBFocused");}};o.prototype.setSelection=function(i){var e=this._getList(),t=this._getSuggestionsPopover(),u,v;this.setAssociation("selectedItem",i);this._setPropertyProtected("selectedItemId",(i instanceof I)?i.getId():i,true);if(typeof i==="string"){i=j.byId(i);}if(e){u=this.getListItem(i);if(u){e.setSelectedItem(u,true);}else{e.removeSelections(true);}}v=i?i.getKey():"";this._setPropertyProtected("selectedKey",v);if(t){t._iPopupListSelectedIndex=this.getItems().indexOf(i);}};o.prototype.isSelectionSynchronized=function(){var i=this.getSelectedItem();return this.getSelectedKey()===(i&&i.getKey());};o.prototype._mapItemToListItem=function(i){var e,t,u,A;var R=this.getRenderer();if(!i){return null;}A=(i.getAdditionalText&&this.getShowSecondaryValues())?i.getAdditionalText():"";t=R.CSS_CLASS_COMBOBOXBASE+"Item";u=(this.isItemSelected(i))?t+"Selected":"";if(i.isA("sap.ui.core.SeparatorItem")){e=this._mapSeparatorItemToGroupHeader(i,R);}else{e=new S({type:m.Active,info:c.escapeSettingsValue(A),visible:i.getEnabled()}).addStyleClass(t+" "+u);}e.setTitle(i.getText());this.setSelectable(i,i.getEnabled());e.setTooltip(i.getTooltip());i.data(R.CSS_CLASS_COMBOBOXBASE+"ListItem",e);i.getCustomData().forEach(function(v){e.addCustomData(v.clone(null,null,{cloneBindings:false}));});this._oItemObserver.observe(i,{properties:["text","additionalText","enabled","tooltip"]});return e;};o.prototype._forwardItemProperties=function(P){var i=P.object,e=i.data(this.getRenderer().CSS_CLASS_COMBOBOXBASE+"ListItem"),t={text:"title",enabled:"visible",tooltip:"tooltip"},A,u,v;if(Object.keys(t).indexOf(P.name)>-1){u=t[P.name];v="set"+u.charAt(0).toUpperCase()+u.slice(1);e[v](P.current);}if(P.name==="additionalText"){A=this.getShowSecondaryValues()?P.current:"";e.setInfo(A);}};o.prototype.isItemSelected=function(i){return i&&(i.getId()===this.getAssociation("selectedItem"));};o.prototype.setAssociation=function(A,i,e){var t=this._getList();if(t&&(A==="selectedItem")){if(!(i instanceof I)){i=this.findItem("id",i);}t.setSelectedItem(this.getListItem(i),true);}return a.prototype.setAssociation.apply(this,arguments);};o.prototype.removeAllAssociation=function(A,e){var i=this._getList();if(i&&(A==="selectedItem")){L.prototype.removeAllAssociation.apply(i,arguments);}return a.prototype.removeAllAssociation.apply(this,arguments);};o.prototype.init=function(){this._oRb=j.getLibraryResourceBundle("sap.m");a.prototype.init.apply(this,arguments);this.bOpenValueStateMessage=true;this._sValueBeforeOpen="";this._sInputValueBeforeOpen="";this._oSelectedItemBeforeOpen=null;this._oFirstItemTextMatched=null;this.bIsFocused=false;if(D.system.phone){this.attachEvent("_change",this.onPropertyChange,this);}this._oLastFocusedListItem=null;this._bIsLastFocusedItemHeader=null;this._oItemObserver=new M(this._forwardItemProperties.bind(this));};o.prototype.onBeforeRendering=function(){a.prototype.onBeforeRendering.apply(this,arguments);var e=this.getSelectedItem(),i=this._getList(),t=e&&this.getListItem(e),F=this.getProperty("formattedTextFocused"),u=this.getPicker()&&this.getPicker().getCustomHeader(),P=(D.browser.msie&&u&&u.getFormattedText)?u.getFormattedText():u;this.synchronizeSelection();if(!this.getOpen()&&document.activeElement===this.getFocusDomRef()){this.addStyleClass("sapMFocus");}if(F){P.addStyleClass("sapMPseudoFocus");i.removeStyleClass("sapMListFocus");t.removeStyleClass("sapMLIBFocused");this.removeStyleClass("sapMFocus");}else if(P){P.removeStyleClass("sapMPseudoFocus");}};o.prototype._fillList=function(){var e=this._getList(),t,u,v,i,w;if(!e){return;}if(this._oLastFocusedListItem){w=this._getItemByListItem(this._oLastFocusedListItem);}e.destroyItems();t=this.getItems();if(this._sInputValueBeforeOpen){t=this.filterItems({properties:this._getFilters(),value:this._sInputValueBeforeOpen});}for(i=0,v=t.length;i<v;i++){u=this._mapItemToListItem(t[i]);e.addAggregation("items",u,true);}if(w){this._oLastFocusedListItem=this.getListItem(w);}};o.prototype.exit=function(){a.prototype.exit.apply(this,arguments);this._oRb=null;this._oSelectedItemBeforeOpen=null;this._oFirstItemTextMatched=null;this._oLastFocusedListItem=null;if(this._oSuggestionPopover){if(this._oPickerCustomHeader){this._oPickerCustomHeader.destroy();this._oPickerCustomHeader=null;}this._oSuggestionPopover.destroy();this._oSuggestionPopover=null;}if(this._oItemObserver){this._oItemObserver.disconnect();this._oItemObserver=null;}};o.prototype.onBeforeRenderingPicker=function(){var O=this["onBeforeRendering"+this.getPickerType()];O&&O.call(this);};o.prototype.onBeforeRenderingDropdown=function(){var P=this.getPicker(),w=(this.$().outerWidth()/parseFloat(l.BaseFontSize))+"rem";if(P){P.setContentMinWidth(w);}};o.prototype.onBeforeRenderingList=function(){if(this.bProcessingLoadItemsEvent){var e=this._getList(),F=this.getFocusDomRef();if(e){e.setBusy(true);}if(F){F.setAttribute("aria-busy","true");}}};o.prototype.onAfterRenderingPicker=function(){var O=this["onAfterRendering"+this.getPickerType()];O&&O.call(this);r.call(this,false);};o.prototype.onAfterRenderingList=function(){var e=this.getSelectedItem(),i=this.getListItem(e);if(this.bProcessingLoadItemsEvent&&(this.getItems().length===0)){return;}var t=this._getList(),F=this.getFocusDomRef();this.highlightList(this._sInputValueBeforeOpen);if(e){t.setSelectedItem(i);this.handleListItemsVisualFocus(i);}if(t){t.setBusy(false);}if(F){F.removeAttribute("aria-busy");}};o.prototype.oninput=function(e){a.prototype.oninput.apply(this,arguments);this.syncPickerContent();if(e.isMarked("invalid")){return;}this.loadItems(function(){this.handleInputValidation(e,this.isComposingCharacter());},{name:"input",busyIndicator:false});if(this.bProcessingLoadItemsEvent&&(this.getPickerType()==="Dropdown")){this.open();}if(this._oLastFocusedListItem){this._oLastFocusedListItem.removeStyleClass("sapMLIBFocused");this._oLastFocusedListItem=null;}this.setFormattedTextFocused(false);this.addStyleClass("sapMFocus");this._getList().removeStyleClass("sapMListFocus");if(this._getItemsShownWithFilter()){this.toggleIconPressedStyle(true);}};o.prototype.handleInputValidation=function(e,i){var v,t,F,u,w,x=this.getSelectedItem(),V=e.target.value,E=V==="",y=e.srcControl,z=(this.getPickerType()==="Dropdown"),A=this.getListItem(x);if(E&&!this.bOpenedByKeyboardOrButton&&!this.isPickerDialog()){v=this.getItems();}else{v=this.filterItems({properties:this._getFilters(),value:V});}F=v[0];u=v.some(function(B){return B.getKey()===this.getSelectedKey();},this);t=this.intersectItems(this._filterStartsWithItems(V,'getText'),v);w=!E&&F&&F.getEnabled();if(F&&this.getSelectedKey()&&!u){this.setSelection(null);}if(w&&y&&y._bDoTypeAhead){this.handleTypeAhead(y,v,V,i);}else if(w&&t[0]&&V===t[0].getText()){this.setSelection(t[0]);}else{this.setSelection(null);}if(x!==this.getSelectedItem()){this.fireSelectionChange({selectedItem:this.getSelectedItem()});A=this.getListItem(this.getSelectedItem());}this._sInputValueBeforeOpen=V;if(this.isOpen()){setTimeout(function(){this.highlightList(V);}.bind(this));}if(F){if(E&&!this.bOpenedByKeyboardOrButton){this.close();}else if(z){this.open();s(A,this.getPicker());}}else if(this.isOpen()){if(z&&!this.bOpenedByKeyboardOrButton){this.close();}}else{this.clearFilter();}};o.prototype.handleTypeAhead=function(i,e,v,t){var u=this.intersectItems(this._filterStartsWithItems(v,'getText'),e);var w=this.getFilterSecondaryValues();var x=D.system.desktop;var y=this.intersectItems(this._filterStartsWithItems(v,'getAdditionalText'),e);if(w&&!u[0]&&y[0]){!t&&i.updateDomValue(y[0].getAdditionalText());this.setSelection(y[0]);}else if(u[0]){!t&&i.updateDomValue(u[0].getText());this.setSelection(u[0]);}if(x){p.call(i,v.length,i.getValue().length);}else{setTimeout(p.bind(i,v.length,i.getValue().length),0);}this.addStyleClass("sapMFocus");this._getList().removeStyleClass("sapMListFocus");};o.prototype.onSelectionChange=function(e){var i=this._getItemByListItem(e.getParameter("listItem")),P=this.getChangeEventParams(),t=(i!==this.getSelectedItem());this.updateDomValue(i.getText());this.setSelection(i);this.fireSelectionChange({selectedItem:this.getSelectedItem()});if(t){P.itemPressed=true;this.onChange(null,P);}};o.prototype.onItemPress=function(e){var i=e.getParameter("listItem"),t=i.getTitle(),P=this.getChangeEventParams(),u=(i!==this.getListItem(this.getSelectedItem()));if(i.isA("sap.m.GroupHeaderListItem")){return;}this.handleListItemsVisualFocus(i);this.updateDomValue(t);if(!u){P.itemPressed=true;this.onChange(null,P);}this._setPropertyProtected("value",t,true);if(this.getPickerType()==="Dropdown"&&!this.isPlatformTablet()){this.selectText.bind(this,this.getValue().length,this.getValue().length);}this.close();};o.prototype.onBeforeOpen=function(){a.prototype.onBeforeOpen.apply(this,arguments);var P=this["onBeforeOpen"+this.getPickerType()],e=this.getFocusDomRef();this.setProperty("open",true);if(this.hasLoadItemsEventListeners()&&!this.bProcessingLoadItemsEvent){this.loadItems();}if(e){e.setAttribute("aria-controls",this.getPicker().getId());}this.addContent();P&&P.call(this);};o.prototype.onBeforeOpenDialog=function(){var P=this.getPickerTextField();this._oSelectedItemBeforeOpen=this.getSelectedItem();this._sValueBeforeOpen=this.getValue();if(this.getSelectedItem()){this.filterItems({properties:this._getFilters(),value:""});}P.setValue(this._sValueBeforeOpen);};o.prototype.onAfterOpen=function(){var i=this.getSelectedItem(),e=this._getSelectionRange(),t=this.isPlatformTablet();this.closeValueStateMessage();r.call(this,true);if(!t&&i&&e.start===e.end&&e.start>1){setTimeout(function(){this.selectText(0,e.end);}.bind(this),0);}};o.prototype.onBeforeClose=function(){a.prototype.onBeforeClose.apply(this,arguments);var e=this.getFocusDomRef();this.setProperty("open",false);this.setProperty("formattedTextFocused",false);if(e){e.removeAttribute("aria-controls");}this.toggleIconPressedStyle(false);};o.prototype.onAfterClose=function(){this.clearFilter();this._sInputValueBeforeOpen="";if(this.isPickerDialog()){a.prototype.closeValueStateMessage.apply(this,arguments);}};o.prototype.onItemChange=function(e){var i=this.getAssociation("selectedItem"),N=e.getParameter("newValue"),P=e.getParameter("name");if(i===e.getParameter("id")){switch(P){case"text":if(!this.isBound("value")){this.setValue(N);}break;case"key":if(!this.isBound("selectedKey")){this.setSelectedKey(N);}break;}}};o.prototype.onkeydown=function(e){var i=e.srcControl;a.prototype.onkeydown.apply(i,arguments);if(!i.getEnabled()||!i.getEditable()){return;}var t=K;i._bDoTypeAhead=!D.os.android&&(e.which!==t.BACKSPACE)&&(e.which!==t.DELETE);};o.prototype.oncut=function(e){var i=e.srcControl;a.prototype.oncut.apply(i,arguments);i._bDoTypeAhead=false;};o.prototype.onsapenter=function(e){var i=e.srcControl,t=i.getSelectedItem();if(t&&this.getFilterSecondaryValues()){i.updateDomValue(t.getText());}a.prototype.onsapenter.apply(i,arguments);if(!i.getEnabled()||!i.getEditable()){return;}if(i.isOpen()&&!this.isComposingCharacter()){i.close();}};o.prototype.onsapdown=function(e){var i=e.srcControl;if(!i.getEnabled()||!i.getEditable()){return;}this.syncPickerContent();e.setMarked();e.preventDefault();this.loadItems(function t(){H.call(this,i,this.getNextFocusableItem(true));});};o.prototype.onsapup=function(e){var i=e.srcControl;if(!i.getEnabled()||!i.getEditable()){return;}this.syncPickerContent();e.setMarked();e.preventDefault();this.loadItems(function t(){H.call(this,i,this.getNextFocusableItem(false));});};o.prototype.onsaphome=function(e){var i=e.srcControl;if(!i.getEnabled()||!i.getEditable()){return;}this.syncPickerContent();e.setMarked();if(this.getValueStateLinks().length){this.setProperty("formattedTextFocused",true);}e.preventDefault();this.loadItems(function t(){var F=this.getSelectableItems()[0];H.call(this,i,F);});};o.prototype.onsapend=function(e){var i=e.srcControl;if(!i.getEnabled()||!i.getEditable()){return;}this.syncPickerContent();e.setMarked();e.preventDefault();if(this.getValueStateLinks().length&&this.getFormattedTextFocused()){this.setProperty("formattedTextFocused",false);}this.loadItems(function u(){var t=this.findLastEnabledItem(this.getSelectableItems());H.call(this,i,t);});};o.prototype.onsappagedown=function(e){var i=e.srcControl;if(!i.getEnabled()||!i.getEditable()){return;}this.syncPickerContent();e.setMarked();e.preventDefault();if(this.getValueStateLinks().length&&this.getFormattedTextFocused()){this.setProperty("formattedTextFocused",false);}this.loadItems(function(){var t=this.getNonSeparatorSelectableItems(this.getSelectableItems()),u=t.indexOf(this.getSelectedItem())+10,v;u=(u>t.length-1)?t.length-1:Math.max(0,u);v=t[u];H.call(this,i,v);});};o.prototype.onsappageup=function(e){var i=e.srcControl;if(!i.getEnabled()||!i.getEditable()){return;}this.syncPickerContent();e.setMarked();e.preventDefault();this.loadItems(function(){var t=this.getNonSeparatorSelectableItems(this.getSelectableItems()),u=t.indexOf(this.getSelectedItem())-10,v;u=(u>t.length-1)?t.length-1:Math.max(0,u);v=t[u];H.call(this,i,v);});};o.prototype.onsapshow=function(e){var i,t,E=this.getEditable(),u;a.prototype.onsapshow.apply(this,arguments);this.syncPickerContent();if(!this.getValue()&&E){i=this.getSelectableItems();t=this.getNonSeparatorSelectableItems(i)[0];if(t){u=this.getListItem(t);if(this.isOpen()){this.removeStyleClass("sapMFocus");this._getList().addStyleClass("sapMListFocus");this.handleListItemsVisualFocus(u);}else{this.addStyleClass("sapMFocus");}this.setSelection(t);this.updateDomValue(t.getText());this.fireSelectionChange({selectedItem:t});setTimeout(function(){this.selectText(0,t.getText().length);}.bind(this),0);}}};o.prototype.onsaphide=o.prototype.onsapshow;o.prototype.ontap=function(e){var i=this.getFocusDomRef(),A="aria-activedescendant";this.addStyleClass("sapMFocus");if(this.getFormattedTextFocused()){this.setFormattedTextFocused(false);}else if((this.getOpen()&&this._getList().hasStyleClass("sapMListFocus"))||this._oLastFocusedListItem){this._getList().removeStyleClass("sapMListFocus");this._oLastFocusedListItem.removeStyleClass("sapMLIBFocused");this._oLastFocusedListItem=null;i.removeAttribute(A);}};o.prototype.onfocusin=function(e){var i=this.getPickerType()==="Dropdown";if(this._bIsBeingDestroyed){return;}if(e.target===this.getOpenArea()){this.bOpenValueStateMessage=false;if(i&&!this.isPlatformTablet()){this.focus();}}else{if(i){setTimeout(function(){if(document.activeElement===this.getFocusDomRef()&&!this.bIsFocused&&!this.bFocusoutDueRendering&&!this.getSelectedText()){this.selectText(0,this.getValue().length);}this.bIsFocused=true;}.bind(this),0);}if(!this.isOpen()&&this.bOpenValueStateMessage&&this.shouldValueStateMessageBeOpened()){this.openValueStateMessage();}this.bOpenValueStateMessage=true;}if(this.getEnabled()&&(!this.isOpen()||!this.getSelectedItem()||!this._getList().hasStyleClass("sapMListFocus"))){this.addStyleClass("sapMFocus");}};o.prototype.onsapfocusleave=function(e){this.bIsFocused=false;var t,P,R,F,i=this.getSelectedItem();if(i&&this.getFilterSecondaryValues()){this.updateDomValue(i.getText());}a.prototype.onsapfocusleave.apply(this,arguments);if(this.isPickerDialog()){return;}P=this.getPicker();if(!e.relatedControlId||!P){return;}t=this.isPlatformTablet();R=j.byId(e.relatedControlId);F=R&&R.getFocusDomRef();if(d(P.getFocusDomRef(),F)&&!t&&!this.getFormattedTextFocused()){this.focus();}};o.prototype.synchronizeSelection=function(){if(this.isSelectionSynchronized()){return;}var e=this.getSelectedKey(),i=this.getItemByKey(""+e);if(i&&(e!=="")){this.setAssociation("selectedItem",i,true);this._setPropertyProtected("selectedItemId",i.getId(),true);this.setValue(i.getText());this._sValue=this.getValue();}};o.prototype.configPicker=function(P){var R=this.getRenderer(),e=R.CSS_CLASS_COMBOBOXBASE;P.setHorizontalScrolling(false).addStyleClass(e+"Picker").addStyleClass(e+"Picker-CTX").attachBeforeOpen(this.onBeforeOpen,this).attachAfterOpen(this.onAfterOpen,this).attachBeforeClose(this.onBeforeClose,this).attachAfterClose(this.onAfterClose,this).addEventDelegate({onBeforeRendering:this.onBeforeRenderingPicker,onAfterRendering:this.onAfterRenderingPicker},this);};o.prototype._configureList=function(e){var R=this.getRenderer();if(!e){return;}e.setMode(n.SingleSelectMaster).addStyleClass(R.CSS_CLASS_COMBOBOXBASE+"List").addStyleClass(R.CSS_CLASS_COMBOBOX+"List");e.attachSelectionChange(this.onSelectionChange,this).attachItemPress(this.onItemPress,this);e.addEventDelegate({onBeforeRendering:this.onBeforeRenderingList,onAfterRendering:this.onAfterRenderingList},this);};o.prototype.destroyItems=function(){this.destroyAggregation("items");if(this._getList()){this._getList().destroyItems();}return this;};o.prototype.getDefaultSelectedItem=function(){return null;};o.prototype.getChangeEventParams=function(){return{itemPressed:false};};o.prototype.clearSelection=function(){this.setSelection(null);};o.prototype.selectText=function(i,e){a.prototype.selectText.apply(this,arguments);this.textSelectionStart=i;this.textSelectionEnd=e;return this;};o.prototype.removeAllItems=function(){var i=a.prototype.removeAllItems.apply(this,arguments);this._fillList();return i;};o.prototype.clone=function(i){var e=a.prototype.clone.apply(this,arguments),t=this._getList();if(!this.isBound("items")&&t){e.syncPickerContent();e.setSelectedIndex(this.indexOfItem(this.getSelectedItem()));}return e;};o.prototype.open=function(){this.syncPickerContent();var e=this._getList();a.prototype.open.call(this);if(this.getSelectedItem()){e.addStyleClass("sapMListFocus");this.removeStyleClass("sapMFocus");}return this;};o.prototype.syncPickerContent=function(){var P,e=this.getPicker(),i=this.getInputForwardableProperties();if(!e){var t,G;e=this.createPicker(this.getPickerType());P=this.getPickerTextField();this._fillList();if(P){i.forEach(function(u){u=u.charAt(0).toUpperCase()+u.slice(1);t="set"+u;G="get"+u;if(P[t]){P[t](this[G]());}},this);}this._getSuggestionsPopover().updateValueState(this.getValueState(),this.getValueStateText(),this.getShowValueStateMessage());}this.synchronizeSelection();return e;};o.prototype.findAggregatedObjects=function(){var e=this._getList();if(e){return L.prototype.findAggregatedObjects.apply(e,arguments);}return[];};o.prototype.setSelectedItem=function(i){if(typeof i==="string"){this.setAssociation("selectedItem",i,true);i=j.byId(i);}if(!(i instanceof I)&&i!==null){return this;}if(!i){i=this.getDefaultSelectedItem();}this.setSelection(i);this.setValue(this._getSelectedItemText(i));return this;};o.prototype.setSelectedItemId=function(i){i=this.validateProperty("selectedItemId",i);if(!i){i=this.getDefaultSelectedItem();}this.setSelection(i);i=this.getSelectedItem();this.setValue(this._getSelectedItemText(i));return this;};o.prototype.setSelectedKey=function(e){e=this.validateProperty("selectedKey",e);var i=(e===""),t=this.isBound("selectedKey")&&this.isBound("value")&&this.getBindingInfo("selectedKey").skipModelUpdate;if(i){this.setSelection(null);if(!t){this.setValue("");}return this;}var u=this.getItemByKey(e);if(u){this.setSelection(u);if(!t){this.setValue(this._getSelectedItemText(u));}return this;}this._sValue=this.getValue();return this._setPropertyProtected("selectedKey",e);};o.prototype._setPropertyProtected=function(P,v,i){try{return this.setProperty(P,v,i);}catch(e){k.warning("setSelectedKey update failed due to exception. Loggable in support mode log",null,null,function(){return{exception:e};});}};o.prototype.getSelectedItem=function(){var v=this.getAssociation("selectedItem");return(v===null)?null:j.byId(v)||null;};o.prototype.removeItem=function(i){i=a.prototype.removeItem.apply(this,arguments);var e;if(this._getList()){this._getList().removeItem(i&&this.getListItem(i));}if(this.isBound("items")&&!this.bItemsUpdated){return i;}var v=this.getValue();if(this.getItems().length===0){this.clearSelection();}else if(this.isItemSelected(i)){e=this.getDefaultSelectedItem();this.setSelection(e);this.setValue(v);}return i;};o.prototype._modifyPopupInput=function(i){a.prototype._modifyPopupInput.apply(this,arguments);i.addEventDelegate({onsapenter:function(){var t=i.getValue();this.updateDomValue(t);this.onChange();if(t){this.updateDomValue(t);this.onChange();this.close();}}},this);return i;};o.prototype.applyShowItemsFilters=function(){var P,e;this.syncPickerContent();P=this.getPicker();e=function(){P.detachBeforeOpen(e,this);P=null;this.filterItems({value:this.getValue()||"_",properties:this._getFilters()});};P.attachBeforeOpen(e,this);};o.prototype.showItems=function(F){var e,i=Array.prototype.slice.call(arguments),t=this.fnFilter,u=function(){this.setFilterFunction(F||function(){return true;});e=this.filterItems({value:this.getValue()||"_",properties:this._getFilters()});this.setFilterFunction(t);if(e&&e.length){a.prototype.showItems.apply(this,i);}}.bind(this);this.attachLoadItems(u);this.loadItems(u);};o.prototype._getFormattedValueStateText=function(){if(this.isOpen()){return this._getSuggestionsPopover()._getValueStateHeader().getFormattedText();}else{return C.prototype.getFormattedValueStateText.call(this);}};return o;});
