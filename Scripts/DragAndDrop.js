let containsAllTasks = []
const todoDraggablePlace = document.getElementById('todo-draggable');
const calendarTasksPlace = document.querySelector('.calender-tasks');

let allClassTasks = JSON.parse(localStorage.getItem("shown-tasks")) || [];
let giveSchoolID = 1 

class newTaskClass{
    constructor(taskName, taskSubtaskName, taskDuration, taskPlacement, date = `${dayNumber}-${month}-${year}`, taskDone = false, )
    {
        this.taskName           = taskName;         //String -> "English Essay"
        this.taskSubtaskName    = taskSubtaskName;  //String -> "Indledning"
        this.taskDuration       = taskDuration;     //String -> "1:30"
        this.taskPlacement      = taskPlacement;    //Float -> 10  OR   -> string "11:30"
        this.taskDone           = taskDone;         //true/false   
        this.date               = date;             //String "dd-mm-yy" -> "31-12-2024"
        //ID = task-project-3 OR task-school-2
        //type = "school" OR "project"
        
        if (typeof this.taskPlacement == 'string') {
            this.type = "school";
            this.startTime = this.taskPlacement;

            // Remove old school tasks with the same taskName
            allClassTasks = allClassTasks.filter(task =>
                !(task.type === "school" && task.taskName === this.taskName)
            );

            this.ID = `task-${this.type}-${giveSchoolID}`;
            giveSchoolID++;
        } else {
            this.type = "project";
            this.startTime = addTwoHours(calculateProcentageIntoDuration(this.taskPlacement), allTimeStamps[allTimeStamps.length - 1][0]);
            
            //ID should be one higher than the current largest.
            let currentNum = 0;
            for (const key in allClassTasks){
                const theTask = allClassTasks[key]
                if(parseInt(theTask.ID.split("-")[2]) > currentNum && theTask.type == "project"){
                    currentNum = parseInt(theTask.ID.split("-")[2])
                }
            }
            let theProjectNumID = currentNum || 0
            theProjectNumID ++;

            this.ID = `task-${this.type}-${theProjectNumID}`;
        }
        
        this.top = calculateDurationIntoProcentage(subtractTwoHours(this.startTime, allTimeStamps[allTimeStamps.length - 1][0]))
        this.endTime =  addTwoHours(this.startTime, this.taskDuration) //String "10:30"
        this.height = calculateDurationIntoProcentage(taskDuration)

        //___ Maybe make sure the same id cant be there twice (Dosent work properly tho)
        let doesItCurrentlyHaveThisTask = false;
        for (let key in allClassTasks){
            if (allClassTasks[key].ID === this.ID){
                // doesItCurrentlyHaveThisTask = true
            }
        }
        if (!doesItCurrentlyHaveThisTask )
        {
            allClassTasks.push({ID : this.ID,                           taskName: this.taskName,                taskSubtaskName: this.taskSubtaskName,          taskDuration : this.taskDuration,
                                taskPlacement : this.taskPlacement,     taskDone : this.taskDone,               type : this.type,                               height : this.height,
                                startTime : this.startTime,             endTime : this.endTime,                 top : this.top,                                 date : this.date})
            updateLocalStorage();
            showAllTasks();
            isPlacedAtSameTimeButForClasses();
            updateVisibleSpans();
        }
    }
}

new newTaskClass("Math", "", "1:00", "8:15")
new newTaskClass("Math", "", "1:00", "9:35")
// new newTaskClass("Physics", "", "2:30", "10:30")
new newTaskClass("Danish", "", "1:00", "10:45")
new newTaskClass("English", "", "1:00", "12:15")
new newTaskClass("Chemistry", "", "1:00", "13:25")
new newTaskClass("Chemistry", "", "1:00", "14:30")
// let thisEntity = new newTaskClass("Kav a Essay", "Introduction", "1:30", 75)

showAllTasks();
isPlacedAtSameTimeButForClasses();
console.log(allClassTasks)

function deleteTask(ID, arr = allClassTasks) {
    for (let index = 0; index < arr.length; index++) 
    {
        const task = arr[index];
        if (task.ID == ID) {
            arr.splice(index, 1);
            updateLocalStorage();

            var element = document.getElementById(ID);
            element.parentNode.removeChild(element);   
            
            // showAllTasks();
            isPlacedAtSameTimeButForClasses();
            updateVisibleSpans();
            break; // Once the task is found and removed, exit the loop
        }
    }
    console.log(allClassTasks)
}

