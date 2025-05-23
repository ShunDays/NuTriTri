import { useState } from 'react'
import type { Meal, Food, FoodReference } from '../types'

interface AddMealFormProps {
  onAddMeal: (meal: Meal) => void
  foodReferences: FoodReference[]
}

export function AddMealForm({ onAddMeal, foodReferences }: AddMealFormProps) {
  const [mealName, setMealName] = useState('')
  const [foods, setFoods] = useState<Food[]>([])
  const [selectedFood, setSelectedFood] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(100)

  const handleAddFood = () => {
    if (!selectedFood || !quantity) return

    const foodRef = foodReferences.find(f => f.id === selectedFood)
    if (!foodRef) return

    const ratio = quantity / 100
    const newFood: Food = {
      id: Date.now().toString(),
      referenceId: foodRef.id,
      name: foodRef.name,
      quantity,
      calories: Math.round(foodRef.calories * ratio),
      proteins: Math.round(foodRef.proteins * ratio * 10) / 10,
      carbs: Math.round(foodRef.carbs * ratio * 10) / 10,
      fats: Math.round(foodRef.fats * ratio * 10) / 10
    }

    setFoods([...foods, newFood])
    setSelectedFood('')
    setQuantity(100)
  }

  const handleRemoveFood = (foodId: string) => {
    setFoods(foods.filter(food => food.id !== foodId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mealName.trim() || foods.length === 0) return

    const newMeal: Meal = {
      id: Date.now().toString(),
      name: mealName,
      foods,
      date: new Date().toISOString()
    }

    onAddMeal(newMeal)
    setMealName('')
    setFoods([])
  }

  const selectedFoodRef = foodReferences.find(f => f.id === selectedFood)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="mealName" className="block text-sm font-medium text-gray-700">
          Nom du repas
        </label>
        <input
          type="text"
          id="mealName"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Ex: Petit-déjeuner"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Ajouter un aliment</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="foodSelect" className="block text-sm font-medium text-gray-700">
              Aliment
            </label>
            <select
              id="foodSelect"
              value={selectedFood}
              onChange={(e) => setSelectedFood(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Sélectionner un aliment</option>
              {foodReferences.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantité ({selectedFoodRef?.unit || 'g'})
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              min="0"
              step="1"
            />
          </div>
        </div>

        {selectedFoodRef && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Valeurs nutritionnelles pour {quantity}{selectedFoodRef.unit}</h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-sm text-gray-500">Calories</p>
                <p className="text-sm font-medium text-gray-900">
                  {Math.round(selectedFoodRef.calories * quantity / 100)} kcal
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Protéines</p>
                <p className="text-sm font-medium text-gray-900">
                  {Math.round(selectedFoodRef.proteins * quantity / 100 * 10) / 10}g
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Glucides</p>
                <p className="text-sm font-medium text-gray-900">
                  {Math.round(selectedFoodRef.carbs * quantity / 100 * 10) / 10}g
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lipides</p>
                <p className="text-sm font-medium text-gray-900">
                  {Math.round(selectedFoodRef.fats * quantity / 100 * 10) / 10}g
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddFood}
            disabled={!selectedFood || !quantity}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ajouter l'aliment
          </button>
        </div>
      </div>

      {foods.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Aliments ajoutés</h3>
          <div className="space-y-2">
            {foods.map((food) => (
              <div key={food.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{food.name}</p>
                  <p className="text-sm text-gray-500">
                    {food.quantity}{foodReferences.find(f => f.id === food.referenceId)?.unit} - {food.calories} kcal
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFood(food.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!mealName.trim() || foods.length === 0}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ajouter le repas
        </button>
      </div>
    </form>
  )
} 