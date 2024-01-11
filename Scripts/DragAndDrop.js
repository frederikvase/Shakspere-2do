let containsAllTasks = []
const todoDraggablePlace = document.getElementById('todo-draggable');
const calendarTasksPlace = document.querySelector('.calender-tasks');
// let alredyMadeTasks = JSON.parse(localStorage.getItem("tasks")) || [] // <- in Localstorage 
let allClassTasks = []

class newTaskClass{
    constructor(taskName, taskSubtaskName, taskDuration, taskPlacement, taskDone = false)
    {
        this.taskName           = taskName;         //String -> "English Essay"
        this.taskSubtaskName    = taskSubtaskName;  //String -> "Indledning"
        this.taskDuration       = taskDuration;     //String -> "1:30"
        this.taskPlacement      = taskPlacement     //Float -> 10  OR   -> string "11:30"
        this.taskDone           = taskDone          //true/false        


        if (typeof this.taskPlacement == 'string'){
            this.type = "school"
            this.startTime = this.taskPlacement
        } else {
            this.type = "project"
            this.startTime = addTwoHours(calculateProcentageIntoDuration(this.taskPlacement), allTimeStamps[allTimeStamps.length - 1][0])
        }
        
        this.top = calculateDurationIntoProcentage(subtractTwoHours(this.startTime, allTimeStamps[allTimeStamps.length - 1][0]))
        this.endTime =  addTwoHours(this.startTime, this.taskDuration) //String "10:30"
        this.height = calculateDurationIntoProcentage(taskDuration)

        this.showTask()
    }

    showTask(){
        const className = this.type == "school" ? "calender-tasks-school" : "calender-tasks-project"
        const thisTask = document.createElement("div")
        thisTask.classList.add(className);
        thisTask.style.position = 'absolute';

        thisTask.style.top = `${this.top}%`; 
        thisTask.style.height = `${this.height}%`;
        thisTask.style.border = `2px solid black`
        thisTask.style.zIndex = `2`
        calendarTasksPlace.appendChild(thisTask);


        //First thing inside thisTask
        const firstElement = document.createElement("span")
        firstElement.classList.add("calender-tasks-item-taskName")
        const textInnerHTML = this.type == "school" ? `${this.taskName}` : `${this.taskName}<br/><li>${this.taskSubtaskName}</li>` 
        firstElement.innerHTML = textInnerHTML;
        thisTask.appendChild(firstElement)
        
        //Secound thing inside thisTask
        const secoundElement = document.createElement("span")
        secoundElement.classList.add("calender-tasks-item-taskDuration")
        secoundElement.innerHTML = `${this.taskDuration.split(":")[0] > 0 ? this.taskDuration.split(":")[0] + ' h ' : ''}${this.taskDuration.split(":")[1]} m`;
        thisTask.appendChild(secoundElement)
        
        //Third thing inside thisTask
        const thirdElement = document.createElement("span")
        thirdElement.classList.add("calender-tasks-item-taskPeriod")
        thirdElement.innerHTML = `${this.startTime} - ${this.endTime}`;
        thisTask.appendChild(thirdElement)
       
        //Forth thing inside thisTask
        if(this.type != "school"){
            const forthElement = document.createElement("button")
            forthElement.classList.add("calender-tasks-item-button")
            // taskDone.addEventListener("click", () => deleteTaskOnClick(element[7]));
            forthElement.innerHTML = this.taskDone ? "J" : "X" // [6] forthElement
            thisTask.appendChild(forthElement)
        }

        // newTask.setAttribute("id", `${element[7]}`);
        // newTask.setAttribute("onmouseover", "checkElementId(event)");
        // newTask.setAttribute("draggable","true");
    }
}
new newTaskClass("Math", "", "1:00", "8:15")
new newTaskClass("Math", "", "1:00", "9:35")
new newTaskClass("Danish", "", "1:00", "10:45")
new newTaskClass("English", "", "1:00", "12:15")
new newTaskClass("Chemistry", "", "1:00", "13:25")
new newTaskClass("Chemistry", "", "1:00", "14:30")
let thisEntity = new newTaskClass("English Essay", "Introduction", "1:30", 0)




function calculateDurationIntoProcentage(duration){ //input: string "1:30" output: float 5
    let startTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][0]);
    let endTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]);
    let placementTimeStamp = converTimeIntoHours(duration);

    let placementProcentage = ((placementTimeStamp) / ((endTimeStamp+2) - startTimeStamp)) * 100;
    
    return placementProcentage;
}

function calculateProcentageIntoDuration(procentage) //Input: float 5 (%) -> output: string "1:30"
{
    let startTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][0]);
    let endTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]);

    let duration = (procentage/100)*((endTimeStamp+2) - startTimeStamp)

    return convertDecimalIntoHours(duration)
}

