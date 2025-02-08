Object.assign(globalThis, require("kolmafia"));

// Trick or treat highlighting of housed. Based on 8bit-relay script.

module.exports.main = () => {
    // This will give us the current page's HTML as a big string
    // Since the relay script loads when the town does, it'll be town's HTML
    var pageText = visitUrl();

    // We don't want to do anything when we visit sub-locations in the town
    if (!pageText.includes(`<b style="color: white">Trick or Treat!</b>`)) return;

    // This is our CSS stuff
    // F versions are the faded versions, with the opacity copied from the source
    const css = `<style type='text/css'>
.litHouse {
	border: 2px solid greenIf I;
}
.litHouseF {
	border: 2px solid green;
	zoom: 1;
	filter: alpha(opacity=35);
	opacity: 0.35;
	-khtml-opacity: 0.35; 
	-moz-opacity: 0.35;
}
.darkHouse {
	border: 2px solid red;
}
.darkHouseF {
	border: 2px solid red;
	zoom: 1;
	filter: alpha(opacity=35);
	opacity: 0.35;
	-khtml-opacity: 0.35; 
	-moz-opacity: 0.35;
}
.starHouse {
	border: 2px solid blue;
}
.starHouseF {
	border: 2px solid blue;
	zoom: 1;
	filter: alpha(opacity=35);
	opacity: 0.35;
	-khtml-opacity: 0.35; 
	-moz-opacity: 0.35;
}
`
    // First we add our CSS to the few styles already defined on the page
    pageText = pageText.replace(`<style type='text/css'>`, css);
    
    // Patterns for houses
    let litHouses  = {imgName: "house_l\\d{1,2}\.gif", style:"litHouse" };
    let darkHouses = {imgName: "house_d\\d{1,2}\.gif", style:"darkHouse"};
    let starHouse  = {imgName: "starhouse\.gif"      , style:"starHouse"};
    let houseTypes = [litHouses,darkHouses,starHouse];
    
    // No lookbehinds in Rhino :(
    //~ let lookbehind = "(?<=img class=)";
    let start = "<img class=";
    let lookahead = "(?= src='https:\/\/[A-Za-z0-9-]{1,63}\.[A-Za-z0-9-]{1,63}\.[A-Za-z]{2,6}\/otherimages\/trickortreat\/\[IMG\])";
    
    for (let iht = 0; iht < houseTypes.length; iht++) {
        ht = houseTypes[iht];
        this_la = lookahead.replace("[IMG]",ht.imgName);
        fullPattern = new RegExp(start+"'faded'"+this_la,"g");
        newText = start+`'`+ht.style+"F"+`'`;
        pageText = pageText.replaceAll(fullPattern,newText);
    }

    // Take the massive string of HTML that we've altered and use it in place of the native 8bit page
    write(pageText);
};
