/*******************************************************************************************************
 	Allt det här låg i article.js förut.
	Datum när filen skapades: 2016-04-12

	Filen innehåller funktioner som datum och tid.

********************************************************************************************************/
		


		function getTime(text) {
			//Temporary variables
			var month = null;
			var year = null;
			var temp_time = [null,null,null]; // [date, month, year]
			var word = "";
			var previous_word_was_month = false;

			//Variable to return
			var time = [];

			//Prepare text.
			text = text.replace(/[-–&\/\\#,+()$~%.'":*?<>{}]/g, ' ');
			text = text.toLowerCase();

			for(var indx = 0; indx < text.length; indx++) {
				//If current char is " ", we have a word.
				if(text[indx] == " ") {
					
					//Check if word is a number, if it is, convert it to an integer and save in "date".
					if(!isNaN(word) && !(word == "")) {
						//If the number is less than 3 digits it is probably a date.
						if(word.length < 3) {
							temp_time[0] = parseInt(word);
							//all_dates.push(parseInt(word));

						//If it is longer than 2 digits and the previous word was a month it is probably a year.
						} else if (temp_time[0] != null && previous_word_was_month) {
							temp_time[2] = parseInt(word);
						} 
					//If the word is not a number, check if it is a date.
					} else {
						month = getMonth(word);
						if(month > -1) {
							temp_time[1] = month;
							previous_word_was_month = true;
						} else {
							previous_word_was_month = false;
						}
					}

					//If all slots in "temp_time" is filled, save the point of time and clear the variable.
					if(temp_time[2] != null) {
						time.push(temp_time);
						if(time.length > 1)
							return time;
						temp_time = [null,null,null];
					}

					//Clear word
					word = "";

				} else {
					//Append current char to word.
					word += text[indx];
				
				}
			}
			return time;
		}

		function getMonth(word) {
			var result = -1;
			result = word.localeCompare("januari");
			if(result == 0)
				return 1; 
			result = word.localeCompare("februari");
			if(result == 0)
				return 2; 
			result = word.localeCompare("mars");
			if(result == 0)
				return 3; 
			result = word.localeCompare("april");
			if(result == 0)
				return 4; 
			result = word.localeCompare("maj");
			if(result == 0)
				return 5; 
			result = word.localeCompare("juni");
			if(result == 0)
				return 6; 
			result = word.localeCompare("juli");
			if(result == 0)
				return 7; 
			result = word.localeCompare("augusti");
			if(result == 0)
				return 8; 
			result = word.localeCompare("september");
			if(result == 0)
				return 9; 
			result = word.localeCompare("oktober");
			if(result == 0)
				return 10; 
			result = word.localeCompare("november");
			if(result == 0)
				return 11; 
			result = word.localeCompare("december");
			if(result == 0)
				return 12;
			//Return -1 if it is not a month.
			return -1;
		}

		function getPosition(revision) {
			
			var birthplace = "";
			var indx = revision.indexOf("f\u00f6delseplats");

			indx = revision.indexOf("[[", indx) + 2;
			birthplace = revision.substring(indx, revision.indexOf("]]",indx));

			return birthplace;
		}