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

		$.getScript( 'http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/wa/RSS/wsAvailableFeeds?cc=' + isWebAppItunesRss.countryCode, function(){
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
		
		// genIframe();
		
		getSimplifiedFeed();
	}

	// Generate RSS iFrame
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
	
	
	////////////////////////////////////
	// Modified from
	// WWDC 2010 Sample Code
	// WWDC10-SampleCode/Safari/SearchAPIDemo.zip
	// http://connect.apple.com/cgi-bin/WebObjects/MemberSite.woa/wa/getSoftware?code=y&source=x&bundleID=20645
	////////////////////////////////////
	
	// return a simple array of objects containing artworkUrl, id, title, artistName, and artistId
	// function getSimplifiedFeed( feedUrl, partnerId, urlPrefix, entryTransformFunction, callback ){
	function getSimplifiedFeed( ){
		var feedUrl = finalURL.slice(0, -3) + 'callback=_jqjsp/json'; // remove 'xml' and replace with jsonp callback
		
		window.console.log(feedUrl);
		
		$.jsonp({
			url: feedUrl,
			callback: "_jqjsp",
			success: function(json, textStatus){
				// This will be called in case of success no matter the callback name
				// this; // the xOptions object or xOptions.context if provided
				window.console.log('JSONP > Success');
				// window.console.log('JSONP > Success > json');
				// window.console.log(json);
				// window.console.log('JSONP > Success > textStatus');
				// window.console.log(textStatus);
				
				try{
					window.console.debug('Raw JSON:', json);
					var result = [];

					if( !json.feed.entry ){
						window.console.warn('No "entry" array for feed:', feedUrl);
					} else {
						$.each(json.feed.entry, function(i, rssEntry){
							try{
								window.console.group("Entry " + i + ": " + rssEntry['im:name'].label, rssEntry);
								window.console.debug(rssEntry);
								
								var simpleEntry = {
									// "url" : affiliate.affiliatedUrlForUrl($.getObject( "id.label", rssEntry ), partnerId, urlPrefix),
									"url" : $.getObject( "id.label", rssEntry ),
									"id" : $.getObject( "id.label", rssEntry ).replace(/.*\/id(\d+)(\?.*|$)/, '$1'),
									"artworkUrl" : $.getObject( "im:image.2.label", rssEntry ),
									"artworkHeight" : $.getObject( "im:image.2.attributes.height", rssEntry ),
									"title" : $.getObject( "title.label", rssEntry )
									// ,"contentTitle" : $.getObject( "im:name.label", rssEntry ),
									// "artistName" : $.getObject( "im:artist.label", rssEntry ),
									// "artistId" : $.getObject( "im:artist.attributes.href", rssEntry ).replace(/.*\/id(\d+)(\?.*|$)/, '$1')
								};

								result.push(htmlElementForSimpleFeedEntry(simpleEntry));
								
								window.console.groupEnd();
							} catch(e) {
								window.console.warn("Caught exception", e, rssEntry);
							}
						});
					}
				} catch(e) {
					window.console.warn("Caught exception", e);
				}
				
				genPageContentForFeed(result);
				// callback(result);
			},
			error: function(xOptions, textStatus){
				// This will be called in case of error no matter the callback name
				// this; // the xOptions object or xOptions.context if provided
				window.console.log('JSONP > Error');
				window.console.log('JSONP > Error > xOptions');
				window.console.log(xOptions);
				window.console.log('JSONP > Error > textStatus');
				window.console.log(textStatus);
			},
			complete: function(xOptions, textStatus){
				// This will be called when the request finishes (after success and error callbacks are executed).
				// this; // the xOptions object or xOptions.context if provided
				window.console.log('JSONP > Complete');
				// window.console.log('JSONP > Complete > xOptions');
				// window.console.log(xOptions);
				// window.console.log('JSONP > Complete > textStatus');
				// window.console.log(textStatus);
			}
		});
	}
	
	// return an HTML element for a given entry, including data from a quick SearchAPI lookup
	function htmlElementForSimpleFeedEntry(simpleEntry) {
		console.log(simpleEntry.artworkHeight);
		var result = $("<div/>");
		result.addClass('rssResult');
		result.height(parseInt(simpleEntry.artworkHeight, 10));
		
		var contentImage = $("<img/>");
		contentImage.attr("src", simpleEntry.artworkUrl);
		
		var contentLink = $("<a/>");
		contentLink.addClass("rssLinkedImage");
		contentLink.attr("href", simpleEntry.url);
		contentLink.attr("title", simpleEntry.title);
		contentLink.data('id', simpleEntry.id);
		
		contentLink.append(contentImage);
		result.append(contentLink);

		// if (true) {
		// 	var overlay = $("<ol/>").addClass('songOverlay');
		// 	var url = 'http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/wsLookup?entity=song&limit=5&sort=popularity&id=' + simpleEntry.id;
		// 	$.getJSON(url, null, function(data) {
		// 		$.each(data.results, function(index, song) {
		// 			if (index == 0) { return true; } // skip the first entry, which will be for the album
		// 			overlay.append($("<li/>").text(song.trackCensoredName));
		// 		});
		// 		result.append(overlay);
		// 	});
		// }
		return result;  
	}
	
	function genPageContentForFeed(feedHtmlElements) {
		console.debug("Pulled back simple data: ", feedHtmlElements); 
		if(feedHtmlElements){
			$("#rssContent").show().empty();
			$.each(feedHtmlElements, function(i, entry) { 
				$("#rssContent").append(entry);
			});
		};
	}

	// Expose isWebAppItunesRss to the global object
	window.isWebAppItunesRss = isWebAppItunesRss;

})(this, jQuery);
