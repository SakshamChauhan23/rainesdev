'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Eye, ShoppingBag } from 'lucide-react'

interface PerformanceChartsProps {
  agents: Array<{
    title: string
    viewCount: number
    purchaseCount: number
    price: number
  }>
}

export function PerformanceCharts({ agents }: PerformanceChartsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Sort agents by views for top performers
  const topAgentsByViews = [...agents]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5)

  // Sort agents by sales
  const topAgentsBySales = [...agents]
    .sort((a, b) => b.purchaseCount - a.purchaseCount)
    .slice(0, 5)

  const maxViews = Math.max(...topAgentsByViews.map(a => a.viewCount), 1)
  const maxSales = Math.max(...topAgentsBySales.map(a => a.purchaseCount), 1)

  // Calculate conversion rate data
  const conversionData = agents.map(agent => ({
    title: agent.title,
    conversionRate: agent.viewCount > 0 ? (agent.purchaseCount / agent.viewCount) * 100 : 0,
    views: agent.viewCount
  })).filter(a => a.views > 0).sort((a, b) => b.conversionRate - a.conversionRate).slice(0, 5)

  const maxConversionRate = Math.max(...conversionData.map(d => d.conversionRate), 1)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Top Performers by Views */}
      <div className={`rounded-3xl bg-white border-2 border-brand-slate/10 p-6 shadow-lg transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal/10">
            <Eye className="h-6 w-6 text-brand-teal" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-slate">Top Performers by Views</h3>
            <p className="text-sm text-brand-slate/60">Most viewed agents</p>
          </div>
        </div>

        <div className="space-y-4">
          {topAgentsByViews.map((agent, index) => (
            <div key={index} className="group">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-brand-slate truncate flex-1 mr-4">{agent.title}</span>
                <span className="font-bold text-brand-teal">{agent.viewCount.toLocaleString()}</span>
              </div>
              <div className="relative h-3 rounded-full bg-brand-cream overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-teal to-brand-teal/80 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: isVisible ? `${(agent.viewCount / maxViews) * 100}%` : '0%',
                    transitionDelay: `${index * 100}ms`
                  }}
                />
              </div>
            </div>
          ))}
          {topAgentsByViews.length === 0 && (
            <p className="text-center text-sm text-brand-slate/50 py-8">No data available yet</p>
          )}
        </div>
      </div>

      {/* Top Performers by Sales */}
      <div className={`rounded-3xl bg-white border-2 border-brand-slate/10 p-6 shadow-lg transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/10">
            <ShoppingBag className="h-6 w-6 text-brand-orange" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-slate">Top Performers by Sales</h3>
            <p className="text-sm text-brand-slate/60">Best selling agents</p>
          </div>
        </div>

        <div className="space-y-4">
          {topAgentsBySales.map((agent, index) => (
            <div key={index} className="group">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-brand-slate truncate flex-1 mr-4">{agent.title}</span>
                <span className="font-bold text-brand-orange">{agent.purchaseCount}</span>
              </div>
              <div className="relative h-3 rounded-full bg-brand-cream overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-orange to-brand-orange/80 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: isVisible ? `${(agent.purchaseCount / maxSales) * 100}%` : '0%',
                    transitionDelay: `${index * 100}ms`
                  }}
                />
              </div>
            </div>
          ))}
          {topAgentsBySales.length === 0 && (
            <p className="text-center text-sm text-brand-slate/50 py-8">No sales data yet</p>
          )}
        </div>
      </div>

      {/* Conversion Rate Chart */}
      <div className={`rounded-3xl bg-gradient-to-br from-brand-orange/5 to-brand-teal/5 border-2 border-brand-slate/10 p-6 shadow-lg lg:col-span-2 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange/20">
            <TrendingUp className="h-6 w-6 text-brand-orange" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-slate">Conversion Rates</h3>
            <p className="text-sm text-brand-slate/60">Views to sales ratio</p>
          </div>
        </div>

        <div className="space-y-4">
          {conversionData.map((data, index) => (
            <div key={index} className="rounded-2xl bg-white/80 backdrop-blur-sm p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-brand-slate truncate mb-1">{data.title}</p>
                  <p className="text-xs text-brand-slate/60">{data.views} views</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-brand-orange">{data.conversionRate.toFixed(1)}%</p>
                  <p className="text-xs text-brand-slate/60">conversion</p>
                </div>
              </div>
              <div className="relative h-2 rounded-full bg-brand-cream overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-orange via-brand-orange/90 to-brand-teal rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: isVisible ? `${(data.conversionRate / maxConversionRate) * 100}%` : '0%',
                    transitionDelay: `${400 + index * 100}ms`
                  }}
                />
              </div>
            </div>
          ))}
          {conversionData.length === 0 && (
            <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 text-center">
              <p className="text-sm text-brand-slate/50">No conversion data available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
