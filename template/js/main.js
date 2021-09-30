
// SVG drawing area

var margin = {top: 40, right: 10, bottom: 60, left: 60};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
var group = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Scales
var x = d3.scaleBand()
    .rangeRound([0, width])
	.paddingInner(0.1);

var y = d3.scaleLinear()
    .range([height, 0]);


// Initialize data
loadData();


// Create a 'data' property under the window object
// to store the coffee chain data
Object.defineProperty(window, 'data', {
	// data getter
	get: function() { return _data; },
	// data setter
	set: function(value) {
		_data = value;
		// update the visualization each time the data property is set by using the equal sign (e.g. data = [])
		updateVisualization()
	}
});

// Load CSV file
function loadData() {
	
	d3.csv("data/coffee-house-chains.csv").then(function(csv) {

		csv.forEach(function(d){
			d.revenue = +d.revenue;
			d.stores = +d.stores;
		});

		// Store csv data in global variable
		data = csv;
		console.log(data)
		// updateVisualization gets automatically called within the data = csv call;
		// basically(whenever the data is set to a value using = operator);
		// see the definition above: Object.defineProperty(window, 'data', { ...

	});

}

// Render visualization
function updateVisualization() {

  console.log(data);
  var select = document.getElementById('ranking-type');
  var valueSelected = select.options[select.selectedIndex].value;
  x.domain(data.map(function (d){return d.company}));
  y.domain(data.map(function (d){return d[valueSelected]}));

  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);
  // Draw the axis
	svg.append("g")
		.attr("class", "axis x-axis")
		.attr("transform", "translate(" + margin.top * 2.7 + "," + height + ")")
		.call(xAxis);
	svg.append("g")
		.attr("class", "axis y-axis")
		.attr("transform", "translate(" + (margin.left * 1.5) + "," + 0 + ")")
		.call(yAxis);

	data.sort(function(a, b) { return b.stores - a.stores; });

	var selection = svg.selectAll("rect").data(data)

	//enter:

	selection.enter().append("rect")
		.attr("x", function(d) { return x(d.company); })
		.attr("y", function(d) { return y(d.stores); })
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height - y(d.stores); })
		.attr("class", "bar");


	//exit:

	selection.exit().remove();




}