let viewDaysAmount = 3;
let initialDate = [dayNumber, month, year]; //Should change onClick -> nextDay

class taskOnGivenDay{
    constructor(taskName, taskSubtaskName, taskDuration, taskPlacement, date)
    {
        this.taskName           = taskName;         //String -> "English Essay"
        this.taskSubtaskName    = taskSubtaskName;  //String -> "Indledning"
        this.taskDuration       = taskDuration;     //String -> "1:30"
        this.taskPlacement      = taskPlacement     //Float -> 10  OR   -> string "11:30"

        if (getMonthsLength(parseInt(date.split("-")[1]), parseInt(date.split("-")[2])) && parseInt(date.split("-")[0]) <= getMonthsLength(parseInt(date.split("-")[1]), parseInt(date.split("-")[2]))){
            this.date           = date              //String: "dd-mm-yyyy" -> "31-1-2024" 
        } else {
            alert("Invaild date! \nGiven date: " + date);
        }
    }
}

function getMonthsLength(thisMonth, thisYear = year) //input int -> 12, int -> 2024
{
    const monthsLength = {
        1 : 31,
        2: thisYear % 4 == 0 && thisYear % 100 != 0 ? 29 : 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    }
    return monthsLength[thisMonth];
} // Ouput int -> 31 

function ouputNumberOfDays(startingDate, viewAmountOfDays = viewDaysAmount) //input arr(int*3) [day, month, year] -> [30, 12, 2024] , viewAmountOfDays: int -> 3
{
    viewAmountOfDays -= 1;
    let startDay = startingDate[0];
    let startMonth = startingDate[1];
    let startYear = startingDate[2];
    
    let shownDays = []
    shownDays.push(`${startDay}-${startMonth}-${startYear}`)
    for (let i = 0; i<viewAmountOfDays; i++){
        startDay += 1;

        if(startDay > getMonthsLength(startMonth, startYear)){
            startDay = 1;
            startMonth += 1;
        } 
        if (startMonth > 12){
            startYear += 1;
            startMonth = 1;
        }
        shownDays.push(`${startDay}-${startMonth}-${startYear}`);
    }
    return shownDays;
} //ouput arr -> ['30-12-2024', '31-12-2024', '1-1-2025']       (length = viewAmountOfDays || 1)

console.log(ouputNumberOfDays([30, 12, 2024], viewDaysAmount));

