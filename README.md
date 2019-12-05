# Hype DataFill

![image|690x492](https://playground.maxziebell.de/Hype/DataFill/HypeDataFill.png) 

Simple project to get text previews using data set values. If the browser supports Mutation Observer the dataset keys stay reactive. There is certainly better ways to implement reactivity with a object based two-way data storage like in React or Vue instead of distributed datasets, but it is a demo on getting feedback direct in the IDE and using the additional HTML-attributes panel provided by Hype.

Usage: After registering the dataset keys with `HypeDataFill.mapDatasetToClass` for example `HypeDataFill.mapDatasetToClass('headline', '.data-headline');` every element below an element that has a `data-headline` and has the class `.data-headline` will have the content defined under `data-headline`.


Notes for version 1.1
---

**Example:** You mapped `data-user` to the class `.date-user` with `HypeDataFill.mapDatasetToClass('user', '.data-user');` in your Head HTML. Whenever you assign `data-user` on a group or symbol all children with the class `.date-user` will be updated. If you are doing this assignment in the IDE it will be set by Hype on every scene load. To avoid that just set `.date-user-initial` instead.

**Explanation of initial-clause:** All values set with the attribute panel in Hype are persistent duo to the Hype runtime refreshing them on each scene load.  This little "genie" at work might be what people expect using the IDE but it certainly isn't how programmers updating values per script would expect things to behave. Hype DataFill 1.1 now has a baked in workaround for this… just add "-initial" to your attribute entry (for example `data-user-initial` given your key is normally `data-user`). Then this value will only be set as an initial value and honor updates done via script like `yourElement.dataset.user = "Max Musterman";` across scene transition. They are anyway honored in a scene context either way.

**Demo Example**\
[HypeDataFill.html ](https://playground.maxziebell.de/Hype/DataFill/HypeDataFill.html)

**Version history**\
`1.0 Initial release under MIT-license`\
`1.1 Added option to set initial value`
