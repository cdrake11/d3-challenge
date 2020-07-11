
// all work is coming from the d3 week 3 activity
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

 // Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins. 
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read in data file using D3
d3.csv("data.csv").then(function (chartData) {
    console.log(chartData)
    // Parse Data as numbers
    chartData.forEach(function (data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
    });

    // Create scale functions for x and why
    // remember logic from Devang: Json and Dictionary are essentially the same thing
    //it has arrays and the arrays has keys and values in order to understand each line of code
    var xLinearScale = d3.scaleLinear()
        .domain([8.5, d3.max(chartData, d => d.age)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([3.5, d3.max(chartData, d => d.smokes)])
        .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);
    
    // Create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(chartData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "purple")
    .attr("opacity", ".5");    

    // Initialize tooltip... make sure versions are correct.. that was the problem the first time I did this
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
         return (`${d.state}<br> Age(Median): ${d.age}%<br> Smokes : ${d.smokes}%`);
        });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
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
        .text("Smokes(%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Age(Median)");
    }).catch(function(error) {
      console.log(error);
});