function updateLocalStorage(arr = allClassTasks){
    localStorage.setItem("shown-tasks", JSON.stringify(arr))
}

function showAllTasks(arr = allClassTasks) 
{
    for (const key in arr) 
    {
        if (arr.hasOwnProperty(key)) 
        {
            const taskVal = arr[key];
            const element = document.getElementById(taskVal.ID);
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    }

    // console.log("Tasks BEING shown");

    for (const key in arr) {
        if (arr.hasOwnProperty(key)) 
        {
            const task = arr[key];
            const placedElement = document.getElementById("element-id");

            if (!placedElement) 
            {
                const className = task.type === "school" ? "calender-tasks-school" : "calender-tasks-project";
                const thisTask = document.createElement("div");
                thisTask.setAttribute("id", `${task.ID}`);

                thisTask.addEventListener("click", () => onPress(true, thisTask));
                
                if(className == "calender-tasks-project"){
                    thisTask.setAttribute("onmouseover", "checkElementId(event)");
                    thisTask.setAttribute("draggable","true");
                }
                thisTask.classList.add(className);
                thisTask.style.position = 'absolute';

                thisTask.style.top = `${task.top}%`;
                thisTask.style.height = `${task.height}%`;
                // thisTask.style.border = `2px solid black`;
                thisTask.style.zIndex = `2`;
                calendarTasksPlace.appendChild(thisTask);

                
                const thisDropLocation = document.getElementById(task.date);
                if (thisDropLocation) {
                    // thisTask.setAttribute('task-date', '18-1-2024');
                    thisDropLocation.appendChild(thisTask);
                } else {
                    console.error("Element with class 'calendar-view-day-droplocation' not found");
                }

                const firstElement = document.createElement("span");
                firstElement.classList.add("calender-tasks-item-taskName");
                const textContent = task.type === "school" ? `${task.taskName}` : `${task.taskName} / ${task.taskSubtaskName}`;
                firstElement.textContent = textContent;
                thisTask.appendChild(firstElement);
                
                const thirdElement = document.createElement("span");
                thirdElement.classList.add("calender-tasks-item-taskPeriod");
                thirdElement.textContent = `${task.startTime} - ${task.endTime}`;
                thisTask.appendChild(thirdElement);
                
                
                const secondElement = document.createElement("span");
                secondElement.classList.add("calender-tasks-item-taskDuration");
                secondElement.textContent = `${task.taskDuration.split(":")[0] > 0 ? task.taskDuration.split(":")[0] + ' h ' : ''}${task.taskDuration.split(":")[1]} m`;
                thisTask.appendChild(secondElement);


                if (task.type !== "school") {
                    const fourthElement = document.createElement("button");
                    fourthElement.classList.add("calender-tasks-item-button");
                    fourthElement.addEventListener("click", (event) => {
                        deleteTask(task.ID);
                        event.stopPropagation();
                        onPress(false);
                    });                    fourthElement.textContent = task.taskDone ? "J" : "X";
                    thisTask.appendChild(fourthElement);
                }
            }
        }
    }
}

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
function returnArrayWithIDStartAndEndTime(arr = allClassTasks) //some arr with object that has ID, startTime -> "10:00" and endTime -> "11:30"
{
    //returns = [["id", float startTime1, float endTime1],["id", float startTime2,  float endTime2]...]
    //Can be used as input to: findOverlappingTasks(tasks) && calculateLeft(arr)
    let returnValues = []
    for (let key in arr)
    {
        const task = arr[key];

        let numStartTime = converTimeIntoHours(task.startTime);
        let numEndTime = converTimeIntoHours(task.endTime);

        returnValues.push([task.ID, numStartTime, numEndTime]);
    }
    return returnValues;
}

let mouseOver = null;

calendarTasksPlace.addEventListener("dragover", dragOver);
calendarTasksPlace.addEventListener("dragenter", dragEnter);
calendarTasksPlace.addEventListener("dragleave", dragLeave);
calendarTasksPlace.addEventListener("drop", dragDrop);

function checkElementId(event) {
    // Access the id of the event target
    var elementId = event.target.id;
    mouseOver = elementId ? elementId : mouseOver;
    // console.log("Mouse is over element with id:", elementId, mouseOver);
  }

function dragStart(event) {
    console.log("Start DRAG");
    const theDraggedID = event.target.id; 
    event.dataTransfer.setData('text/plain', theDraggedID); 
    this.classList.add("hold");
    setTimeout(() => (this.classList.add("invisible")), 0);
}

function dragEnd() {
    console.log("END DRAG");
    this.classList.remove("invisible", "hold");
}

let droppedInsideID;
function dragOver(event) {
    console.log("OVER" + event);
    droppedInsideID = (event.toElement.id) || `${dayNumber}-${month}-${year}`; //___Secound part might need to be deleted
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

    if (draggedItem) 
    {
        // Place item based on y-axis
        const rect = this.getBoundingClientRect();
        const relativeY = event.clientY - rect.top; //mouse y-pos (relative to the calendar)
        let relativePercentage = (relativeY / rect.height) * 100;

        let val = parseFloat(calculatePlacement3(interval).split("%")[0]) 
        const remainder = relativePercentage % val
        relativePercentage -= remainder;
        
        //Add changes to clone
        const clone = draggedItem.cloneNode(true);
        clone.classList.remove("invisible", "hold");
        
        //get values from spans:
        const originalSubtaskName = draggedItem.querySelector('.subtask-taskName li').textContent;
        const originalTaskName = draggedItem.querySelector('.subtask-taskName').textContent.replace(originalSubtaskName, '').trim()
        const spanTaskDuration = clone.querySelector('.subtask-taskDuration').textContent;
        

        droppedInsideID
        draggedItem.parentNode.removeChild(draggedItem);
        new newTaskClass(originalTaskName, originalSubtaskName, spanTaskDuration, relativePercentage,droppedInsideID)
        
    }else { // ___ remake this whole else statement, using checkElementId() and mouseOver isnt reliable in the long run.
        if (mouseOver)  // ID = mouseOver:
        { // Check if mouseOver has a valid value
            
            // Place item based on y-axis
            const rect = this.getBoundingClientRect();
            const relativeY = event.clientY - rect.top; //mouse y-pos (relative to the calendar)

            let relativePercentage = (relativeY / rect.height) * 100;
            let val = parseFloat(calculatePlacement3(interval).split("%")[0]) 
            const remainder = relativePercentage % val
            relativePercentage -= remainder;
    
            const draggedItem = document.getElementById(mouseOver);
    
            if (draggedItem) // Check if the element with mouseOver ID exists
            { 
               
                //Get values from dragged item, and add a new one (use relativePercentage as new input)
                for (key in allClassTasks)
                {
                    const task = allClassTasks[key]
                    if (task.ID == mouseOver)
                    {
                        new newTaskClass(task.taskName, task.taskSubtaskName, task.taskDuration, relativePercentage, droppedInsideID)
                        console.log(`${task.taskName}, ${task.taskSubtaskName}, ${task.taskDuration}, ${relativePercentage}, ${droppedInsideID}`)
                    }
                }
                
                //remove previous element/task that was being dragged
                updateVisibleSpans();
                deleteTask(mouseOver)
                updateVisibleSpans();

            } else {
                alert("Element not found with ID: " + mouseOver);
            }
        } else {
            alert("try again!");
        }
    }
}

function findNeighboursOtOnce(arr)
{
    let ans = [];
  
    const overlappingRoundOne = findOverlappingTasks(arr);
    // console.log("overlappingRoundOne")
    // console.log(overlappingRoundOne)
    // console.log("Other")
  
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
            // console.log("overlappingTimesTwo", theID)
            // console.log(overlappingTimesTwo)
    
            let overlapOfOverlap = findOverlappingTasks(overlappingTimesTwo);
            // console.log(overlapOfOverlap)
            let maxLength = 0;
    
            for (let key of Object.keys(overlapOfOverlap)) {
                if (overlapOfOverlap[key].length > maxLength) {
                    // console.log(theID + " | " + overlapOfOverlap[key].length)
                    maxLength = overlapOfOverlap[key].length;
                }
            }
    
            ans.push([theID, maxLength+1]);
        } else {
            ans.push([theID, 0]);
        }
    }
  
    // console.log("ans")
    // console.log(ans)
    return ans;
  }

