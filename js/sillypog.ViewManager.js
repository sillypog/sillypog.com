/**
* View manager
*
* Watches for changes in the window hash and execute appropriately.
* Want to be able to pass in specific functions for specific changes, eg main->portfolio.
*/
var sillypog = sillypog || {};
sillypog.ViewManager = (function($){
	'use strict';
	
	//----------
	// Private properties
	//----------
	var pages,
		currentPage,
		currentSubpage = '';
	
	
	/*----------
	* Constructor
	*Each section of the appliation has a class that manages it.
	* These are added here with a name corresponding to the page name in the url.
	* Every page implements the same interface so the manager can call the correct method as needed.
	\*----------*/
	var ViewManager = function(pageInfo){
		console.log('ViewManager: Constructor');
		
		pages = pageInfo;
		
		// Listen for events from pages
		for (var i in pages){
			$(pages[i]).bind(sillypog.events.OUTRO_COMPLETE, showCurrentPage);
		}
		
		$(window).on('hashchange', onHashChange);
		onHashChange();
	};
	
	
	//----------
	// Private methods
	//----------
	
	var onHashChange = function onHashChange(e){
		console.log('ViewManager.onHashChange',e);
		
		var hash = $.param.fragment().substr(1) || '';
		console.log('Hash change', hash);
		
		var hashParts = hash.split('/');
		var page = hashParts[0] || '';
		var subpage = hashParts[1] || '';
		
		if (page !== currentPage || subpage !== currentSubpage){
			showPage(page, subpage);
		}
		
		currentPage = page;
		currentSubpage = subpage;
	}
	
	var showPage = function showPage(page, subpage){
		console.log('ViewManager.showPage:',page, subpage);
		
		if (typeof currentPage !== "undefined"){
			pages[currentPage].outro();
		} else {
			pages[page].show();
		}
	}
	
	/**
	* Called in response to OUTRO_COMPLETE from exiting page
	*/
	var showCurrentPage = function showCurrentPage(event, params){
		console.log('!!',params);
		pages[currentPage].intro(params);
	}
	
	// Export
	return ViewManager;
	
})(jQuery);