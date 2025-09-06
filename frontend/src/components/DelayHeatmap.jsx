import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

const DelayHeatmap = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 80, bottom: 40, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.bottom - margin.top;

    const container = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Get unique segments and hours
    const segments = [...new Set(data.map(d => d.segment))];
    const hours = [...new Set(data.map(d => d.hour))];

    // Scales
    const xScale = d3.scaleBand()
      .domain(hours)
      .range([0, width])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(segments)
      .range([0, height])
      .padding(0.05);

    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateRdYlBu)
      .domain([d3.max(data, d => d.delay), 0]);

    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "heatmap-tooltip")
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

    // Add rectangles
    const rects = container.selectAll(".cell")
      .data(data)
      .enter().append("rect")
      .attr("class", "cell")
      .attr("x", d => xScale(d.hour))
      .attr("y", d => yScale(d.segment))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("rx", 4)
      .style("fill", d => colorScale(d.delay))
      .style("stroke", "#1F2937")
      .style("stroke-width", 1)
      .style("opacity", 0);

    // Animate rectangles
    rects.transition()
      .delay((d, i) => i * 50)
      .duration(800)
      .style("opacity", 1);

    // Add hover effects
    rects
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition().duration(100)
          .style("stroke", "#00E5FF")
          .style("stroke-width", 2);
        
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`Segment: ${d.segment}<br/>Hour: ${d.hour}:00<br/>Delay: ${d.delay} min`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition().duration(100)
          .style("stroke", "#1F2937")
          .style("stroke-width", 1);
        
        tooltip.transition().duration(200).style("opacity", 0);
      });

    // Add axes
    container.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("fill", "#9CA3AF")
      .style("font-size", "10px");

    container.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("fill", "#9CA3AF")
      .style("font-size", "10px");

    // Add axis labels
    container.append("text")
      .attr("transform", `translate(${width / 2}, ${height + 35})`)
      .style("text-anchor", "middle")
      .style("fill", "#6B7280")
      .style("font-size", "11px")
      .text("Hour");

    container.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 15)
      .attr("x", 0 - (height / 2))
      .style("text-anchor", "middle")
      .style("fill", "#6B7280")
      .style("font-size", "11px")
      .text("Segment");

    // Add color legend
    const legendWidth = 15;
    const legendHeight = height;
    
    const legendScale = d3.scaleLinear()
      .domain(colorScale.domain())
      .range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5)
      .tickFormat(d => `${d}m`);

    const legend = container.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width + 20}, 0)`);

    // Create gradient for legend
    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
      .attr("id", "legend-gradient");

    const numStops = 10;
    for (let i = 0; i < numStops; i++) {
      const value = colorScale.domain()[0] + (colorScale.domain()[1] - colorScale.domain()[0]) * i / (numStops - 1);
      linearGradient.append("stop")
        .attr("offset", `${100 * i / (numStops - 1)}%`)
        .attr("stop-color", colorScale(value));
    }

    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)")
      .style("stroke", "#374151")
      .style("stroke-width", 1);

    legend.append("g")
      .attr("class", "legend-axis")
      .attr("transform", `translate(${legendWidth}, 0)`)
      .call(legendAxis)
      .selectAll("text")
      .style("fill", "#9CA3AF")
      .style("font-size", "9px");

    // Style axes
    container.selectAll(".domain")
      .style("stroke", "#374151");

    container.selectAll(".tick line")
      .style("stroke", "#374151");

    // Cleanup tooltip on component unmount
    return () => {
      d3.select(".heatmap-tooltip").remove();
    };

  }, [data]);

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-xl rounded-lg border border-white/10 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full"></div>
          <h3 className="text-lg font-bold text-white">Delay Heatmap</h3>
        </div>
        <div className="text-xs text-gray-400">
          Minutes of delay
        </div>
      </div>
      <svg ref={svgRef}></svg>
    </motion.div>
  );
};

export default DelayHeatmap;