function calculateLeft(arr) // [["id", startTime, endTime ]]
{
    let arrWithLeftOffset = []

    for (let element of arr){
        let theID = element[0]

        let taskWithID = document.getElementById(theID)
        let widthOfTaskString = taskWithID.style.width;
        let taskWidth = parseInt(widthOfTaskString.split("%"));

        // console.log("LEFT/THE WIDTH?: "+ theID + " | " + widthOfTaskString)

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
            // console.log("overlapsWithID")
            // console.log(overlapsWithID)
            for (let things of overlapsWithID){
                let thingsElement = document.getElementById(things)
                let thingsWidthString = thingsElement.style.width
                let thingsWidth = parseInt(thingsWidthString.split("%"))

                let overlappingLeft = 100 - (extraPush +thingsWidth/*+0.7*/)
               
                // console.log(`if (${overlappingLeft} < ${taskWidth})`)
                if (overlappingLeft < taskWidth) {
                    //extraPush = 0;
                    //overlappingLeft = 100 - (extraPush + thingsWidth + 0.7);
                }
                if (overlappingLeft < 0){ 
                    overlappingLeft = 0;
                }

                extraPush += thingsWidth;

                // console.log("Added: " + things + " | " + overlappingLeft)
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
    // console.log(arrWithLeftOffset)
    return arrWithLeftOffset;
}

function isPlacedAtSameTimeButForClasses(arr = allClassTasks){
    let taskTimes = []

    // Find tasks that occur at the same time
    for (let i = 0; i < arr.length; i++) 
    {
        const taskObj = arr[i]
        let beginningOfTask = parseInt(taskObj.startTime.split(":")[0] + taskObj.startTime.split(":")[1])
        let endingOfTask = parseInt(taskObj.endTime.split(":")[0] + taskObj.endTime.split(":")[1])
        taskTimes.push([taskObj.ID, beginningOfTask, endingOfTask]);
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
        changeTask.style.left = `${element[1]-1}%`
    }

    updateProjectVerticalPosition();
}

function updateProjectVerticalPosition(arr = allClassTasks) {
    for (let key in arr) {
        const task = arr[key];
        if (task.type === "project") {
            const changeTask = document.getElementById(task.ID);

            const newTop = calculateDurationIntoProcentage(subtractTwoHours(task.startTime, allTimeStamps[allTimeStamps.length - 1][0]));
            changeTask.style.top = `${newTop}%`;

            const newHeight = calculateDurationIntoProcentage(task.taskDuration);
            changeTask.style.height = `${newHeight}%`;
        }
    }
}

function findOverlappingTasks(tasks) //input const tasks = [["id", float startTime1, float endTime1],["id", startTime2, endTime2]...]
{
    const tasksOverlap = {};
  
    for (let i = 0; i < tasks.length; i++) 
    {
        for (let j = 0; j < tasks.length; j++) 
        {
            if (i !== j) 
            {
                const [idI, startI, endI] = tasks[i];
                const [idJ, startJ, endJ] = tasks[j];

                // Check for overlap
                if (startI < endJ && endI > startJ) 
                {
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

function updateVisibleSpans() {
    var containers = document.querySelectorAll('.calender-tasks-project');

    containers.forEach(function (container) {
        var spans = container.querySelectorAll('span');
        var containerWidth = container.clientWidth;

        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';

        var totalSpanWidth = 0;

        spans.forEach(function (span, i) {
            // Calculate total width of already visible spans
            totalSpanWidth += span.clientWidth;

            // Always make the taskName visible
            if (i === 0) {
                span.style.visibility = 'visible';
                span.style.position = 'static';

                // Adjust font size to fit the span if it's wider than the container
                while (span.clientWidth > containerWidth - 2) {
                    var fontSize = parseFloat(window.getComputedStyle(span).fontSize);
                    span.style.fontSize = (fontSize - 1) + 'px';
                }
            } else {
                // Show taskPeriod if there's more space
                if (i === 2 && containerWidth >= totalSpanWidth) {
                    span.style.visibility = 'visible';
                    span.style.position = 'static';
                } else if (i === 3 && containerWidth >= totalSpanWidth) {
                    // Show the remove button if there's even more space
                    span.style.visibility = 'visible';
                    span.style.position = 'static';
                } else if (i === 1 && containerWidth >= totalSpanWidth) {
                    // Show taskDuration if there's even more more space
                    span.style.visibility = 'visible';
                    span.style.position = 'static';
                } else {
                    // Hide the span and position it absolutely if space is limited
                    span.style.visibility = 'hidden';
                    span.style.position = 'absolute';
                }
            }
        });

        // Set the visibility and position of the remove button (4th span) like the others
        var removeButton = container.querySelector('button');
        if (removeButton) {
            if (spans.length >= 2 && containerWidth >= totalSpanWidth) {
                removeButton.style.visibility = 'visible';
                removeButton.style.position = 'static';
            } else {
                removeButton.style.visibility = 'hidden';
                removeButton.style.position = 'absolute';
            }
        }
    });
}

updateVisibleSpans();