console.log('logic.js')

function buildPlot() {
    
  // olympic spinner code
  $( document ).ready(function() {
	
    // Loop through each nav item
    $('.spinner-container').children('.spinner').each(function(index){
          
      // Turn the index value into a reasonable animation delay
      var delay = index*0.3;
          
      // Apply the animation delay
      // $(this).css("animation-delay", delay + "s")    
      });
  });
  
  var svgWidth = 960;
  var svgHeight = 500;
  
  var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
  };
  
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = d3
  .select(".line")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // download data from mongodb
  let line_url = "/downloadlinechartdata";
  d3.json(line_url).then(function(response) {
    
    // output data to console
    console.log(response[0].summer_female_medal.length); 
    console.log(response[0]); 
    
    //function to convert string array to integer array
    function ArraytoInt (inputArray) {
      var outputArray = [];
      for (var i = 0; i < inputArray.length; i++) {
        outputArray[i] = parseInt(inputArray[i]);
      }
      console.log(outputArray);
      return outputArray;
    }

    //convert all arrays from string into integer arrays
    summer_female_medal_int = ArraytoInt(response[0].summer_female_medal);
    summer_female_year_int = ArraytoInt(response[0].summer_female_year);
    summer_male_medal_int = ArraytoInt(response[0].summer_male_medal);
    summer_male_year_int = ArraytoInt(response[0].summer_male_year);
    winter_female_medal_int = ArraytoInt(response[0].winter_female_medal);
    winter_female_year_int = ArraytoInt(response[0].winter_female_year);
    winter_male_medal_int = ArraytoInt(response[0].winter_male_medal);
    winter_male_year_int = ArraytoInt(response[0].winter_male_year);




    });
  

  //});
};

buildPlot();
