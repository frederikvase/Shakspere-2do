function editTask(task)
{
    document.getElementById("EditTaskModal").style.display = "block";
    path = task.path;
}

document.getElementById("closeTaskModal").onclick = function() 
{
    document.getElementById("AddTaskModal").style.display = "none";
}

document.getElementById("closeEditTaskModal").onclick = function()
{
    document.getElementById("EditTaskModal").style.display = "none";
}

function showTaskModal(parent)
{
    let modal = document.getElementById("AddTaskModal");
    modal.style.display = "block";

    selectedTaskParent = parent;
}

function addTask()
{
    let name = document.getElementById("taskName").value;
    let time = document.getElementById("taskTime").value;

    if (name == '')
    {
        alert("Please fill out a name for the project!");
        return;
    }
    
    if (!time)
    {
        alert("Please fill out a time for the project!");
        return;
    }

    let modal = document.getElementById("AddTaskModal");
    modal.style.display = "none";
    
    if (typeof(Storage) !== "undefined")
    {
        let parent = getElementAtPath(path.slice());
        path.push(parent.content.length);
        parent.content.push(new Task(name, path.slice(), time));

        localStorage.elements = JSON.stringify(elements);
        location.reload();
    }
}