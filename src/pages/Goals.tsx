import { useState, useEffect } from 'react'
import type { NutritionGoals } from '../types'

const LOCAL_STORAGE_KEY = 'nutritri_goals'

export default function Goals() {
  const [goals, setGoals] = useState<NutritionGoals>({ calories: 2000, proteins: 100, carbs: 250, fats: 70 })
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

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Objectifs nutritionnels</h1>
      {edit ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label>Calories (kcal)</label>
            <input type="number" value={goals.calories} onChange={e => setGoals({ ...goals, calories: Number(e.target.value) })} className="block w-full" />
          </div>
          <div>
            <label>Protéines (g)</label>
            <input type="number" value={goals.proteins} onChange={e => setGoals({ ...goals, proteins: Number(e.target.value) })} className="block w-full" />
          </div>
          <div>
            <label>Glucides (g)</label>
            <input type="number" value={goals.carbs} onChange={e => setGoals({ ...goals, carbs: Number(e.target.value) })} className="block w-full" />
          </div>
          <div>
            <label>Lipides (g)</label>
            <input type="number" value={goals.fats} onChange={e => setGoals({ ...goals, fats: Number(e.target.value) })} className="block w-full" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
        </form>
      ) : (
        <div className="space-y-2">
          <div>Calories : <b>{goals.calories}</b> kcal</div>
          <div>Protéines : <b>{goals.proteins}</b> g</div>
          <div>Glucides : <b>{goals.carbs}</b> g</div>
          <div>Lipides : <b>{goals.fats}</b> g</div>
          <button onClick={() => setEdit(true)} className="mt-4 bg-gray-200 px-4 py-2 rounded">Modifier</button>
        </div>
      )}
    </div>
  )
} 