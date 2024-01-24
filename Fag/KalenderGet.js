const puppeteer = require('puppeteer-core');
const fs = require('fs');

function CountToKomma(input,StartPos = 0) {
    for (let i = StartPos; i < input.length; i++) {
        if(input[i] == ",") {
            return i;
        } else if (input[i] == "é" && input[i - 1] == 'f') {
            return input.length;
        } else if (input[i] == "K" && input[i + 1] == "l") {
            return 17;
        }
    }
    throw new Error('No komma in string: ' + input);
}


async function Kalender (userMail, userPassword, dag, maaned, aar) 
{
    if (dag < 10) dag = '0' + dag;
    if (maaned < 10) maaned = '0' + maaned;

    let url = "https://selvbetjening.aarhustech.dk/WebTimeTable/default.aspx?viewdate=" + dag + "-" + maaned + "-" + aar



    const browser = await puppeteer.launch({executablePath: "chrome\\chrome-win\\chrome.exe"});
    const page = await browser.newPage();

    await page.goto(url);
    await page.type("#userNameInput", userMail);
    await page.type("#passwordInput", userPassword);
    await page.click("#submitButton");
    await page.waitForNavigation();

    const alt = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("#day0Col")).map(x => x.textContent)
    });

    const altRem = alt.join(",").split('\n').filter(y => y != '');


    let skoleFag = new Map();

    for (let i = 0; i < altRem.length; i++) {
        skoleFag.set(i, {
            fag: altRem[i].split('').slice(11,CountToKomma(altRem[i],11)).join(''),
            tidStart: altRem[i].split('').slice(0,5).join(''), 
            tidSlut: altRem[i].split('').slice(6,11).join('')});
    }
    await browser.close();

    console.log(skoleFag);

    // return skoleFag;
}

// let hej;

// async function GetAsyncValueToVar(inputFunction, outputVar) {
//     outputVar = await inputFunction;
//     console.log(outputVar);
// }

// GetAsyncValueToVar(, hej);

Kalender("at114098@edu.aarhustech.dk", kode, 18, 1, 2024);

  