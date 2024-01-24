//Settings.js is being used to change initial values like: bedtime, wakeUp, placementInterval, timeLines etc.

let isSettingsOpen = false;
const settingsImage = document.getElementById("settings-image");
settingsImage.addEventListener("click", () => openOrCloseOverlay());

const initialInformation = {
    wakeUpTime: "6:50",
    bedtime: "21:00",
    placementInterval: "0:10",
    timeLines: "1:00",
    schoolUsername : "",
    schoolPassword : "",
};

// Get and set localStorage
let settingsInformation = JSON.parse(localStorage.getItem("settingsInformation")) || initialInformation;
localStorage.setItem("settingsInformation", JSON.stringify(settingsInformation));

function openOrCloseOverlay(currentState = isSettingsOpen) //Handles clicking on settings
{
    //True -> overlay opened, false -> overlay closed 
    let nextState = !currentState;
    isSettingsOpen = nextState;

    if(nextState) //If settings should be open
    {
        openSettingsOverlay();
        
        //Create a black overlay begind the settingsOverlay
        const backgroundOverlay = document.createElement("div");
        backgroundOverlay.classList.add("calendar-background-overlay");
        const thisPage = document.getElementById("calendar-main");
        thisPage.appendChild(backgroundOverlay);

    } else { //This statement closes all overlay elements
        
        //Remove the overlay
        var element = document.getElementsByClassName("settings-overlay")[0];
        element.parentNode.removeChild(element); 

        //Remove background overlay 
        var darkOverlay = document.getElementsByClassName("calendar-background-overlay")[0];
        darkOverlay.parentNode.removeChild(darkOverlay);   
    }
}

function clickOnKeepChanges(){
    const bedtimeElement = document.querySelector(".settings-inputfield-bedtime");
    settingsInformation.bedtime = bedtimeElement.value || settingsInformation.bedtime;
    
    const wakeupElement = document.querySelector(".settings-inputfield-wakeup");
    settingsInformation.wakeUpTime = wakeupElement.value || settingsInformation.wakeUpTime;
    
    const intervalElement = document.querySelector(".settings-inputfield-interval");
    settingsInformation.placementInterval = intervalElement.value || settingsInformation.placementInterval;
    
    const timeLineElement = document.querySelector(".settings-inputfield-timeLine");
    settingsInformation.timeLines = timeLineElement.value || settingsInformation.timeLines;
    
    const usernameElement = document.querySelector(".settings-inputfield-username");
    settingsInformation.schoolUsername = usernameElement.value || settingsInformation.schoolUsername;
    
    const passwordElement = document.querySelector(".settings-inputfield-password");
    settingsInformation.schoolPassword = passwordElement.value || settingsInformation.schoolPassword;
    localStorage.setItem("settingsInformation", JSON.stringify(settingsInformation));
    
    //___Find better option than just reloading the page!
    location.reload();
}