function convertDecimalIntoHours(decimal) //input float 22.5 ouput string "22:30"
{
    let min = ((decimal % 1)*60).toFixed(0);
    let hours = Math.floor(decimal)

    return min < 10 ?  `${hours}:0${min}` :  `${hours}:${min}`
}

function addTwoHours(one, two) //Input ("7:30", "2:30") -> ouput ("10:00")
{
    let totalNum = converTimeIntoHours(one) + converTimeIntoHours(two)
    return convertDecimalIntoHours(totalNum)
}
function subtractTwoHours(one,two) //input ("7:30", "2:30") -> ouput ("5:00")
{
    let totalNum = converTimeIntoHours(one) - converTimeIntoHours(two)
    return convertDecimalIntoHours(totalNum)
}




// console.log(alredyMadeTasks)
console.log(containsAllTasks)

// let containsAllTasks = []
//Contains: [[]]
//                       0         1                2                       3                4                        5                             6         7
//containsAllTasks.push([taskName, taskSubtaskName, taskDurationProcentage, taskDurationMin, taskPlacementProcentage, taskPlacementStartEndHourMin, taskDone, ID]);
//                       taskName  SubtaskName      height:                 amountMin        top:                     placementMinENDSTART         isTaskDone?  taskID


let mouseOver = null;

showCalendarTasks();


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

function checkElementId(event) {
    // Access the id property of the event target
    var elementId = event.target.id;
    mouseOver = elementId ? elementId : mouseOver;
    // Log the id to the console or do something else with it
    console.log("Mouse is over element with id:", elementId, mouseOver);
  }

function dragStart(event) {
    console.log("Start DRAG");
    const theDraggedID = event.target.id; //__ can be changed back/removed (look next line:)
    event.dataTransfer.setData('text/plain', theDraggedID); // event.dataTransfer.setData('text/plain', event.target.id);
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
    this.classList.remove("over");
}

function dragLeave() {
    console.log("Leave");
}

