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

        this.checked = -1;
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

    initSideBox();
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
    container.className = "container";
    
    let table = getTextTable(element);
    
    container.appendChild(table);

    if (element.type === "project")
    {
        table.appendChild(getProjectAdder(element));
        table.appendChild(getTaskAdder(element));

        let content = getContent(element);
        container.appendChild(content);

        table.onclick = function() 
        { 
            if (typeof element.content === "undefined" || element.content.length === 0)
                return;

            let text = table.rows.item(0).cells.item(1);

            if (element.opened) 
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
    else
    {
        let checkmark = document.createElement("span");
        checkmark.className = (element.checked !== -1) ? "checked" : "unchecked";

        checkmark.onclick = function(event)
        {
            event.stopPropagation();
            checkmark.className = (checkmark.className === "unchecked") ? "checked" : "unchecked";

            if (element.checked === -1)
            {
                selectItem(element);
                element.checked = selectedItems[selectedItems.length - 1].uniqueID;
            }
            else
            {
                removeItemWithID(element.checked);
                element.checked = -1;
            }

            localStorage.elements = JSON.stringify(elements);
        }

        table.appendChild(checkmark);
    }
    
    table.appendChild(settingDots(element));

    return container;
}

function getTextTable(element)
{
    let table = document.createElement("table");
    
    let row = table.insertRow();
    document.getElementById("myUL").appendChild(table);
    
    let time = row.insertCell();
    if (element.time > 0)
    {
        time.textContent = element.time + " min ";
        time.className = "elementText";
    }
    time.style.width = "30%"; 
    row.appendChild(time);

    let text = row.insertCell();
    text.innerHTML = element.name + (element.opened || element.type == "task" || element.content.length === 0 ? "" : " <b>...</b>");
    text.style.width = "40%";
    row.appendChild(text);

    let rightCell = row.insertCell();
    rightCell.style.width = "40%";
    rightCell.style.float = "left";
    row.appendChild(rightCell);

    table.appendChild(row);

    if (element.type === "project")
    {
        table.className = "project";
    }
    else
    {
        table.className = "task";
    }

    return table;
}

function getProjectAdder(project)
{
    let projectAdder = document.createElement("projectAdder");
    projectAdder.className = "addProject";
    projectAdder.onclick = function(event) 
    {
        event.stopPropagation();

        document.getElementById("AddProjectModal").style.display = "block";
        document.getElementById("projectAdder").onclick = function() {
            addProject(project);
        }
    };
    projectAdder.appendChild(document.createTextNode("Add Project"));

    return projectAdder;
}

function getTaskAdder(project)
{
    let taskAdder = document.createElement("taskAdder");
    taskAdder.className = "addTask";
    taskAdder.onclick = function(event) 
    {
        event.stopPropagation();

        path = project.path.slice();
        showTaskModal(project);
    };
    taskAdder.appendChild(document.createTextNode("Add Task"));

    return taskAdder;
}

function getContent(element)
{
    let content = document.createElement("table");
    content.className = "content";
    for (let i = 0; i < element.content.length; i++)
    {
        content.appendChild(getHTMLElement(element.content[i]));
    }
    
    content.style.display = element.opened ? "block" : "none";

    return content;
}

function settingDots(element)
{
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

    return span;
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
        if (element.content[index].type === "task" && element.content[index].checked !== -1)
        {
            removeItemWithID(element.content[index].checked);
        }

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

function selectItem(element)
{
    let fullPath = getFullPathName(element.path.slice());

    let sideElement = new SideElement(element.name, fullPath, element.time / 60);
    selectedItems.push(sideElement);
    localStorage.selectedItems = JSON.stringify(selectedItems);
    
    displaySideElement(sideElement)
}

function getFullPathName(path)
{
    let index = path.shift();
    let pathName = elements[index].name;

    let element = elements[index];
    while (path.length > 0)
    {
        index = path.shift();
        element = element.content[index];
        pathName += "/" + element.name;
    }

    return pathName;
}

function goToCalendarView()
{
    window.location.href = "Calender.html";
}