function openSettingsOverlay() 
{
    const settingsElement = document.getElementsByClassName("settings")[0];

    //Title
        const settingsTitle = document.createElement("span");
        settingsTitle.classList.add("settings-title");
        settingsTitle.innerHTML = "Ajust Your Settings";
    //Confirm changes
        const confirmChoices = document.createElement("button");
        confirmChoices.innerText = "Keep changes";
        confirmChoices.classList.add("settings-confirm-button");
        confirmChoices.addEventListener("click", () => {clickOnKeepChanges(); openOrCloseOverlay();})
    //Deny changes
        const denyChoices = document.createElement("button");
        denyChoices.innerText = "Discard changes";
        denyChoices.classList.add("settings-deny-button");
        denyChoices.addEventListener("click", () => {openOrCloseOverlay();});
        
    //The overlay
        const settingsOverlay = document.createElement("div");
        settingsOverlay.classList.add("settings-overlay");
        settingsElement.appendChild(settingsOverlay);

    //WakeUpTime
        const settingsInputWakeUpTime = document.createElement("div")
        settingsInputWakeUpTime.classList.add("settings-input-wakeup");

        const inputWakeUpTime = document.createElement("input");
        inputWakeUpTime.classList.add("settings-inputfield-wakeup");
        inputWakeUpTime.placeholder = "Enter your wake up time";

        const textWakeUpTime = document.createElement("span");
        textWakeUpTime.innerText = `Wake up time - Current: ${settingsInformation.wakeUpTime}`;

        settingsInputWakeUpTime.appendChild(textWakeUpTime);
        settingsInputWakeUpTime.appendChild(inputWakeUpTime);
    
    //Bedtime
        const settingsInputBedtime = document.createElement("div")
        settingsInputBedtime.classList.add("settings-input-bedtime");

        const inputBedtime = document.createElement("input");
        inputBedtime.classList.add("settings-inputfield-bedtime");
        inputBedtime.placeholder = "Enter your bedtime";

        const textBedtime = document.createElement("span");
        textBedtime.innerText = `Bedtime - Current: ${settingsInformation.bedtime}`;

        settingsInputBedtime.appendChild(textBedtime);
        settingsInputBedtime.appendChild(inputBedtime);
        
    // placementInterval
        const settingsInputInterval = document.createElement("div")
        settingsInputInterval.classList.add("settings-input-interval");
        
        const inputInterval = document.createElement("input");
        inputInterval.classList.add("settings-inputfield-interval");
        inputInterval.placeholder = "Enter placement interval";
        
        const textInterval = document.createElement("span");
        textInterval.innerText = `Placement interval - Current: ${settingsInformation.placementInterval}`;
        
        settingsInputInterval.appendChild(textInterval);
        settingsInputInterval.appendChild(inputInterval);
        
    //TimeLines
        const settingsInputTimeLine = document.createElement("div")
        settingsInputTimeLine.classList.add("settings-input-timeLine");

        const inputTimeLine = document.createElement("input");
        inputTimeLine.classList.add("settings-inputfield-timeLine");
        inputTimeLine.placeholder = "Enter time between each line";

        const textTimeLine = document.createElement("span");
        textTimeLine.innerText = `Time indicator - Current: ${settingsInformation.timeLines}`;

        settingsInputTimeLine.appendChild(textTimeLine);
        settingsInputTimeLine.appendChild(inputTimeLine);
        
    //School username
        const settingsInputUsername = document.createElement("div")
        settingsInputUsername.classList.add("settings-input-username");

        const inputUsername = document.createElement("input");
        inputUsername.classList.add("settings-inputfield-username");
        inputUsername.placeholder = "Enter school username";

        const textUsername = document.createElement("span");
        textUsername.innerText = `Username - Current: ${settingsInformation.schoolUsername}`;

        settingsInputUsername.appendChild(textUsername);
        settingsInputUsername.appendChild(inputUsername);
    
    //Password
        const settingsInputPassword = document.createElement("div")
        settingsInputPassword.classList.add("settings-input-password");

        const inputPassword = document.createElement("input");
        inputPassword.type = "password"
        inputPassword.classList.add("settings-inputfield-password");
        inputPassword.placeholder = "Enter school password";

        const textPassword = document.createElement("span");
        textPassword.innerText = `Password`;

        settingsInputPassword.appendChild(textPassword);
        settingsInputPassword.appendChild(inputPassword);
        
    settingsOverlay.appendChild(settingsTitle);
    settingsOverlay.appendChild(settingsInputWakeUpTime);
    settingsOverlay.appendChild(settingsInputBedtime);
    settingsOverlay.appendChild(settingsInputInterval);
    settingsOverlay.appendChild(settingsInputTimeLine);
    settingsOverlay.appendChild(settingsInputUsername);
    settingsOverlay.appendChild(settingsInputPassword);
    
    settingsOverlay.appendChild(denyChoices);
    settingsOverlay.appendChild(confirmChoices);
}