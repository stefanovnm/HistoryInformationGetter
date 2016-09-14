var allRows = document.getElementsByTagName('tr');

function filterByFirstDate() {
    var firstFilter = document.getElementById("firstDate");
    //console.log(firstFilter.value);
    
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
    //console.log(secondFilter.value);
    
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

function showAll() {
    for(var row in allRows){
        allRows[row].style.display = "block";
    }
}

function filter() {
    var firstFilter = document.getElementById("firstDate");
    var secondFilter = document.getElementById("secondDate");

    if (firstFilter.value.length === 8 && secondFilter.value.length !== 8) {
        filterByFirstDate();
    } else if (firstFilter.value.length !== 8 && secondFilter.value.length === 8) {
        filterBySecondDate();
    } else if (firstFilter.value.length === 8 && secondFilter.value.length === 8) {
        for(var row in allRows){
            if(firstFilter.value <= allRows[row].className && allRows[row].className <= secondFilter.value ) {
                allRows[row].style.display = "block";
            } else {
                if(allRows[row].className !== ""){
                    allRows[row].style.display = "none";
                }
            }
        }
    } else {
        showAll();
    }

}