let allSubtasks = [];

class SubTask{
    constructor(taskName, subtaskName, duration)
    {
        this.taskName       = taskName          //String -> "English"
        this.subtaskName    = subtaskName       //String -> "Introduction"  
        this.duration       = duration          //String -> "1:00"
        //this.ID                               //String -> "task-num-3"

        let heighestValue = 0;
        for (let key in allSubtasks){
            const tasks = allSubtasks[key];
            if (parseInt(tasks.ID.split("-")[2]) > heighestValue ){
                heighestValue = parseInt(tasks.ID.split("-")[2])
            }
        }
        this.ID = `task-num-${heighestValue +1}`

        // only adds if ID not in localStorage
        let idAlredyTaken = allSubtasks.some(task => task.ID === this.ID);
        if (!idAlredyTaken)
        {
            allSubtasks.push(
                {ID : this.ID,
                taskName : this.taskName,
                subtaskName : this.subtaskName,
                duration : this.duration}
            )
        }
        this.showSubtask();
    }

    showSubtask()
    {
        let subtaskHolder = document.getElementById("todo-draggable");
        
        /* DIV: Container of item*/
        let thisSubtask = document.createElement("div");
        thisSubtask.classList.add("todo-item");
        thisSubtask.setAttribute("id", this.ID)
        thisSubtask.setAttribute("draggable", "true")
        thisSubtask.addEventListener("dragstart", dragStart);
        thisSubtask.addEventListener("dragend", dragEnd);
        thisSubtask.setAttribute("onmouseover", "checkElementId(event)");

        subtaskHolder.appendChild(thisSubtask)

        /* 1st span: task- and subtask name */
        let taskName = document.createElement("span")
        taskName.classList.add("subtask-taskName")
        taskName.innerHTML = `${this.taskName} </br> <li>${this.subtaskName}</li> `
        thisSubtask.appendChild(taskName)
        
        /* 2nd span: Duration */
        let taskDuration = document.createElement("span")
        taskDuration.classList.add("subtask-taskDuration")
        taskDuration.innerHTML = this.duration
        thisSubtask.appendChild(taskDuration)
        
        
        /* 3rd span: empty */
        let taskTimeStartEnd = document.createElement("span")
        taskTimeStartEnd.classList.add("subtask-taskTimeStartEnd")
        thisSubtask.appendChild(taskTimeStartEnd)
    }
}

//Subtask being shown: __Should be loaded from localStorage (Frederik's Part)
let draggableItems = [
    {taskName : "Example Task Name",    subtaskName : "Important task",     duration : "1:00"},
    {taskName : "Another Task",         subtaskName : "Important Too!",     duration : "2:00"},
    {taskName : "Another Task",         subtaskName : "Important Too!",     duration : "2:00"},
    {taskName : "Example Task Name",    subtaskName : "Important task",     duration : "1:00"},
    {taskName : "Example Task Name",    subtaskName : "Important task",     duration : "1:00"},
    {taskName : "Another Task",         subtaskName : "Important Too!",     duration : "2:00"}
];

for (let i = 0; i < draggableItems.length; i++) {
    new SubTask(draggableItems[i].taskName, draggableItems[i].subtaskName, draggableItems[i].duration);
}
