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
	var specificTransitions = {};
	var currentPage = '';
	var currentSubpage = '';
	
	
	//----------
	// Constructor
	//----------
	var ViewManager = function(){
		console.log('ViewManager: Constructor');
		
		$(window).on('hashchange', onHashChange);

		onHashChange();
	};
	
	//----------
	// Public methods
	//----------
	ViewManager.prototype.specifyTransition = function(oldPage, newPage, callback){
		specificTransitions[oldPage] = specificTransitions[oldPage] || {};
		specificTransitions[oldPage][newPage] = callback;
	}
	
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
		
		if (page != currentPage || subpage != currentSubpage){
			showPage(page, subpage);
		}
		
		currentPage = page;
		currentSubpage = subpage;
	}
	
	var showPage = function showPage(page, subpage){
		console.log('ViewManager.showPage:',page, subpage);
		
		// Check for specific transition
		if (specificTransitions[currentPage] && specificTransitions[currentPage][page]){
			specificTransitions[currentPage][page]();
		}
		
		// Dispatch an event to the main application
		
		
		/*switch (page){
			case 'portfolio':
				// Dispatch an event and let the application decide what to do with this
				break;
			case '':	// Same as default
			default:
		}*/
	}
	
	// Export
	return ViewManager;
	
})(jQuery);