import { useState } from 'react'
import type { FoodReference } from '../types'

interface FoodDatabaseProps {
  onAddFood: (food: FoodReference) => void
  onEditFood: (food: FoodReference) => void
  onDeleteFood: (id: string) => void
  foods: FoodReference[]
}

export function FoodDatabase({ onAddFood, onEditFood, onDeleteFood, foods }: FoodDatabaseProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingFood, setEditingFood] = useState<FoodReference | null>(null)
  const [newFood, setNewFood] = useState<Partial<FoodReference>>({
    name: '',
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
    unit: 'g'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFood.name) {
      return
    }

    if (editingFood) {
      onEditFood({
        ...editingFood,
        ...newFood,
        calories: Number(newFood.calories) || 0,
        proteins: Number(newFood.proteins) || 0,
        carbs: Number(newFood.carbs) || 0,
        fats: Number(newFood.fats) || 0
      })
      setEditingFood(null)
    } else {
      onAddFood({
        id: Date.now().toString(),
        name: newFood.name,
        calories: Number(newFood.calories) || 0,
        proteins: Number(newFood.proteins) || 0,
        carbs: Number(newFood.carbs) || 0,
        fats: Number(newFood.fats) || 0,
        unit: newFood.unit || 'g'
      })
    }

    setNewFood({
      name: '',
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
      unit: 'g'
    })
    setIsAdding(false)
  }

  const handleEdit = (food: FoodReference) => {
    setEditingFood(food)
    setNewFood(food)
    setIsAdding(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Base de données d'aliments</h2>
        <button
          onClick={() => {
            setIsAdding(true)
            setEditingFood(null)
            setNewFood({
              name: '',
              calories: 0,
              proteins: 0,
              carbs: 0,
              fats: 0,
              unit: 'g'
            })
          }}
          className="btn-primary"
        >
          Ajouter un aliment
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            {editingFood ? 'Modifier l\'aliment' : 'Ajouter un aliment'}
          </h3>
          
          <div>
            <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">
              Nom de l'aliment
            </label>
            <input
              type="text"
              id="foodName"
              value={newFood.name}
              onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Ex: Poulet"
              required
            />
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
              Unité
            </label>
            <select
              id="unit"
              value={newFood.unit}
              onChange={(e) => setNewFood({ ...newFood, unit: e.target.value as 'g' | 'ml' | 'unité' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="g">grammes (g)</option>
              <option value="ml">millilitres (ml)</option>
              <option value="unité">unité</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
                Calories (kcal/100{newFood.unit})
              </label>
              <input
                type="number"
                id="calories"
                value={newFood.calories}
                onChange={(e) => setNewFood({ ...newFood, calories: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label htmlFor="proteins" className="block text-sm font-medium text-gray-700">
                Protéines (g/100{newFood.unit})
              </label>
              <input
                type="number"
                id="proteins"
                value={newFood.proteins}
                onChange={(e) => setNewFood({ ...newFood, proteins: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label htmlFor="carbs" className="block text-sm font-medium text-gray-700">
                Glucides (g/100{newFood.unit})
              </label>
              <input
                type="number"
                id="carbs"
                value={newFood.carbs}
                onChange={(e) => setNewFood({ ...newFood, carbs: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label htmlFor="fats" className="block text-sm font-medium text-gray-700">
                Lipides (g/100{newFood.unit})
              </label>
              <input
                type="number"
                id="fats"
                value={newFood.fats}
                onChange={(e) => setNewFood({ ...newFood, fats: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setEditingFood(null)
              }}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {editingFood ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aliment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calories
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Protéines
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Glucides
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lipides
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {foods.map((food) => (
              <tr key={food.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {food.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {food.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {food.calories} kcal/100{food.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {food.proteins}g/100{food.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {food.carbs}g/100{food.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {food.fats}g/100{food.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(food)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDeleteFood(food.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 