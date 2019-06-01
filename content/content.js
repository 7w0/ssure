var rules;

function decorate(el, styles) {
    Object.keys(styles).forEach(function (k) {
        el.style[k] = styles[k];
    });
}

function applyRules(root, rules) {
    if (!rules) {
        return;
    }

    var enabledRules = rules.filter(function (r) {
        return r.enabled;
    });

    var attrRules = enabledRules.filter(function (r) {
        return r.searchAttributes;
    });

    var textRules = enabledRules.filter(function (r) {
        return r.searchText;
    });

    var show = 0;

    if (attrRules.length > 0) {
        show |= NodeFilter.SHOW_ELEMENT;
    }

    if (textRules.length > 0) {
        show |= NodeFilter.SHOW_TEXT;
    }

    if (show === 0) {
        return;
    }

    var texasRanger = document.createTreeWalker(root, show);
    var visible = false;
    var node = null;
    var hit = false;

    while (texasRanger.nextNode()) {
        node = texasRanger.currentNode;
        visible = node.offsetParent || node.nodeType === document.TEXT_NODE;

        if (!visible) {
            continue;
        }

        if (node.nodeType === document.ELEMENT_NODE) {
            for (var i = 0; i < node.attributes.length; i++) {
                hit = attrRules.some(function (r) {
                    return r.regExps.some(function (p) {
                        var re = new RegExp(p.pattern, p.flags);

                        if (re.test(node.attributes[i].value)) {
                            decorate(node, r.styles);
                            return true;
                        }
                    });
                });

                if (hit) {
                    break;
                }
            }
        } else {
            textRules.some(function (r) {
                return r.regExps.some(function (p) {
                    var re = new RegExp(p.pattern, p.flags);

                    if (re.test(node.textContent)) {
                        decorate(node.parentElement, r.styles);
                        return true;
                    }
                });
            });
        }
    }
}

function onMessage(message) {
    rules = message.rules;
    applyRules(document.body, rules);
}

var observer = new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
        for (var j = 0; j < mutations[i].addedNodes.length; j++) {
            applyRules(mutations[i].addedNodes[j], rules);
        }
    }
});

observer.observe(document, {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true
});

browser.runtime.onMessage.addListener(onMessage);

browser.runtime.sendMessage({});
