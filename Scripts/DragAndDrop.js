let containsAllTasks = [] // <- in Localstorage 

showCalendarTasks();

const todoDraggablePlace = document.getElementById('todo-draggable');
const calendarTasksPlace = document.querySelector('.calender-tasks');

// Attach drag events to each todo-item
const todoItems = todoDraggablePlace.querySelectorAll('.todo-item');
todoItems.forEach(item => {
    item.draggable = true;
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragend", dragEnd);
});

calendarTasksPlace.addEventListener("dragover", dragOver);
calendarTasksPlace.addEventListener("dragenter", dragEnter);
calendarTasksPlace.addEventListener("dragleave", dragLeave);
calendarTasksPlace.addEventListener("drop", dragDrop);

function dragStart(event) {
    console.log("Start DRAG");
    event.dataTransfer.setData('text/plain', event.target.id);
    this.classList.add("hold");
    setTimeout(() => (this.classList.add("invisible")), 0);
}

function dragEnd() {
    console.log("END DRAG");
    this.classList.remove("invisible", "hold");
}

function dragOver(event) {
    console.log("OVER");
    event.preventDefault();
}

function dragEnter() {
    console.log("Enter");
    this.classList.add("over");
}

function dragLeave() {
    console.log("Leave");
    this.classList.remove("over");
}

function dragDrop(event) {
    console.log("Drop");
    event.preventDefault();

    const draggedItemId = event.dataTransfer.getData('text/plain'); //Dragged ID
    const draggedItem = document.getElementById(draggedItemId); //HTML elements

    if (draggedItem) {
        // Place item based on y-axis
        const rect = this.getBoundingClientRect();
        const relativeY = event.clientY - rect.top;
        const relativePercentage = (relativeY / rect.height) * 100;
    
        const clone = draggedItem.cloneNode(true);
        clone.classList.remove("invisible", "hold");
        
        // clone.style.position = 'absolute';
        // clone.style.top = `${relativePercentage}%`;
    
        // Give item a height based on task duration.
        const secondSpanValue = clone.querySelector('.todo-item span:nth-child(2)').textContent;
        // clone.style.height = calculateHeight(secondSpanValue);
    
        // Give item time (from -> to) based on top: and duration:
        let timePeriod = calculatePeriod(relativePercentage, secondSpanValue);
        const thirdSpan = clone.querySelector('.todo-item span:nth-child(3)');
        thirdSpan.textContent = timePeriod;

        //Added elent to array (if not alredy there):
        let isThere = false;
        for (let thing of containsAllTasks)
        {
            if(thing[thing.length-1] === draggedItemId){
                isThere = true;
            }
            console.log("HeRe: " + thing)
        }
        console.log("IS there is " + isThere)
        if(!isThere){
            appendTasks("Task", "SubTask", calculateHeight(secondSpanValue), secondSpanValue, relativePercentage, timePeriod, false, draggedItemId)
        }
        
        showCalendarTasks(containsAllTasks);
        isPlacedAtSameTime()

    
        //this.appendChild(clone); //____ THIS ONE ADDDDDDS


        // Remove the dragged item from todoDraggablePlace
        draggedItem.parentNode.removeChild(draggedItem);
    }   
}

function calculateHeight(input) //Number of minutes: e.g. "120 min"
{
    let amountOfMin = parseInt(input.split("min")[0])/60

    //Used functions and values from Calendar.js
    let theStartTime = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][0]);
    let theEndTime = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]) +2; //___ +2 because its showing 2 extra hours

    //New calculations
    let theHeight = (amountOfMin)/(theEndTime-theStartTime)*100
    return theHeight + "%"
}

function calculatePeriod(top, height) //both top an height is procentage: input: 40,3% | 5,67%
{
    //Functions and variables from Calendar.js
    let theStartTime = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][0]);
    let theEndTime = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]) +2; //___ +2 because its showing 2 extra hours

    //Calculate StartingTime
    let period =((top/100) *(theEndTime-theStartTime))+theStartTime;

    
    //Calculating endingTime:
    let numberOfMin = parseInt(height.split("min"))
    let periodEndTime = decimalToHoursAndMinutes((numberOfMin/60) + period)

    return `${decimalToHoursAndMinutes(period)} - ${periodEndTime}`
}

