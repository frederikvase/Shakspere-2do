var itemCount;
var projects;

class Project
{
    constructor(arr)
    {
        this.name = arr[0];
        this.time = parseFloat(arr[1]);
        this.date = arr[2];
    }
}

function reload()
{
    // Initialize undefined localStorage data
    if (typeof (Storage) !== "undefined") 
    {
        if (!localStorage.projects)
            localStorage.projects = "[]";
    }

    itemCount = JSON.parse(localStorage.projects).length;
    projects = [];
    
    for (let i = 0; i < itemCount; i++)
    {
        projects.push(JSON.parse(localStorage.projects)[i]);
        showItem(projects[i]);
    }

    // Delete closed list items
    let close = document.getElementsByClassName("close");
    for (let i = 0; i < close.length; i++)
    {
        let div = close[i].parentElement;
        const index = Array.from(div.parentNode.children).indexOf(div);

        close[i].onclick = function() 
        {
            list.remove(index); 
        } 
    }
}

function showItem(task)
{
    let table = document.createElement("table");
    let row = table.insertRow();
    document.getElementById("myUL").appendChild(table);

    // Display date in leftmost cell
    let leftCell = row.insertCell();
    leftCell.textContent = new Date(task.date).toLocaleDateString("en-GB");
    leftCell.style.width = "25%"; 
    row.appendChild(leftCell);

    // Display name in middle cell
    let middleCell = row.insertCell();
    middleCell.textContent = task.name;
    middleCell.style.width = "50%";
    row.appendChild(middleCell);

    // Create a table cell for labour time
    let rightCell = row.insertCell();
    rightCell.textContent = task.time;
    rightCell.style.width = "25%";
    row.appendChild(rightCell);
}

function createItem()
{
    let name = "Epic name"; // document.getElementById("name").value;
    let time = "100"; // document.getElementById("time").value;
    let date = "(Do)Due date"; // new Date(document.getElementById("date").value).toLocaleDateString("ne");

    if (name == '' || time == '' || date == '')
    {
        alert("Fill out the entire thing, you SAUCY boy!");
    }
    else if (typeof(Storage) !== "undefined")
    {
        const element = new Project([name, time, date]);

        // Add the new project to projects array
        projects.push(element);
        itemCount++;

        // Add new project to localStorage
        let copy = localStorage.projects != "" ? JSON.parse(localStorage.projects) : [];
        copy.push(element);
        localStorage.projects = JSON.stringify(copy);

        location.reload();
    }
}