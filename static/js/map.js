var format = d3.format(",");

// Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Medal Wins: </strong><span class='details'>" + format(d.medal_count) +"</span>";
            })

var margin = {
                top: 0, right: 0, bottom: 0, left: 0
             },
             width = 1600 - margin.left - margin.right,
             height = 800 - margin.top - margin.bottom;

var color = d3.scaleThreshold()
    .domain([600,1200,1800,2400,3000,3600,4200,4800,5400])
    .range(['#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58']);

var path = d3.geoPath();

// Create <svg> element
var svg = d3.select("#map")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

// Create <g> element
svg = svg.append('g').attr('class', 'map');

// Create a project
var projection = d3.geoMercator()
                   .scale(140)
                   .translate( [width / 2, height / 1.5]);

// Apply project
var path = d3.geoPath().projection(projection);

// Attach tool tip 
svg.call(tip);

// download data from mongodb
let map_url = "/downloadmapdata";
let mapmedal_url = "/downloadmapmedaldata";
// Read in the .json and raw table data
// https://stackoverflow.com/questions/49534470/d3-js-v5-promise-all-replaced-d3-queue
var promises = [ 
                  d3.json(map_url), 
                  d3.json(mapmedal_url)
                ];

// Read the files by                 
Promise.all(promises).then((output) => { 
  console.log(output)
  // output = [ result(json), result(json)]
  ready(output[0], output[1]);
});

  // d3.json(mapmedal_url).then(function(response) {    
    
  //   // output data to console
  //   console.log(response[0]); })

// This is called when world_countries.json and mapviz.tsv finishes reading.
// data variable => world_countries.json
// medal variable => mapviz.tsv
function ready(data, medal) {
  var medalById = {};
  medal.forEach(
    (d)=> { 
      medalById[d.id] = +d.medal_count; 
    }
  );
  console.log('debug')
  console.log(data[0].features)
  // Added medal count info to the data object. 
  data[0].features.forEach(
    function(d) { 
      d.medal_count = medalById[d.id]
    });

  // Adding the country drawings
  svg.append("g")
      .attr("class", "countries")
      .selectAll("path")  // creating the SVG paths 
      .data(data[0].features) // attaching the array of country polygon (lat/long)
      .enter()  // drawing the polygons
      .append("path")
      .attr("d", path) 
      .style("fill", function(d) { 
        return color(medalById[d.id]);  // # of medals  
      })
      .style('stroke', '#808080')  // border of the polygons
      .style('stroke-width', 1.5)  // how thick it is
      .style("opacity",0.8) // opacity
      .style("stroke","white")
      .style('stroke-width', 0.3)
      .on('mouseover',function(d){    
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","black")
            .style("stroke-width",3);
      })
      .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
      })
      function zoomed() {
        projection
          .translate(zoom.translate())
          .scale(zoom.scale());

  
}

}