function decimalToHoursAndMinutes(decimal) {
    // Extract the hours and minutes
    let hours = Math.floor(decimal);
    let minutes = Math.round((decimal % 1) * 60);

    // Format the result
    let formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

    return formattedTime;
}

function appendTasks(taskName, taskSubtaskName, taskDurationProcentage, taskDurationMin, taskPlacementProcentage, taskPlacementStartEndHourMin, taskDone = false, ID)
{
    //                     0         1                2                       3                4                        5                             6         7
    containsAllTasks.push([taskName, taskSubtaskName, taskDurationProcentage, taskDurationMin, taskPlacementProcentage, taskPlacementStartEndHourMin, taskDone, ID]);
    //                     taskName  SubtaskName      height:                 amountMin        top:                     placementMinENDSTART         isTaskDone?  taskID
}

function removeTask(ID, arr = containsAllTasks) 
{
    for (let i = 0; i < arr.length; i++) 
    {
        if (arr[i][arr[i].length - 1] == ID) 
        {
            arr.splice(i, 1);
            i--; 

            const elementBeingRemoved = document.getElementById(ID);
            elementBeingRemoved.remove();
        }
    }
    console.log(containsAllTasks)
    showCalendarTasks();
}

function showCalendarTasks(arr = containsAllTasks){
    for (let element of arr) 
    {
        //Makes sure, it dosent add an element/task which alredy is there (in calendarTasksPlace):
        let isElementThere = false
        let existingElement = calendarTasksPlace.querySelector(`#${element[element.length-1]}`); //Gets the ID
        if (existingElement) {
            console.log("Don't add the task: " + element[element.length-1]);
            isElementThere = true
        } else {
            console.log("Add task: " + element[element.length-1]);
        }

        //Add task
        if (!isElementThere)
        {   
            /* TODO: maybe add the following:
                    draggable & extraStyles */
    
            const newTask = document.createElement("div");
            newTask.classList.add("calender-tasks-item");
            newTask.setAttribute("id", `${element[7]}`)
            calendarTasksPlace.appendChild(newTask);
            
            //Placement of task:
            newTask.style.position = 'absolute';
            newTask.style.top = `${element[4]}%`; //value == relativePercentage == e.g. 46.5            == [4]taskPlacementProcentage
            newTask.style.height = element[2]; //value == calculateHeight(secondSpanValue) == "47.3%"   == 2[taskDurationProcentage]


            //Structure of task: inside <div>newTask</div> 
                //<span> TaskName | Subtask </span>
                const taskName = document.createElement("span")
                taskName.classList.add("calender-tasks-item-taskName")
                taskName.innerHTML = `${element[0]}<br/><li>${element[1]}</li>`;    // [0] = taskName | [1] = subTaskName
                newTask.appendChild(taskName)
    
                
                //<span> Duration </span>
                const taskDuration = document.createElement("span")
                taskDuration.classList.add("calender-tasks-item-taskDuration")
                taskDuration.innerHTML = `${element[3]}` // [3] taskDurationMin
                newTask.appendChild(taskDuration)
    
                
                //<span> Period </span>
                const taskPeriod = document.createElement("span")
                taskPeriod.classList.add("calender-tasks-item-taskPeriod")
                taskPeriod.innerHTML = `${element[5]}`       // [5] taskPlacementStartEndHourMin
                newTask.appendChild(taskPeriod)
    
                //<span> TaskDone? </span>
                const taskDone = document.createElement("span")
                
                if(element[6]){ // [6] taskDone
                    taskDone.innerHTML = `J`  
                } else {
                    taskDone.innerHTML = `O`
                }
    
                taskDone.classList.add("calender-tasks-item-taskDone")
                newTask.appendChild(taskDone)
        }
    }
}

