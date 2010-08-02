(function( window, $, undefined ) {
	
var document = window.document,
	isWebAppItunesRss = { 
		options: {},
		is_ready: false
	};

	isWebAppItunesRss.init = function init( options ){
		this.options = $.extend({}, isWebAppItunesRss.defaults, options);
		this.is_ready = true;
		debug(this, options);
	};
	
	isWebAppItunesRss.defaults = {
		status: true
	};
	
	isWebAppItunesRss.get_defaults = function get_defaults(){
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
		}
	}

	// Expose isWebAppItunesRss to the global object
	window.isWebAppItunesRss = isWebAppItunesRss;

})(this, jQuery);
