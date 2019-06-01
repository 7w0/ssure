var rules = document.getElementById("rules");

function save() {
    var newRules = JSON.parse(rules.value);

    if (newRules) {
        browser.storage.local.set({
            rules: newRules
        });
    }
}

document.getElementById("save").addEventListener("click", function () {
    save();
});

browser.storage.local.get("rules").then(function (res) {
    rules.value = JSON.stringify(res.rules, null, 4);
});
