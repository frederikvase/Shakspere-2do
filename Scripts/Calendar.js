const body = document.body;

const date = new Date();
const hour = date.getHours();
const min = date.getMinutes();

const year = date.getUTCFullYear();
const month = date.getUTCMonth() + 1;
const dayNumber = date.getUTCDate();
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
let day = weekday[date.getDay()];

//Set initial values from settings.js:
let valuesFromSettings = JSON.parse(localStorage.getItem("settingsInformation")) || initialInformation;
let bedtime = valuesFromSettings.bedtime              || initialInformation.bedtime;
let wakeUp = valuesFromSettings.wakeUpTime            || initialInformation.wakeUpTime;
let interval = valuesFromSettings.placementInterval   || initialInformation.placementInterval; 
let timeLine = valuesFromSettings.timeLines           || initialInformation.timeLines;

/* html layout but in js */
allCalendarTasks = []
allTimeStamps = []

//The calender
const calendarSection = document.createElement("section");
calendarSection.classList.add("calender");
body.append(calendarSection);

//Calender-title
const calendarTitle = document.createElement("h1");
calendarTitle.classList.add("calender-title");
calendarTitle.innerText = `${day}: ${dayNumber}/${month} - ${year}`;
calendarSection.appendChild(calendarTitle);

//Calender-time stamps
const calendarTimeStamps = document.createElement("div");
calendarTimeStamps.classList.add("calender-time");
calendarSection.appendChild(calendarTimeStamps);

addTimeStamps(wakeUp, bedtime);
addTimeStampsV2(wakeUp, bedtime);


//CalederTasks
const calendarTasks = document.createElement("div");
calendarTasks.classList.add("calender-tasks");
calendarTasks.setAttribute("id", "calendarTaskID")
calendarSection.appendChild(calendarTasks);

//Line that shows current time:
let currentTime = `${hour}:${min}`
console.log(currentTime)
let currentTimePlacement = calculatePlacement2(currentTime)

const calendarCurrentTimeLine = document.createElement("section")
calendarCurrentTimeLine.style.position = "absolute";
calendarCurrentTimeLine.style.top = currentTimePlacement;
calendarCurrentTimeLine.classList.add("calender-currentTime");
calendarTasks.appendChild(calendarCurrentTimeLine);

const wakeUpLine = document.createElement("section")
wakeUpLine.style.position = "absolute";
wakeUpLine.style.top = calculatePlacement2(wakeUp);
wakeUpLine.classList.add("calender-startendtime");
calendarTasks.appendChild(wakeUpLine);

const bedtimeLine = document.createElement("section")
bedtimeLine.style.position = "absolute";
bedtimeLine.style.top = calculatePlacement2(bedtime);
bedtimeLine.classList.add("calender-startendtime");
calendarTasks.appendChild(bedtimeLine);

/* All lines that indicate the time */
let val = calculateLinePlacement(timeLine);
for (let element of val){
    const divElement = document.createElement("section")
    divElement.style.position = "absolute";
    divElement.style.top = `${element}%`;
    divElement.classList.add("calender-timeline");
    calendarTasks.appendChild(divElement); //or append it to calendarTasks or calendarTimeStamps

}

/*addTaskToCalendar("Danish", 90, "10:00", false, "Conclusion");
addTaskToCalendar("Danish", 90, "16:00", false, "Conclusion");
addTaskToCalendar("Danish", 90, "12:00", false, "Conclusion");*/
//addTaskToCalendar("Danish", 60, "12:00-13:00", false, "Conclusion");

displayTasks();

let placeCalendar = document.getElementsByClassName("ChangeToCalenderLater")[0];
placeCalendar.appendChild(calendarSection);


function addTimeStamps(wakeUp, bedtime)
{
    var theWakeUp = wakeUp.split(":");
    var theBedtime = bedtime.split(":");

    let arr = [];

    for (let i = parseInt(theWakeUp[0]); i-2 <= parseInt(theBedtime[0]); i+=2){
        if (i % 2 == 0){
            arr.push(i + ":00");
        } else {
            arr.push(i-1 + ":00");
        }
    }
    allTimeStamps.push(arr);
    console.log(allTimeStamps)
    arr.forEach(Element =>{
        let calendarTimeSpan = document.createElement("span");
        calendarTimeSpan.innerText = Element;
        calendarTimeStamps.appendChild(calendarTimeSpan);
    })
}
function addTimeStampsV2(wakeUp, bedtime) //adds to view-more-days calendar
{
    const toElement = document.getElementById("calendar-view-left-timelines");

    if (toElement) {
        toElement.classList.add("calender-time");

        var theWakeUp = wakeUp.split(":");
        var theBedtime = bedtime.split(":");

        let arr = [];

        for (let i = parseInt(theWakeUp[0]); i-2 <= parseInt(theBedtime[0]); i += 2) {
            if (i % 2 === 0) {
                arr.push(i + ":00");
            } else {
                arr.push((i - 1) + ":00");
            }
        }

        console.log(arr)
        arr.forEach(timeStamp => {
            let calendarTimeSpan = document.createElement("span");
            calendarTimeSpan.innerText = timeStamp;
            toElement.appendChild(calendarTimeSpan);
        });
    }
}

