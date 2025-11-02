import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Props {
  data: any[];
}

export default function MenstrualCycleChart({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    drawChart(data);
  }, [data]);

  const drawChart = (entries: any[]) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 50 };
    const width = 700 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Process data - show cycles
    const cycles = entries.map((entry, i) => {
      const start = new Date(entry.startDate);
      const end = entry.endDate ? new Date(entry.endDate) : new Date(start.getTime() + 5 * 24 * 60 * 60 * 1000);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

      return {
        index: i,
        start,
        end,
        duration,
        intensity: entry.flowIntensity,
        symptoms: entry.symptoms?.length || 0,
      };
    });

    // Scales
    const x = d3
      .scaleTime()
      .domain([
        d3.min(cycles, (d) => d.start) as Date,
        d3.max(cycles, (d) => new Date(d.end.getTime() + 21 * 24 * 60 * 60 * 1000)) as Date,
      ])
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(cycles.map((_, i) => `Cycle ${i + 1}`))
      .range([0, height])
      .padding(0.3);

    // Color scale for flow intensity
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(['light', 'medium', 'heavy'])
      .range(['#FCA5A5', '#F87171', '#DC2626']);

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat('%b %d') as any))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#6B7280')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Add Y axis
    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6B7280');

    // Draw period bars
    g.selectAll('.period')
      .data(cycles)
      .enter()
      .append('rect')
      .attr('class', 'period')
      .attr('x', (d) => x(d.start))
      .attr('y', (d) => y(`Cycle ${d.index + 1}`) || 0)
      .attr('width', (d) => x(d.end) - x(d.start))
      .attr('height', y.bandwidth())
      .attr('fill', (d) => colorScale(d.intensity))
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.7);

        // Tooltip
        const tooltip = g
          .append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${x(d.start) + (x(d.end) - x(d.start)) / 2},${(y(`Cycle ${d.index + 1}`) || 0) - 10})`);

        tooltip
          .append('rect')
          .attr('x', -60)
          .attr('y', -40)
          .attr('width', 120)
          .attr('height', 35)
          .attr('fill', '#1F2937')
          .attr('rx', 4);

        tooltip
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('y', -25)
          .style('fill', '#fff')
          .style('font-size', '11px')
          .text(`${Math.round(d.duration)} days`);

        tooltip
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('y', -12)
          .style('fill', '#fff')
          .style('font-size', '10px')
          .text(`${d.symptoms} symptoms`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
        g.selectAll('.tooltip').remove();
      });

    // Predict next cycle (28-day average)
    const lastCycle = cycles[cycles.length - 1];
    const nextCycleStart = new Date(lastCycle.start.getTime() + 28 * 24 * 60 * 60 * 1000);
    const nextCycleEnd = new Date(nextCycleStart.getTime() + lastCycle.duration * 24 * 60 * 60 * 1000);

    g.append('rect')
      .attr('x', x(nextCycleStart))
      .attr('y', height - y.bandwidth() - 20)
      .attr('width', x(nextCycleEnd) - x(nextCycleStart))
      .attr('height', y.bandwidth())
      .attr('fill', '#9CA3AF')
      .attr('rx', 4)
      .attr('opacity', 0.5)
      .attr('stroke', '#6B7280')
      .attr('stroke-dasharray', '5,5');

    g.append('text')
      .attr('x', x(nextCycleStart) + (x(nextCycleEnd) - x(nextCycleStart)) / 2)
      .attr('y', height - 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#6B7280')
      .text('Predicted');

    // Legend
    const legend = g.append('g').attr('transform', `translate(${width - 200}, -10)`);

    ['light', 'medium', 'heavy'].forEach((intensity, i) => {
      legend
        .append('rect')
        .attr('x', i * 65)
        .attr('y', 0)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colorScale(intensity))
        .attr('rx', 2);

      legend
        .append('text')
        .attr('x', i * 65 + 20)
        .attr('y', 12)
        .style('font-size', '11px')
        .style('fill', '#6B7280')
        .text(intensity);
    });
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="w-full"></svg>
    </div>
  );
}
