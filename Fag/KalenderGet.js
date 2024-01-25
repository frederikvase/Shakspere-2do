const puppeteer = require('puppeteer-core');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const schoolUsername = "kasp933i@edu.aarhustech.dk";
const schoolPassword = "TevRRAHH";

let browser; // Define a global browser variable

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
        }
    }
    throw new Error('No komma in string: ' + input);
}

async function Kalender(userMail, userPassword, dag, maaned, aar) {
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
                [`${dag}-${maaned}-${aar}`]: {
                    fag: altRem[i].split('').slice(11, CountToKomma(altRem[i], 11)).join(''),
                    tidStart: altRem[i].slice(0, 5),
                    tidSlut: altRem[i].slice(6, 11),
                }
            });
        }

        await page.close();

        return subjects;
    } catch (error) {
        throw new Error('Failed to scrape data: ' + error.message);
    }
}

app.post('/get-information', async (req, res) => {
    const { dag, maaned, aar } = req.body;

    try {
        const result = await Kalender(schoolUsername, schoolPassword, dag, maaned, aar);
        res.send(result); // Sending scraped data as response
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Initialize the browser when the server starts
initializeBrowser();

// Close the browser when the server stops
process.on('SIGINT', async () => {
    await closeBrowser();
    process.exit();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});






// const puppeteer = require('puppeteer-core');
// const fs = require('fs');

// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// const app = express();

// app.use(express.json());
// app.use(bodyParser.json());
// app.use(cors())

// const schoolUsername = "kasp933i@edu.aarhustech.dk" 
// const schoolPassword = "TevRRAHH"

// let information = []; // Placeholder for storing the information

// function CountToKomma(input, StartPos = 0) {
//     for (let i = StartPos; i < input.length; i++) {
//         if (input[i] == ",") {
//             return i;
//         } else if (input[i] == "é" && input[i - 1] == 'f') {
//             return input.length;
//         } else if (input[i] == "K" && input[i + 1] == "l") {
//             return 17;
//         }
//     }
//     throw new Error('No komma in string: ' + input);
// }

// async function Kalender(userMail, userPassword, dag, maaned, aar) {
//     if (dag < 10) dag = '0' + dag;
//     if (maaned < 10) maaned = '0' + maaned;

//     let url = "https://selvbetjening.aarhustech.dk/WebTimeTable/default.aspx?viewdate=" + dag + "-" + maaned + "-" + aar

//     const browser = await puppeteer.launch({executablePath: "chrome\\chrome-win\\chrome.exe"});
//     const page = await browser.newPage();

//     await page.goto(url);
//     await page.type("#userNameInput", userMail);
//     await page.type("#passwordInput", userPassword);
//     await page.click("#submitButton");
//     await page.waitForNavigation();

//     const alt = await page.evaluate(() => {
//         return Array.from(document.querySelectorAll("#day0Col")).map(x => x.textContent)
//     });

//     const altRem = alt.join(",").split('\n').filter(y => y != '');


//     let subjects = []
//     for (let i = 0; i < altRem.length; i++) {
//         subjects.push({
//             [`${dag}-${maaned}-${aar}`]: {
//                 fag:        altRem[i].split('').slice(11,CountToKomma(altRem[i],11)).join(''),
//                 tidStart:   altRem[i].slice(0, 5),
//                 tidSlut:    altRem[i].slice(6, 11),
//             }
//         });

//     }
//     await browser.close();

//     return subjects;
// }

// async function GetAsyncValueToVar(inputFunction) {
//     return await inputFunction;
// }

// app.post('/get-information', async (req, res) => {
//     const { dag, maaned, aar } = req.body;

//     try {
//         const result = await Kalender(schoolUsername, schoolPassword, dag, maaned, aar);
//         res.send(result); // Sending scraped data as response
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// app.post('/scrape', async (req, res) => {
//     const { url, otherParams } = req.body;
  
//     try {
//       const scrapedData = await scrapeData(url, otherParams);
//       // Assuming you have another endpoint to send the scraped data to frontend
//       // Adjust the endpoint accordingly
//       await postDataToEndpoint(scrapedData);
//       res.send()
//       res.status(200).json({ message: 'Scraped data sent successfully' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });

// // app.post('/add-information', async (req, res) => {
// //     try {
// //         const {dag, maaned, aar } = req.body;
// //         const data = await Kalender(schoolUsername, schoolPassword, dag, maaned, aar);
// //         res.json(data);
// //     } catch (error) {
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// // app.get('/get-information', (req, res) => {
// //     try {
// //         // Assuming information is stored somewhere, retrieve it here
// //         // const information = ...; // Retrieve information from wherever it's stored
// //         res.json(JSON.stringify(information));
// //     } catch (error) {
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// const PORT = 3000;

// // app.post('/add-information', (req, res) => {
// //     // Here you can handle the incoming request and forward it to the desired endpoint
// //     // For demonstration purposes, let's just log the received data
// //     console.log('Received data:', req.body);
    
// //     // Respond with a success message
// //     res.send('Information added successfully');
// // });

// // // GET route to retrieve information
// // app.get('/get-information', (req, res) => {
// //     // Here you can handle the incoming request to retrieve information
// //     // For demonstration purposes, let's just send dummy data
// //     const infoData = { example: 'data' };
    
// //     // Respond with the retrieved information
// //     res.json(infoData);
// // });






// // async function accesSubjectsOnDay(getDay, getMonth, getYear) {
// //     let valueToReturn = "hasNoValueYet";
// //     try {
// //         const save = await GetAsyncValueToVar(Kalender(schoolUsername, schoolPassword, getDay, getMonth, getYear));
// //         console.log('Saving save:', save);
        
// //         await axios.post('http://localhost:3000/add-information', {
// //             data: save
// //         });

// //         const response = await axios.get('http://localhost:3000/get-information');
       
// //         console.log("NEW ADDED")

// //         for (let keys in response.data){
// //             const info = response.data[keys]
// //             console.log(info);
// //         }

// //         console.log("returned!");
// //         valueToReturn = response.data;
// //     } catch (error) {
// //         console.error('Error:', error);
// //     }

// //     return valueToReturn
// // }

// // app.post('/start-server', async (req, res) => {
// //     try {
// //         const { day, month, year } = req.body;
        
// //         // Perform the action to retrieve and store information
// //         const result = await accesSubjectsOnDay(day, month, year);

// //         // Send a response indicating that the action was successful
// //         console.log(result)
// //         res.send('Action performed successfully');
// //         return result
// //     } catch (error) {
// //         console.error('Error performing action:', error);
// //         res.status(500).send('Error performing action: ' + error.message);
// //     }
// // });


// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//     // accesSubjectsOnDay(25,1,2024)
// });


// // global.accesSubjectsOnDay = accesSubjectsOnDay;
