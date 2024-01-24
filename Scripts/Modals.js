function openModal(id)
{
    document.getElementById(id).style.display = "block";
}

function deleteNestedArray(relativePath, listItem)
{
    const index = relativePath.shift();
    if (relativePath.length === 0)
    {
        listItem.content.splice(index, 1);
    }
    else
    {
        deleteNestedArray(relativePath, listItem.content[0]);
    }
}