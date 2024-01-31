const puppeteer = require('puppeteer-core');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

let browser; 

async function initializeBrowser() {
    browser = await puppeteer.launch({ executablePath: "chrome\\chrome-win\\chrome.exe" });
}

async function closeBrowser() {
    await browser.close();
}

function CountToKomma(input, StartPos = 0) {
    for (let i = StartPos; i < input.length; i++) {
        if (input[i] === ",") {
            return i;
        } else if (input[i] === "é" && input[i - 1] === 'f') {
            return input.length;
        } else if (input[i] === "K" && input[i + 1] === "l") {
            return 17;
        } else if (input[i] === "O" && input[i + 1] === "m") {
            return 32;
        } else if (input[i] === "K" && input[i + 1] === "o") {
            return 27;
        }
    }
    throw new Error('No komma in string: ' + input);
}

async function Kalender(browser, userMail, userPassword, dag, maaned, aar) {
    try {
        if (dag < 10) dag = '0' + dag;
        if (maaned < 10) maaned = '0' + maaned;

        const url = "https://selvbetjening.aarhustech.dk/WebTimeTable/default.aspx?viewdate=" + dag + "-" + maaned + "-" + aar;

        const page = await browser.newPage();

        await page.goto(url);
        await page.type("#userNameInput", userMail);
        await page.type("#passwordInput", userPassword);
        await page.click("#submitButton");
        await page.waitForNavigation();

        const alt = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("#day0Col")).map(x => x.textContent);
        });

        const altRem = alt.join(",").split('\n').filter(y => y !== '');

        let subjects = [];
        for (let i = 0; i < altRem.length; i++) {
            subjects.push({
                fag: altRem[i].split('').slice(11, CountToKomma(altRem[i], 11)).join(''),
                tidStart: altRem[i].slice(0, 5),
                tidSlut: altRem[i].slice(6, 11),
                dato : `${dag}-${maaned}-${aar}`
            });
        }

        await page.close();

        return subjects;
    } catch (error) {
        throw new Error('Failed to scrape data: ' + error.message);
    }
}

app.post('/get-information', async (req, res) => {
    const { dag, maaned, aar, un, pw } = req.body;

    let localBrowser; 

    try {
        localBrowser = await puppeteer.launch({ executablePath: "chrome\\chrome-win\\chrome.exe" });
        const result = await Kalender(localBrowser, un, pw, dag, maaned, aar);
        res.send(result); 
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (localBrowser) {
            await localBrowser.close(); 
        }
    }
});

initializeBrowser();

process.on('SIGINT', async () => {
    await closeBrowser();
    process.exit();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});