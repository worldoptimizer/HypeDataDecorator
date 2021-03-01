/*!
Hype DataFill 1.2
copyright (c) 2019 Max Ziebell, (https://maxziebell.de). MIT-license
*/

/*
* Version-History
* 1.0 Initial release under MIT-license
* 1.1 Added option to set initial value
* 1.2 Inspired by Symbol Override I added a callback
*/
if("HypeDataFill" in window === false) window['HypeDataFill'] = (function () {

	var _mapList = [];
	var _activated = {};
	
	/* @const */
	const _isHypeIDE = window.location.href.indexOf("/Hype/Scratch/HypeScratch.") != -1;

	function watchContentNodes (hypeDocument, element, event) {
		var baseContainer = hypeDocument.getElementById(hypeDocument.documentId());
		activateObserver(baseContainer);
	}

	function activateObserverIDE (){
		if (_isHypeIDE){
			var baseContainer = document.documentElement || document.body;
			activateObserver(baseContainer);
		}
	}

	function activateObserver (baseContainer){
		_mapList.forEach(function(mapItem) {
			if (!_activated[baseContainer+'_'+mapItem.attributeName]){
				_activated[baseContainer+'_'+mapItem.attributeName] = true;
				mapItem.startObserver(baseContainer);
			}
		});
	}

	function observerFactory(attributeName, selector, callback){
		callback = typeof callback == 'function'? callback: function(elm, value){
			elm.innerHTML = value;
		};
		return function(mutations) {
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
	
	function mapDatasetToClass (key, selector, callback){
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
		activateObserverIDE();
	}

	/* setup callbacks */
	if("HYPE_eventListeners" in window === false) { window.HYPE_eventListeners = Array();}
	window.HYPE_eventListeners.push({"type":"HypeScenePrepareForDisplay", "callback": watchContentNodes});
	
	/* Reveal Public interface to window['HypeDataFill'] */
	return {
		version: '1.2',
		'mapDatasetToClass' : mapDatasetToClass,
	};
})();
