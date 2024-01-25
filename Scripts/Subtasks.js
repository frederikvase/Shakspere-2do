let allSubtasks = [];
let showTasks = false;

let addSubtasks = [] //new prop delete this one!

class SubTask{
    constructor(taskName, subtaskName, duration)
    {
        this.taskName       = taskName;         //String -> "English"
        this.subtaskName    = subtaskName;      //String -> "Introduction"  
        this.duration       = duration;         //String -> "1:00"
        //this.ID                               //String -> "task-num-3"

        let heighestValue = 0;
        for (let key in allSubtasks){
            const tasks = allSubtasks[key];
            if (parseInt(tasks.ID.split("-")[2]) > heighestValue ){
                heighestValue = parseInt(tasks.ID.split("-")[2]);
            }
        }
        this.ID = `task-num-${heighestValue +1}`;

        // only adds if ID not in localStorage
        let idAlredyTaken = allSubtasks.some(task => task.ID === this.ID);
        if (!idAlredyTaken)
        {
            allSubtasks.push(
                {ID : this.ID,
                taskName : this.taskName,
                subtaskName : this.subtaskName,
                duration : this.duration}
            );
        }
        // this.showSubtask();
    }

    showSubtask()
    {
        let subtaskHolder = document.getElementById("todo-draggable");
        
        /* DIV: Container of item*/
        let thisSubtask = document.createElement("div");
        thisSubtask.classList.add("todo-item");
        thisSubtask.setAttribute("id", this.ID);
        thisSubtask.setAttribute("draggable", "true");
        thisSubtask.addEventListener("dragstart", dragStart);
        thisSubtask.addEventListener("dragend", dragEnd);
        // thisSubtask.setAttribute("onmouseover", "checkElementId(event)");

        subtaskHolder.appendChild(thisSubtask);

        /* 1st span: task- and subtask name */
        let taskName = document.createElement("span");
        taskName.classList.add("subtask-taskName");
        taskName.innerHTML = `${this.taskName} </br> <li>${this.subtaskName}</li> `;
        thisSubtask.appendChild(taskName);
        
        /* 2nd span: Duration */
        let taskDuration = document.createElement("span");
        taskDuration.classList.add("subtask-taskDuration");
        taskDuration.innerHTML = this.duration;
        thisSubtask.appendChild(taskDuration);
        
        
        /* 3rd span: empty */
        let taskTimeStartEnd = document.createElement("span");
        taskTimeStartEnd.classList.add("subtask-taskTimeStartEnd");
        thisSubtask.appendChild(taskTimeStartEnd);
    }
}

//Subtask being shown: __Should be loaded from localStorage (Frederik's Part)
//Tasknames can't contain "/" since that's being used to .split("/") in function onPress()
let draggableItems = [
    {taskName : "English Essay",        subtaskName : "Introduction",           duration : "0:45"},
    {taskName : "Math - Functions",     subtaskName : "KAP 9",                  duration : "1:30"},
    {taskName : "Math - Functions",     subtaskName : "KAP 10",                 duration : "2:00"},
    {taskName : "Danish Assignment",    subtaskName : "Discussion",             duration : "2:30"},
    {taskName : "Programming",          subtaskName : "View multiple days",     duration : "4:00"},
    {taskName : "Blah",                 subtaskName : "View multiple days",     duration : "4:00"},
    {taskName : "BlAH Blah",            subtaskName : "View multiple days",     duration : "4:00"},
];



function updateSubtaskView()
{
    for (let i = 0; i < draggableItems.length; i++) {
        addSubtasks.push(new SubTask(draggableItems[i].taskName, draggableItems[i].subtaskName, draggableItems[i].duration));
    }

    shownELements = [];
    //Only show subtasks, that are not placed!    
    let allItemsDuplicate = JSON.parse(localStorage.getItem("all-tasks")) || [];
    for (let i = 0; i<addSubtasks.length; i++){
        shouldBeShown = true;
        console.log("NEW PART");
        for (let key in allItemsDuplicate){
            task = allItemsDuplicate[key];
    
            console.log(`if ${task.IDFromSubtask} ==  ${addSubtasks[i].ID}`)
            if(task.IDFromSubtask == addSubtasks[i].ID){
                shouldBeShown = false;
                console.log("-----THEN FALSE")
            }
        }
    
        if (shouldBeShown){
            console.log("----TRUTH: Following should be shown")
            // addSubtasks[i].showSubtask();
            shownELements.push(addSubtasks[i])
            console.log(addSubtasks[i]);
        }
    
        //Update layout___
    }
    console.log(shownELements)
    for(let obj in shownELements){
        shownELements[obj].showSubtask();
    }
}

