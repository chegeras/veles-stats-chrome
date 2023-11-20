(function () {
    const parseSingleDeal = function (deal: Element): string[] {
        // csv format BOT NAME, PAIR, DATE, ALGORITHM, GROSS, COMMISSION, NET, PNL, DURATION, GRID, TP, RESULT
        const botName = (deal.childNodes[2] as Element)?.querySelector("p")?.innerText ?? "";
        const pair = (deal.childNodes[3] as Element)?.querySelector("p")?.innerText ?? "";
        const date = (deal.childNodes[4] as Element)?.querySelector("p")?.innerText ?? "";
        const algorithm = (deal.childNodes[5] as Element)?.querySelector("p")?.innerText ?? "";
        const gross = (deal.childNodes[6] as Element)?.querySelector("p")?.innerText ?? "";
        const commission = (deal.childNodes[7] as Element)?.querySelector("p")?.innerText ?? "";
        const net = (deal.childNodes[8] as Element)?.querySelector("p")?.innerText ?? "";
        const pnl = (deal.childNodes[9] as Element)?.querySelector("p")?.innerText ?? "";
        const duration = (deal.childNodes[10] as Element)?.querySelector("p")?.innerText ?? "";
        const grid = (deal.childNodes[11] as Element)?.querySelector("p")?.innerText ?? "";
        const tp = (deal.childNodes[12] as Element)?.querySelector("p")?.innerText ?? "";
        const result = (deal.childNodes[13] as Element)?.querySelector("p")?.innerText ?? "";
        return [botName, pair, date, algorithm, gross, commission, net, pnl, duration, grid, tp, result];
    }

    const exporDataFromPage = function (): string[] {
        let deals = document.querySelectorAll(".table-body .row")

        const data: string[] = [];
        deals.forEach(row => {
            data.push(parseSingleDeal(row).join(","));
        });

        return data;
    }

    const activateDealsTab = function () {
        (document.querySelector(".deals-section .tab-wrapper .tab:nth-child(1)") as HTMLElement)?.click();
    }

    const getActiveDealsPageNumber = function (): number {
        return parseInt(document.querySelector(".pagination-button.active")?.getAttribute("data-page-number") ?? "-1");
    }

    const activateFirstDealsPage = function () {
        (document.querySelector(".pagination-pages > div:nth-child(1)") as HTMLElement)?.click();

    }

    const exportData = async function () {
        if (window.location.href !== "https://veles.finance/cabinet/statistics") {
            alert("Please open https://veles.finance/cabinet/statistics");
            return;
        }

        activateDealsTab();

        const activePageNumber = getActiveDealsPageNumber();

        if (!activePageNumber) {
            alert("No data to export.");
            return;
        }

        // activate first page with deals
        while (getActiveDealsPageNumber() !== 1) {
            activateFirstDealsPage();
            // required to wait for page data load
            await new Promise(r => setTimeout(r, 1000));
        }

        let hasNextPage = true;
        let data: string[] = []
        while (hasNextPage) {

            data = data.concat(exporDataFromPage());

            const nextPage = document.querySelector(".pagination-button.active + .pagination-button") as HTMLElement;
            if (!!nextPage) {
                nextPage.click();
                // required to wait for page data load
                await new Promise(r => setTimeout(r, 1000));
            } else {
                hasNextPage = false;
            }
        };

        chrome.runtime.sendMessage(data);
    }

    exportData();
})();