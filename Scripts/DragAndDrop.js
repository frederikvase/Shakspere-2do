
function deleteTask(ID, arr) {
    for (let index = 0; index < arr.length; index++) 
    {
        const task = arr[index];
        if (task.ID == ID) {
            arr.splice(index, 1);
            // updateLocalStorage();

            var element = document.getElementById(ID);
            element.parentNode.removeChild(element);   
            
            // showAllTasks();
            // isPlacedAtSameTimeButForClasses();
            // updateVisibleSpans();
            break; // Once the task is found and removed, exit the loop
        }
    }
    // console.log(allClassTasks)
}

function calculateDurationIntoProcentage(duration){ //input: string "1:30" output: float 5
    let startTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][0]);
    let endTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]);
    let placementTimeStamp = converTimeIntoHours(duration);

    let placementProcentage = ((placementTimeStamp) / ((endTimeStamp+2) - startTimeStamp)) * 100;
    
    return placementProcentage;
}

function calculateProcentageIntoDuration(procentage) //Input: float 5 (%) -> output: string "1:30"
{
    let startTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][0]);
    let endTimeStamp = converTimeIntoHours(allTimeStamps[allTimeStamps.length - 1][allTimeStamps[0].length - 1]);

    let duration = (procentage/100)*((endTimeStamp+2) - startTimeStamp)

    return convertDecimalIntoHours(duration)
}

// function converTimeIntoHours(input) //input = "23:30" -> 23,5 timer
// {
//     let hours = parseInt(input.split(":")[0]);
//     let min = parseInt(input.split(":")[1]);

//     let minToHours = min/60
//     return hours+minToHours;
// }

//Not being Used
function convertDecimalIntoHours(decimal) //input float 22.5 ouput string "22:30"
{
    let min = ((decimal % 1)*60).toFixed(0);
    let hours = Math.floor(decimal)

    return min < 10 ?  `${hours}:0${min}` :  `${hours}:${min}`
}

function addTwoHours(one, two) //Input ("7:30", "2:30") -> ouput ("10:00")
{
    let totalNum = converTimeIntoHours(one) + converTimeIntoHours(two)
    return convertDecimalIntoHours(totalNum)
}

function subtractTwoHours(one,two) //input ("7:30", "2:30") -> ouput ("5:00")
{
    let totalNum = converTimeIntoHours(one) - converTimeIntoHours(two)
    return convertDecimalIntoHours(totalNum)
}

function dragStart(event) {
    console.log("Start DRAG");
    const theDraggedID = event.target.id; 
    event.dataTransfer.setData('text/plain', theDraggedID); 
    this.classList.add("hold");
    setTimeout(() => (this.classList.add("invisible")), 0);
}

function dragEnd() {
    console.log("END DRAG");
    this.classList.remove("invisible", "hold");
}


function findNeighboursOtOnce(arr)
{
    let ans = [];
  
    const overlappingRoundOne = findOverlappingTasks(arr);
    // console.log("overlappingRoundOne")
    // console.log(overlappingRoundOne)
    // console.log("Other")
  
    for (let element of arr) {
        let theID = element[0];
        let amountOfOverlap = overlappingRoundOne[theID] || [];
    
        if (amountOfOverlap.length >= 1) 
        {
            let overlappingTimesTwo = amountOfOverlap.map(stuff => {
            for (let thing of arr) {
                if (thing[0] === stuff) {
                return thing;
                }
            }
            });
            // console.log("overlappingTimesTwo", theID)
            // console.log(overlappingTimesTwo)
    
            let overlapOfOverlap = findOverlappingTasks(overlappingTimesTwo);
            // console.log(overlapOfOverlap)
            let maxLength = 0;
    
            for (let key of Object.keys(overlapOfOverlap)) {
                if (overlapOfOverlap[key].length > maxLength) {
                    // console.log(theID + " | " + overlapOfOverlap[key].length)
                    maxLength = overlapOfOverlap[key].length;
                }
            }
    
            ans.push([theID, maxLength+1]);
        } else {
            ans.push([theID, 0]);
        }
    }
  
    // console.log("ans")
    // console.log(ans)
    return ans;
  }

