// Set up the dimensions of the chart
const margin = { top: 70, right: 40, bottom: 60, left: 175 };
const width = 660 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create the SVG container for the chart
const svg = d3.select("#body-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load and process the COVID-19 data
d3.csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv", rowConverter).then(data => {

    // Filter the data for entries where the value on '03/03/2022' is greater than 0
    const newDataSet = data.filter(d => d.cases > 0);

    // Sort the new data by total
    newDataSet.sort((a, b) => d3.ascending(a.cases, b.cases));

    // Set the x and y scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(newDataSet, d => d.cases)])
        .range([0, width]);

    const y = d3.scaleBand()
        .range([height, 0])
        .domain(newDataSet.map(d => d.country))
        .padding(0.1);

    // Create the x and y axes
    const xAxis = d3.axisBottom(x)
        .ticks(5);

    const yAxis = d3.axisLeft(y)
        .tickPadding(10)
        .tickSize(0);

    // Create the bars for the chart
    svg.selectAll(".bar")
        .data(newDataSet)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.country))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", d => x(d.cases))
        .style('fill', 'skyblue');

    // Add the x and y axes to the chart
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    // Add labels to the end of each chart
    svg.selectAll(".label")
        .data(newDataSet)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.cases) + 5)
        .attr("y", d => y(d.country) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("fill", "red")
        .text(d => d.cases);

});

// Define the rowConverter function
function rowConverter(d) {
    // Convert string dates to JavaScript Date objects
    const dateParser = d3.timeParse("%m/%d/%y");
    return {
        country: d["Country/Region"],
        date: dateParser(Object.keys(d).slice(4)[0]),
        cases: parseFloat(d["03/03/2022"]), // Change the key to match your date format
        latitude: parseFloat(d["Lat"]),
        longitude: parseFloat(d["Long"])
        // Add other properties as needed
    };
}
