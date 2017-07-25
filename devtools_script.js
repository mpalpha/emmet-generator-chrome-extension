// We'll alias this property for ease of access..
var panels = chrome && chrome.devtools && chrome.devtools.panels;
panels.elements.createSidebarPane("Emmet Generator", function (sidebar) {

  function updateContent() {
    // You can also run a function in the
    // devtools_script.js within the context
    // of the page by doing the following...
    function getPanelContents() {
      
      /**
       * generate emmet
       * @param {Element} elem
       * @return {String}
       */
      var emmet = function(elem) {
        /** @type {string} */
        let emtStr = "";
        let i = 0;
        if (elem && elem.tagName && "SCRIPT" !== elem.tagName) {
          const tag = elem.tagName;
          emtStr += tag.toLowerCase();
          /** @type {number} */
          for (i = 0; i < elem.attributes.length; i++) {
            elem.attributes[i] && elem.attributes[i].value &&
              // id
              ("id" == elem.attributes[i].name ?
                emtStr += "#" + elem.id :
                // classes
                "class" == elem.attributes[i].name ?
                  emtStr += "." + elem.className.toString().split(/\s+/).join(".") :
                  // style
                  "style" == elem.attributes[i].name ?
                    "" != elem.cssText && (emtStr += "[" + elem.attributes[i].name + '="' + elem.style.cssText + '"]') :
                    // other attributes
                    emtStr += "[" + elem.attributes[i].name + '="' + elem.attributes[i].value + '"]');
          }

          // children
          const children = elem.childNodes;
          if (0 < children.length) {
            /** @type {Array} */
            let childRets = [];
            /** @type {number} */
            for (i = 0; i < children.length; i++) {
              // is element node
              if (1 !== children[i].nodeType) {
                // is text node and has value
                if (3 === children[i].nodeType && 0 !== children[i].nodeValue.replace(/^\s+|\s+$/gm, "").length) {
                  // add text or continue
                  childRets.push("{" + children[i].nodeValue + "}");
                } else {
                  continue;
                }
              }
              // add element
              childRets.push(emmet(children[i]));
            }
            if (childRets.length) {
              // append results to snippet
              emtStr += ">" + childRets.join("+") + "^";
            }
          }
          // TODO: replace these clean up hacks.
          emtStr = emtStr.replace(/\++/g, "+")
            .replace(/\+\^+/g, "^")
            .replace(/\^\+/g, "^")
            .replace(/\n/g, "");
        }
        return emtStr;
      };
      // Return a value based on the page
      // content and the currently selected
      // element pointed to by $0

      return {
        "snippet": emmet($0),
        "element": $0
      };

    } (window, document);

    sidebar.setExpression(
      "(" + getPanelContents.toString() + ")()"
    );
  }

  updateContent();

  panels.elements
    .onSelectionChanged.addListener(updateContent);

});