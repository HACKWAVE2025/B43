import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getStressTrends } from './services/ml-service';

export default function StressTrendChart() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const data = getStressTrends();
    drawChart(data);
  }, []);

  const drawChart = (data: any[]) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d: any) => new Date(d.timestamp)) as [Date, Date])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, 10])
      .range([height, 0]);

    // Line generator
    const line = d3
      .line<any>()
      .x((d) => x(new Date(d.timestamp)))
      .y((d) => y(d.score))
      .curve(d3.curveMonotoneX);

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(7).tickFormat(d3.timeFormat('%b %d') as any))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6B7280');

    // Add Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6B7280');

    // Add stress level zones
    const zones = [
      { name: 'No Stress', max: 2.5, color: '#10B981' },
      { name: 'Low Stress', max: 5, color: '#F59E0B' },
      { name: 'Moderate', max: 7.5, color: '#F97316' },
      { name: 'High Stress', max: 10, color: '#EF4444' },
    ];

    let prevMax = 0;
    zones.forEach((zone) => {
      g.append('rect')
        .attr('x', 0)
        .attr('y', y(zone.max))
        .attr('width', width)
        .attr('height', y(prevMax) - y(zone.max))
        .attr('fill', zone.color)
        .attr('opacity', 0.1);
      prevMax = zone.max;
    });

    // Add gradient
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', y(0))
      .attr('x2', 0)
      .attr('y2', y(10));

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#EF4444');

    gradient
      .append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#F59E0B');

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#10B981');

    // Add the line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#line-gradient)')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add dots
    g.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d: any) => x(new Date(d.timestamp)))
      .attr('cy', (d: any) => y(d.score))
      .attr('r', 5)
      .attr('fill', '#8B5CF6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d: any) {
        d3.select(this).attr('r', 7);

        // Tooltip
        const tooltip = g
          .append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${x(new Date(d.timestamp))},${y(d.score) - 20})`);

        tooltip
          .append('rect')
          .attr('x', -40)
          .attr('y', -30)
          .attr('width', 80)
          .attr('height', 25)
          .attr('fill', '#1F2937')
          .attr('rx', 4);

        tooltip
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('y', -15)
          .style('fill', '#fff')
          .style('font-size', '12px')
          .text(`${d.level}`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 5);
        g.selectAll('.tooltip').remove();
      });

    // Add labels
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + 35)
      .style('font-size', '12px')
      .style('fill', '#6B7280')
      .text('Date');

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', -35)
      .attr('x', -height / 2)
      .style('font-size', '12px')
      .style('fill', '#6B7280')
      .text('Stress Score');
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="w-full"></svg>
    </div>
  );
}
