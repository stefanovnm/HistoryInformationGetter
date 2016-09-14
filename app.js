var objectToPrint = {};

document.getElementById('file').onchange = function () {
    var file = this.files[0];

    var reader = new FileReader();
    reader.onload = function () {

        var lines = this.result.split('\n'),
            firstOccur = false,
            counter = 0;

        var allInfo = [];

        for (var line = 0, lengthInfo = lines.length; line < lengthInfo; line += 1) {
            var currentLine = lines[line].split(' ');
            var date,
                hour,
                user,
                typeOfSave;

            if (!firstOccur) {
                if (currentLine[0] === '***') {
                    firstOccur = true;
                    counter += 1;
                    typeOfSave = currentLine[1];
                    date = currentLine[2];
                    hour = currentLine[3];
                }
            } else {
                if (currentLine[0] === '***') {
                    if (counter === 1) {
                        user = currentLine[2];
                    }
                    counter += 1;
                    if (counter === 4) {
                        counter = 0;
                        firstOccur = false;
                        allInfo.push({
                            user: user,
                            date: date,
                            hour: hour,
                            saveType: typeOfSave
                        });
                    }
                }
            }
        }
        // console.log(allInfo);

        var byUser = {};
        for (var i = 0, length = allInfo.length; i < length; i += 1) {
            if (typeof byUser[allInfo[i].user] === 'undefined') {
                byUser[allInfo[i].user] = [];
            }
            byUser[allInfo[i].user].push({
                date: allInfo[i].date,
                hour: allInfo[i].hour,
                saveType: allInfo[i].saveType
            });
        }
        // console.log(byUser);

        var sorted = {};
        var numberOfSaves = 0,
            numberOfNumberings = 0,
            numberOfAutosaves = 0;

        for (var key in byUser) {

            var previousDate = byUser[key][0].date;
                numberOfSaves = 0,
                numberOfNumberings = 0,
                numberOfAutosaves = 0;

            for (var index in byUser[key]) {
                var currentDate = convertDate(byUser[key][index].date);

                if (typeof sorted[key] === 'undefined') {
                    sorted[key] = {};
                }

                if (typeof sorted[key][currentDate] === 'undefined') {
                    sorted[key][currentDate] = {
                        hours: [],
                        workingHours: 0,
                        numberOfAutosaves: 0,
                        numberOfNumberings: 0,
                        numberOfSaves: 0
                    }
                }

                if (previousDate !== currentDate) {
                    numberOfSaves = 0;
                    numberOfNumberings = 0,
                    numberOfAutosaves = 0;
                }

                sorted[key][currentDate].hours.push(byUser[key][index].hour);

                if (byUser[key][index].saveType === "Autosave") {
                    numberOfAutosaves += 1;
                    sorted[key][currentDate].numberOfAutosaves = numberOfAutosaves;
                }

                if (byUser[key][index].saveType === "Save") {
                    numberOfSaves += 1;
                    sorted[key][currentDate].numberOfSaves = numberOfSaves;
                }

                if (byUser[key][index].saveType === "Numbering") {
                    numberOfNumberings += 1;
                    sorted[key][currentDate].numberOfNumberings = numberOfNumberings;
                }

                previousDate = currentDate;
            }
        }

        // console.log(sorted);
        for (var userIndex in sorted) {
            for (var dateIndex in sorted[userIndex]) {
                var element = sorted[userIndex][dateIndex].hours;

                sorted[userIndex][dateIndex].hour = element[0] + " - " + element[element.length - 1];
                sorted[userIndex][dateIndex].workingHours = getWorkingHours(element[0], element[element.length - 1]);
                // console.log(sorted[userIndex][dateIndex].hour);
            }
        }

        generateTable(sorted);

    };

    reader.readAsText(file);

};

