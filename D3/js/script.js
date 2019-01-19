d3.json('js/data/filmGrosing.json', function(d) {

  var movieName = [],
    totalGros = [],
    margin = {
      top: 0,
      right: 0,
      bottom: 300,
      left: 20
    }
  height = 800 - margin.top - margin.bottom,
    width = 600 - margin.left - margin.right,
    grapwidth = 10000;

  var tempColor;

  for (var i = 0; i < d.Movies.length; i++) {
    movieName.push(d.Movies[i].name);
    totalGros.push(d.Movies[i].total_gros);
  }


  var yScale = d3.scaleLinear()
    .domain([0, d3.max(totalGros)])
    .range([0, height]);

  var yAxisValues = d3.scaleLinear()
    .domain([0, d3.max(totalGros)])
    .range([height, 0]);

  var yAxisTicks = d3.axisLeft(yAxisValues)
    .ticks(10)


  var xScale = d3.scaleBand()
    .domain(totalGros)
    .paddingInner(.2)
    .paddingOuter(.2)
    .range([0, width])

  var xAxisValues = d3.scaleBand()
    .domain(movieName)
    .range([0, width]);

  var xAxisTicks = d3.axisBottom(xAxisValues)
    .ticks(10)

  var colors = d3.scaleLinear()
    .domain([0, 2000000000, d3.max(totalGros)])
    .range(['#FD9497', '#C83A3E', '#810508'])

  var tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'white')
    .style('opacity', 0);

  var movieChart = d3.select('#viz').append('svg')
    .attr('width', grapwidth)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
      'translate(' + 200 + ',' + margin.right + ')')
    .style('background', '#C9D7D6')
    .selectAll('rect').data(totalGros)
    .enter().append('rect')
    .attr('fill', colors)
    .attr('width', function(d) {
      return xScale.bandwidth();
    })
    .attr('height', 0)
    .attr('x', function(d) {
      return xScale(d);
    })
    .attr('y', height)

    .on('mouseover', function(d) {
      tooltip.transition().duration(200)
        .style('opacity', .9)
      tooltip.html(
          '<div style="font-size: 2rem; font-weight: bold"> &dollar;' +
          d + '</div>'
        )
        .style('left', (d3.event.pageX - 35) + 'px')
        .style('top', (d3.event.pageY - 30) + 'px')
      tempColor = this.style.fill;
      d3.select(this)
        .style('fill', 'blue')
    })

    .on('mouseout', function(d) {
      tooltip.html('')
      d3.select(this)
        .style('fill', tempColor)
    });

  var yGuide = d3.select('#viz svg').append('g')
    .attr('transform', 'translate(200,0)')
    .call(yAxisTicks)
  var xGuide = d3.select('#viz svg').append('g')
    .attr('transform', 'translate(200,' + height + ')')
    .call(xAxisTicks)
    .selectAll("text")
    .style("text-anchor", "start")
    .style("font", "12px times")
    .attr("dx", ".8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
      return "rotate(80)"
    });


  movieChart.transition()
    .attr('height', function(d) {
      return yScale(d);
    })
    .attr('y', function(d) {
      return height - yScale(d);
    })
    .delay(function(d, i) {
      return i * 20;
    })
    .duration(1000)
    .ease(d3.easeElastic)


});
