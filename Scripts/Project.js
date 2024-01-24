function editProject(project)
{
    document.getElementById("EditProjectModal").style.display = "block";
    path = project.path;
}

function addProject(parent)
{
    document.getElementById("projectAdder").style.display = "block";

    let name = document.getElementById("projectName").value;
    let date = new Date(document.getElementById("date").value).toLocaleDateString("ne");

    if (name == '')
    {
        alert("Please fill out a name for the project!");
    }
    else if (typeof(Storage) !== "undefined")
    {
        if (typeof(parent) === 'undefined')
        {
            const project = new Project(name, [elements.length], date, Array(0));
            elements.push(project);
            localStorage.elements = JSON.stringify(elements);
            location.reload();
        }

        let path = parent.path.splice();
        path.push(parent.content.length);
        parent.content.push(new Project(name, path.slice(), date, Array(0)));
        
        localStorage.elements = JSON.stringify(elements);
        location.reload();
    }
}

document.getElementById("closeEditProjectModal").onclick = function() 
{
    document.getElementById("EditProjectModal").style.display = "none";
}