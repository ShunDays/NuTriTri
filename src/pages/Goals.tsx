import { useState, useEffect } from 'react'
import type { NutritionGoals } from '../types'

const LOCAL_STORAGE_KEY = 'nutritri_goals'

export default function Goals() {
  const [goals, setGoals] = useState<NutritionGoals>({ 
    calories: 2000, 
    proteins: 100, 
    carbs: 250, 
    fats: 70 
  })
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) setGoals(JSON.parse(saved))
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(goals))
    setEdit(false)
  }

  const calculateMacroPercentages = () => {
    const proteinCal = goals.proteins * 4
    const carbsCal = goals.carbs * 4
    const fatsCal = goals.fats * 9
    const total = proteinCal + carbsCal + fatsCal
    
    return {
      proteins: Math.round((proteinCal / total) * 100),
      carbs: Math.round((carbsCal / total) * 100),
      fats: Math.round((fatsCal / total) * 100)
    }
  }

  const macroPercentages = calculateMacroPercentages()

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="section-title mb-2">Objectifs nutritionnels</h1>
              <p className="text-gray-600">Définissez vos objectifs quotidiens en macronutriments</p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>

          {edit ? (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calories quotidiennes (kcal)
                    </label>
                    <input 
                      type="number" 
                      value={goals.calories} 
                      onChange={e => setGoals({ ...goals, calories: Number(e.target.value) })} 
                      className="input-field"
                      min="1000"
                      max="5000"
                      step="50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Protéines (g)
                    </label>
                    <input 
                      type="number" 
                      value={goals.proteins} 
                      onChange={e => setGoals({ ...goals, proteins: Number(e.target.value) })} 
                      className="input-field"
                      min="20"
                      max="300"
                      step="5"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Glucides (g)
                    </label>
                    <input 
                      type="number" 
                      value={goals.carbs} 
                      onChange={e => setGoals({ ...goals, carbs: Number(e.target.value) })} 
                      className="input-field"
                      min="50"
                      max="500"
                      step="10"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lipides (g)
                    </label>
                    <input 
                      type="number" 
                      value={goals.fats} 
                      onChange={e => setGoals({ ...goals, fats: Number(e.target.value) })} 
                      className="input-field"
                      min="20"
                      max="200"
                      step="5"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" className="btn-primary">
                  💾 Enregistrer les objectifs
                </button>
                <button 
                  type="button" 
                  onClick={() => setEdit(false)} 
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Résumé des objectifs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="nutrition-card text-center">
                  <div className="text-2xl font-bold text-red-600">{goals.calories}</div>
                  <div className="text-sm text-gray-600">kcal/jour</div>
                  <div className="text-xs text-gray-500 mt-1">Calories</div>
                </div>
                
                <div className="nutrition-card text-center">
                  <div className="text-2xl font-bold text-blue-600">{goals.proteins}g</div>
                  <div className="text-sm text-gray-600">{macroPercentages.proteins}%</div>
                  <div className="text-xs text-gray-500 mt-1">Protéines</div>
                </div>
                
                <div className="nutrition-card text-center">
                  <div className="text-2xl font-bold text-green-600">{goals.carbs}g</div>
                  <div className="text-sm text-gray-600">{macroPercentages.carbs}%</div>
                  <div className="text-xs text-gray-500 mt-1">Glucides</div>
                </div>
                
                <div className="nutrition-card text-center">
                  <div className="text-2xl font-bold text-yellow-600">{goals.fats}g</div>
                  <div className="text-sm text-gray-600">{macroPercentages.fats}%</div>
                  <div className="text-xs text-gray-500 mt-1">Lipides</div>
                </div>
              </div>

              {/* Répartition des macronutriments */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition des macronutriments</h3>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-blue-500 h-full" 
                    style={{ width: `${macroPercentages.proteins}%` }}
                    title={`Protéines: ${macroPercentages.proteins}%`}
                  ></div>
                  <div 
                    className="bg-green-500 h-full" 
                    style={{ width: `${macroPercentages.carbs}%` }}
                    title={`Glucides: ${macroPercentages.carbs}%`}
                  ></div>
                  <div 
                    className="bg-yellow-500 h-full" 
                    style={{ width: `${macroPercentages.fats}%` }}
                    title={`Lipides: ${macroPercentages.fats}%`}
                  ></div>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Protéines {macroPercentages.proteins}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Glucides {macroPercentages.carbs}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Lipides {macroPercentages.fats}%</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button onClick={() => setEdit(true)} className="btn-primary">
                  ✏️ Modifier les objectifs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 