function showMultipleDays()
{
    tasksFromLocalStorage = JSON.parse(localStorage.getItem("shown-tasks"));
    
    const calendarViewAllDays = document.getElementById("calendar-view-all-days");
    calendarViewAllDays.innerHTML = ""; // Clear existing content


    for (let elements of ouputNumberOfDays(initialDate, viewDaysAmount)){
        //day container
        const daySection = document.createElement("div");
        daySection.classList.add("calendar-view-day")
        daySection.style.position = "relative";
        
        calendarViewAllDays.appendChild(daySection);
        
        //Day title
        const dayTitle = document.createElement("span");
        dayTitle.classList.add("calendar-view-day-text")
        dayTitle.innerText = elements;
        daySection.appendChild(dayTitle);
        
        //Day drop location
        const dropLocation = document.createElement("div");
        dropLocation.classList.add("calendar-view-day-droplocation")
        dropLocation.setAttribute("id", elements)
        daySection.appendChild(dropLocation);

        dropLocation.addEventListener("dragover", dragOver);
        dropLocation.addEventListener("dragenter", dragEnter);
        dropLocation.addEventListener("dragleave", dragLeave);
        dropLocation.addEventListener("drop", dragDrop);
        
        //Show tasks 
        for (let key in tasksFromLocalStorage)
        {
            const localStorageTask = tasksFromLocalStorage[key];
            if (localStorageTask.date == elements)
            {
                // const randomDivclassName = localStorageTask.type === "school" ? "calender-tasks-school" : "calender-tasks-project";

                // const randomDiv = document.createElement("span");
                // randomDiv.classList.add(randomDivclassName);
                // randomDiv.style.position = "absolute";
                // randomDiv.style.top = `${localStorageTask.top}%`;
                // randomDiv.style.height = `${localStorageTask.height}%`;
                // randomDiv.style.width = `100%`; //Change this later!
                // randomDiv.style.backgroundColor = "233";
                // randomDiv.id = localStorageTask.ID;
                // randomDiv.innerText = `${localStorageTask.taskName} / ${localStorageTask.taskSubtaskName}`;
                // dropLocation.appendChild(randomDiv);
                const className = localStorageTask.type === "school" ? "calender-tasks-school" : "calender-tasks-project";
                const thisTask = document.createElement("div");
                thisTask.setAttribute("id", `${localStorageTask.ID}`);

                thisTask.addEventListener("click", () => onPress(true, thisTask));
                
                if(className == "calender-tasks-project"){
                    thisTask.setAttribute("onmouseover", "checkElementId(event)");
                    thisTask.setAttribute("draggable","true");
                }
                thisTask.classList.add(className);
                thisTask.style.position = 'absolute';

                thisTask.style.top = `${localStorageTask.top}%`;
                thisTask.style.height = `${localStorageTask.height}%`;
                // thisTask.style.border = `2px solid black`;
                thisTask.style.zIndex = `2`;
                calendarTasksPlace.appendChild(thisTask);

                
                const thisDropLocation = document.getElementById(localStorageTask.date);
                if (thisDropLocation) {
                    // thisTask.setAttribute('task-date', '18-1-2024');
                    thisDropLocation.appendChild(thisTask);
                } else {
                    console.error("Element with class 'calendar-view-day-droplocation' not found");
                }

                const firstElement = document.createElement("span");
                firstElement.classList.add("calender-tasks-item-taskName");
                const textContent = localStorageTask.type === "school" ? `${localStorageTask.taskName}` : `${localStorageTask.taskName} / ${localStorageTask.taskSubtaskName}`;
                firstElement.textContent = textContent;
                thisTask.appendChild(firstElement);
                
                const thirdElement = document.createElement("span");
                thirdElement.classList.add("calender-tasks-item-taskPeriod");
                thirdElement.textContent = `${localStorageTask.startTime} - ${localStorageTask.endTime}`;
                thisTask.appendChild(thirdElement);
                
                
                const secondElement = document.createElement("span");
                secondElement.classList.add("calender-tasks-item-taskDuration");
                secondElement.textContent = `${localStorageTask.taskDuration.split(":")[0] > 0 ? localStorageTask.taskDuration.split(":")[0] + ' h ' : ''}${localStorageTask.taskDuration.split(":")[1]} m`;
                thisTask.appendChild(secondElement);


                if (localStorageTask.type !== "school") {
                    const fourthElement = document.createElement("button");
                    fourthElement.classList.add("calender-tasks-item-button");
                    fourthElement.addEventListener("click", (event) => {
                        deleteTask(localStorageTask.ID);
                        event.stopPropagation();
                        onPress(false);
                    });                    fourthElement.textContent = localStorageTask.taskDone ? "J" : "X";
                    thisTask.appendChild(fourthElement);
                }

            }
        }
    }
}

const nextImg = document.getElementById("calendar-view-left-next");
const previousImg = document.getElementById("calendar-view-left-previous");
nextImg.addEventListener("click", () => nextDay());
previousImg.addEventListener("click", () => previousDay());

function nextDay(){
    let startDay = initialDate[0];
    let startMonth = initialDate[1];
    let startYear = initialDate[2];

    for (let i = 0; i < 1; i++) {
        startDay += 1;

        if (startDay > getMonthsLength(startMonth, startYear)) {
            startDay = 1;
            startMonth += 1;
        }
        if (startMonth > 12) {
            startYear += 1;
            startMonth = 1;
        }
    }
    initialDate = [startDay, startMonth, startYear];
    console.log(initialDate);
    showMultipleDays();
}

function previousDay(){
    let startDay = initialDate[0];
    let startMonth = initialDate[1];
    let startYear = initialDate[2];

    for (let i = 0; i < 1; i++) {
        startDay -= 1;

        if (startDay < 1) {
            startMonth -= 1;
            startDay = getMonthsLength(startMonth, startYear);
        }
        if (startMonth < 1) {
            startYear -= 1;
            startMonth = 1;
        }
    }
    initialDate = [startDay, startMonth, startYear];
    console.log(initialDate);
    showMultipleDays();
}


showMultipleDays();