/**
 * @name CopyReactions
 * @version 0.0.3
 * @description Adds a button to the reactions window that copies all users that have reacted to a message
 * @author Kur0
 *
 */
// var running = true;

module.exports = (meta) => {
  console.log("CopyReactions loading");

  let running = true;
  const observer = new MutationObserver(handleMutations);
  let currentMsgId;
  let listeners = [];
  // Do stuff in here before returning
  // Callback function to handle the mutations
  function handleMutations(mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.matches && node.matches("[class^=chatContent]")) {
          addRightClickListener(node);
        } else {
          //console.log("Ignored right click")
        }
      });
    });
  }

  function NestedParent(element, selector) {
    return element.closest(selector);
  }

  function addRightClickListener(node) {
    console.log("Adding right click listener. context:", this);
    // The element with the selector '[class^=chatContent]' has been added
    console.log("Element with selector '[class^=chatContent]' added:", node);

    node.addEventListener("contextmenu", handleRightClick);
    listeners.push({
      eventType: "contextmenu",
      listener: handleRightClick,
    });
  }

  function handleRightClick(event) {
    var targetElement = event.target;
    var parentElement = NestedParent(targetElement, "[id^=chat-messages]");
    if (parentElement != null) {
      var parentElemParts = parentElement.id.split("-");
      var msgId = parentElemParts[parentElemParts.length - 1];
      currentMsgId = msgId;
      console.log("Right clicked! Id is ", msgId);
    }
  }

  return {
    start: () => {
      console.log("CopyReactions started");

      var list = [];
      var reactMenuCount = 0;
      var scrollerSelector =
        "[class^=scroller]:has(+[class*=reactorsContainer])";
      var reactorsSelector = "[class*=reactorsContainer] > div";
      function copyToClipboard(text) {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
      }

      function onButtonClick() {
        console.log(`Current id is ${currentMsgId}`);
        var scrollerSelector =
          "[class^=scroller]:has(+[class*=reactorsContainer])";
        var reactName = document.querySelector(
          `${scrollerSelector} > [class^=reactionSelected] > img`
        ).alt;
        var reactMenuCount = document.querySelector(
          `${scrollerSelector} > [class^=reactionSelected] > [class*=text]`
        ).innerHTML;
        var reactions =
          ZLibrary.DiscordModules.ReactionsStore.__getLocalVars()["reactions"];

        for (let key in reactions) {
          const value = reactions[key];
          const userCount = Object.keys(value.users).length;
          const storedEmoteName = key.split(":")[1];
          const reactionMsgId = key.split(":")[0];

          if (
            storedEmoteName == reactName &&
            value.fetched == true &&
            userCount != 0 &&
            reactionMsgId == currentMsgId
          ) {
            console.log(key);
            console.log(value);
            const userList = Object.keys(value.users);
            const foundCount = userList.length;
            if (foundCount == reactMenuCount) {
              let editedList = userList.map(id => `<@${id}>`);
              //match
              copyToClipboard(editedList.join(" "));
              BdApi.alert(
                "Copied to clipboard!",
                `There are: ${reactMenuCount} reactions. Found: ${foundCount}.`
              );
            } else {
              BdApi.alert(
                "FAIL!",
                `There are: ${reactMenuCount} reactions. Found: ${foundCount}.`
              );
            }
          }
        }
      }

      // OBSERVER PART

      // Create a new mutation observer

      var chatContentSelector = document.querySelector("[class^=chatContent]");
      if (chatContentSelector != null) {
        addRightClickListener(chatContentSelector);
      }

      // Start observing the document body for mutations
      console.log("Observing");
      observer.observe(document.body, { childList: true, subtree: true });

      function copyReactions() {
        let sidebar = document.querySelector(scrollerSelector);
        if (sidebar != null) {
          //if reaction sidebar exists
          let btn = document.createElement("button");
          if (document.querySelector("#copyReactsbtn") == null) {
            //if no button yet
            btn.innerHTML = "Copy Reactions";
            btn.id = "copyReactsbtn";
            btn.onclick = onButtonClick;
            sidebar.appendChild(btn);
          } else {
            btn.onclick = onButtonClick;
          }
        }
        // console.log(`copyReactions is running: ${running}`)
        if (running == true) {
          setTimeout(copyReactions, 1000);
        } else {
          running = true;
        }
      }

      copyReactions();
    },
    stop: () => {
      console.log("CopyReactions stopping...");
      running = false;
      console.log("Disconnecting observer...", observer);
      observer.disconnect();

      console.log("CopyReactions: Removing listeners");
      // Remove all event listeners

      listeners.forEach((event) => {
        document.querySelector("[class^=chatContent]").removeEventListener(event.eventType, event.listener);
      });

      // Clear the event listeners array
      listeners.length = 0;
    },
  };
};
