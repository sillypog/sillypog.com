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
	function onHashChange(e){
		console.log('ViewManager.onHashChange',e);
		
		var path = parseURL();
		
		if (path.page !== currentPage){
			changePage(path.page, path.subpage);
		}
		if (path.subpage !== currentSubpage){
			// Let page classes manage their own subpage changes
		}
		
		console.log('ViewManager: done onHashChange');
	}
	
	function changePage(page, subpage){
		console.log('ViewManager.showPage:',page, subpage);
		
		var cPage = currentPage;
		currentPage = page;	// Need to set the new currentPage before calling outro so it's ready for outroComplete if there's no animation
		
		if (typeof cPage !== "undefined"){
			pages[cPage].outro();
		} else {
			// This is only relevant when the app first loads
			pages[page].show();
		}
	}
	
	/**
	* Called in response to OUTRO_COMPLETE from exiting page
	*/
	function showCurrentPage(event, params){
		// Get page to show - don't rely on stored variables, the browser location is best guide.
		console.log('showCurrentPage:',currentPage);
		pages[currentPage].intro(params);
	}
	
	function parseURL(){
		var hash = $.param.fragment().substr(1) || '';
		var hashParts = hash.split('/');
		var page = hashParts[0] || '';
		var subpage = hashParts[1] || '';
		return {page:page, subpage:subpage};
	}
	
	// Export
	return ViewManager;
	
})(jQuery);