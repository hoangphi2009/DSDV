//set up the dimensions of the chart
const margin = { top: 70, right: 40, bottom: 60, left: 175 }
const width = 660 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom;

//create the SVG container for the chart
const svg = d3.select("#body-chart")
.append("svg")
.attr("width",width+margin.left+margin.right)
.attr("height",height+margin.top+margin.bottom)
.append("g")
.attr("transform","translate("+margin.left+","+margin.top+")");

//load and process the data
d3.csv("bog_bodies.csv").then(data =>{
    data.forEach(d=>{
        d.total= +d.total;
    });
    // console.log(data);
//sort the data by total

data.sort(function(a,b){
    return d3.ascending(a.total,b.total);
});


//set the x and y scales
const x =d3.scaleLinear()
.domain([0, d3.max(data,function(d){return d.total;})])
.range([0,width]);

const y =d3.scaleBand()
.range([height,0])
.domain(data.map(function(d){return d.bog_body_type;}))
.padding(0.1);
//create the x and y axes
const xAxis = d3.axisBottom(x)
//number of ticks in the x axis
    .ticks(5)
    .tickSize(0);//remove the ticks


const yAxis = d3.axisLeft(y)
    .tickPadding(10)
    .tickSize(0);
//create the bars for the chart

svg.selectAll(".bar")
.data(data)
.enter()
.append("rect")
.attr("class", "bar")
.attr("y",function(d) { return y(d.bog_body_type);})
.attr("height",y.bandwidth())
.attr("x",0)
.attr("width",function(d) { return x(d.total);})
.style('fill', 'skyblue')


//Add the x and y axes to the chart
svg.append("g")
.attr("transform","translate(0,"+height+")")
.call(xAxis);

svg.append("g")
.call(yAxis);
//Add labels to the end of each chart

svg.selectAll(".label")
.data(data)
.enter()
.append("text")
.attr("class", "label")
.attr("x",function(d) { return x(d.total)+5;})
.attr("y",function(d) { return y(d.bog_body_type)+y.bandwidth()/2;})
.attr("dy",".35em")
.style("font-size","10px")
.style("font-weight","bold")
.style("fill","red")
.text(function(d) { return d.total;});

})
