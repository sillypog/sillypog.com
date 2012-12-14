(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	$.fn.compileTemplates = function(ns){
		var id = this.attr('id');
		ns[id.toUpperCase()] = id;
		$.template(id, this.remove().html());
	}; // Would be called as $('[type="x-jQuery-tmpl"]').compileTemplates(namespace);
}));