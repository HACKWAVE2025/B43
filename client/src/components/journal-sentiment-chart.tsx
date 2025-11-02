import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { analyzeSentiment } from './services/sentiment-service';

interface Props {
  entries: any[];
}

export default function JournalSentimentChart({ entries }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || entries.length === 0) return;

    // Calculate sentiment for entries if not already done
    const processedEntries = entries.slice(-14).map((entry) => ({
      date: new Date(entry.date),
      sentiment: entry.sentiment || 0.5,
    }));

    drawChart(processedEntries);
  }, [entries]);

  const drawChart = (data: any[]) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 700 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date.toLocaleDateString()))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#6B7280')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Add Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6B7280');

    // Color scale
    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, 0.5, 1])
      .range(['#EF4444', '#F59E0B', '#10B981']);

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.date.toLocaleDateString()) || 0)
      .attr('y', (d) => y(d.sentiment))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d.sentiment))
      .attr('fill', (d) => colorScale(d.sentiment))
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 0.7);

        // Tooltip
        const tooltip = g
          .append('g')
          .attr('class', 'tooltip')
          .attr(
            'transform',
            `translate(${(x(d.date.toLocaleDateString()) || 0) + x.bandwidth() / 2},${y(d.sentiment) - 10})`
          );

        tooltip
          .append('rect')
          .attr('x', -35)
          .attr('y', -30)
          .attr('width', 70)
          .attr('height', 25)
          .attr('fill', '#1F2937')
          .attr('rx', 4);

        tooltip
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('y', -15)
          .style('fill', '#fff')
          .style('font-size', '12px')
          .text(`${Math.round(d.sentiment * 100)}%`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
        g.selectAll('.tooltip').remove();
      });

    // Add reference line at 0.5 (neutral)
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', y(0.5))
      .attr('y2', y(0.5))
      .attr('stroke', '#9CA3AF')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5,5');

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
      .text('Sentiment Score');
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No data to display yet. Keep journaling!</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="w-full"></svg>
    </div>
  );
}
