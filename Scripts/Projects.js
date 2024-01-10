var projects;
var projectName;

class Project
{
    constructor(arr)
    {
        this.name = arr[0];
        this.time = parseFloat(arr[1]);
        this.date = arr[2];
        this.content = arr[3];
    }
}

function reload()
{
    // Initialize undefined localStorage data
    if (typeof (Storage) !== "undefined") 
    {
        if (!localStorage.projects)
        {
            localStorage.projects = JSON.stringify(new Project(["", 0, "", Array(0)]));
        }
    }

    //itemCount = JSON.parse(localStorage.projects).length;
    projects = JSON.parse(localStorage.projects);
    
    for (let i = 0; i < projects.content.length; i++)
    {
        document.getElementById("myUL").appendChild(getProjectDiv(projects.content[i]));
        document.getElementById("myUL").appendChild(getContentDiv(projects.content[i]));

        console.log(document.getElementById("myUL"));
        //showItem(projects.content[i]);
    }
}

function getProjectDiv(project)
{
    let div = document.createElement("div");
    div.className = "project";
    div.innerHTML = project.name;

    let button = document.createElement("button");
    button.className = "collapsibleButton";
    button.innerHTML = "BTN";
    button.onclick = function() { showContent(this); };
    
    div.appendChild(button);
    return div;
}

function getContentDiv(project)
{
    let content = document.createElement("div");
    content.className = "content";

    if (typeof(project.content) !== "undefined")
    {
        for (let i = 0; i < project.content.length; i++)
        {
            content.appendChild(getProjectDiv(project.content[i]));
            content.appendChild(getContentDiv(project.content[i]));
        }
    }
    
    let projectAdder = document.createElement("div");
    projectAdder.className = "project";
    projectAdder.innerHTML = "Add new project!";

    projectAdder.onclick = function() { 
        openAddProjectModal(project.name) 
    };
    content.appendChild(projectAdder);

    return content;
}

function openAddProjectModal(name)
{
    projectName = name;
    let modal = document.getElementById("AddProjectModal");
    modal.style.display = "block";
}

function addProject()
{
    let modal = document.getElementById("AddProjectModal");
    modal.style.display = "block";

    document.getElementById("projectAdder").style.display = "block";
    document.getElementById("subProjectAdder").style.display = "none";

    let name = document.getElementById("projectName").value;
    let date = new Date(document.getElementById("date").value).toLocaleDateString("ne");
    let time = "100";

    if (name == '')
    {
        alert("Please fill out a name for the project!");
    }
    else if (typeof(Storage) !== "undefined")
    {
        const element = new Project([name, time, date, Array(0)]);

        // Add new project to localStorage
        projects.content.push(element);
        localStorage.projects = JSON.stringify(projects);

        location.reload();
    }
}

function addSubProject()
{
    let modal = document.getElementById("AddProjectModal");
    modal.style.display = "block";

    if (document.getElementById("projectAdder").style.display === "block")
        document.getElementById("projectAdder").style.display = "none";
    if (document.getElementById("subProjectAdder").style.display === "none")
        document.getElementById("subProjectAdder").style.display = "block";

    let name = document.getElementById("projectName").value;
    let date = new Date(document.getElementById("date").value).toLocaleDateString("ne");
    let time = "100";

    if (name == '')
    {
        alert("Please fill out a name for the project!");
    }
    else if (typeof(Storage) !== "undefined")
    {
        const element = new Project([name, time, date, Array(0)]);

        // Add new project to localStorage
        addElementToProjects(projects, projectName, element);
        localStorage.projects = JSON.stringify(projects);

        location.reload();
    }
}

function addElementToProjects(project, name, element)
{
    if (typeof(project.content) === "undefined")
        return;

    alert(name);

    for (let i = 0; i < project.content.length; i++)
    {
        if (project.content[i].name == name)
        {
            //alert("aaa");
            project.content[i].content.push(element);
            return;
        }

        addElementToProjects(project.content[i], name, element);
    }
}

function showContent(btn)
{
    btn.parentElement.classList.toggle("active");
    var content = btn.parentElement.nextElementSibling;

    if (content.style.display === "block") 
    {
        content.style.display = "none";
    } 
    else 
    {
        content.style.display = "block";
    }
}