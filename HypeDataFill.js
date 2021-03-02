/*!
Hype DataFill 1.2.2
copyright (c) 2019 Max Ziebell, (https://maxziebell.de). MIT-license
*/

/*
* Version-History
* 1.0 Initial release under MIT-license
* 1.1 Added option to set initial value
* 1.2.0 Inspired by Symbol Override I added a callback
* 1.2.1 Also updating when class is modified (only in IDE)
* 1.2.2 Minor bugfix on preview, refactored names (breaking change)
*/
if("HypeDataFill" in window === false) window['HypeDataFill'] = (function () {

	var _mapList = [];
	var _activated = {};
	

	/* @const */
	const _isHypeIDE = window.location.href.indexOf("/Hype/Scratch/HypeScratch.") != -1;

	if (_isHypeIDE) {
		//var _lastRefresh = 0;

		function refreshIDE (){
			//	var now = new Date().getTime(); if (_lastRefresh == now) return; _lastRefresh = now;
			console.log("refresh");
			_mapList.forEach(function(mapItem) {
				mapItem.baseContainer.querySelectorAll('['+mapItem.attributeName+']').forEach(function(elm){
					elm.setAttribute(mapItem.attributeName, elm.getAttribute(mapItem.attributeName));
				});
			});
		}

		function activateObserverIDE (){
			if (_isHypeIDE){
				var baseContainer = document.documentElement || document.body;
				activateObserver(baseContainer);
				var classObserver = new MutationObserver(function(m){ refreshIDE(); });
				classObserver.observe(baseContainer, { attributes: true, subtree: true, attributeFilter: [ 'class' ]});
			}
		}
	}

	function observerMappedItems (hypeDocument, element, event) {
		var baseContainer = hypeDocument.getElementById(hypeDocument.documentId());
		activateObserver(baseContainer);
	}

	function activateObserver (baseContainer){
		_mapList.forEach(function(mapItem) {
			console.log(mapItem);
			if (!_activated[baseContainer+'_'+mapItem.attributeName]){
				_activated[baseContainer+'_'+mapItem.attributeName] = true;
				mapItem.baseContainer = baseContainer;
				mapItem.startObserver(baseContainer);
			}
		});
	}

	function observerFactory(attributeName, selector, callback){
		callback = typeof callback == 'function'? callback: function(elm, value){
			elm.innerHTML = value;
		};
		return function(mutations) {
			console.log(mutations);
			mutations.forEach(function(mutation) {
				if (mutation.type == 'attributes') {
					if (mutation.attributeName == attributeName) {
						var currentValue = mutation.target.getAttribute(attributeName);
						var targetElms = mutation.target.querySelectorAll(selector);
						for (var i=0; i < targetElms.length; i++) {
							callback(targetElms[i], currentValue);
						}
					}
					if (mutation.attributeName == attributeName+'-initial') {
						var initialValue = mutation.target.getAttribute(attributeName+'-initial');
						var currentValue = mutation.target.getAttribute(attributeName);
						if (_isHypeIDE){
							mutation.target.setAttribute(attributeName, initialValue);
						} else {
							if (currentValue!=null ) {
								mutation.target.setAttribute(attributeName, currentValue);
							} else if (!mutation.target.hasAttribute(attributeName) && initialValue) {
								mutation.target.setAttribute(attributeName, initialValue);
							}
						}
					} 			
				}	
			});
		}
	}
	
	function mapDatasetToClass (key, callback){
		mapDatasetToSelector(key, '.'+key, callback);
	}

	function mapDatasetToSelector (key, selector, callback){
		var mapItem = {};
		var attributeName = 'data-'+key;

		mapItem.attributeName = attributeName;
		mapItem.observerFunction = observerFactory(attributeName, selector, callback);
		mapItem.observer = new MutationObserver(mapItem.observerFunction);

		mapItem.startObserver = function(target){
			this.observer.observe(target, { 
				attributes: true,
				subtree: true,
				attributeFilter: [ this.attributeName, this.attributeName+'-initial' ]
			});
		}

		_mapList.push(mapItem);

	}

	if (_isHypeIDE) window.addEventListener('DOMContentLoaded', function (event){
    	activateObserverIDE();
	});

	/* setup callbacks */
	if("HYPE_eventListeners" in window === false) { window.HYPE_eventListeners = Array();}
	window.HYPE_eventListeners.push({"type":"HypeDocumentLoad", "callback": observerMappedItems});
	
	/* Reveal Public interface to window['HypeDataFill'] */
	return {
		version: '1.2.2',
		'mapDatasetToClass' : mapDatasetToClass,
		'mapDatasetToSelector' : mapDatasetToSelector,
	};
})();
