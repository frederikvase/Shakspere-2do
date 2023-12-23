const body = document.body;

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
calendarTitle.innerText = "Tuesday";
calendarSection.appendChild(calendarTitle);

//Calender-time stamps
const calendarTimeStamps = document.createElement("div");
calendarTimeStamps.classList.add("calender-time");
calendarSection.appendChild(calendarTimeStamps);

//Each timestamp:
addTimeStamps("6:50", "21:45");

//CalederTasks
const calendarTasks = document.createElement("div");
calendarTasks.classList.add("calender-tasks");
calendarSection.appendChild(calendarTasks);


/*addTaskToCalendar("Danish", 90, "10:00", false, "Conclusion");
addTaskToCalendar("Danish", 90, "16:00", false, "Conclusion");
addTaskToCalendar("Danish", 90, "12:00", false, "Conclusion");*/
//addTaskToCalendar("Danish", 90, "12:00", false, "Conclusion");

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

function calculatePlacement(placementTime, index) {
    let regulatingNumber = 0;
    let startTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][0]);
    let endTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]);
    let placementTimeStamp = converTimeIntoHours(placementTime);
    let placementProcentage = ((placementTimeStamp - startTimeStamp) / (endTimeStamp - startTimeStamp)) * 100;
    
    // Adding an index factor to differentiate tasks with the same placement time
    let adjustedPercentage = placementProcentage + index * regulatingNumber;
    console.log("placement: " + adjustedPercentage + " %");
    return adjustedPercentage + "%";
}