function calculateLeft(arr) // [["id", startTime, endTime ]]
{
    let arrWithLeftOffset = []

    for (let element of arr){
        let theID = element[0]

        let taskWithID = document.getElementById(theID)
        
        if (taskWithID) 
        {
            let widthOfTaskString = taskWithID.style.width;
            let taskWidth = parseInt(widthOfTaskString.split("%"));

            // console.log("LEFT/THE WIDTH?: "+ theID + " | " + widthOfTaskString)

            if (taskWidth == 100){ //If not overlapping with anyone
                arrWithLeftOffset.push([theID, 0])
            } else { //Overlaps:
                let thingsToAdd = [] // 2d array -> [["id1", left], ["id2", left]...]
                //thingsToAdd.push(taskWithID, 0);
                
                let allOverlaps = findOverlappingTasks(arr)
                let overlapsWithID; // contains overlap with id, e.g. ["id1", "id3", "id8"]
                
                for (let key in allOverlaps){
                    if(key === theID){
                        overlapsWithID = allOverlaps[key];
                    }
                }
                overlapsWithID.push(theID)

                let extraPush = 0
                // console.log("overlapsWithID")
                // console.log(overlapsWithID)
                for (let things of overlapsWithID){
                    let thingsElement = document.getElementById(things)
                    let thingsWidthString = thingsElement.style.width
                    let thingsWidth = parseInt(thingsWidthString.split("%"))

                    let overlappingLeft = 100 - (extraPush +thingsWidth)
                
                    // console.log(`if (${overlappingLeft} < ${taskWidth})`)
                    if (overlappingLeft < taskWidth) {
                        //extraPush = 0;
                        //overlappingLeft = 100 - (extraPush + thingsWidth + 0.7);
                    }
                    if (overlappingLeft < 0){ 
                        overlappingLeft = 0;
                    }

                    extraPush += thingsWidth;

                    // console.log("Added: " + things + " | " + overlappingLeft)
                    thingsToAdd.push([things, overlappingLeft])
                }

                //Add to final arr
                for (let l of thingsToAdd)
                {
                    let inFinalArray = false
                    for (let m of arrWithLeftOffset)
                    {
                        if(l[0] == m[0])
                        {
                            inFinalArray = true;
                        }
                    }
                    if (!inFinalArray){
                        arrWithLeftOffset.push([l[0], l[1]]);
                    }
                }
            }
        }
    }
    return arrWithLeftOffset;
}


function findOverlappingTasks(tasks) //input const tasks = [["id", float startTime1, float endTime1],["id", startTime2, endTime2]...]
{
    const tasksOverlap = {};
  
    for (let i = 0; i < tasks.length; i++) 
    {
        for (let j = 0; j < tasks.length; j++) 
        {
            if (i !== j) 
            {
                const [idI, startI, endI] = tasks[i];
                const [idJ, startJ, endJ] = tasks[j];

                // Check for overlap
                if (startI < endJ && endI > startJ) 
                {
                    if (!tasksOverlap[idI]) {
                        tasksOverlap[idI] = [idJ];
                    } else {
                        tasksOverlap[idI].push(idJ);
                    }
                }   
            }
        } 
    }
      return tasksOverlap;
}
//     var containers = document.querySelectorAll('.calender-tasks-project');

//     containers.forEach(function (container) {
//         var spans = container.querySelectorAll('span');
//         var containerWidth = container.clientWidth;

//         container.style.display = 'flex';
//         container.style.justifyContent = 'center';
//         container.style.alignItems = 'center';

//         var totalSpanWidth = 0;

//         spans.forEach(function (span, i) {
//             // Calculate total width of already visible spans
//             totalSpanWidth += span.clientWidth;

//             // Always make the taskName visible
//             if (i === 0) {
//                 span.style.visibility = 'visible';
//                 span.style.position = 'static';

//                 // Adjust font size to fit the span if it's wider than the container
//                 while (span.clientWidth > containerWidth - 2) {
//                     var fontSize = parseFloat(window.getComputedStyle(span).fontSize);
//                     span.style.fontSize = (fontSize - 1) + 'px';
//                 }
//             } else {
//                 // Show taskPeriod if there's more space
//                 if (i === 2 && containerWidth >= totalSpanWidth) {
//                     span.style.visibility = 'visible';
//                     span.style.position = 'static';
//                 } else if (i === 3 && containerWidth >= totalSpanWidth) {
//                     // Show the remove button if there's even more space
//                     span.style.visibility = 'visible';
//                     span.style.position = 'static';
//                 } else if (i === 1 && containerWidth >= totalSpanWidth) {
//                     // Show taskDuration if there's even more more space
//                     span.style.visibility = 'visible';
//                     span.style.position = 'static';
//                 } else {
//                     // Hide the span and position it absolutely if space is limited
//                     span.style.visibility = 'hidden';
//                     span.style.position = 'absolute';
//                 }
//             }
//         });

//         // Set the visibility and position of the remove button (4th span) like the others
//         var removeButton = container.querySelector('button');
//         if (removeButton) {
//             if (spans.length >= 2 && containerWidth >= totalSpanWidth) {
//                 removeButton.style.visibility = 'visible';
//                 removeButton.style.position = 'static';
//             } else {
//                 removeButton.style.visibility = 'hidden';
//                 removeButton.style.position = 'absolute';
//             }
//         }
//     });
// }

// updateVisibleSpans();