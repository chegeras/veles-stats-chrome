(function () {
    const exporDataFromPage = function (): string[] {
        let deals = document.querySelectorAll(".table-body .row")

        const data: string[] = [];
        deals.forEach(row => {
            // csv format ИМЯ БОТА, ПАРА, ДАТА, АЛГОРИТМ, GROSS, КОМИССИЯ, NET, PNL, ДЛИТЕЛЬНОСТЬ, СЕТКА, TP, РЕЗУЛЬТАТ

            const botName = (row.childNodes[2] as Element)?.querySelector("p")?.innerText;
            const pair = (row.childNodes[3] as Element)?.querySelector("p")?.innerText;
            const date = (row.childNodes[4] as Element)?.querySelector("p")?.innerText;
            const algorithm = (row.childNodes[5] as Element)?.querySelector("p")?.innerText;
            const gross = (row.childNodes[6] as Element)?.querySelector("p")?.innerText;
            const commission = (row.childNodes[7] as Element)?.querySelector("p")?.innerText;
            const net = (row.childNodes[8] as Element)?.querySelector("p")?.innerText;
            const pnl = (row.childNodes[9] as Element)?.querySelector("p")?.innerText;
            const duration = (row.childNodes[10] as Element)?.querySelector("p")?.innerText;
            const grid = (row.childNodes[11] as Element)?.querySelector("p")?.innerText;
            const tp = (row.childNodes[12] as Element)?.querySelector("p")?.innerText;
            const result = (row.childNodes[13] as Element)?.querySelector("p")?.innerText;

            data.push(`${botName},${pair},${date},${algorithm},${gross},${commission},${net},${pnl},${duration},${grid},${tp},${result}`);
        });

        return data;
    }

    const exportData = async function () {
        const pagination = document.querySelector(".pagination-pages");
        if (pagination?.childElementCount) {
            let startIndex = 1;
            let data: string[] = [];
            const getCurrentPagination = (index: number) => { return document.querySelector(`[data-page-number="${startIndex}"]`) as HTMLElement };
            while (!!getCurrentPagination(startIndex)) {
                getCurrentPagination(startIndex).click();
                while (!getCurrentPagination(startIndex)?.className.includes("active")) {
                    await new Promise(r => setTimeout(r, 1000));
                }
                data = data.concat(exporDataFromPage());
                startIndex++;
            }
            chrome.runtime.sendMessage(data);
        } else {
            alert("No data to export");
        }
    };


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