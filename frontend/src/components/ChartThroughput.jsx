import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

const ChartThroughput = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.bottom - margin.top;

    const container = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scalePoint()
      .domain(data.map(d => d.time))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.1])
      .range([height, 0]);

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.value))
      .curve(d3.curveCardinal.tension(0.3));

    // Area generator
    const area = d3.area()
      .x(d => xScale(d.time))
      .y0(height)
      .y1(d => yScale(d.value))
      .curve(d3.curveCardinal.tension(0.3));

    // Gradient definition
    const defs = container.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "areaGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", 0)
      .attr("x2", 0).attr("y2", height);

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#00D1B2")
      .attr("stop-opacity", 0.6);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#00D1B2")
      .attr("stop-opacity", 0.1);

    // Add area
    const areaPath = container.append("path")
      .datum(data)
      .attr("fill", "url(#areaGradient)")
      .attr("d", area);

    // Add line
    const linePath = container.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#00E5FF")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Get path length for animation
    const totalLength = linePath.node().getTotalLength();

    // Animate line drawing
    linePath
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Add dots
    const dots = container.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.time))
      .attr("cy", d => yScale(d.value))
      .attr("r", 0)
      .attr("fill", "#00E5FF")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2);

    // Animate dots
    dots.transition()
      .delay((d, i) => i * 200)
      .duration(300)
      .attr("r", 4);

    // Add tooltip functionality
    const tooltip = d3.select("body").append("div")
      .attr("class", "d3-tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("backdrop-filter", "blur(12px)")
      .style("border", "1px solid rgba(255, 255, 255, 0.2)");

    dots
      .on("mouseover", function(event, d) {
        d3.select(this).transition().duration(100).attr("r", 6);
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`Time: ${d.time}<br/>Throughput: ${d.value} tr/hr`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).transition().duration(100).attr("r", 4);
        tooltip.transition().duration(200).style("opacity", 0);
      });

    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .tickSize(-height)
      .tickFormat(d => d);

    const yAxis = d3.axisLeft(yScale)
      .tickSize(-width)
      .ticks(5);

    container.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("fill", "#9CA3AF")
      .style("font-size", "10px");

    container.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("fill", "#9CA3AF")
      .style("font-size", "10px");

    // Style grid lines
    container.selectAll(".tick line")
      .style("stroke", "#374151")
      .style("stroke-opacity", 0.3);

    container.selectAll(".domain")
      .style("stroke", "#374151");

    // Cleanup tooltip on component unmount
    return () => {
      d3.select(".d3-tooltip").remove();
    };

  }, [data]);

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-xl rounded-lg border border-white/10 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"></div>
        <h3 className="text-lg font-bold text-white">Throughput</h3>
      </div>
      <svg ref={svgRef}></svg>
    </motion.div>
  );
};

export default ChartThroughput;