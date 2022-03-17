// ==UserScript==
// @name         OddsChecker - Arbitrage panel
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlights and shows arbitrage possibilities
// @author       nyitrairicsi99
// @match        https://www.oddschecker.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oddschecker.com
// @grant        none
// ==/UserScript==

(function() {
    let ignoreSites = [
        false, //bet365
        false, //skybet
        false, //paddypower
        false, //williamhill
        false, //888sport
        false, //betfair
        false, //betvictor
        false, //coral
        false, //unibet
        false, //mansionbet
        false, //betfred
        false, //sbk
        false, //boylesports
        false, //10bet
        false, //sportnation
        false, //sportingindex
        false, //spreadex
        false, //quinnbet
        false, //betway
        false, //ladbrokers
        false, //parimatch
        false, //vbet
        false, //betfair
        false, //smartbet
        false, //matchbook
    ]
    function logEvent(key,winrate) {
        let notbar = document.getElementById("notbar");


        if (notbar==undefined) {
            let div = document.createElement("div");
            div.id = "notbar";

            div.style.backgroundColor = "#014c6b";
            div.style.width = "350px";
            div.style.minHeight = "50px";
            div.style.position = "fixed";
            div.style.right = "0";
            div.style.top = "75px";
            div.style.zIndex = "1000";
            div.style.padding = "10px";
            div.style.textTransform = "uppercase";
            div.style.boxShadow = "0 1px 3px 0 rgb(0 0 0 / 25%)";
            div.style.fontFamily = "'Nunito Sans',Trebuchet MS,sans-serif";

            document.body.appendChild(div);
            notbar = div;

            let h3 = document.createElement("h3");
            h3.innerHTML = "Found arbitrages:";
            notbar.appendChild(h3);

        }

        if (winrate>0 || true) {
            let h5 = document.createElement("h5");
            let header
            if (key=="t1") {
                header = "QuickBet"
            } else {
                header = document.getElementById(key).parentElement.parentElement.parentElement.getElementsByTagName("h4")[0].innerHTML
            }
            h5.innerHTML = header+": " + winrate;
            h5.className = "arbitrage"
            if (winrate<=0){
                h5.style.color = "#fc0303"
            } else if (winrate>10) {
                h5.style.color = "#24fc03"
            } else {
                h5.style.color = "#fcba03"
            }
            notbar.appendChild(h5);
        }


    }

    function clearNotification() {
        let ars = document.getElementsByClassName("arbitrage")
        for (let i = 0;i<ars.length;i++) {
            ars[0].remove();
        }
    }


    function processRowFootBall(divs){
        let buttons = divs.getElementsByTagName("button");
        let maxOdds = 0
        let maxElement
        for (let i = 0;i<buttons.length;i++) {
            if (!ignoreSites[i]){
                let inner = buttons[i].innerHTML.split('/');
                if (inner.length>1) {
                    let n1 = parseInt(inner[0]);
                    let n2 = parseInt(inner[1]);
                    let odds = 1 + n1/n2;
                    buttons[i].innerHTML = Math.round(odds * 100) / 100
                    if (odds>maxOdds) {
                        maxOdds = odds
                        maxElement = buttons[i]
                    }
                } else {
                    let odds = parseFloat(buttons[i].innerHTML)
                    if (odds>maxOdds) {
                        maxOdds = odds
                        maxElement = buttons[i]
                    }
                }
                buttons[i].style.fontWeight = "600";
            } else {
                buttons[i].style.color = "red"
                buttons[i].style.fontWeight = "100";
                buttons[i].style.opacity = "0";
            }
        }
        maxElement.style.fontWeight = "900";
        return maxOdds
    }

    function scanSiteFootBall(){
        let divs = document.getElementsByTagName("div");
        let parents = {}
        let siteindex = 0
        for(let i = 0;i<divs.length;i++) {
            if (divs[i].className.includes("oddsAreaWrapper")){
                let max = processRowFootBall(divs[i])
                let parent = divs[i].parentElement.id
                if (!(parent in parents)) {
                    parents[parent] = [];
                }
                parents[parent].push(max);
            }
        }
        for (const [key, value] of Object.entries(parents)) {
            let sum = 0;
            for (let i = 0;i<value.length;i++) {
                sum += 1/value[i];
            }
            let winrate = Math.round((1-sum) * 100 * 100) / 100;
            logEvent(key,winrate);
        }
    }


    function processRowBasketBall(divs){
        let buttons = divs.getElementsByTagName("p");
        let maxOdds = 0
        let maxElement
        for (let i = 0;i<buttons.length;i++) {
            if (!ignoreSites[i]){
                let inner = buttons[i].innerHTML.split('/');
                if (inner.length>1) {
                    let n1 = parseInt(inner[0]);
                    let n2 = parseInt(inner[1]);
                    let odds = 1 + n1/n2;
                    buttons[i].innerHTML = Math.round(odds * 100) / 100
                    if (odds>maxOdds) {
                        maxOdds = odds
                        maxElement = buttons[i]
                    }
                } else {
                    let odds = parseFloat(buttons[i].innerHTML)
                    if (odds>maxOdds) {
                        maxOdds = odds
                        maxElement = buttons[i]
                    }
                }
                buttons[i].style.fontWeight = "600";
            } else {
                buttons[i].style.color = "red"
                buttons[i].style.fontWeight = "100";
                buttons[i].style.opacity = "0";
            }
        }
        maxElement.style.fontWeight = "900";
        return maxOdds
    }

    function scanSiteBasketBall(){
        let trs = document.getElementsByTagName("tr");
        let parents = {}
        for(let i = 0;i<trs.length;i++) {
            if (trs[i].className.includes("diff-row")) {
                let max = processRowBasketBall(trs[i])
                let parent = trs[i].parentElement.id
                if (!(parent in parents)) {
                    parents[parent] = [];
                }
                parents[parent].push(max);
            }
        }

        for (const [key, value] of Object.entries(parents)) {
            let sum = 0;
            for (let i = 0;i<value.length;i++) {
                sum += 1/value[i];
            }
            let winrate = Math.round((1-sum) * 100 * 100) / 100;
            logEvent(key,winrate);
        }
    }

    function formatOdds(){
        let oddsList = document.getElementsByClassName("odds");
        for (let i = 0;i<oddsList.length;i++) {
            let inner = oddsList[i].innerHTML.split('/');
            if (inner.length>1) {
                let n1 = parseInt(inner[0]);
                let n2 = parseInt(inner[1]);
                let odds = 1 + n1/n2;
                oddsList[i].innerHTML = Math.round(odds * 100) / 100;
            }
        }
    }

    function runScans(){
        clearNotification()
        clearNotification()

        scanSiteFootBall()
        scanSiteBasketBall()
        formatOdds()
    }
    setInterval(runScans,50)

})();