(function () {
    const exportData = function () { };

    const addExportButton = function () {
        let exportButton = document.getElementById("veles-export-button");
        if (!!exportButton) {
            return;
        }

        const tabsElement = document.querySelectorAll(".tab-wrapper")[0];

        // create a button element
        exportButton = document.createElement("button");
        exportButton.setAttribute("id", "veles-export-button");
        exportButton.innerText = "Export data";
        exportButton.onclick = exportData;
        // append the button to the body
        tabsElement.appendChild(exportButton);
    }

    addExportButton();
})();