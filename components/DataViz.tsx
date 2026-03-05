import * as React from 'react';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataVizProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  animate?: boolean;
}

const DataViz: React.FC<DataVizProps> = ({ data, color = 'currentColor', height = 80, width = 300, animate = false }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 15, right: 15, bottom: 15, left: 15 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    const lineGenerator = d3.line<number>()
      .x((_, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveStepAfter);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Grid System - Subtle and technical
    g.append('g')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(y).ticks(3).tickSize(-innerWidth).tickFormat(() => ''))
      .selectAll('line').attr('stroke', color).attr('stroke-dasharray', '2,2');

    g.append('g')
      .attr('opacity', 0.1)
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(-innerHeight).tickFormat(() => ''))
      .selectAll('line').attr('stroke', color).attr('stroke-dasharray', '2,2');

    const areaGenerator = d3.area<number>()
        .x((_, i) => x(i))
        .y0(innerHeight)
        .y1(d => y(d))
        .curve(d3.curveStepAfter);
        
    const areaPath = g.append('path')
        .datum(data)
        .attr('fill', color)
        .attr('fill-opacity', 0)
        .attr('d', areaGenerator);

    if (animate) {
      areaPath.transition().duration(1200).delay(400).attr('fill-opacity', 0.08);
    } else {
      areaPath.attr('fill-opacity', 0.08);
    }

    const path = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

    if (animate) {
      const totalLength = path.node()?.getTotalLength() || 0;
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
    }

    // Industrial Orange Nodes
    const dots = g.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (_, i) => x(i))
      .attr('cy', (d: number) => y(d))
      .attr('r', 3)
      .attr('fill', '#FF3300')
      .attr('stroke', color)
      .attr('stroke-width', 1)
      .attr('opacity', animate ? 0 : 1);

    if (animate) {
      dots.transition()
        .delay((_, i) => 1000 + (1000 * (i / data.length)))
        .attr('opacity', 1)
        .attr('r', 4)
        .transition()
        .duration(300)
        .attr('r', 3);
    }

  }, [data, color, height, width, animate]);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <svg 
        ref={svgRef} 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-full overflow-visible drop-shadow-sm" 
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export default DataViz;