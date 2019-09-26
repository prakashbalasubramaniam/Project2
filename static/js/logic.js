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
  
  //define SVG size
var svgWidth = 960;
var svgHeight = 500;

//define margins for SVG
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

//define drawing area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create an SVG wrapper, append an SVG group that will hold our chart,
//and shift the latter by left and top margins.
var svg = d3.select("#line")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial Params load
var chosenXAxis = "Years";
var chosenYAxis = "No. of Medals";  

//var i = 0;
var age = [];
  // download data from mongodb
  let line_url = "/downloadolympicdata";
  d3.json(line_url).then(function(response) {
    // output data to console
    //console.log(response); 
      //parse data
  
    // response.forEach(function(data) {
    //   //console.log(data);
    //   //i++;
    //   data.all_data.year = +data.all_data.year;      
    //   console.log(+data.all_data.year);
    //   console.log(i);
    //   //i++;
    for (i = 0; i < response[0].all_data.length; i++) {
      response[0].all_data[i].year = +response[0].all_data[i].year; 
      //console.log(response[0].all_data[i].year);
      //console.log(i);
    }

    console.log(response[0].all_data)
  });
  

  //});
};

buildPlot();
