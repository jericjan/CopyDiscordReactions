/**
 * @name CopyReactions
 * @version 0.0.2
 * @description Adds a button to the reactions window that copies all users that have reacted to a message
 * @author Kur0
 *  
 */
module.exports = class Example {

  load() {

  }
  start() {

    var list = []
    var reactMenuCount = 0
	var scrollerSelector = "div.scroller-2GkvCq.thin-31rlnD.scrollerBase-_bVAAt.fade-1R6FHN"
	var reactorsSelector = "div.reactors-1VXca7.thin-31rlnD.scrollerBase-_bVAAt.fade-1R6FHN"
    function copyToClipboard(text) {
      var dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    }


    function onButtonClick() {

      list = []
      let children = document.querySelector(`${reactorsSelector} > div`).children


      function atTop() {
        console.log("atTop start")
        var elem = document.querySelector(reactorsSelector)
        var children = document.querySelector(`${reactorsSelector} > div`).children
        if (elem.scrollTop == 0) {
          console.log("at the top")
          next(list);
        } else {
          console.log("Scrolling up")
          children[0].scrollIntoView();
          setTimeout(atTop, 1000);
        }
      }

      atTop();

      function next(list) {
        console.log("aaaaa")

        console.log("starting thing")
        for (let i = 0; i < children.length; i++) {
          if (children[i].children.length != 0) {
            while (typeof children[i].querySelector("strong > div > span.username-3JLfHz.username-tJjT82") === "null") {
              //pass
            }
            //console.log("[1] added children:")
            //console.log(children[i])
            if (children[i].querySelector("span.spinner-2RT7ZC") != null) {
              console.log("spinner")
            } else {
              let name = children[i].querySelector("strong > div > span.username-3JLfHz.username-tJjT82").innerHTML
              let discriminator = children[i].querySelector("strong > div > span.discriminator-1DCM-o").innerHTML
              list.push(`@${name}${discriminator}`)
            }
          }
        }




        console.log("starting thing2")
        var lastElem = null

        var mutationObserver = new MutationObserver(function(mutations) {
          /*creates observer*/

          for (let i = 0; i < mutations.length; i++) {
            if (mutations[i].addedNodes.length != 0) {
              // console.log('Mutation found:')
              // console.log(mutations[i].addedNodes[0])

              while (typeof mutations[i].addedNodes[0].querySelector("strong > div > span.username-3JLfHz.username-tJjT82") === "null") {
                //pass
              }
              //console.log("[2] added nodes:")
              //console.log(mutations[i].addedNodes[0])
              if (document.querySelector(`${reactorsSelector} > div > span`) != null) {
                console.log("spinner")
              } else {
                let name = mutations[i].addedNodes[0].querySelector("strong > div > span.username-3JLfHz.username-tJjT82").innerHTML
                let discriminator = mutations[i].addedNodes[0].querySelector("strong > div > span.discriminator-1DCM-o").innerHTML
                list.push(`@${name}${discriminator}`)
              }

            }
          }



          if (mutations[mutations.length - 1].addedNodes[0] != lastElem) {
            if (mutations[mutations.length - 1].addedNodes.length != 0) {
              var lastElem = mutations[mutations.length - 1].addedNodes[0]
              console.log("scrolling")
              lastElem.scrollIntoView();
            } else {
              console.log("end?")
              console.log(list.join(" "))
              console.log(`length: ${list.length}`)
            }
          }

        });

        mutationObserver.observe(document.querySelector(`${reactorsSelector} > div`), {

          childList: true
        });
        children[children.length - 1].scrollIntoView();

        function isEnd() {
          console.log("isEnd start")
          var elem = document.querySelector(reactorsSelector)
          if (elem.scrollHeight - elem.scrollTop === elem.clientHeight) {
            if (document.querySelector(`${reactorsSelector} > div > span`) == null) {
              console.log("end")
              console.log(list.join(" "))
              console.log(`length: ${list.length}`)
              reactMenuCount = document.querySelector(`${scrollerSelector} > div.reactionSelected-1aMb2K > div.text-sm-normal-3Zj3Iv`).innerHTML
              if (parseInt(reactMenuCount) == list.length) {
                console.log(`MATCH!`)
              }
              console.log(`Menu: ${reactMenuCount} - List: ${list.length}`)
              final(reactMenuCount, list.length, list);
              mutationObserver.disconnect();
            } else {
              console.log("loading")
              setTimeout(isEnd, 1000);
            }

          } else {
            setTimeout(isEnd, 1000);
          }
        }

        isEnd();
      }

      function final(reactMenuCount, found, list) {
        copyToClipboard(list.join(" "))
        var success_msg = ''
        if (reactMenuCount == found) {
          var success_msg = 'SUCCESS!'
        } else {
          var success_msg = 'FAIL! Try it again.'
        }
        BdApi.alert("Copied to clipboard!", `There are: ${reactMenuCount} reactions. Found: ${found}.\n${success_msg}`)

      }

    }


    function copyReactions() {
	  let sidebar = document.querySelector(scrollerSelector)
      if (sidebar != null) { //if reaction sidebar exists
        let btn = document.createElement("button");
        if (document.querySelector("#copyReactsbtn") == null) { //if no button yet
          btn.innerHTML = "Copy Reactions";
          btn.id = "copyReactsbtn";
          btn.onclick = onButtonClick
          sidebar.appendChild(btn);
        } else {
          btn.onclick = onButtonClick
        }
		
    }
    setTimeout(copyReactions, 1000);
	}

  copyReactions();}


stop() {

}
}