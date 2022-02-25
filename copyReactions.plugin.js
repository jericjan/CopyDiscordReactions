/**
 * @name CopyReactions
 * @version 0.0.1
 * @description Adds a button to the reactions window that copies all users that have reacted to a message
 * @author Kur0
 *  
 */



 module.exports = class Example{
     
    load() { }
    start() {

//code here
function copyReactions(){
    // do whatever you like here
if (document.querySelector("#app-mount > div:nth-child(7) > div.layer-1Ixpg3 > div > div > div.scroller-2GkvCq.thin-31rlnD.scrollerBase-_bVAAt.fade-1R6FHN") != null) {
    if (document.querySelector("#copyReactsbtn") == null) {
        let btn = document.createElement("button");
        btn.innerHTML = "Copy Reactions";
        btn.id = "copyReactsbtn";

        function copyToClipboard(text) {
            var dummy = document.createElement("textarea");
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);
        }

        btn.onclick = function() {
            let children = document.querySelector("#app-mount > div:nth-child(7) > div.layer-1Ixpg3 > div > div > div.reactors-1VXca7.thin-31rlnD.scrollerBase-_bVAAt.fade-1R6FHN > div").children
            list = []
            for (let i = 0; i < children.length; i++) {
                if (children[i].children.length != 0) {
                    let name = children[i].querySelector("strong > div > span.username-3JLfHz.username-tJjT82").innerHTML
                    let discriminator = children[i].querySelector("strong > div > span.discriminator-1DCM-o").innerHTML
                    list.push(`@${name}${discriminator}`)
                }
            }
            copyToClipboard(list.join(" "))
            BdApi.alert("Copied to clipboard!")
        }

        document.querySelector("#app-mount > div:nth-child(7) > div.layer-1Ixpg3 > div > div > div.scroller-2GkvCq.thin-31rlnD.scrollerBase-_bVAAt.fade-1R6FHN").appendChild(btn);


    }
}
    setTimeout(copyReactions, 1000);
}

copyReactions();

//stop coding
}
stop(){

}
}