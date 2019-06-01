var rules;

function notifyAllTabs() {
    browser.tabs.query({}).then(function (tabs) {
        tabs.forEach(function (tab) {
            browser.tabs.sendMessage(tab.id, { "rules": rules });
        });
    });
}

function setRulesFromResource(res) {
    rules = res.rules;
    notifyAllTabs();
}

function onMessage(message, sender) {
    browser.tabs.sendMessage(sender.tab.id, { "rules": rules });
}

function onStorageChanged(changes) {
    if (changes.rules) {
        setRules(changes.rules.newValue);
    }
}

browser.runtime.onMessage.addListener(onMessage);

browser.storage.onChanged.addListener(onStorageChanged);

browser.storage.local.get("rules").then(setRulesFromResource);
