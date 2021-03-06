define([ "dojo/_base/array", //
"dojo/_base/lang",//
"dojo/_base/declare",//
"./ListPane"//
], function(array, lang, declare, ListPane) {

	return declare("gform.ListGroupFactory", null, {
		constructor : function(kwArgs) {
			lang.mixin(this, kwArgs);
		},
		
		create : function(group, modelHandle) {
			var listWidget = new ListPane({
				meta:group
			});
			
			array.forEach(group.groups, function(childGroup) {
				var groupWidget = this.editorFactory.create(childGroup, modelHandle);
				listWidget.addChild(groupWidget);
			}, this);
			
			return listWidget;
		},
		collectAttributes: function(group) {
			var attributes=[];
			array.forEach(group.groups, function(group) {
				array.forEach(group.attributes, function(attribute) {
					attributes.push(attribute);
				},this);
			},this);
			return attributes;
		},
	});
});
