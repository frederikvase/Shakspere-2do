let viewDaysAmount = 2;
let initialDate = [dayNumber, month, year]; //Should change onClick -> nextDay

const calendarDropLocation = document.querySelector('.calendar-view-day-droplocation');

let schoolID = 100;


let allItems = JSON.parse(localStorage.getItem("all-tasks")) || [];

class taskOnGivenDay{
    constructor(taskName, taskSubtaskName, taskDuration, taskPlacement, date = `${dayNumber}-${month}-${1800}`)
    {
        this.taskName           = taskName;         //String -> "English Essay"
        this.taskSubtaskName    = taskSubtaskName;  //String -> "Indledning"
        this.taskDuration       = taskDuration;     //String -> "1:30"
        this.taskPlacement      = taskPlacement     //Float -> 10  OR   -> string "11:30"
        //this.ID | this.date | this.type | this.startTime | this.endTime | this.top | this.height

        // console.log(date + " | " + this.taskSubtaskName + this.taskName)
        if (getMonthsLength(parseInt(date.split("-")[1]), parseInt(date.split("-")[2])) && parseInt(date.split("-")[0]) <= getMonthsLength(parseInt(date.split("-")[1]), parseInt(date.split("-")[2]))){
            this.date           = date              //String: "dd-mm-yyyy" -> "31-1-2024" 
        } else {
            alert("Invaild date! \nGiven date: " + date);
        }

        if (typeof this.taskPlacement == 'string') {
            this.type = "school";
            this.startTime = this.taskPlacement;
            this.ID = `task-day-${this.type}-${schoolID}`;
            schoolID++;
        } else {
            this.type = "project";
            this.startTime = addTwoHours(calculateProcentageIntoDuration(this.taskPlacement), allTimeStamps[allTimeStamps.length - 1][0]);
            
            let currentNum = 0;
            for (const key in allItems){
                const theTask = allItems[key]
                if(parseInt(theTask.ID.split("-")[3]) > currentNum && theTask.type == "project"){
                    currentNum = parseInt(theTask.ID.split("-")[3])
                }
            }
            let projectsID = currentNum || 0
            projectsID ++;
            
            this.ID = `task-day-${this.type}-${projectsID}`;
        }


        this.top = calculateDurationIntoProcentage(subtractTwoHours(this.startTime, allTimeStamps[allTimeStamps.length - 1][0]))
        this.endTime =  addTwoHours(this.startTime, this.taskDuration) //String "10:30"
        this.height = calculateDurationIntoProcentage(taskDuration)
    }

    showDaysTask(){
        const placedDay = document.getElementById(this.date);
        const givenClassName = this.type == "school" ? "calender-tasks-school" : "calender-tasks-project";

        const createdTask = document.createElement("div");
        createdTask.classList.add(givenClassName);
        createdTask.classList.add("calendar-is-task");

        createdTask.setAttribute("id", this.ID)

        //Styles (mainly placement)
        createdTask.style.position = "absolute"
        createdTask.style.top = `${this.top}%`
        createdTask.style.height = `${this.height}%`
        createdTask.style.zIndex = `2`;

        //Other elements inside createdTask 
            //Taskname & subtaskname
        const firstElement = document.createElement("span");
        firstElement.classList.add("calender-tasks-item-taskName");
        const textContent = this.type === "school" ? `${this.taskName}` : `${this.taskName} / ${this.taskSubtaskName}`;
        firstElement.textContent = textContent;
        createdTask.appendChild(firstElement);
        
            //Period
        const thirdElement = document.createElement("span");
        thirdElement.classList.add("calender-tasks-item-taskPeriod");
        thirdElement.textContent = `${this.startTime} - ${this.endTime}`;
        createdTask.appendChild(thirdElement);
        
            //Duration
        const secondElement = document.createElement("span");
        secondElement.classList.add("calender-tasks-item-taskDuration");
        secondElement.textContent = `${this.taskDuration.split(":")[0] > 0 ? this.taskDuration.split(":")[0] + ' h ' : ''}${this.taskDuration.split(":")[1]} m`;
        createdTask.appendChild(secondElement);

            //Remove button
        if (this.type !== "school") {
            const fourthElement = document.createElement("button");
            fourthElement.classList.add("calender-tasks-item-button");
            fourthElement.addEventListener("click", (event) => {
                deleteTask(this.ID, allItems);
                displayAllTasks();
                event.stopPropagation();
                onPress(false);
            });                    
            fourthElement.textContent = this.taskDone ? "J" : "X";
            createdTask.appendChild(fourthElement);
        }

        
        createdTask.addEventListener("click", () => onPress(true, createdTask));
                
        if(givenClassName == "calender-tasks-project"){
            // createdTask.setAttribute("onmouseover", "checkElementId(event)");
            createdTask.setAttribute("draggable","true");
        }
    
        if(placedDay){ //Only show item, if the date is being shown
            placedDay.appendChild(createdTask);
        }
    }
}

