const puppeteer = require('puppeteer');
const fs = require('fs');

function CountToKomma(input,StartPos = 0) {
    for (let i = StartPos; i < input.length; i++) {
        if(input[i] == ",") {
            return i;
        } else if (input[i] == "é" && input[i - 1] == 'f') {
            return input.length;
        }
    }
    throw new Error('No komma in string: ' + input);
}

const url = "https://selvbetjening.aarhustech.dk/WebTimeTable/default.aspx";

async function Kalender (userMail, userPassword) 
{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.type("#userNameInput", userMail);
    await page.type("#passwordInput", userPassword);
    await page.click("#submitButton");
    await page.waitForNavigation();

    const alt = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".schemaDayHolderCell_Current")).map(x => x.textContent)
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


    return skoleFag;
}

let hej;

async function GetAsyncValueToVar(inputFunction, outputVar) {
    outputVar = await inputFunction;
    console.log(outputVar.get(0).fag);
}

GetAsyncValueToVar(Kalender("at114098@edu.aarhustech.dk", "hej"), hej);


  