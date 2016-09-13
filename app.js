var objectToPrint;

document.getElementById('file').onchange = function(){
  var file = this.files[0];

  var reader = new FileReader();
  reader.onload = function(){
    
    var lines = this.result.split('\n'),
        firstOccur = false,
        lastOccur = false,
        counter = 0;
    
    var allInfo = [];

    for(var line = 0, length = lines.length; line < length; line+=1){
      var currentLine = lines[line].split(' ');
      var save,
          date,
          hour,
          user;

      if(!firstOccur){
          if (currentLine[0] === '***') {
              firstOccur = true;
              counter += 1;
              typeOfSave = currentLine[1];
              date = currentLine[2];
              hour = currentLine[3];
          }
      } else {
          if (currentLine[0] === '***') {
              if(counter === 1){
                  user = currentLine[2];
              }
              counter += 1;
              if (counter === 4) {
                  counter = 0;
                  firstOccur = false;
                  allInfo.push({user: user, 
                                date: date,
                                hour: hour,
                                saveType: typeOfSave});
              }
          }
      }
    }

    // console.log(allInfo);

    var byUser = {};

    for(var i = 0, length = allInfo.length; i < length; i+=1) {
        if (typeof byUser[allInfo[i].user] === 'undefined')
        {
            byUser[allInfo[i].user] = [];
        }
        byUser[allInfo[i].user].push({date: allInfo[i].date,
                                      hour: allInfo[i].hour,
                                      saveType: allInfo[i].saveType});
    }

    // console.log(byUser);

    var sorted = {};
    var numberOfSaves = 0,
        numberOfNumberings = 0,
        numberOfAutosaves = 0;

    for(var key in byUser){
        
        var previousDate = byUser[key][0].date;
        numberOfSaves = 0,
        numberOfNumberings = 0,
        numberOfAutosaves = 0;
        
        for(var index in byUser[key]){
            var currentDate = byUser[key][index].date;
            
            if(typeof sorted[key] === 'undefined'){
                sorted[key] = {};               
            }
                
            if(typeof sorted[key][currentDate] === 'undefined'){
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

                if(byUser[key][index].saveType === "Autosave"){
                    numberOfAutosaves += 1;
                    sorted[key][currentDate].numberOfAutosaves = numberOfAutosaves;
                }

                if(byUser[key][index].saveType === "Save"){
                    numberOfSaves += 1;
                    sorted[key][currentDate].numberOfSaves = numberOfSaves;
                }

                if(byUser[key][index].saveType === "Numbering"){
                    numberOfNumberings += 1;
                    sorted[key][currentDate].numberOfNumberings = numberOfNumberings;
                }    

            previousDate = currentDate;
        }
    }

    // console.log(sorted);
    for(var userIndex in sorted){
        for(var dateIndex in sorted[userIndex]){
            var element = sorted[userIndex][dateIndex].hours;
            
            sorted[userIndex][dateIndex].hour = element[0] + " - " + element[element.length-1];
            // console.log(sorted[userIndex][dateIndex].hour);
        }
    }

    objectToPrint = sorted;

    // console.log(objectToPrint);
    generateTable();
  };

  reader.readAsText(file);
  
};




function generateTable() {
    var table = document.createElement("table");
    var tableBody = document.createElement("tbody");
    var firstRow = document.createElement("tr");
    var firstCell = document.createElement("td");
    firstCell.setAttribute("width", "100")
    firstCell.setAttribute("align", "center")
    var firstCellText = document.createTextNode("Date\\User");
    firstCell.appendChild(firstCellText);
    firstRow.appendChild(firstCell);
    tableBody.appendChild(firstRow);
    table.appendChild(tableBody);
    table.setAttribute("border", "2");

    var allDates = [];

    for(var userIndex in objectToPrint){
        for(var dateIndex in objectToPrint[userIndex]){
            allDates.push(dateIndex);
        }
    }

    console.log(allDates);
    var uniqueDates = uniq(allDates);
    uniqueDates.sort();
    console.log(uniqueDates);


    console.log(objectToPrint);
    for(var userIndex in objectToPrint){
        // console.log(userIndex);
        var cell = document.createElement("td");
        cell.setAttribute("width", "100")
        cell.setAttribute("align", "center")
        var text = document.createTextNode(userIndex);
        cell.appendChild(text);
        firstRow.appendChild(cell);

        for(var dateIndex in objectToPrint[userIndex]){
            //console.log(dateIndex);
        }
        var row = document.createElement("tr");
        table.appendChild(row);
    }


    
    
    

    var body = document.getElementsByTagName("body")[0];

    body.appendChild(table);
}



function uniq(a) {
   return Array.from(new Set(a));
}