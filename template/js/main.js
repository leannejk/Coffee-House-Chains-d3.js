
// SVG drawing area

var margin = {top: 40, right: 10, bottom: 60, left: 100};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)


// Scales
var x = d3.scaleBand()
    .rangeRound([0, width])
	.paddingInner(0.1);

var y = d3.scaleLinear()
    .range([height, 0]);

var yscale = svg.append("g")
var xscale = svg.append("g")

var yAxisLabel = svg.append("text")
	.attr("x", 20)
	.attr("y", height / 2)
	.attr("class", "label")
	.attr("transform", "translate(-150,250) rotate("+270+")")
	.text("Stores")


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


	var select = document.getElementById('ranking-type');
	var valueSelected = String(select.options[select.selectedIndex].value);
	y.domain([0, d3.max(data, function (d) {
		return d[valueSelected];
	})])

	data.sort(function(a, b) { return b[valueSelected] - a[valueSelected] });
	x.domain(data.map(function (d){return d.company}));


  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);
  // Draw the axis
	xscale
		.attr("class", "axis x-axis")
		.attr("transform", "translate(" + margin.left + "," + height + ")")
		.transition()
		.duration(3000)
		.call(xAxis);

	yscale
		.attr("class", "axis y-axis")
		.attr("transform", "translate(" + margin.left + "," + 0 + ")")
		.transition()
		.duration(3000)
		.call(yAxis);


	var selection = svg.selectAll("rect").data(data)

	//enter:

	selection.enter().append("rect")
		.attr("class", "bar")
		.merge(selection)
		.attr("x", function(d) { return x(d.company) + margin.left; })
		.attr("width", x.bandwidth())
		.transition()
		.duration(3000)
		.attr("y", function(d) { return y(d[valueSelected]); })
		.attr("height", function(d) {
			return height - y(d[valueSelected]); })

	//exit:

	selection.exit()
		.remove();

	//text:

	if(valueSelected === "revenue"){
		yAxisLabel
			.text("Billion USD")

	}



}


