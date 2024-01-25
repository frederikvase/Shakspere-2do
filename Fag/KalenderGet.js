const puppeteer = require('puppeteer-core');
const fs = require('fs');
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

let information = []; // Placeholder for storing the information

async function CountToKomma(input, StartPos = 0) {
    for (let i = StartPos; i < input.length; i++) {
        if (input[i] == ",") {
            return i;
        } else if (input[i] == "é" && input[i - 1] == 'f') {
            return input.length;
        } else if (input[i] == "K" && input[i + 1] == "l") {
            return 17;
        }
    }
    throw new Error('No komma in string: ' + input);
}

async function Kalender(userMail, userPassword, dag, maaned, aar) {
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


    let subjects = []
    for (let i = 0; i < altRem.length; i++) {
        subjects.push({
            [`${dag}-${maaned}-${aar}`]: {
                fag:        altRem[i].split('').slice(11,CountToKomma(altRem[i],11)).join(''),
                tidStart:   altRem[i].slice(0, 5),
                tidSlut:    altRem[i].slice(6, 11),
            }
        });

    }

    console.log("-----------SUBJEJEJ-----------")
    console.log(subjects)
    console.log("-----------SUBJEJEJ-----------")
    await browser.close();

    return subjects;
}

async function GetAsyncValueToVar(inputFunction) {
    return await inputFunction;
}

app.post('/add-information', async (req, res) => {
    try {
        const { data } = req.body;
        information.push(data);
        res.send('Information added successfully.');
    } catch (error) {
        res.status(500).send('Error adding information: ' + error.message);
    }
});

app.get('/get-information', (req, res) => {
    try {
        res.json(information);
    } catch (error) {
        res.status(500).send('Error getting information: ' + error.message);
    }
});

const PORT = 3000;

async function accesSubjectsOnDay(getDay, getMonth, getYear) {
    try {
        const save = await GetAsyncValueToVar(Kalender("kasp933i@edu.aarhustech.dk", "TevRRAHH", getDay, getMonth, getYear));
        console.log('Saving save:', save);
        
        await axios.post('http://localhost:3000/add-information', {
            data: save
        });

        const response = await axios.get('http://localhost:3000/get-information');
       
        console.log("NEW ADDED")

        for (let keys in response.data){
            const info = response.data[keys]
            console.log(info);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    accesSubjectsOnDay(25, 1, 2024);
});