showMultipleDays();
displayAllTasks();

// allItems.push(new taskOnGivenDay("Samfundsfag", "rAnDoM",       "1:00",     65,         "20-1-2024"));
// allItems.push(new taskOnGivenDay("Samfundsfag", "rAnDoM",       "1:00",     "18:00",    "20-1-2024"));
// allItems.push(new taskOnGivenDay("BiOlOgIV2",   "POWER HOUSE",  "2:00",     "9:30",     "22-1-2024"));
// allItems.push(new taskOnGivenDay("Samfundsfag", "rAnDoM",       "1:00",     "17:00",    "21-1-2024"));
// allItems.push(new taskOnGivenDay("BiOlOgIV2",   "HOUSE",        "2:00",     "11:30",    "22-1-2024"));
// allItems.push(new taskOnGivenDay("BiOlOgI",     "MiToCoNDrIa",  "0:20",     10,         "20-1-2024"));



//Input from MinSkoleApp (Mortens del)
allItems.push(new taskOnGivenDay("Math", "", "1:00", "8:15", "20-1-2024"));
allItems.push(new taskOnGivenDay("Math", "", "1:00", "9:35", "20-1-2024"));
allItems.push(new taskOnGivenDay("Danish", "", "1:00", "10:45", "20-1-2024"));
allItems.push(new taskOnGivenDay("English", "", "1:00", "12:15", "20-1-2024"));
allItems.push(new taskOnGivenDay("Chemistry", "", "1:00", "13:25", "20-1-2024"));
allItems.push(new taskOnGivenDay("Chemistry", "", "1:00", "14:30", "20-1-2024"));

console.log(allItems);

function displayAllTasks() {
    showMultipleDays();

    for (let i = 0; i < allItems.length; i++) 
    {
        let task = allItems[i];

        if(task.date)
        {
            //makes sure "school" tasks only gets shown if they're just made
            if (!(task instanceof taskOnGivenDay)) 
            {
                if (allItems[i].type == "school") 
                {
                    const existingSchoolTask = allItems.find(item =>
                        item.type === "school" && item.ID === allItems[i].ID
                    );
    
                    // If not, add the new school task
                    if (!existingSchoolTask) 
                    {
                        const { taskName, taskSubtaskName, taskDuration, taskPlacement, date } = allItems[i];
                        if(allItems[i].taskName && allItems[i].taskSubtaskName && allItems[i].taskDuration && allItems[i].taskPlacement && allItems[i].date){
                            task = new taskOnGivenDay(taskName, taskSubtaskName, taskDuration, taskPlacement, date);
                            allItems[i] = task; 
                        } else {console.error("Some information missing:"); console.log(allItems[i]); }
                    } else {
                        allItems.splice(i, 1);
                        i--; 
                    }
                } else {
                    // Projects -> Convert into instance of taskOnGivenDay
                    const { taskName, taskSubtaskName, taskDuration, taskPlacement, date } = allItems[i];
                    if(allItems[i].taskName && allItems[i].taskSubtaskName && allItems[i].taskDuration && allItems[i].taskPlacement && allItems[i].date)
                    {
                        task = new taskOnGivenDay(taskName, taskSubtaskName, taskDuration, taskPlacement, date);
                        allItems[i] = task; 
                    } else {console.error("Some information missing"); console.log(allItems[i]);}
                }
            }
    
            // Show task
            if (typeof task.showDaysTask === 'function') {
                task.showDaysTask();
            }
        }
    }

    isPlacedAtSameTimeButForViewMoreDays(allItems);
    updateVisibleElements();
    updateDraggableState();

    localStorage.setItem("all-tasks", JSON.stringify(allItems));
}

displayAllTasks();


