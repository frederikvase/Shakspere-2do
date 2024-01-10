var modal = document.getElementById("EditProjectModal");
var index = -1;

// Open modal if a task has been clicked
document.querySelector('ul').addEventListener('click', function(ev) 
{
    if (ev.target.tagName == 'TD') 
    {
        showModal(findParentTable(ev.target));
    }
}, false);

// Close the modal, when the close button has been pressed
document.getElementsByClassName("closeModal")[0].onclick = function() 
{ 
    hideModal(); 
}

function findParentTable(element) 
{
    while (element && element.tagName != 'TABLE')
    {
        element = element.parentNode;
    }
    return element;
}

function showModal(table)
{
    modal.style.display = "block";

    index = Array.from(table.parentNode.children).indexOf(table);
    let project = projects[index];

    document.getElementById("projectTitle").innerHTML = "<b>" + project.name + "</b>";

    document.getElementById("name_m").value = project.name;
    document.getElementById("time_m").value = project.time;
    document.getElementById("date_m").value = project.date;
}

function hideModal() 
{
    modal.style.display = "none";
    location.reload();
}

function deleteProject()
{
    projects.splice(index, 1);
    localStorage.projects = JSON.stringify(projects);

    location.reload();
}