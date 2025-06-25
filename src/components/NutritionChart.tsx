import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import type { DailyNutrition } from '../types'

interface NutritionChartProps {
  data: DailyNutrition[]
  type: 'calories' | 'proteins' | 'carbs' | 'fats'
}

const chartColors = {
  calories: '#ef4444',
  proteins: '#3b82f6',
  carbs: '#22c55e',
  fats: '#f59e0b'
}

const chartLabels = {
  calories: 'Calories (kcal)',
  proteins: 'Protéines (g)',
  carbs: 'Glucides (g)',
  fats: 'Lipides (g)'
}

export function NutritionChart({ data, type }: NutritionChartProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week')

  const filteredData = data.slice(-(timeRange === 'week' ? 7 : 30))

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Évolution des {chartLabels[type]}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeRange === 'week'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeRange === 'month'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Mois
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value) => [`${value} ${type === 'calories' ? 'kcal' : 'g'}`, chartLabels[type]]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={type === 'calories' ? 'totalCalories' : `total${type.charAt(0).toUpperCase() + type.slice(1)}`}
              stroke={chartColors[type]}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 