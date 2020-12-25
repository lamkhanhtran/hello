export {setBombs, firstTime, timeStop}

let grid = document.getElementById("grid");
let firstTime = true, Win = false;
let clicking = -1;
let timeStop;

let setRow = 10, setCol = 10, setBombs = 20;

generateGrid();

function generateGrid(){

    Win = false; firstTime = true; timeStop = false; grid.innerHTML = "";
    for(let i=0;i<setRow;i++){
        let row = grid.insertRow(i);
        for(let j=0;j<setCol;j++){
            let cell = row.insertCell(j);
            cell.innerHTML = "<div></div>"
            cell.onmousedown = function(){
                OpenNow(clicking, this);
                clicking = event.buttons;
                if(clicking!=2)
                    notOpenYet(clicking, this);
                else
                    cellClicked(this, clicking);
            };
            cell.onmouseleave = function(){
                if(clicking!=-1&&clicking!=2)
                    OpenNow(clicking, this);
            }
            cell.onmouseenter = function(){
                if(clicking!=-1&&clicking!=2)
                    notOpenYet(clicking, this);
            }
            cell.onmouseup = function(){
                if(clicking!=2){
                    OpenNow(clicking, this);
                    cellClicked(this, clicking);
                }
                clicking = -1;
            };
            let mine = document.createAttribute("haveMine");
            mine.value = "false";
            cell.setAttributeNode(mine);
        }
    }
}

function notOpenYet(btntype, cell){

    if(cell.innerText=="")
        cell.className = "beingClicked";
    if(btntype>=3){
        let atRow = cell.parentNode.rowIndex;
        let atCol = cell.cellIndex;
        for(let i=Math.max(atRow-1, 0);i<=Math.min(atRow+1, setRow-1);i++){
            for(let j=Math.max(atCol-1, 0);j<=Math.min(atCol+1, setCol-1);j++){
                let newCell = grid.rows[i].cells[j];
                if(newCell.innerText=="")
                    newCell.className = "beingClicked";
            }
        }
    }
}

function OpenNow(btntype, cell){

    if(cell.innerText=="")
        cell.className = "";
    if(btntype>=3){
        let atRow = cell.parentNode.rowIndex;
        let atCol = cell.cellIndex;
        for(let i=Math.max(atRow-1, 0);i<=Math.min(atRow+1, setRow-1);i++){
            for(let j=Math.max(atCol-1, 0);j<=Math.min(atCol+1, setCol-1);j++){
                let newCell = grid.rows[i].cells[j];
                if(newCell.innerText=="")
                    newCell.className = "";
            }
        }
    }
}

function firstClicked(cell){

    let bombsLeft = setBombs;
    while(bombsLeft){
        let row = Math.floor(Math.random()*setRow);
        let col = Math.floor(Math.random()*setCol);
        let thatCell = grid.rows[row].cells[col];
        if(thatCell.getAttribute("haveMine")=="false"&&cell!=thatCell){
            bombsLeft--;
            thatCell.setAttribute("haveMine", "true");
        }
    }
}

function revealMine(Win){

    for(let i=0;i<setRow;i++){
        for(let j=0;j<setCol;j++){
            let cell = grid.rows[i].cells[j];
            if(cell.getAttribute("haveMine")=="true"&&cell.innerText==""){
                if(!Win){
                    cell.className = "mine";
                    cell.innerText = "X"
                }
                else
                    cell.innerText = "x";
            }
            cell.onmousedown = null;
            cell.onmouseenter = null;
            cell.onmouseleave = null;
            cell.onmouseup = null;
        }
    }
    timeStop = true;
}

function checkLevelCompletion(){

    if(Win)
        return 0;
    let cellOpened = 0;
    for(let i=0;i<setRow;i++){
        for(let j=0;j<setCol;j++){
            let cell = grid.rows[i].cells[j];
            if(cell.className.indexOf("clicked")>=0)
                cellOpened++;
        }
    }
    if(cellOpened==setRow*setCol-setBombs){
        console.log("You win!")
        Win = true;
        revealMine(Win);
    }
}

function cellClicked(cell, btntype){

    let atRow = cell.parentNode.rowIndex;
    let atCol = cell.cellIndex;
    if(btntype==1&&(cell.innerText==""||cell.innerText=="?")){
        if(firstTime){
            firstClicked(cell);
            firstTime = false;
        }
        if(cell.getAttribute("haveMine")=="true"){
            revealMine(Win);
            console.log("You lose!");
        }
        else{
            cell.className = "clicked";
            let mineCount = 0;
            for(let i=Math.max(atRow-1, 0);i<=Math.min(atRow+1, setRow-1);i++){
                for(let j=Math.max(atCol-1, 0);j<=Math.min(atCol+1, setCol-1);j++){
                    let newCell = grid.rows[i].cells[j];
                    if(newCell.getAttribute("haveMine")=="true")
                        mineCount++;
                }
            }
            cell.innerHTML = `<div>${mineCount}</div>`;
            cell.className += ` Num${mineCount}`;
            if(!mineCount){
                for(let i=Math.max(atRow-1, 0);i<=Math.min(atRow+1, setRow-1);i++){
                    for(let j=Math.max(atCol-1, 0);j<=Math.min(atCol+1, setCol-1);j++){
                        let newCell = grid.rows[i].cells[j];
                        if(newCell.innerText=="")
                            cellClicked(grid.rows[i].cells[j], 1);
                    }
                }
            }
        }
    }
    else if(btntype==2&&cell.className==""){
        let texts = ["<div></div>", "<div>x</div>", "<div>?</div>"];
        let next = [1, 2, 0];
        cell.innerHTML = texts[next[texts.indexOf(cell.innerHTML)]];
    }
    else if(btntype==3&&cell.innerText>0){
        let flagsFound = 0;
        for(let i=Math.max(atRow-1, 0);i<=Math.min(atRow+1, setRow-1);i++){
            for(let j=Math.max(atCol-1, 0);j<=Math.min(atCol+1, setCol-1);j++){
                let newCell = grid.rows[i].cells[j];
                if(newCell.innerText=="x")
                    flagsFound++;
            }
        }
        if(flagsFound==Number(cell.innerText)){
            for(let i=Math.max(atRow-1, 0);i<=Math.min(atRow+1, setRow-1);i++){
                for(let j=Math.max(atCol-1, 0);j<=Math.min(atCol+1, setCol-1);j++){
                    let newCell = grid.rows[i].cells[j];
                    if(newCell.innerText=="")
                        cellClicked(grid.rows[i].cells[j], 1);
                }
            }
        }
    }
    if(!Win)
        checkLevelCompletion();
}

let inputRow = document.getElementById("row");
let inputCol = document.getElementById("column");
let inputBombs = document.getElementById("bombs");

let reset = document.getElementById("reset");
reset.addEventListener("click", function(){

    if(inputRow.value=="")
        setRow = 10;
    else
        setRow = Math.min(Math.max(1, inputRow.value), 99);
    inputRow.value = "";
    if(inputCol.value=="")
        setCol = 10;
    else
        setCol = Math.min(Math.max(8, inputCol.value), 99);
    if(inputBombs.value=="")
        setBombs = Math.round(setRow*setCol/5);
    else
        setBombs = Math.max(Math.min(setRow*setCol-1, inputBombs.value), 1);
    inputRow.value = "";
    inputCol.value = "";
    inputBombs.value = "";
    generateGrid();
})