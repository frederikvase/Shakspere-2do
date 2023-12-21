const todoDraggablePlace = document.getElementById('todo-draggable');
const calendarTasksPlace = document.querySelector('.calender-tasks');

// Attach drag events to each todo-item
const todoItems = todoDraggablePlace.querySelectorAll('.todo-item');
todoItems.forEach(item => {
    item.draggable = true;
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragend", dragEnd);
});

calendarTasksPlace.addEventListener("dragover", dragOver);
calendarTasksPlace.addEventListener("dragenter", dragEnter);
calendarTasksPlace.addEventListener("dragleave", dragLeave);
calendarTasksPlace.addEventListener("drop", dragDrop);

function dragStart(event) {
    console.log("Start DRAG");
    event.dataTransfer.setData('text/plain', event.target.id);
    this.classList.add("hold");
    setTimeout(() => (this.classList.add("invisible")), 0);
}

function dragEnd() {
    console.log("END DRAG");
    this.classList.remove("invisible", "hold");
}

function dragOver(event) {
    console.log("OVER");
    event.preventDefault();
}

function dragEnter() {
    console.log("Enter");
    this.classList.add("over");
}

function dragLeave() {
    console.log("Leave");
    this.classList.remove("over");
}

function dragDrop(event) {
    console.log("Drop");
    event.preventDefault();

    const draggedItemId = event.dataTransfer.getData('text/plain');
    const draggedItem = document.getElementById(draggedItemId);

    if (draggedItem) {
        // Place item based on y-axis
        const rect = this.getBoundingClientRect();
        const relativeY = event.clientY - rect.top;
        const relativePercentage = (relativeY / rect.height) * 100;
    
        const clone = draggedItem.cloneNode(true);
        clone.classList.remove("invisible", "hold");
        clone.style.position = 'absolute';
        clone.style.top = `${relativePercentage}%`;
    
        // Give item a height based on task duration.
        const secondSpanValue = clone.querySelector('.todo-item span:nth-child(2)').textContent;
        console.log('Value of the second span:', secondSpanValue + " | Calc: " + calculateHeight(secondSpanValue));
        clone.style.height = calculateHeight(secondSpanValue);
    
        // Give item time (from -> to) based on top: and duration:
        let timePeriod = calculatePeriod(relativePercentage, secondSpanValue);
        const thirdSpan = clone.querySelector('.todo-item span:nth-child(3)');
        thirdSpan.textContent = timePeriod;
    
        this.appendChild(clone);
        // Remove the dragged item from todoDraggablePlace
        draggedItem.parentNode.removeChild(draggedItem);
    }   
}

function calculateHeight(input) //Number of minutes: e.g. "120 min"
{
    let amountOfMin = parseInt(input.split("min")[0])/60

    //Used functions and values from Calendar.js
    let theStartTime = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][0]);
    let theEndTime = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]) +2; //___ +2 because its showing 2 extra hours

    //New calculations
    let theHeight = (amountOfMin)/(theEndTime-theStartTime)*100
    return theHeight + "%"
}

function calculatePeriod(top, height) //both top an height is procentage: input: 40,3% | 5,67%
{
    //Functions and variables from Calendar.js
    let theStartTime = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][0]);
    let theEndTime = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]) +2; //___ +2 because its showing 2 extra hours

    //Calculate StartingTime
    let period =((top/100) *(theEndTime-theStartTime))+theStartTime;
    console.log(`(${top}/${100}) *(${theEndTime}-${theStartTime}))+${theStartTime}`)

    console.log("RETUNS: " + decimalToHoursAndMinutes(period))
    
    //Calculating endingTime:
    let numberOfMin = parseInt(height.split("min"))
    console.log(numberOfMin);
    let periodEndTime = decimalToHoursAndMinutes((numberOfMin/60) + period)

    console.log(`NEW text ON thirdSPAN: ${decimalToHoursAndMinutes(period)} - ${periodEndTime}`)
    return `${decimalToHoursAndMinutes(period)} - ${periodEndTime}`
}

function decimalToHoursAndMinutes(decimal) {
    // Extract the hours and minutes
    let hours = Math.floor(decimal);
    let minutes = Math.round((decimal % 1) * 60);

    // Format the result
    let formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

    return formattedTime;
}