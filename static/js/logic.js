function buildPlot() {

  // SVG size
  var svg_lineWidth = 1200;
  var svg_lineHeight = 500;
  
  // margins for SVG
  var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
  };
  
  // final SVG size after borders
  var width = svg_lineWidth - margin.left - margin.right;
  var height = svg_lineHeight - margin.top - margin.bottom;

  // set SVG size
  var svg = d3
  .select("#line")
  .append("svg")
  .attr("width", svg_lineWidth)
  .attr("height", svg_lineHeight);

  // define chart space variable
  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Create a function to parse date and time
  var parseTime = d3.timeParse("%Y");
    
  // download data from mongodb
  let line_url = "/downloadlinechartdata";
  d3.json(line_url).then(function(response) {    
    
    // output data to console
    console.log(response[0]); 
    
    // convert read in data string for year and medal counts
    response[0].all_data.forEach(function(data) {
      data.year = parseTime(data.year);           
      data.medal = +data.medal;      
    });
    // output data to console after conversion
    console.log(response[0]);

    // fit data into SVG space for X axis
    var xTimeScale = d3.scaleTime()
    .domain(d3.extent(response[0].all_data, d => d.year))
    .range([0, width]);

    // fit data into SVG space for Y axis
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(response[0].all_data, d => d.medal)])
    .range([height, 0]);

    // define bottom and left axes
    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y"));
    var leftAxis = d3.axisLeft(yLinearScale);

    // call bottomAxis
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // call LeftAxis
    chartGroup.append("g")
    .call(leftAxis);

    // color setup for different Olympic data
    var cValue_season = function(d) { return d.season_sex;},
    color = d3.scaleOrdinal(d3.schemeCategory10);

     // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(response[0].all_data)
    .enter()
    .append("circle")
    //zoom exp
    .join("circle")
      .attr("cx", d => xTimeScale(d.year))
      .attr("cy", d => yLinearScale(d.medal))
      .attr("r", 9)
      .style("fill", function(d) { return color(cValue_season(d));}) 
      .attr("opacity", ".5");
    
    svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([1, 8])
      .on("zoom", zoomed));

      function zoomed() {
        chartGroup.attr("transform", d3.event.transform);
      }

    // Create Label group for axes 
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 3}, ${height + 10})`);

    // X axis Label
    var xLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    //.attr("value", "num_albums") // value to grab for event listener    
    .text("Summer & Winter Olympic Years (1896-2016)");

    // Y axis Label
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left-5)
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

    // Date formatter to display dates nicely
    var dateFormatter = d3.timeFormat("%Y");

    // D3 Tooltip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`<strong>Olympic Year: ${dateFormatter(d.year)}<hr>Medal(s) Won: ${d.medal}`);
      });
    
    // Create the tooltip in chartGroup
    chartGroup.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    circlesGroup
    .on("mouseover", function(d) {
      toolTip.show(d, this);
    })
    // Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });  
  });
};

// call function above to build chart
buildPlot();
