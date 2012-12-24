define([ "dojo/_base/array", //
"dojo/_base/lang",//
"dojo/_base/declare", "dijit/_WidgetBase", "dijit/_Container",
		"dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
		"dojo/text!./polymorphic_embedded_attribute.html",
		"dijit/layout/StackContainer", "dojo/Stateful",
		"gform/Editor"//
], function(array, lang, declare, _WidgetBase, _Container, _TemplatedMixin,
		_WidgetsInTemplateMixin, template, StackContainer, Stateful,
		Editor) {

	return declare("app.GroupPanelWidget", [ _WidgetBase, _Container,
			_TemplatedMixin, _WidgetsInTemplateMixin ], {
		templateString : template,
		//_setMetaAttr : function(/* dojo/Stateful */attribute) {
		postCreate : function() {
			var attribute=this.get("meta");
			// move this to postCreate
			var validTypes = attribute.validTypes;

			this.validTypeOptions = array.map(attribute.validTypes,
					function(validType) {
						return {
							value : validType.code,
							label : validType.label
						};
					});
			this.validTypeOptions.push({
				label : "null",
				value : "null"
			});
			var initialType = this.validTypeOptions[0].value
			var panelModel = new Stateful({
				title : "",// attribute.code,
				validTypes : this.validTypeOptions,
				type : initialType
			});

			var typeStack = new StackContainer();
			var typeToGroup = {};
			var me=this;
			var typeToModel={};
			var modelHandle = this.get("modelHandle");
			typeToModel[initialType]=modelHandle.get(attribute.code);	
			array.forEach(attribute.validTypes, function(type) {
				var editor = new app.Editor();
				typeStack.addChild(editor);
				typeToGroup[type.code] = editor;
				if (type.code!=initialType) {	
					typeToModel[type.code]=new Stateful();
					typeToModel[type.code][attribute.type_property]=type.code;
					editor.set("modelHandle", typeToModel[type.code]);
				}else{
					editor.set("modelHandle", typeToModel[type.code]);
				}
				editor.set("meta", type);
			}, this);
			
			panelModel.watch("type", function() {
				var type = panelModel.get("type");
				var modelHandle=me.get("modelHandle");
				if (type == "null") {
					modelHandle.set(attribute.code, null);
					typeStack.domNode.style.display="none";
				} else {
					typeStack.domNode.style.display="block";
					modelHandle.set(attribute.code, typeToModel[type]);
					typeStack.selectChild(typeToGroup[type]);
				}
			});
			this.addChild(typeStack);
			this.set("target", panelModel);
		},
		startup: function() {
			this.inherited(arguments);
			this.get("target").set("type", this.validTypeOptions[0].value);
		}

	});

});