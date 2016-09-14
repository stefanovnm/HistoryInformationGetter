var allRows = document.getElementsByTagName('tr');

function filterByFirstDate() {
    var firstFilter = document.getElementById("firstDate");
    console.log(firstFilter.value);
    for(var row in allRows){
        if(allRows[row].className < firstFilter.value) {
            if(allRows[row].className !== ""){
                allRows[row].style.display = "none";
            }
            
        } else {
            allRows[row].style.display = "block";
        }
    }

}

function filterBySecondDate() {
    var secondFilter = document.getElementById("secondDate");
    console.log(secondFilter.value);
    for(var row in allRows){
        if(allRows[row].className > secondFilter.value) {
            if(allRows[row].className !== ""){
                allRows[row].style.display = "none";
            }
            
        } else {
            allRows[row].style.display = "block";
        }

        if(secondFilter.value === ""){
        allRows[row].style.display = "block";
        }
    }
}