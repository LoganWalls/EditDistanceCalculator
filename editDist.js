window.onload = function(){
	var calcButton = document.getElementById("calculate_button");
	calcButton.addEventListener("click", calculateButton);
};

Array.prototype.min = function(){
	return Math.min.apply(null, this);
};

Array.prototype.prettyPrint = function(){
	var line = "";

	for(var i = this.length-1; i >= 0; i--){

		for(var j = 0; j < this[i].length; j++){

			line += "["+this[i][j]+"]";
		}
		console.log(line);
		line = "";
	}
};

//Displays the path in the given table element.
//words: a tuple or array containing the two words used in the calculation.
//distances: an array of all distances used in the calculation
//backtrace: an array with the backtraces of all distances.
//table: the DOM element corresponding to the table where the information is to be displayed.
function pathToTable(words, distances, backtrace, table){
	table.innerHTML = "";
	table.style.display = "block";

	var string1 = "-"+words[0];
	var string2 = "-"+words[1];

	for(var i = distances.length-1; i >= 0; i--){
		var row  = document.createElement("TR");
		table.appendChild(row);
		var string1Cell = document.createElement("TD");
		string1Cell.innerHTML = string1[i];
		string1Cell.className = "wordCell";
		row.appendChild(string1Cell);

		for(var j = 0; j < distances[i].length; j++){
			//Content
			var curDist = distances[i][j];
			var curTrace = backtrace[i][j];
			var cell  = document.createElement("TD");
			cell.innerHTML = String(curDist)+curTrace;

			//Styling
			if(i == 0 || j == 0){
				cell.className = "zeroCell";
			}

			row.appendChild(cell);
		}

		if(i == 0){
			var string2Row  = document.createElement("TR");
			var cornerTile = document.createElement("TD");
			cornerTile.innerHTML = "*";
			cornerTile.className = "wordCell";
			string2Row.appendChild(cornerTile);

			for(var s = 0; s < string2.length; s++){
				var string2Cell  = document.createElement("TD");
				string2Cell.innerHTML = string2[s];
				string2Cell.className = "wordCell";
				string2Row.appendChild(string2Cell);
			}
			table.appendChild(string2Row);
		}
	}
}

//Prints the array of distances for the two given strings and returns the minimum edit distance between the two.
function levDistance(string1, string2){
	var equalCost = 0;
	var delCost = 1;
	var insertCost = 1;
	var repCost = 2;
	var backtrace = new Array();
	var distances = new Array(); //Holds all previously calculated distances.
	var finalDistance = null;


	for(var i = 0; i <= string1.length; i++){
		distances[i] = new Array();
		backtrace[i] = new Array();

		for(var j = 0; j <= string2.length; j++){
			
			//Initializaions	
			if(j == 0){
				distances[i][j] = i;
				backtrace[i][j] = " ";
			}
			if(i == 0){
				distances[i][j] = j;
				backtrace[i][j] = " ";
			}

			if(i != 0 && j != 0){

				var curCosts = new Array();

				curCosts[0] = distances[i-1][j] + delCost;
				curCosts[1] = distances[i][j-1] + insertCost;

				//console.log("Comparing: ",string1[i-1], " and ", string2[j-1], "  Result: ", (string1[i-1] == string2[j-1]));
				if(string1[i-1] == string2[j-1]){
					curCosts[2] = distances[i-1][j-1] + equalCost;
				}else{
					curCosts[2] = distances[i-1][j-1] + repCost;
				}

				var shortest = curCosts.min(); //Shortest path.
				var direction = null;
				switch(curCosts.indexOf(shortest)){
					case 0:
						direction = "\u2190";
						break;
					case 1:
						direction = "\u2193";
						break;
					case 2:
						direction = "\u2199";
						break;
					default:
						console.log("Error, Invalid shortest path index:", curCosts.indexOf(shortest));
						break;
				}

				distances[i][j] = shortest;
				backtrace[i][j] = direction;

			}
			if(i+1 == string1.length+1 && j+1 == string2.length+1){
				finalDistance = curCosts.min();
			}
		}
	}
	//distances.prettyPrint();
	//backtrace.prettyPrint();
	return [finalDistance, distances, backtrace];
}

//The function for the calculate button,
//takes the two text inputs from the DOM,
//feeds them into the edit distance function
//and displays the result on the page.
//CONVERTS TO LOWER CASE!!!
function calculateButton(){

	var input1 = String(document.getElementById("string1").value);
	var input2 = String(document.getElementById("string2").value);
	
	if(typeof input1  == "string" && typeof input2 == "string"){
		var string1 = input1.toLowerCase();
		var string2 = input2.toLowerCase();
		
		var result = levDistance(string1, string2);

		var finalDistance = result[0];
		var distances = result[1];
		var backtrace = result[2];

	 	var pathTable = document.getElementById("path_table");
		pathToTable( [string1,string2] , distances, backtrace, pathTable);
	}else{
		console.log("Error input(s) not Strings:", input1, input2);
	}

}
