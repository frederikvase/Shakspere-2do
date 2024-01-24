var elements = [];
var path = []; // Path to selected list item

class ListElement
{
    constructor(name, path, type)
    {
        this.name = name;      
        this.path = path;
        this.type = type;

        this.opened = false;
    }
}

class Project extends ListElement
{
    constructor(name, path, date, content)
    {
        super(name, path, "project");

        // --- Projects ---
        this.date = date;
        this.content = content;
    }
}

class Task extends ListElement
{
    constructor(name, path, time)
    {
        super(name, path, "task");
        this.time = parseFloat(time);
    }
}

function reload()
{
    // Initialize undefined localStorage data
    if (typeof (Storage) !== "undefined") 
    {
        if (!localStorage.elements)
        {
            localStorage.elements = JSON.stringify(Array(0));
        }
    }

    elements = JSON.parse(localStorage.elements);

    for (let i = 0; i < elements.length; i++)
    {
        elements[i].time = getTime(elements[i]);

        let path = [i];
        setPath(elements[i], path);
    }

    localStorage.elements = JSON.stringify(elements);

    for (let i = 0; i < elements.length; i++)
    {
        document.getElementById("myUL").appendChild(getHTMLElement(elements[i]));
    }
}

function setPath(element, path)
{
    element.path = path;

    if (element.type === "task")
        return;

    for (let i = 0; i < element.content.length; i++)
    {
        let subElementPath = path.slice();
        subElementPath.push(i);

        setPath(element.content[i], subElementPath);
    }
}

function getTime(element)
{
    if (element.type === "task")
    {
        return element.time;
    }

    let time = 0;
    for (let i = 0; i < element.content.length; i++)
    {
        element.content[i].time = getTime(element.content[i]);
        time += element.content[i].time;
    }

    return time;
}

function getHTMLElement(element)
{
    let container = document.createElement("div");
    let table = document.createElement("table");
    
    if (element.type === "project")
    {
        table.className = "project";
    }
    else
    {
        table.className = "task";
    }
    
    
    let row = table.insertRow();
    document.getElementById("myUL").appendChild(table);
    
    // Display time in leftmost cell
    let time = row.insertCell();
    if (element.time > 0)
    {
        time.textContent = element.time + " minutes ";
        time.className = "elementText";
    }
    time.style.width = "15%"; 
    row.appendChild(time);

    // Display name in middle cell
    let text = row.insertCell();
    text.innerHTML = element.name + (element.opened || element.type == "task" || element.content.length === 0 ? "" : " <b>...</b>");
    text.style.width = "70%";
    row.appendChild(text);

    // Create a table cell for labour time
    let rightCell = row.insertCell();
    rightCell.style.width = "15%";
    rightCell.style.float = "left";
    row.appendChild(rightCell);

    // Append the row to the table
    table.appendChild(row);
    
    container.appendChild(table);

    if (element.type === "project")
    {
        let projectAdder = document.createElement("projectAdder");
        projectAdder.className = "addProject";
        projectAdder.onclick = function(event) 
        {
            event.stopPropagation();

            document.getElementById("AddProjectModal").style.display = "block";
            document.getElementById("projectAdder").onclick = function() {
                addProject(element);
            }
        };
        projectAdder.appendChild(document.createTextNode("Add Project"));
        table.appendChild(projectAdder);

        let taskAdder = document.createElement("taskAdder");
        taskAdder.className = "addTask";
        taskAdder.onclick = function(event) 
        {
            event.stopPropagation();
            
            path = element.path.slice();
            showTaskModal(element);
        };
        taskAdder.appendChild(document.createTextNode("Add Task"));
        table.appendChild(taskAdder);

        let content = document.createElement("table");
        content.className = "content";
        for (let i = 0; i < element.content.length; i++)
        {
            content.appendChild(getHTMLElement(element.content[i]));
        }
        container.appendChild(content);

        content.style.display = element.opened ? "block" : "none";

        table.onclick = function() 
        { 
            if (typeof element.content === "undefined" || element.content.length === 0)
                return;

            if (content.style.display === "block") 
            {
                element.opened = false;
                text.innerHTML = element.name + (element.opened || element.type == "task" || element.content.length === 0 ? "" : " <b>...</b>");
                content.style.display = "none";
            }
            else 
            {
                text.innerHTML = element.name;

                content.style.display = "block";
                element.opened = true;
            }
            localStorage.elements = JSON.stringify(elements);
        };
    }
        
    let span = document.createElement("span");
    span.className = "settingDots";
    span.innerHTML = "<b>&#8942</b>";
    span.onclick = function(event) 
    {
        event.stopPropagation();

        if (element.type === "project")
        {
            editProject(element);
            document.getElementById("deleteProject").onclick = function()
            {
                deleteSelectedItem();
            };
        }
        else
        {
            editTask(element);
            document.getElementById("deleteTask").onclick = function()
            {
                deleteSelectedItem();
            };
        }
    };
    table.appendChild(span);

    return container;
}

function deleteSelectedItem()
{
    let index = path.shift();

    if (path.length === 0)
    {
        elements.splice(index, 1);
    }
    else
    {        
        deleteListElement(path, elements[index]);
    }

    localStorage.elements = JSON.stringify(elements);
    location.reload();
}

function deleteListElement(path, element)
{
    let index = path.shift();
    console.log(path);

    if (path.length === 0)
    {
        console.log(element);

        element.content.splice(index, 1);
    }
    else
    {
        deleteListElement(path, element.content[index]);
    }
}

function getElementAtPath(elementPath)
{
    const index = elementPath.shift();
    return getElementFromContent(elements[index], elementPath);
}

function getElementFromContent(element, elementPath)
{
    if (elementPath.length == 0)
    {
        return element;
    }

    const index = elementPath.shift();
    return getElementFromContent(element.content[index], elementPath);
}