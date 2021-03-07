# Hype Data Decorator

![image|690x492](https://playground.maxziebell.de/Hype/DataDecorator/HypeDataDecorator.jpg)
<sup>The cover artwork is not hosted in this repository and &copy;opyrighted by Max Ziebell</sup>

Project for getting reactivity and feedback directly in Tumult Hype 4 using the additional HTML-attributes panel for options.

**Usage:** After registering the dataset keys with `HypeDataDecorator.mapDataAttribute` for example `HypeDataDecorator.mapDataAttribute('headline');` every element below an element that has a `data-headline` and has the class `.headline` inside will have the content defined under `data-headline`.


Notes for version 1.1
---

**Example:** You mapped `data-user` with `HypeDataDecorator.mapDataAttribute('user');` in your Head HTML. Whenever you assign `data-user` on a group or symbol all children withat have the CSS class `.user` will be updated. If you are doing this assignment in the IDE it will be set by Hype on every scene load. To avoid that just set `.user-initial` instead.

**Explanation of initial-clause:** All values set with the attribute panel in Hype are persistent duo to the Hype runtime refreshing them on each scene load.  This little "genie" at work might be what people expect using the IDE but it certainly isn't how programmers updating values per script would expect things to behave. Hype DataDecorator 1.1 now has a baked in workaround for this… just add "-initial" to your attribute entry (for example `data-user-initial` given your key is normally `data-user`). Then this value will only be set as an initial value and honor updates done via script like `yourElement.dataset.user = "Max Musterman";` across scene transition. They are anyway honored in a scene context either way.

**Regular usage:**
```javascript
HypeDataDecorator.mapDataAttribute('label');
```
Now every `data-label` value update reflects in groups and symbols on each element with the class `.label`.

Notes for version 1.2.6 
---
<sup>Switched to semantic versioning.</sup>  
**Usage with callback and refactored interface and name to reflect new capabilities:** 

Various examples:

```javascript 
// register an element decorator callback called bgcolor
HypeDataDecorator.registerElementDecorator(
	'bgcolor', 
	function(hypeDocument, element, event){
		element.style.backgroundColor = event.value;
	}
);

// register an element decorator callback called randomcolor
HypeDataDecorator.registerElementDecorator(
	'randomcolor',
	function(hypeDocument, element, event){
		return {
			value: 'rgb('+
				Math.floor(Math.random()*256)+','+
				Math.floor(Math.random()*256)+','+
				Math.floor(Math.random()*256)+')'
		}
	}
);

// map based on class hence data-bgcolor --> .bgcolor with custom callback
HypeDataDecorator.mapDataAttribute(
	'bgcolor', 
	'randomcolor|bgcolor'
);

var upper = function(hypeDocument, element, event){
	event.value = event.value.toUpperCase();
	return event;
}

HypeDataDecorator.registerElementDecorator('upper', upper);

// map data attribute to class hence data-headline --> .headline with default custom decorators by string joind by pipe symbol
//HypeDataDecorator.mapDataAttribute('headline', 'upper|setContent');

// this shows that you can mix and match registered decorator names and direct functions using an array
HypeDataDecorator.mapDataAttribute('headline', [upper, 'setContent']);

// callback with hypeDocument and symbolInstance
HypeDataDecorator.mapAttributeToSelector(
	'data-symbol-start', 
	'.symbol-start', 
	function(hypeDocument, element, event){
		if(event.symbolInstance) {
			event.symbolInstance.startTimelineNamed(event.value, hypeDocument.kDirectionForward);
		}
	}
);

// map based on more complex selector with custom currency callback (could use other dataset node for currency instead of de-DE)
HypeDataDecorator.mapAttributeToSelector(
	'data-price', 
	'.currency.formatted', 
	function(hypeDocument, element, event){
		var currency = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
		HypeDataDecorator.setContent(element, currency.format(event.value)); 
	}
);

```

---

Default callback still only replaces the content in a save way (meaning if its and end node).
Also, one can use the a preset like setting to set multiple values:

![](https://forums.tumult.com/uploads/db2156/original/3X/9/6/96edabcaca7c2c57eabfff4acfb7da559a526d21.gif)

```javascript
// preset based overrides with hypeDocument callback
HypeDataDecorator.mapDataAttribute(
	'preset',
	function(hypeDocument, element, event){
		switch (event.value){
			case "invalid":
				element.style.backgroundColor = 'red';
				element.style.color = 'yellow';
				element.innerHTML = 'Broken!';
				//...
				break;
	
			case "valid":
				element.style.backgroundColor = 'green';
				element.style.color = 'white';
				element.innerHTML = 'Fixed';
				//...
				break;
		}
	}
);
```

---

With direct observation you can do the following (new since v1.2.6):

![](https://forums.tumult.com/uploads/db2156/original/3X/c/1/c17abe06caccbfbd7b559aeb348dd755a5168a63.gif)

```javascript

// setup a direct observer by selector and process it with callback
HypeDataDecorator.observeBySelector(
	'.progress', 
	function(hypeDocument, element, event){
		element.innerHTML = element.style.width;
	}
);

// Complex oberserver example using some SVG magic pulling from defs and setting up multiple data attributes
// in these cases it is more efficient (in my opinion) to set up this way but you can always also observer
// each data attribute individually instead of with a single observer.
HypeDataDecorator.observeBySelector('[data-marker-start],[data-marker-mid],[data-marker-end]', function(hypeDocument, element, event){
	var pathElm = element.querySelector('path');
	var markerStart = element.getAttribute('data-marker-start');
	var markerMid = element.getAttribute('data-marker-mid');
	var markerEnd = element.getAttribute('data-marker-end');
	if (markerStart) pathElm.setAttribute('marker-start', 'url(#'+markerStart+')');
	if (markerMid) pathElm.setAttribute('marker-mid', 'url(#'+markerMid+')');
	if (markerEnd) pathElm.setAttribute('marker-end', 'url(#'+markerEnd+')');
}, {attributeFilter: ['data-marker-start', 'data-marker-mid' , 'data-marker-end']});		

```

---

**Version history**\
`1.0 Initial release under MIT-license`\
`1.1 Added option to set initial value`\
`1.2.0 Inspired by Symbol Override I added a callback`\
`1.2.1 Also updating when class is modified (only in IDE)`\
`1.2.2 Minor bugfix on preview, refactored names (breaking change)`\
`1.2.3 Remove the possibility for recursive loops in IDE and console.log`\
`1.2.4 Added hypeDocument, symbolInstance to callback and setContent`\
`1.2.5 Renamed and refactored to Hype Data Decorator`\
`1.2.6 Another refactor, comments in code, cleanup and direct observer`

Content Delivery Network (CDN)
--
Latest version can be linked into your project using the following in the head section of your project:
```html
<script src="https://cdn.jsdelivr.net/gh/worldoptimizer/HypeDataDecorator/HypeDataDecorator.min.js"></script>
```

Optionally you can also link a SRI version or specific releases. 
Read more about that on the JsDelivr (CDN) page for this extension at https://www.jsdelivr.com/package/gh/worldoptimizer/HypeDataDecorator

Learn how to use the latest extension version and how to combine extensions into one file at
https://github.com/worldoptimizer/HypeCookBook/wiki/Including-external-files-and-Hype-extensions