function isPlacedAtSameTime(arr = containsAllTasks){
    let taskTimes = []

    // Find tasks that occur at the same time
    for (let i = 0; i < arr.length; i++) 
    {
        let theTaskTime = arr[i][5].split("-")
        let beginningOfTask = parseInt(theTaskTime[0].split(":")[0] + theTaskTime[0].split(":")[1]);
        let endingOfTask = parseInt(theTaskTime[1].split(":")[0] + theTaskTime[1].split(":")[1]);
        taskTimes.push([arr[i][arr[i].length-1], beginningOfTask, endingOfTask]);
    }

    //Changes the width of the tasks
    const arrWithNeighbours = findNeighboursOtOnce(taskTimes)

    for (let key of Object.keys(arrWithNeighbours)){
        let theObject = arrWithNeighbours[key];
        let changeTask = document.getElementById(theObject[0])
        let theWidth = 100 / (theObject[1] + 1)
        changeTask.style.width = `${theWidth}%`
    }
    
    //Changes the leftOffset of the tasks
    const arrWithHorizontalOffset = calculateLeft(taskTimes)

    for (let element of arrWithHorizontalOffset){
        let changeTask = document.getElementById(element[0])
        changeTask.style.left = `${element[1]}%`
    }
}

function findNeighboursOtOnce(arr) {
    let ans = [];
  
    const overlappingRoundOne = findOverlappingTasks(arr);
    console.log("overlappingRoundOne")
    console.log(overlappingRoundOne)
    console.log("Other")
  
    for (let element of arr) {
        let theID = element[0];
        let amountOfOverlap = overlappingRoundOne[theID] || [];
    
        if (amountOfOverlap.length >= 1) 
        {
            let overlappingTimesTwo = amountOfOverlap.map(stuff => {
            for (let thing of arr) {
                if (thing[0] === stuff) {
                return thing;
                }
            }
            });
            console.log("overlappingTimesTwo", theID)
            console.log(overlappingTimesTwo)
    
            let overlapOfOverlap = findOverlappingTasks(overlappingTimesTwo);
            console.log(overlapOfOverlap)
            let maxLength = 0;
    
            for (let key of Object.keys(overlapOfOverlap)) {
                if (overlapOfOverlap[key].length > maxLength) {
                    console.log(theID + " | " + overlapOfOverlap[key].length)
                    maxLength = overlapOfOverlap[key].length;
                }
            }
    
            ans.push([theID, maxLength+1]); //___maybe -1
        } else {
            ans.push([theID, 0]);
        }
    }
  
    console.log("ans")
    console.log(ans)
    return ans;
  }


function findOverlappingTasks(tasks) {
const tasksOverlap = {};

for (let i = 0; i < tasks.length; i++) {
    for (let j = 0; j < tasks.length; j++) {
    if (i !== j) {
        const [idI, startI, endI] = tasks[i];
        const [idJ, startJ, endJ] = tasks[j];

        // Check for overlap
        if (startI < endJ && endI > startJ) {
        if (!tasksOverlap[idI]) {
            tasksOverlap[idI] = [idJ];
        } else {
            tasksOverlap[idI].push(idJ);
        }
        }
    }
    }
}
return tasksOverlap;
}

function calculateLeft(arr) // [["id", ]]
{
    let arrWithLeftOffset = []

    for (let element of arr){
        let theID = element[0]

        let taskWithID = document.getElementById(theID)
        let widthOfTaskString = taskWithID.style.width;
        let taskWidth = parseInt(widthOfTaskString.split("%"));

        console.log("LEFT: "+ theID + " | " + widthOfTaskString)

        if (taskWidth == 100){ //If not overlapping with anyone
            arrWithLeftOffset.push([theID, 0])
        } else { //Overlaps:
            arrWithLeftOffset.push([theID, Math.floor(Math.random() * (50 - 0 + 1)) + 0]) //__change
        }
    }

    return arrWithLeftOffset;
}