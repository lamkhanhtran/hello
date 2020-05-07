import {setBombs, firstTime, timeStop} from './buildgame.js'

let countTime = ["0", "0", "0"];

function addUp(Anumber){
    let changeTime = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    return changeTime[Number(Anumber)];
}

let Clock = document.getElementById("clock");
Clock.innerText = countTime.join("");

function updateTime(){
    let counting = setInterval(function(){
        if(!firstTime&&!timeStop){
            countTime[2] = (countTime.join("")!="999") ? addUp(countTime[2]) : countTime[0];
            countTime[1] = (countTime[2]=="0"&&countTime.join("")!="999") ? addUp(countTime[1]) : countTime[1];
            countTime[0] = (countTime[1]=="0"&&countTime[2]=="0"&&countTime.join("")!="999") ? addUp(countTime[0]) : countTime[0];
        }
        Clock.innerText = countTime.join("");
    }, (!firstTime&&!timeStop) ? 1000 : 0)
}

updateTime();

let reset = document.getElementById("reset");
reset.addEventListener("click", function(){
    countTime = ["0", "0", "0"];
})