function addTaskToCalendar(taskName, taskDuration, taskPlacement, taskDone = false, taskSubtask = "")
{
    allCalendarTasks.push([taskName, taskDuration, taskPlacement, taskDone, taskSubtask]);
    console.log("ALL tasks: " + allCalendarTasks);
}

function displayTasks(){
    allCalendarTasks.forEach(element => {
        //Create task
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("calender-task-8") //___Change to ID later (element[???]) | long-/shortTask (maybe)
        taskDiv.style.position = "relative";
        taskDiv.style.top = calculatePlacement(element[2], allCalendarTasks.indexOf(element));

        //Elements inside the task
        const taskTitle = document.createElement("span");
        taskTitle.innerHTML = `${element[0]}<br/><li>${element[4]}</li>`;
        taskDiv.appendChild(taskTitle)
        
        const taskDuration = document.createElement("span");
        taskDuration.innerText = element[1]
        taskDiv.appendChild(taskDuration)
        
        const taskPlacement = document.createElement("span");
        taskPlacement.innerText = element[2]
        taskDiv.appendChild(taskPlacement)

        //Add to CalendarTasks
        calendarTasks.appendChild(taskDiv)
    })
}

function converTimeIntoHours(input) //input = "23:30" -> 23,5 timer
{
    let hours = parseInt(input.split(":")[0]);
    let min = parseInt(input.split(":")[1]);

    let minToHours = min/60
    return hours+minToHours;
}

function calculatePlacement(placementTime, index = 0) {
    let regulatingNumber = 0;
    let startTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][0]);
    let endTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]);
    let placementTimeStamp = converTimeIntoHours(placementTime);
    let placementProcentage = ((placementTimeStamp - startTimeStamp) / (endTimeStamp - startTimeStamp)) * 100;
    
    // Adding an index factor to differentiate tasks with the same placement time
    // console.log(`((${placementTimeStamp} - ${startTimeStamp}) / (${endTimeStamp} - ${startTimeStamp})) * 100`)
    let adjustedPercentage = placementProcentage + index * regulatingNumber;
    // console.log("placement: " + adjustedPercentage + " %");
    return adjustedPercentage + "%";
}


function calculatePlacement2(placementTime, index = 0) {
    let regulatingNumber = 0;
    let startTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][0]);
    let endTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]);
    let placementTimeStamp = converTimeIntoHours(placementTime);
    let placementProcentage = ((placementTimeStamp - startTimeStamp) / ((endTimeStamp+2) - startTimeStamp)) * 100;
    
    // Adding an index factor to differentiate tasks with the same placement time
    // console.log(`((${placementTimeStamp} - ${startTimeStamp}) / (${endTimeStamp+2} - ${startTimeStamp})) * 100`)
    let adjustedPercentage = placementProcentage + index * regulatingNumber;
    // console.log("placement: " + adjustedPercentage + " %");
    return adjustedPercentage + "%";
}

function calculatePlacement3(placementTime, index = 0) {
    let regulatingNumber = 0;
    let startTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][0]);
    let endTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]);
    let placementTimeStamp = converTimeIntoHours(placementTime);
    let placementProcentage = ((placementTimeStamp) / ((endTimeStamp+2) - startTimeStamp)) * 100;
    
    // Adding an index factor to differentiate tasks with the same placement time
    // console.log(`((${placementTimeStamp}) / (${endTimeStamp+2} - ${startTimeStamp})) * 100`)
    let adjustedPercentage = placementProcentage + index * regulatingNumber;
    // console.log("placement: " + adjustedPercentage + " %");
    return adjustedPercentage + "%";
}

function calculateLinePlacement(timePlacement) //Input "0:30" Returns: arr[0, 10, 20, 30...] <- all placements of procentage of whole calendar.
{
    let allPlacements = []

    let num = converTimeIntoHours(timePlacement) // 1,0

    let startTime = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][0]);
    let endTime = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]);

    let increasingDistance = parseFloat(calculatePlacement3(timePlacement).split("%")[0])
    let startPlacement = parseFloat(calculatePlacement2(allTimeStamps[allTimeStamps.length - 1][0]).split("%")[0])
    let endPlacement = parseFloat(calculatePlacement2(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]).split("%")[0])
    
    // console.log(calculatePlacement2(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]).split("%")[0])
    // console.log(calculatePlacement2((timePlacement).split("%")[0]))

    for(let i = startPlacement; i<100; i+=increasingDistance){ //___ i <= endPlacement
        allPlacements.push(i - startPlacement)
    }
    // console.log(allPlacements)
    return allPlacements
}








