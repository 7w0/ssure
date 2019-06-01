document.getElementById("openSettings").addEventListener("click", function (e) {
    browser.runtime.openOptionsPage();
    window.close();
});