function generateTable(objectToPrint) {
    var table = document.createElement("table");
    var tableBody = document.createElement("tbody");
    var firstRow = document.createElement("tr");
    var firstCell = document.createElement("th");
        var firstCellText = document.createTextNode("Date\\User");
    firstCell.appendChild(firstCellText);
    firstRow.appendChild(firstCell);
    tableBody.appendChild(firstRow);
    table.appendChild(tableBody);
    
    var allDates = [];

    for (var userInd in objectToPrint) {
        for (var dateInd in objectToPrint[userInd]) {
            allDates.push(dateInd);
        }
    }

    // console.log(allDates);
    var uniqueDates = uniq(allDates);
    uniqueDates.sort();
    // console.log(uniqueDates);

    for (var dateToAddIndex in uniqueDates) {
        var rowToAdd = document.createElement("tr");
        rowToAdd.id = uniqueDates[dateToAddIndex];
        rowToAdd.className = uniqueDates[dateToAddIndex];
        var cellToAdd = document.createElement("td");
        cellToAdd.innerHTML = uniqueDates[dateToAddIndex];

        rowToAdd.appendChild(cellToAdd);
        tableBody.appendChild(rowToAdd);
    }

    console.log(objectToPrint);
        

    for (var userIndex in objectToPrint) {
        // console.log(userIndex);
        var cell = document.createElement("th");
        var text = document.createTextNode(userIndex);
        cell.appendChild(text);
        cell.className = userIndex;
        firstRow.appendChild(cell);

        var rows = table.getElementsByTagName('tr');
        

        for(var rowIndex in rows)
        {
            if(rowIndex>0){
                //console.log(rows[rowIndex].className);
                var checker = [];
                
                var emptyCell = document.createElement("td");
                emptyCell.innerHTML = "";

                for (var dateIndex in objectToPrint[userIndex]) {
                    var cellToAddWithResult = document.createElement("td");
                    cellToAddWithResult.className = userIndex;
                    cellToAddWithResult.innerHTML = objectToPrint[userIndex][dateIndex].workingHours;

                    emptyCell.className = userIndex;

                    if(rows[rowIndex].className === dateIndex){
                        rows[rowIndex].appendChild(cellToAddWithResult);
                        checker[rowIndex] = true;
                    }
                    
                    if((rows[rowIndex].className < dateIndex && !checker[rowIndex])) {
                        //console.log(checker[rowIndex]);
                        rows[rowIndex].appendChild(emptyCell);
                        checker[rowIndex] = true;
                    }
                }

                if(!checker[rowIndex]){
                    rows[rowIndex].appendChild(emptyCell);
                }
            }  
        }
    }

    var body = document.getElementsByTagName("body")[0];

    body.appendChild(table);
    makeColors();
}

//AS6
function uniq(a) {
    return Array.from(new Set(a));
}

function convertDate(oldDate) {
    var newDate = oldDate.substring(6, 10) + oldDate.substring(3, 5) + oldDate.substring(0, 2);
    return newDate;
}

function makeColors() {
    var rows = document.getElementsByTagName('tr');
    //console.log(rows.length);

    for(var row of rows){
        var child = row.childNodes;
        for(var ind in child){
            if(ind % 2 === 1){
                child[ind].style.backgroundColor = "#e9e9e9";
            }
        }
    }
}

function getWorkingHours(firstHour, secondHour) {
    var hour;

    if(firstHour === secondHour){
        hour = '1:00';
    } else {
        var firstHours = parseInt(firstHour.substring(0,2));
        var firstMinutes = parseInt(firstHour.substring(3,5));
        var secondHours = parseInt(secondHour.substring(0,2));
        var secondMinutes = parseInt(secondHour.substring(3,5));
        
        //console.log(firstHours + ":" + firstMinutes + " - " + secondHours + ":" + secondMinutes);
        
        var hours = secondHours - firstHours;

        var minutes = secondMinutes - firstMinutes;

        if (secondMinutes < firstMinutes) {
            minutes = 60 + secondMinutes - firstMinutes;
            hours -= 1;
        }
        hour = hours + ":" + minutes;
    }

    //console.log(hour);

    return hour;
}