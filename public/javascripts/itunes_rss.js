(function( window, $, undefined ) {
	
var document = window.document,
	json,
	finalURL,
	channelParams,
	urlParams = window.location.search,
	urlParamsObj = $.deparam.querystring(urlParams),
	urlPath = window.location.pathname,
	isWebAppItunesRss = { 
		options: {},
		is_ready: false
	};

	isWebAppItunesRss.init = function init( options ){
		this.options = $.extend({}, isWebAppItunesRss.defaults, options);
		
		// set the default countryCode from the ?cc= param
		this.countryCode = urlParamsObj.cc;
		if (this.countryCode !== undefined) {
			this.countryCode = this.countryCode.toUpperCase();
		} else {
			this.countryCode = "US";
		}
    $('#feedCountry').val(this.countryCode);
    
		getData(this.countryCode);
		
		$('#feedCountry').bind( 'change', function(){
			var paramsStr = 'cc=' + $('#feedCountry').val();
			window.location = $.param.querystring( window.location.href, paramsStr );
		});
		
		$('#feedMediaType').bind( 'focus change', function(){
			if( typeof json !== undefined )
			{
				checkExplicit(json.list[this.selectedIndex]);
				popFields(this.selectedIndex, 'types', '#feedType');
				popFields(this.selectedIndex, 'genres', '#feedGenre');
			}
		});
		
		$('#generate_btn').bind( 'click', function(){
			genURL($('#feedMediaType').attr('selectedIndex'), $('#feedType').attr('selectedIndex'));
		});
		
		$('#preview_btn').bind( 'click', function(){
			window.open(finalURL);
		});
		
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
			window.console.log(urlParams);
			window.console.log(urlParamsObj);
			window.console.log(urlPath);
			window.console.log(obj.countryCode);
		}
	}
	
	// get data for the country
	function getData(cc) {
		// clear out any current options
		$('#feedMediaType > option').remove();
		$('#feedType > option').remove();
		$('#feedGenre > option').remove();
		
		$('#feedMediaType').removeAttr('disabled');
		
		createOption( '#feedMediaType', 'Loading...' );

		$.getScript( '/javascripts/wsAvailableFeeds/' + isWebAppItunesRss.countryCode + '.js', function(){
			if(typeof availableFeeds !== 'undefined')
			{
				json = availableFeeds;
				// window.console.log(json);
				
				// load in mediaType options and focus on this field
				var mediaType = availableFeeds.list;
				$('#feedMediaType > option').remove();
				$.each(mediaType, function(i, e){
					createOption('#feedMediaType', e.display, e.name, isDefault(i));
				});
				$('#feedMediaType').focus();
				
				$('#feedSize').removeAttr('disabled');
				
				// populate feedType and feedGenre fields 
				if($('#feedMediaType > option').length > 0)
				{
					popFields(0, 'types', '#feedType');
					popFields(0, 'genres', '#feedGenre');
				}
			}
		});
	}
	
	// Populate subsequent select menus
	function popFields(id, field, elem) {
		if (id !== null) {
			var feedTypes = $.getObject( 'list.'+ id +'.'+ field +'.list' , json );
			if(feedTypes) {
				$(elem +' > option').remove();
				
				$.each(feedTypes, function(i, e){
					if(field === 'genres') {
						createOption(elem, e.display, e.value, isDefault(i));
					} else {
						createOption(elem, e.display, e.name, isDefault(i));
					}
				});
				
				$(elem).removeAttr('disabled');
			}
		}
	}
	
	// Create and append a select option
	function createOption(field, text, value, selected) {
		var new_option = $('<option value="'+ value +'">'+ text +'</option>');
		if(selected) {
			new_option.attr( 'selected', 'selected');
		}
		$(field).append(new_option);
	}
	
	// Generate RSS URL
	function genURL(media, index) {
		var prefix = $.getObject( 'list.'+ media +'.types.list.'+ index +'.urlPrefix' , json ),
				suffix = $.getObject( 'list.'+ media +'.types.list.'+ index +'.urlSuffix' , json ),
				isExplicit = ( $('#feedEC > option:selected').val() === 'true' ) && $('#feedEC').is(':visible');
		
		channelParams = "limit=" + $('#feedSize').val() + "/";
		
		if( $('#feedGenre').val() !== '' ){
			channelParams += "genre=" + $('#feedGenre').val() + "/";
		}
		
		if( isExplicit ) {
			channelParams += "explicit=true/";
		}
		
		finalURL = prefix + channelParams + suffix;
		$('#urlField').val(finalURL);
		$('#urlOutput').show();
		
		genIframe();
	}

	//Generate RSS iFrame
	function genIframe() {
		if( typeof finalURL !== 'undefined' ) {
			$('#urlFieldIframe').attr('src', finalURL);
			$('#urlOutputIframe').show();
		}
	}
	
	// Select first option
	function isDefault(n) {return n < 1;}

	// Show/Hide Explicit options
	function checkExplicit(type) {
		if (type.canBeExplicit) {
			$('#field_explicit').show();
		} else {
			$('#field_explicit').hide();
		}
	}

	// Expose isWebAppItunesRss to the global object
	window.isWebAppItunesRss = isWebAppItunesRss;

})(this, jQuery);
