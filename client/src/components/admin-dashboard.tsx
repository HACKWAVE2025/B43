import React, { useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Activity, AlertTriangle, TrendingUp, CheckCircle, Phone } from 'lucide-react';
import { getAnalyticsData } from './services/data-service';
import { getFeatureImportance } from './services/ml-service';
import * as d3 from 'd3';

export default function AdminDashboard() {
  const featureChartRef = useRef<SVGSVGElement>(null);
  const completionChartRef = useRef<SVGSVGElement>(null);

  const analytics = getAnalyticsData();

  useEffect(() => {
    drawFeatureImportanceChart();
    drawCompletionChart();
  }, []);

  const drawFeatureImportanceChart = () => {
    if (!featureChartRef.current) return;

    const data = getFeatureImportance();
    const svg = d3.select(featureChartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 120 };
    const width = 500 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 0.3]).range([0, width]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.feature))
      .range([0, height])
      .padding(0.2);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat((d) => `${(d as number * 100).toFixed(0)}%`))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#6B7280');

    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6B7280');

    const colorScale = d3.scaleSequential(d3.interpolatePurples).domain([0, 0.3]);

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('y', (d) => y(d.feature) || 0)
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', (d) => x(d.importance))
      .attr('fill', (d) => colorScale(d.importance))
      .attr('rx', 4);

    g.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('x', (d) => x(d.importance) + 5)
      .attr('y', (d) => (y(d.feature) || 0) + y.bandwidth() / 2 + 4)
      .style('font-size', '11px')
      .style('fill', '#6B7280')
      .text((d) => `${(d.importance * 100).toFixed(0)}%`);
  };

  const drawCompletionChart = () => {
    if (!completionChartRef.current) return;

    const data = [
      { day: 'Mon', rate: 75 },
      { day: 'Tue', rate: 82 },
      { day: 'Wed', rate: 78 },
      { day: 'Thu', rate: 85 },
      { day: 'Fri', rate: 80 },
      { day: 'Sat', rate: 72 },
      { day: 'Sun', rate: 68 },
    ];

    const svg = d3.select(completionChartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.day))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#6B7280');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d}%`))
      .selectAll('text')
      .style('font-size', '11px')
      .style('fill', '#6B7280');

    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'bar-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#8B5CF6');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#6366F1');

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.day) || 0)
      .attr('y', (d) => y(d.rate))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d.rate))
      .attr('fill', 'url(#bar-gradient)')
      .attr('rx', 4);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System analytics and user insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl text-gray-900">{analytics.totalUsers.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Today</p>
              <p className="text-3xl text-gray-900">{analytics.activeToday}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">High Stress Users</p>
              <p className="text-3xl text-gray-900">{analytics.highStressUsers}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Completion</p>
              <p className="text-3xl text-gray-900">{analytics.completionRate}%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl text-gray-900 mb-4">ML Feature Importance</h2>
          <p className="text-sm text-gray-600 mb-4">Random Forest model feature weights</p>
          <div className="w-full overflow-x-auto">
            <svg ref={featureChartRef} className="w-full"></svg>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl text-gray-900 mb-4">Todo Completion Rate</h2>
          <p className="text-sm text-gray-600 mb-4">Weekly completion trends</p>
          <div className="w-full overflow-x-auto">
            <svg ref={completionChartRef} className="w-full"></svg>
          </div>
        </Card>
      </div>

      {/* Activity Log */}
      <Card className="p-6">
        <h2 className="text-xl text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            {
              type: 'emergency',
              message: 'Emergency call initiated by user #4521',
              time: '5 min ago',
              icon: Phone,
            },
            {
              type: 'high-stress',
              message: '12 users flagged with high stress levels',
              time: '23 min ago',
              icon: AlertTriangle,
            },
            {
              type: 'journal',
              message: '342 new journal entries today',
              time: '1 hour ago',
              icon: TrendingUp,
            },
            {
              type: 'completion',
              message: 'Average todo completion increased to 78%',
              time: '2 hours ago',
              icon: CheckCircle,
            },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'emergency'
                    ? 'bg-red-100'
                    : activity.type === 'high-stress'
                    ? 'bg-orange-100'
                    : 'bg-blue-100'
                }`}
              >
                <activity.icon
                  className={`w-5 h-5 ${
                    activity.type === 'emergency'
                      ? 'text-red-600'
                      : activity.type === 'high-stress'
                      ? 'text-orange-600'
                      : 'text-blue-600'
                  }`}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* System Info */}
      <Card className="p-6">
        <h2 className="text-xl text-gray-900 mb-4">System Status</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-700">ML Models</p>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
            <p className="text-xs text-gray-600">Random Forest Classifier & Regression running</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-700">Gemini API</p>
              <Badge className="bg-green-100 text-green-700">Connected</Badge>
            </div>
            <p className="text-xs text-gray-600">Recommendation generation operational</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-700">Database</p>
              <Badge className="bg-green-100 text-green-700">Synced</Badge>
            </div>
            <p className="text-xs text-gray-600">Firebase & MongoDB synchronized</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