function getMonthsLength(thisMonth, thisYear = year) //input int -> 12, int -> 2024
{
    const monthsLength = {
        1 : 31,
        2: thisYear % 4 == 0 && thisYear % 100 != 0 || thisYear % 400 == 0 ? 29 : 28,
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
        const calendarDropLocation = document.createElement("div");
        calendarDropLocation.classList.add("calendar-view-day-droplocation")
        calendarDropLocation.setAttribute("id", elements)
        daySection.appendChild(calendarDropLocation);

        calendarDropLocation.addEventListener("dragover", dragOverDays);
        calendarDropLocation.addEventListener("dragenter", dragEnterDays);
        calendarDropLocation.addEventListener("dragleave", dragLeaveDays);
        calendarDropLocation.addEventListener("drop", dragDropDays);
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
    showMultipleDays();
    displayAllTasks();
    updateVisibleElements();
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
            startMonth = 12;
            startDay = getMonthsLength(startMonth, startYear);
        }
    }
    initialDate = [startDay, startMonth, startYear];
    showMultipleDays();
    displayAllTasks();
    updateVisibleElements();
}

// function dragStartDays(event) {
//     const draggedItem = event.target;
//     event.dataTransfer.setData('text/plain', draggedItem.id);
// }

function dragOverDays(event) {
    // console.log("dragOverDays");
    event.preventDefault();

    if (calendarDropLocation) {
        calendarDropLocation.classList.add('drag-over');
    }
}

function dragEnterDays() {
    // console.log("dragEnterDays");

    if (calendarDropLocation) {
        calendarDropLocation.classList.add('drag-over');
    }
}

function dragLeaveDays() {
    // console.log("dragLeaveDays");

    if (calendarDropLocation) {
        calendarDropLocation.classList.remove('drag-over');
    }
}

function dragDropDays(event) {
    event.preventDefault();
    // console.log("dragDropDays");

    const draggedItemId = event.dataTransfer.getData('text/plain');
    const draggedItem = document.getElementById(draggedItemId);
    // console.log(draggedItem)

    if (draggedItem) {
        const rect = this.getBoundingClientRect();
        const relativeY = event.clientY - rect.top;
        let relativePercentage = (relativeY / rect.height) * 100;

        let val = parseFloat(calculatePlacement3(interval).split("%")[0]);
        const remainder = relativePercentage % val;
        relativePercentage -= remainder;

        // Get the drop location id
        let dropLocationId = event.target.id;
        let runningVal = 0;

        // Check if the drop location is valid
        let canBeDropped = true;
        while (!(getMonthsLength(parseInt(dropLocationId.split("-")[1]), parseInt(dropLocationId.split("-")[2])) && parseInt(dropLocationId.split("-")[0]) <= getMonthsLength(parseInt(dropLocationId.split("-")[1]), parseInt(dropLocationId.split("-")[2])))) {
            if (runningVal > 2) {
                alert("Mistake, please try again!");
                canBeDropped = false;
                break;
            } else {
                runningVal++;
                let parentElement = event.target.parentElement;
                if (parentElement) {
                    dropLocationId = parentElement.id;
                } else {
                    break;
                }
            }
        }

        if(draggedItem.classList.contains('todo-item')){ //From subtask
            const originalSubtaskName = draggedItem.querySelector('.subtask-taskName li').textContent;
            const originalTaskName = draggedItem.querySelector('.subtask-taskName').textContent.replace(originalSubtaskName, '').trim()
            const spanTaskDuration = draggedItem.querySelector('.subtask-taskDuration').textContent;
            allItems.push(new taskOnGivenDay(originalTaskName, originalSubtaskName, spanTaskDuration, relativePercentage, dropLocationId));

        } else { //Alredy in calendar
            for (let i = 0; i<allItems.length; i++)
            {
                const task = allItems[i]
                // console.log(task.ID)
                // console.log(task.taskPlacement)
                if(draggedItem.id == task.ID){
                    // console.log(task)
                    task.taskPlacement = relativePercentage+5;

                    if(canBeDropped) {
                        allItems.push(new taskOnGivenDay(task.taskName, task.taskSubtaskName, task.taskDuration, relativePercentage, dropLocationId))
                        allItems.splice(i,1);
                    }
                }
            }
        }        
        displayAllTasks();
    } else {
        alert("No Item Found!");
    }
}

