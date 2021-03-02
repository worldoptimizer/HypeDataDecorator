/*!
Hype Data Decorator 1.2.5
copyright (c) created 2019, refactored 2021 by Max Ziebell, (https://maxziebell.de). MIT-license
*/

/*
* Version-History
* 1.0 Initial release under MIT-license
* 1.1 Added option to set initial value
* 1.2.0 Inspired by Symbol Override I added a callback
* 1.2.1 Also updating when class is modified (only in IDE)
* 1.2.2 Minor bugfix on preview, refactored names (breaking change)
* 1.2.3 Remove the possibility for recursive loops in IDE and console.log
* 1.2.4 Added hypeDocument, symbolInstance to callback and setContent
* 1.2.5 Renamed and refactored to Hype Data Decorator
*/
if("HypeDataDecorator" in window === false) window['HypeDataDecorator'] = (function () {

	var _mapList = [];
	var _activated = {};

	/* @const */
	const _isHypeIDE = window.location.href.indexOf("/Hype/Scratch/HypeScratch.") != -1;

	if (_isHypeIDE) {
		var _lastRefresh = 0;

		function refreshIDE (){
			var now = Math.round(new Date().getTime()/10); if (_lastRefresh == now) return; _lastRefresh = now;
			_mapList.forEach(function(mapItem) {
				mapItem.baseContainer.querySelectorAll('['+mapItem.attributeName+']').forEach(function(elm){
					elm.setAttribute(mapItem.attributeName, elm.getAttribute(mapItem.attributeName));
				});
			});
		}

		window.addEventListener('DOMContentLoaded', function (event){
    		if (_isHypeIDE){
				var baseContainer = document.documentElement || document.body;
				var classObserver = new MutationObserver(function(){ refreshIDE(); });
				classObserver.observe(baseContainer, { attributes: true, subtree: true, attributeFilter: [ 'class' ]});
				activateObserver(baseContainer);
			}
		});
	}

	function activateObserver (baseContainer, hypeDocument){
		_mapList.forEach(function(mapItem) {
			if (!_activated[baseContainer+'_'+mapItem.attributeName]){
				_activated[baseContainer+'_'+mapItem.attributeName] = true;
				mapItem.baseContainer = baseContainer;
				mapItem.observerFunction = observerFactory(
					mapItem.attributeName, 
					mapItem.selector, 
					mapItem.callback,
					hypeDocument
				);
				mapItem.observer = new MutationObserver(
					mapItem.observerFunction
				);
				mapItem.startObserver = function(target){
					this.observer.observe(target, { 
						attributes: true,
						subtree: true,
						attributeFilter: [ this.attributeName, this.attributeName+'-initial' ]
					});
				};
				mapItem.startObserver(
					baseContainer, 
					hypeDocument
				);
			}
		});
	}

	function setContent(elm, value){
		if (elm.querySelector('.HYPE_element_container, .HYPE_element')) return;
		elm.innerHTML = value;
	}

	function observerFactory(attributeName, selector, callback, hypeDocument){
		callback = typeof callback == 'function'? callback: setContent;
		return function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.type == 'attributes') {
					if (mutation.attributeName == attributeName) {
						var currentValue = mutation.target.getAttribute(attributeName);
						var targetElms = [].slice.call(mutation.target.querySelectorAll(selector));
						if(mutation.target.matches(selector)) targetElms.unshift(mutation.target);
						for (var i=0; i < targetElms.length; i++) {
							var symbolInstance = hypeDocument? hypeDocument.getSymbolInstanceById(targetElms[i].id):null; 
							callback(targetElms[i], currentValue, hypeDocument, symbolInstance);
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

	function observerMappedItems (hypeDocument, element, event) {
		var baseContainer = hypeDocument.getElementById(hypeDocument.documentId());
		activateObserver(baseContainer, hypeDocument);
	}
	
	function mapDatasetToClass (key, callback){
		mapDatasetToSelector(key, '.'+key, callback);
	}

	function mapDatasetToSelector (key, selector, callback){
		_mapList.push( {
			attributeName : 'data-'+key,
			selector : selector.trim(),
			callback : callback,
		} );
	}

	/* setup callbacks */
	if("HYPE_eventListeners" in window === false) { window.HYPE_eventListeners = Array();}
	window.HYPE_eventListeners.push({"type":"HypeDocumentLoad", "callback": observerMappedItems});
	
	/* Reveal Public interface to window['HypeDataDecorator'] */
	return {
		version: '1.2.5',
		'mapDatasetToClass' : mapDatasetToClass,
		'mapDatasetToSelector' : mapDatasetToSelector,
		'setContent' : setContent,
	};
})();
