/**
 * @name CopyReactions
 * @version 0.0.3
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
    var scrollerSelector = "[class^=scroller]:has(+[class*=reactorsContainer])"
    var reactorsSelector = "[class*=reactorsContainer] > div"
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
            while (typeof children[i].querySelector("strong > div > span[class*=username]") === "null") {
              //pass
            }
            //console.log("[1] added children:")
            //console.log(children[i])
            if (children[i].querySelector("span[class*=spinner]") != null) {
              console.log("spinner")
            } else {
              let pfpUrl = children[i].querySelector("div > div > svg > foreignObject > div > img").src.split('/')
              let pfpType = pfpUrl[3]
              if (pfpType == "avatars") {
                var pingerTxt = `<@${pfpUrl[4]}>`
              } else {
                let name = children[i].querySelector("strong > div > span[class*=username]").innerHTML
                let discriminator = children[i].querySelector("strong > div > span[class*=discriminator]").innerHTML
                var pingerTxt = `@${name}${discriminator}`
              }
              list.push(pingerTxt)
              console.log(`Added ${pingerTxt}`)
            }
          }
        }




        console.log("starting thing2")
        var lastElem = null

        var mutationObserver = new MutationObserver(function (mutations) {
          /*creates observer*/
          console.log("Mutation!")
          for (let i = 0; i < mutations.length; i++) {
            if (mutations[i].addedNodes.length != 0) {
              // console.log('Mutation found:')
              // console.log(mutations[i].addedNodes[0])

              while (typeof mutations[i].addedNodes[0].querySelector("strong > div > span[class*=username]") === "null") {
                //pass
              }
              //console.log("[2] added nodes:")
              //console.log(mutations[i].addedNodes[0])
              if (document.querySelector(`${reactorsSelector} > div > span`) != null) {
                console.log("spinner")
              } else {
                let pfpUrl = mutations[i].addedNodes[0].querySelector("div > div > svg > foreignObject > div > img").src.split('/')
                let pfpType = pfpUrl[3]
                if (pfpType == "avatars") {
                  var pingerTxt = `<@${pfpUrl[4]}>`
                } else {

                  let name = mutations[i].addedNodes[0].querySelector("strong > div > span[class*=username]").innerHTML
                  let discriminator = mutations[i].addedNodes[0].querySelector("strong > div > span[class*=discriminator]").innerHTML
                  var pingerTxt = `@${name}${discriminator}`
                }
                list.push(pingerTxt)
                console.log(`Added ${pingerTxt}`)
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
          var elem = document.querySelector(reactorsSelector)
          if (elem.scrollHeight - elem.scrollTop === elem.clientHeight) {
            isEnd();
          } else {
            console.log(`scroll height: ${elem.scrollHeight - elem.scrollTop} max height: ${elem.clientHeight}`)
          }
        });

        mutationObserver.observe(document.querySelector(`${reactorsSelector} > div`), {

          childList: true
        });

        var elem = document.querySelector(reactorsSelector)
        if (elem.scrollHeight - elem.scrollTop === elem.clientHeight) {
          isEnd();
        } else {
          console.log(`scroll height: ${elem.scrollHeight - elem.scrollTop} max height: ${elem.clientHeight}`)
        }

        let lastChild = children[children.length - 1]
        let name = lastChild.querySelector("strong > div > span[class*=username]").innerHTML
        let discriminator = lastChild.querySelector("strong > div > span[class*=discriminator]").innerHTML
        lastChild.scrollIntoView();
        console.log(`Scrolled to ${name}${discriminator}`)
        setTimeout(isEnd, 3000);
        function isEnd() {
          console.log("isEnd start")
          var elem = document.querySelector(reactorsSelector)
          if (elem.scrollHeight - elem.scrollTop === elem.clientHeight) {
            if (document.querySelector(`${reactorsSelector} > div > span`) == null) {
              console.log("end")
              console.log(list.join(" "))
              console.log(`length: ${list.length}`)
              reactMenuCount = document.querySelector(`${scrollerSelector} > [class^=reactionSelected] > [class*=text]`).innerHTML
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

    copyReactions();
  }


  stop() {

  }
}