// Function to update the draggable state after dropping
function updateDraggableState() {
    const projectTasks = document.querySelectorAll('.calender-tasks-project');
    projectTasks.forEach(task => {
        task.setAttribute("draggable", "true");
        task.addEventListener("dragstart", dragStart);
    });
}


function isPlacedAtSameTimeButForViewMoreDays(arr = allItems) {
    let initialDate = [dayNumber, month, year];
    let viewDaysAmount = 3;

    for (let elements of ouputNumberOfDays(initialDate, viewDaysAmount)) {
        for (let m = 0; m < arr.length; m++) {
            let taskTimes = [];
            if (arr[m] && elements && arr[m].date === elements) {
                for (let i = 0; i < arr.length; i++) {
                    const taskObj = arr[i];
                    if (taskObj.date === elements) {
                        let beginningOfTask = parseInt(taskObj.startTime.split(":")[0] + taskObj.startTime.split(":")[1]);
                        let endingOfTask = parseInt(taskObj.endTime.split(":")[0] + taskObj.endTime.split(":")[1]);
                        taskTimes.push([taskObj.ID, beginningOfTask, endingOfTask]);
                    }
                }

                const arrWithNeighbours = findNeighboursOtOnce(taskTimes);

                for (let key of Object.keys(arrWithNeighbours)) {
                    let theObject = arrWithNeighbours[key];
                    let changeTask = document.getElementById(theObject[0]);
                
                    if (changeTask) {
                        let theWidth = 100 / (theObject[1] + 1);
                        changeTask.style.width = `${theWidth}%`;
                    }
                }
                
                const arrWithHorizontalOffset = calculateLeft(taskTimes);
                
                for (let element of arrWithHorizontalOffset) {
                    let changeTask = document.getElementById(element[0]);
                
                    if (changeTask) {
                        changeTask.style.left = `${element[1]}%`;
                    }
                }
            }
        }
    }
}


function updateVisibleElements() {
    var containers = document.querySelectorAll('.calendar-is-task');
    var gapValue = 15;  // Adjust the gap value as needed
    var containerPadding = 15;  // Adjust the container padding value as needed
    const singleElementPadding = 0; 
    const singleGapValue = 0;

    containers.forEach(function (container) {
        var spans = container.querySelectorAll('span');
        var containerWidth = container.clientWidth;
        var containerHeight = container.clientHeight;
        var totalSpanWidth = 0;
        var totalSpanHeight = 0;
        var currentLineHeight = 0;

        container.style.display = 'flex';
        container.style.flexWrap = 'wrap'; // Allow flex items to wrap
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        
        spans.forEach(function (span, i) {
            totalSpanWidth += span.clientWidth;
            totalSpanHeight += span.clientHeight;

            if (i === 0) {
                span.style.visibility = 'visible';
                span.style.position = 'static';
            } else {
                if (containerHeight >= totalSpanHeight + currentLineHeight) {
                    span.style.visibility = 'visible';
                    span.style.position = 'static';
                } else {
                    span.style.visibility = 'hidden';
                    span.style.position = 'absolute';
                    currentLineHeight = totalSpanHeight; // Start a new line
                }
            }
        });

        // Set the visibility and position of the remove button (4th span)
        var removeButton = container.querySelector('button');
        if (removeButton) {
            if (containerHeight >= totalSpanHeight + currentLineHeight) {
                removeButton.style.visibility = 'visible';
                removeButton.style.position = 'static';
            } else {
                removeButton.style.visibility = 'hidden';
                removeButton.style.position = 'absolute';
            }
        }

        const visibleElements = [...container.children].filter(span => span.style.visibility === 'visible');
        if (visibleElements.length === 1) {
            container.style.padding = `0 ${singleElementPadding}px`;
            container.style.justifyContent = "center"
            container.style.gap = `${singleGapValue}px`;  // Set gap based on the variable

            const span = visibleElements[0];
            const fontSizeToFit = (containerWidth / span.textContent.length) * 2; // Adjust this as needed

            if (fontSizeToFit > 20) {
                span.style.fontSize = "20px";
            } else {
                span.style.fontSize = `${fontSizeToFit}px`;
            }
           
        } else {
            container.style.padding = `0 ${containerPadding}px`;
            container.style.justifyContent = "space-around"
            container.style.gap = `${gapValue}px`;  // Set gap based on the variable
        }
    });
}
