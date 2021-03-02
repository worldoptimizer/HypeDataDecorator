# Hype DataFill

![image|690x492](https://playground.maxziebell.de/Hype/DataFill/HypeDataFill.jpg)
<sup>The cover artwork is not hosted in this repository and &copy;opyrighted by Max Ziebell</sup>

Simple project to get text previews using data set values. If the browser supports Mutation Observer the dataset keys stay reactive. There is certainly better ways to implement reactivity with a object based two-way data storage like in React or Vue instead of distributed datasets, but it is a demo on getting feedback direct in the IDE and using the additional HTML-attributes panel provided by Hype.

Usage: After registering the dataset keys with `HypeDataFill.mapDatasetToClass` for example `HypeDataFill.mapDatasetToClass('headline');` every element below an element that has a `data-headline` and has the class `.headline` inside will have the content defined under `data-headline`.


Notes for version 1.1
---

**Example:** You mapped `data-user` with `HypeDataFill.mapDatasetToClass('user');` in your Head HTML. Whenever you assign `data-user` on a group or symbol all children withat have the CSS class `.user` will be updated. If you are doing this assignment in the IDE it will be set by Hype on every scene load. To avoid that just set `.user-initial` instead.

**Explanation of initial-clause:** All values set with the attribute panel in Hype are persistent duo to the Hype runtime refreshing them on each scene load.  This little "genie" at work might be what people expect using the IDE but it certainly isn't how programmers updating values per script would expect things to behave. Hype DataFill 1.1 now has a baked in workaround for this… just add "-initial" to your attribute entry (for example `data-user-initial` given your key is normally `data-user`). Then this value will only be set as an initial value and honor updates done via script like `yourElement.dataset.user = "Max Musterman";` across scene transition. They are anyway honored in a scene context either way.

**Regular usage:**
```
HypeDataFill.mapDatasetToClass('label'});
```
Now every `data-label` value update reflects in groups and symbols on each element with the class `.label`.

Notes for version 1.2.3
---
<sup>Switched to semantic versioning.</sup>  
**Usage with callback and refactored interface (breaking change):**  
``` 
// map based on class hence data-headline --> .headline with default innerHTML callback
HypeDataFill.mapDatasetToClass('headline');

// map based on class hence data-bgcolor --> .bgcolor with custom callback
HypeDataFill.mapDatasetToClass('bgcolor', function(elm, value){
	elm.style.backgroundColor = value;
});

// map based on more complex selector with custom currency callback
HypeDataFill.mapDatasetToSelector('price', '.currency.formatted', function(elm, value){
	elm.innerHTML = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value); 
});
```

Default callback is still only doing this … no need to set it.

```
function(elm, value){
	elm.innerHTML = value;
}
```

**Demo Example**\
[HypeDataFill.html ](https://playground.maxziebell.de/Hype/DataFill/HypeDataFill.html)

**Version history**\
`1.0 Initial release under MIT-license`\
`1.1 Added option to set initial value`
`1.2.0 Inspired by Symbol Override I added a callback`
`1.2.1 Also updating when class is modified (only in IDE)`
`1.2.2 Minor bugfix on preview, refactored names (breaking change)`

Content Delivery Network (CDN)
--
Latest version can be linked into your project using the following in the head section of your project:
```html
<script src="https://cdn.jsdelivr.net/gh/worldoptimizer/HypeDataFill/HypeDataFill.min.js"></script>
```

Optionally you can also link a SRI version or specific releases. 
Read more about that on the JsDelivr (CDN) page for this extension at https://www.jsdelivr.com/package/gh/worldoptimizer/HypeDataFill

Learn how to use the latest extension version and how to combine extensions into one file at
https://github.com/worldoptimizer/HypeCookBook/wiki/Including-external-files-and-Hype-extensions
