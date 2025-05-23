import type { NutritionGoals } from '../types'

interface NutritionStatsProps {
  goals: NutritionGoals
  current: {
    calories: number
    proteins: number
    carbs: number
    fats: number
  }
}

export function NutritionStats({ goals, current }: NutritionStatsProps) {
  const calculatePercentage = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100)
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Calories</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{current.calories} / {goals.calories} kcal</div>
                <div className="mt-1">
                  <div className="overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-red-600"
                      style={{ width: `${calculatePercentage(current.calories, goals.calories)}%` }}
                    />
                  </div>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Protéines</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{current.proteins}g / {goals.proteins}g</div>
                <div className="mt-1">
                  <div className="overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${calculatePercentage(current.proteins, goals.proteins)}%` }}
                    />
                  </div>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Glucides</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{current.carbs}g / {goals.carbs}g</div>
                <div className="mt-1">
                  <div className="overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{ width: `${calculatePercentage(current.carbs, goals.carbs)}%` }}
                    />
                  </div>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Lipides</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{current.fats}g / {goals.fats}g</div>
                <div className="mt-1">
                  <div className="overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-yellow-600"
                      style={{ width: `${calculatePercentage(current.fats, goals.fats)}%` }}
                    />
                  </div>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
} 