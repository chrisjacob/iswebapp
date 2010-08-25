GOALS
=======================

AJAX for Everything
-----------------------
Die page refreshes, DIE! Dynamically load in .js and .css depending on the current "state"

Headless AJAX
-----------------------
Deeplinking application "states" and Search Engine crawlability (+ noscript visitor accessibility).


TODO - High
=======================
Small Task
-----------------------
* AJAX for Everything - Organise .js and .css files into application specific files e.g. isRss.js and isRss.css, isSearch.js and isSearch.css, application.js and application.css
* AJAX for Everything - isRss.js should encapsulate everything in an "isRss" object, same for all other "apps"
* AJAX for Everything - isRss.css should have a root css class of body#isRss{}, same for all other "apps"


Big Task
-----------------------
* AJAX for Everything - Dynamically load .js and .css files ... or any file
* Headless AJAX - Deeplinking, ensure any "state" in the app can be directly navigated to. e.g. http://iswebapp.com/?app=rss or http://iswebapp.com/#app=rss 
* Headless AJAX - HTMLUnit hosted on Google App Engine (GAE).
* Headless AJAX - HTMLUnit as a Web Service on GAE to return HTML Snapshots (altered DOM following js execution on page load)


TODO - Low
=======================
Small Task
-----------------------
* Rewrite www.iswebapp.com/ to iswebapp.com/. See: http://scottw.com/seo-rack-rewrite


Big Task
-----------------------


COMPLETED
=======================
 * Start a todo list [Chris 2010-08-26]