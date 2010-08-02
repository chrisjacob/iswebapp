(function( window, $, undefined ) {
	
var document = window.document,
	isWebApp = { 
		options: {},
		is_ready: false
	};

	isWebApp.init = function init( options ){
		this.options = $.extend({}, isWebApp.defaults, options);
		this.is_ready = true;
		debug(this, options);
	};
	
	isWebApp.defaults = {
		status: true,
		page_name: ''
	};
	
	isWebApp.get_defaults = function get_defaults(){
		return this.defaults;
	};
	
	isWebApp.get_options = function get_options(){
		return this.options;
	};
	
	// PRIVATE FUNCTIONS
	function debug(obj, options){
		if (window.console && window.console.log) {
			window.console.log(obj);
			window.console.log(options);
			window.console.log($().jquery);
			window.console.log(document);
		}
	}

	// Expose isWebApp to the global object
	window.isWebApp = isWebApp;

})(this, jQuery);