function dragDrop(event) {
    console.log("Drop");
    event.preventDefault();

    const draggedItemId = event.dataTransfer.getData('text/plain'); //Dragged ID
    const draggedItem = document.getElementById(draggedItemId); //HTML elements

    const theDraggedID = event.dataTransfer.getData('text/plain'); //Donsent work :( empty string in some cases
    const letID = theDraggedID;


    console.log("In drop -> ID: " + draggedItemId + " | Item: " + draggedItem + " | IDV2: " + letID)
    if (draggedItem) {
        console.log("Has been dropped and found. ID: " + draggedItemId + " | Item: " + draggedItem)
        // Place item based on y-axis
        const rect = this.getBoundingClientRect();
        const relativeY = event.clientY - rect.top; //mouse y-pos (relative to the calendar)
        let relativePercentage = (relativeY / rect.height) * 100;

        let val = parseFloat(calculatePlacement3(interval).split("%")[0]) 
        const remainder = relativePercentage % val
        relativePercentage -= remainder;
        
        const clone = draggedItem.cloneNode(true);
        clone.classList.remove("invisible", "hold");
        
        
        // Give item a height based on task duration.
        const secondSpanValue = clone.querySelector('.todo-item span:nth-child(2)').textContent;
        
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
            console.log(`Task Appended: -> "Task", "SubTask", ${calculateHeight(secondSpanValue)}, ${secondSpanValue}, ${relativePercentage}, ${timePeriod}, false, ${draggedItemId}`)
        }
        
        showCalendarTasks(containsAllTasks);
        isPlacedAtSameTime()
        
        draggedItem.parentNode.removeChild(draggedItem);
    }else { // ___ remake this whole else statement, using checkElementId() isnt reliable in the long run.
        // ID = mouseOver:
        console.log("Hello - here's the ID: " + mouseOver);
        if (mouseOver) { // Check if mouseOver has a valid value
            
            const rect = this.getBoundingClientRect();
            const relativeY = event.clientY - rect.top; //mouse y-pos (relative to the calendar)

            let relativePercentage = (relativeY / rect.height) * 100;
            let val = parseFloat(calculatePlacement3(interval).split("%")[0]) 
            const remainder = relativePercentage % val
            relativePercentage -= remainder;
    
            const draggedItem = document.getElementById(mouseOver);
    
            if (draggedItem) { // Check if the element with mouseOver ID exists
    
                const clone = draggedItem.cloneNode(true);
                clone.classList.remove("invisible", "hold");
    
                const secondSpan = clone.querySelector("span:nth-child(2)");
                const secondSpanValue = secondSpan ? secondSpan.textContent : '';
    
                let timePeriod = calculatePeriod(relativePercentage, secondSpanValue);
                const thirdSpan = clone.querySelector("span:nth-child(2)");
                if (thirdSpan) {
                    thirdSpan.textContent = timePeriod;
                }
    
                // Append the clone to the calendarTasksPlace
                calendarTasksPlace.appendChild(clone);
                
                // Make the clone draggable after it has been appended
                clone.draggable = true;
                clone.addEventListener("dragstart", dragStart);
                clone.addEventListener("dragend", dragEnd);
    
                //Add and remove from local-storage
                appendTasks("Task", "SubTask", calculateHeight(secondSpanValue), secondSpanValue, relativePercentage, timePeriod, false, `${mouseOver}1`);
                removeTask(mouseOver)

                isPlacedAtSameTime();
                showCalendarTasks(containsAllTasks);

                //remove previous element/task that was being dragged
                var element = document.getElementById(mouseOver);
                element.parentNode.removeChild(element);

            } else {
                alert("Element not found with ID: " + mouseOver);
            }
        } else {
            alert("try again!");
        }
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

function decimalToHoursAndMinutes(decimal)  // e.g. input: 7,5 -> output: "7:30"
{
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
    // let a = JSON.parse(localStorage.getItem("tasks"))
    // a.push([taskName, taskSubtaskName, taskDurationProcentage, taskDurationMin, taskPlacementProcentage, taskPlacementStartEndHourMin, taskDone, ID])
    // localStorage.setItem("tasks", a);
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
            if (elementBeingRemoved) {
                elementBeingRemoved.remove();
            }
            break; // exit the loop once the element is removed
        } 
    }
    console.log(containsAllTasks)
    showCalendarTasks();
    isPlacedAtSameTime()
}
function deleteTaskOnClick(ID){
    console.log("Task should be deleted: " + ID )
    removeTask(ID)
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
    
            newTask.setAttribute("id", `${element[7]}`);
            newTask.setAttribute("onmouseover", "checkElementId(event)");
            newTask.setAttribute("draggable","true");
            calendarTasksPlace.appendChild(newTask);
            
            //Placement of task:
            newTask.style.position = 'absolute';
            newTask.style.top = `${element[4]}%`; //value == relativePercentage == e.g. 46.5            == [4]taskPlacementProcentage
            newTask.style.height = element[2]; //value == calculateHeight(secondSpanValue) == "47.3%"   == 2[taskDurationProcentage]
            newTask.style.border = `2px solid black`
            newTask.style.zIndex = `2`

            //Structure of task: inside <div>newTask</div> 
                //<span> TaskName & Subtask </span>
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
                const taskDone = document.createElement("button")
                taskDone.addEventListener("click", () => deleteTaskOnClick(element[7]));
                //styles:
                taskDone.style.width = "20%"
                taskDone.style.height = "25px"
                taskDone.style.backgroundColor = "transparent"; 
                taskDone.style.color = "red"

                taskDone.innerHTML = element[6] ? "J" : "X" // [6] taskDone
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
    
            ans.push([theID, maxLength+1]);
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
    console.log("overlap")
    for (let key in tasksOverlap){
        console.log(tasksOverlap[key])
    }
    return tasksOverlap;
}

function calculateLeft(arr) // [["id", startTime, endTime ]]
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
            let thingsToAdd = [] // 2d array -> [["id1", left], ["id2", left]...]
            //thingsToAdd.push(taskWithID, 0);
            
            let allOverlaps = findOverlappingTasks(arr)
            let overlapsWithID; // contains overlap with id, e.g. ["id1", "id3", "id8"]
            
            for (let key in allOverlaps){
                if(key === theID){
                    overlapsWithID = allOverlaps[key];
                }
            }
            overlapsWithID.push(theID)

            let extraPush = 0
            console.log("overlapsWithID")
            console.log(overlapsWithID)
            for (let things of overlapsWithID){
                let thingsElement = document.getElementById(things)
                let thingsWidthString = thingsElement.style.width
                let thingsWidth = parseInt(thingsWidthString.split("%"))

                let overlappingLeft = 100 - (extraPush+thingsWidth+0.7)
               
                console.log(`if (${overlappingLeft} < ${taskWidth})`)
                if (overlappingLeft < taskWidth) {
                    //extraPush = 0;
                    //overlappingLeft = 100 - (extraPush + thingsWidth + 0.7);
                }
                if (overlappingLeft < 0){ 
                    overlappingLeft = 0;
                }

                extraPush += thingsWidth;

                console.log("Added: " + things + " | " + overlappingLeft)
                thingsToAdd.push([things, overlappingLeft])
            }
            

            //Add to final arr
            for (let l of thingsToAdd)
            {
                let inFinalArray = false
                for (let m of arrWithLeftOffset)
                {
                    if(l[0] == m[0])
                    {
                        inFinalArray = true;
                    }
                }
                if (!inFinalArray){
                    arrWithLeftOffset.push([l[0], l[1]]);
                }
            }
        }
    }

    return arrWithLeftOffset;
}