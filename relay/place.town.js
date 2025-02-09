Object.assign(globalThis, require("kolmafia"));

// Trick or treat highlighting of houses. Based on 8bit-relay script.

module.exports.trick_or_treat_decorator = function (pageTextEncoded) {
    
    // Only work if we get a valid page
    if (typeof(pageTextEncoded) == "undefined") {
        return;
    }
    // Decode the page body
    var pageText = urlDecode(pageTextEncoded);

    // We don't want to do anything when we visit non-Trick or Treat locations in the town
    if (!pageText.includes(`<b style="color: white">Trick or Treat!</b>`)) return;

    // This is our CSS stuff
    // F versions are the faded (visited) versions, with the opacity copied from the source
    const css = `<style type='text/css'>
.litHouse {
	border: 2px solid green;
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
	border: 2px solid darkred;
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
    //~ let lookbehind = "(?<=img )";
    let start = "<img ";
    let lookahead = "(?= src='https:\/\/[A-Za-z0-9-]{1,63}\.[A-Za-z0-9-]{1,63}\.[A-Za-z]{2,6}\/otherimages\/trickortreat\/\[IMG\])";
    
    for (let iht = 0; iht < houseTypes.length; iht++) {
        ht = houseTypes[iht];
        this_la = lookahead.replace("[IMG]",ht.imgName);

        // Fresh are houses that haven't been opened yet.
        freshPattern = new RegExp(start+this_la,"g");
        newFreshText = start+`class='`+ht.style+`'`;
        pageText = pageText.replaceAll(freshPattern,newFreshText);

        // Faded are houses that have been visited.
        fadedPattern = new RegExp(start+`class='faded'`+this_la,"g");
        newFadedText = start+`class='`+ht.style+"F"+`'`;
        pageText = pageText.replaceAll(fadedPattern,newFadedText);
    }
    
    // Make the images a little smaller to fit the border
    pageText = pageText.replaceAll(`width=100 height=100 alt="A House`,`width=96 height=96 alt="A House`);

    // Take the massive string of HTML that we've altered and use it in place of the native town page
    write(pageText);
};

module.exports.main = function (pageTextEncoded) {
    module.exports.trick_or_treat_decorator(pageTextEncoded);
}
