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
  
  var svgWidth = 1200;
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
  .select("#line")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Create a function to parse date and time
  var parseTime = d3.timeParse("%Y");
    
  // download data from mongodb
  let line_url = "/downloadlinechartdata";
  d3.json(line_url).then(function(response) {    
    
    // output data to console
    console.log(response[0]); 
    
    response[0].all_data.forEach(function(data) {
      data.year = parseTime(data.year);           
      data.medal = +data.medal;      
    });
    // output data to console after conversion
    console.log(response[0]);

    var xTimeScale = d3.scaleTime()
    .domain(d3.extent(response[0].all_data, d => d.year))
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(response[0].all_data, d => d.medal))
    .range([height, 0]);

    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y"));
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    var cValue_season = function(d) { return d.season_sex;},
    color = d3.scaleOrdinal(d3.schemeCategory10);

     // append initial circles
    var circlesGroup_summer_female = chartGroup.selectAll("circle")
    .data(response[0].all_data)
    .enter()
    .append("circle")
    .attr("cx", d => xTimeScale(d.year))
    .attr("cy", d => yLinearScale(d.medal))
    .attr("r", 5)
    .style("fill", function(d) { return color(cValue_season(d));}) 
    .attr("opacity", ".5");
  
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 3}, ${height + 10})`);

    var xLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    //.attr("value", "num_albums") // value to grab for event listener    
    .text("Summer & Winter Olympic Years (1896-2016)");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height-50))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Number of Medals Won (Gold, Silver & Bronze)");

    // draw legend
    var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
    .attr("x", width - 500)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  // draw legend text
  legend.append("text")
    .attr("x", width - 500)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d;})

  
  var cities = color.domain().map(function(name) {
      return {
        name: name,
        values: response[0].all_data.map(function(d) {
          return {
            year: d.year,
            medals: +d[name]
          };
        })
      };
    });

    var mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

  mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");
    
  var lines = document.getElementsByClassName('line');

  var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(cities)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

  mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", function(d) {
      return color(d.season_sex);
    })
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  mousePerLine.append("text")
    .attr("transform", "translate(10,3)");

  mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', width) // can't catch mouse events on a g element
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() { // on mouse out hide line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "0");
    })
    .on('mouseover', function() { // on mouse in show line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "1");
    })
    .on('mousemove', function() { // mouse moving over canvas
      var mouse = d3.mouse(this);
      d3.select(".mouse-line")
        .attr("d", function() {
          var d = "M" + mouse[0] + "," + height;
          d += " " + mouse[0] + "," + 0;
          return d;
        });

      d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {
          console.log(width/mouse[0])
          var xDate = xTimeScale.invert(mouse[0]),
              bisect = d3.bisector(function(d) { return d.year; }).right;
              idx = bisect(d.values, xDate);
          
          var beginning = 0,
              end = lines[i].getTotalLength(),
              target = null;

          while (true){
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                break;
            }
            if (pos.x > mouse[0])      end = target;
            else if (pos.x < mouse[0]) beginning = target;
            else break; //position found
          }
          
          d3.select(this).select('text')
            .text(y.invert(pos.y).toFixed(2));
            
          return "translate(" + mouse[0] + "," + pos.y +")";
        });
      });

  });
};

buildPlot();
