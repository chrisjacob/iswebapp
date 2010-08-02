// Referenced jsonfeed.js
// http://ax.itunes.apple.com/static/rssgenerator/jsonfeed.js
// 01/08/2010

console.log('called: itunes_rss.js');


// http://ax.itunes.apple.com/static/rssgenerator/jsonfeed.js
// 01/08/2010

var json;
var finalURL;
var channelParams;
var urlParams;
var urlPath;

//Retrieve JSON feed
function getData(cc) {
    clearMenus($('feedMediaType'));
    clearMenus($('feedType'));
    clearMenus($('feedGenre'));
    $('feedMediaType').enable();
    createOption('feedMediaType', 'Loading...');
    // new Ajax.Request('WebObjects/MZStoreServices.woa/wa/RSS/wsAvailableFeeds' + urlParams, {
    //     method:'get',
    //     onSuccess: function(transport) {
    //         $('feedMediaType').remove(0);
    //         json = transport.responseText.evalJSON();
    //         var mediaType = json.list;
    //         mediaType.each(function(name, index) {
    //             createOption('feedMediaType', name.display, name.name, isDefault(index));
    //         });
    //         $('feedMediaType').activate();
    //         $('feedSize').enable();
    //         if ($('feedMediaType').options.length == 1) {
    //             popFields(index, 'types', 'feedType');
    //             popFields(index, 'genres', 'feedGenre');
    //         }
    //     },
    //     onComplete: function() {
    //         buildFeedList($('topfeed').value);
    //     }
    // });

    $('feedMediaType').remove(0);
    json = availableFeeds[cc];
    var mediaType = json.list;
    mediaType.each(function(name, index) {
        createOption('feedMediaType', name.display, name.name, isDefault(index));
    });
    $('feedMediaType').activate();
    $('feedSize').enable();
    if ($('feedMediaType').options.length == 1) {
        popFields(index, 'types', 'feedType');
        popFields(index, 'genres', 'feedGenre');
    }
}

//Populate subsequent select menus
function popFields(id, field, elem) {
    if (id != null) {
        var feedTypes = eval('json.list[id].' + field + '.list');
        $(elem).options.length = 0;
        feedTypes.each(function(name, index) {
            if (field == "genres")
                createOption(elem, name.display, name.value, isDefault(index));
            else
                createOption(elem, name.display, name.name, isDefault(index));
        });
        $(elem).enable();
    }
}

//Create select option
function createOption(field, text, value, selected) {
    $(field).options[$(field).options.length] = new Option(text, value, selected);
}

//Generate RSS URL
function genURL(media, index) {
    var prefix = json.list[media].types.list[index].urlPrefix;
    var suffix = json.list[media].types.list[index].urlSuffix;
    var isExplicit = $$('input:checked[type="radio"][name="feedEC"]').pluck('value');
    channelParams = "limit=" + $('feedSize').value + "/";
    if ($('feedGenre').value.length != 0)
        channelParams += "genre=" + $('feedGenre').value + "/";
    if (isExplicit == "true" && $('field_explicit').visible())
        channelParams += "explicit=true/";
    finalURL = prefix + channelParams + suffix;
    $('urlField').innerHTML = finalURL;
    $('urlOutput').show();
    $('urlField').activate();

		genIframe(finalURL);
}

//Generate RSS iFrame
function genIframe(url) {
	$('urlFieldIframe').setAttribute('src', url)
	$('urlOutputIframe').show();
}

//Select first option
function isDefault(n) {return n < 1;}

//Clear all options for a given list of select elements
function clearMenus(elem) {
    while (elem.hasChildNodes())
        elem.removeChild(elem.childNodes[0])
}

//Show/Hide Explicit radios
function checkExplicit(type) {
    if (type.canBeExplicit) {
        $('field_explicit').show();
    } else {
        $('field_explicit').hide();
    }
}

//Listeners
Event.observe(window, 'load', function() {
    urlParams = location.search;
    urlPath = location.pathname;

    var countryCode = urlParams.toQueryParams().cc;
    if (countryCode != null) {
        countryCode = countryCode.toUpperCase();
    } else if (urlPath.indexOf('/rss') > 0) {
        countryCode = urlPath.substr(1,2).toUpperCase();
    } else {
        countryCode = "US";
    }
    $('feedCountry').value = countryCode;
    getData($('feedCountry').value);

    Event.observe($('feedCountry'), 'change', function() {
        if(urlParams != "") {
            if(urlParams.indexOf('cc=') > 0)
                window.location = urlParams.replace(/cc=\w*/,"cc=" + $('feedCountry').value);
            else
                window.location = window.location + "&cc=" + $('feedCountry').value;
        } else {
            window.location = "?cc=" + $('feedCountry').value;
        }
    });

    Event.observe($('feedMediaType'), 'focus', function() {
        checkExplicit(json.list[this.selectedIndex]);
        popFields(this.selectedIndex, 'types', 'feedType');
        popFields(this.selectedIndex, 'genres', 'feedGenre');
    });

    Event.observe($('feedMediaType'), 'change', function() {
        checkExplicit(json.list[this.selectedIndex]);
        popFields(this.selectedIndex, 'types', 'feedType');
        popFields(this.selectedIndex, 'genres', 'feedGenre');
    });

    Event.observe($('generate_btn'), 'click', function() {
        genURL($('feedMediaType').selectedIndex, $('feedType').selectedIndex);
    });

    Event.observe($('preview_btn'), 'click', function() {
        window.open(finalURL);
    });
});

//Build Top Feeds list based on storefront
function findOptions(elem,value) {
    for (var i=0; i < $(elem).options.length; i++) {
        if ($(elem).options[i].value == value)
            return i;
    }
    return false;
}

function populateFromLink(type,index) {
    var array = eval(type)[index];
    $('feedMediaType').selectedIndex = findOptions(array[1],array[2]);
    popFields(findOptions(array[1],array[2]), 'types', 'feedType');
    $('feedType').selectedIndex = findOptions(array[3],array[4]);
    $('feedSize').selectedIndex = array[5];
    $('feedGenre').selectedIndex = 0;
    checkExplicit(json.list[$('feedMediaType').selectedIndex]);
    genURL(findOptions(array[1],array[2]),findOptions(array[3],array[4]));
}