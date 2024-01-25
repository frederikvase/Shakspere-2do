var selectedItems = [];

class SideElement
{
    constructor(taskName, subtaskName, duration)
    {
        this.taskName       = taskName;         //String -> "English"
        this.subtaskName    = subtaskName;      //String -> "Introduction"  
        this.duration       = duration;         //String -> "1:00"

        // Set unique ID of sideElement
        this.uniqueID = 0;
        if (selectedItems.length !== 0)
        {
            this.uniqueID = selectedItems[selectedItems.length - 1].uniqueID + 1; 
        }
    }
}

function initSideBox()
{
    // Initialize undefined localStorage data
    if (typeof (Storage) !== "undefined") 
    {
        if (!localStorage.selectedItems)
        {
            localStorage.selectedItems = JSON.stringify(Array(0));
        }
    }
    selectedItems = JSON.parse(localStorage.selectedItems);

    for(let i = 0; i < selectedItems.length; i++)
    {
        displaySideElement(selectedItems[i]);
    }
}

function displaySideElement(item)
{
    let subtaskHolder = document.getElementById("todo-draggable");
    
    /* DIV: Container of item*/
    let thisSubtask = document.createElement("div");
    thisSubtask.classList.add("todo-item");
    thisSubtask.setAttribute("id", item.ID);

    subtaskHolder.appendChild(thisSubtask);

    /* 1st span: task- and subtask name */
    let taskName = document.createElement("span");
    taskName.classList.add("subtask-taskName");
    taskName.innerHTML = `${item.taskName} </br> <li>${item.subtaskName}</li> `;
    thisSubtask.appendChild(taskName);
    
    /* 2nd span: Duration */
    let taskDuration = document.createElement("span");
    taskDuration.classList.add("subtask-taskDuration");
    taskDuration.innerHTML = item.duration;
    thisSubtask.appendChild(taskDuration);
    
    /* 3rd span: empty */
    let taskTimeStartEnd = document.createElement("span");
    taskTimeStartEnd.classList.add("subtask-taskTimeStartEnd");
    thisSubtask.appendChild(taskTimeStartEnd);
}

function removeItemWithID(id)
{
    for (let i = 0; i < selectedItems.length; i++)
    {
        if (selectedItems[i].uniqueID === id)
        {
            selectedItems.splice(i, 1);
            localStorage.selectedItems = JSON.stringify(selectedItems);

            document.getElementsByClassName("todo-item")[i].remove();

            return;
        }
    }
}