updateSubtaskView();


const viewMore = document.getElementsByClassName("task-view-more-info");
viewMore[0].addEventListener("click", () => onPress(false));

//When clicked on button "Add another task" -> redirect to another page.
// const viewTasks = document.getElementsByClassName("task-view-dragAndDrop")
// viewTasks[0].addEventListener("click", () => onPress(showTasks));

onPress(showTasks);

function onPress(valueShowViewMore, element = null)
{        
    const viewMore = document.getElementsByClassName("task-view-more-info")[0];
    const draggedMore = document.getElementsByClassName("task-view-dragAndDrop")[0];
    removeClassFromAllElements("calendar-clicked-element");

    if(valueShowViewMore)
    {
        viewMore.style.display = "block";
        draggedMore.style.display = "none";

        if(element)
        {
            // console.log(element);
            const clickedELement = document.getElementById(element.id);
            clickedELement.classList.add("calendar-clicked-element");

            let viewMoreTask = document.getElementsByClassName("view-task")[0];
            viewMoreTask.innerHTML = '';
            
            // console.log(element);
            const shownTaskName = element.getElementsByClassName('calender-tasks-item-taskName')[0].textContent;
            const shownTaskDuration = element.getElementsByClassName('calender-tasks-item-taskDuration')[0].textContent;
            const shownTaskPeriod = element.getElementsByClassName('calender-tasks-item-taskPeriod')[0].textContent;
            
            let info = document.createElement("div");
            info.classList.add("calendar-task-more-info");
            
            const containsAllItsClasses = element.classList;

            if (containsAllItsClasses.contains("calender-tasks-school")) {
                // info.innerHTML = `Subject: ${shownTaskName} <br/>Duration: ${shownTaskDuration} <br/>Period: ${shownTaskPeriod} `;
                
                const groupTaskName = document.createElement("div");
                groupTaskName.innerHTML = shownTaskName;
                groupTaskName.classList.add("calendar-groupTaskName-school");
                info.appendChild(groupTaskName);
                
            } else if (containsAllItsClasses.contains("calender-tasks-project")) {
                let actualTaskName = shownTaskName.split("/")[0];
                let actualSubtaskName = shownTaskName.split("/")[1];

                const groupTaskName = document.createElement("div") ;
                groupTaskName.innerHTML = actualTaskName;
                groupTaskName.classList.add("calendar-groupTaskName-project");
                info.appendChild(groupTaskName);

                const groupSubtaskName = document.createElement("div");
                groupSubtaskName.classList.add("calendar-groupSubtaskName");
                groupSubtaskName.innerHTML = actualSubtaskName;
                info.appendChild(groupSubtaskName);
            }

            const groupTaskDuration = document.createElement("div");
            groupTaskDuration.classList.add("calendar-groupTaskDuration");
            groupTaskDuration.innerHTML = `Duration: ${shownTaskDuration}`;
            info.appendChild(groupTaskDuration);
            
            const groupTaskPeriod = document.createElement("div");
            groupTaskPeriod.classList.add("calendar-groupTaskPeriod");
            groupTaskPeriod.innerHTML = `Period: ${shownTaskPeriod}`;
            info.appendChild(groupTaskPeriod);

            if(containsAllItsClasses.contains("calender-tasks-project")){
                const groupButton = document.createElement("button")
                groupButton.classList.add("calender-tasks-item-button-subtask-view");
                groupButton.innerText = "Delete task"
                groupButton.addEventListener("click", () => {
                    onPress(false);

                    //View-days
                    console.log("UHUNUWHCUBdHCHUCHUCDUCUDCNDUNUCN");
                    deleteTask(element.id, allItems);
                    displayAllTasks();

                    // localStorage.setItem("all-tasks", JSON.stringify(allItems))
                })
                info.appendChild(groupButton);
            }

            viewMoreTask.appendChild(info);    
        }
    } else{
        viewMore.style.display = "none";
        draggedMore.style.display = "block";
    }
}


function removeClassFromAllElements(classname){
    var elements = document.getElementsByClassName(classname);

    for(var i = 0; i < elements.length; i++) {
        elements[i].classList.remove(classname);
    }
}
