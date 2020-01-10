// Create a scatter plot between two of the data variables 
// Smokers vs. Age

// Set up our chart
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

// Create an SVG wrapper: append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
// Load data.csv
d3.csv("data/data.csv").then(function(healthcareData) {

// Cast each value in healthcareData using the unary + operator
  healthcareData.forEach(function(data) {
    data.age = +data.age;
    data.smokes = +data.smokes;
  });


// Create Scales
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(healthcareData, d => d.age))
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([d3.extent(healthcareData, d => d.smokes)])
    .range([height, 0]);

// Create Axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);


// Append the axes to the chartGroup
// Add bottomAxis
  chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);

  // Add leftAxis to the left side of the display
  chartGroup.append("g").call(leftAxis);


  // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthcareData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".7");

// Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Age: ${d.age}<br>Smoking Habits: ${d.smokes}`);
      });

// Create tooltip in the chart
    chartGroup.call(toolTip);

// Create event listeners to display and hide the tooltip
   
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
    // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smoking Habits");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Age");
   }).catch(function(error) {
    console.log(error);
  });