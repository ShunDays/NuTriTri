import { useState } from 'react'
import type { Meal, Food, FoodReference } from '../types'
import { FoodSearch } from './FoodSearch'

interface AddMealFormProps {
  onAddMeal: (meal: Meal) => void
  foodReferences: FoodReference[]
}

export function AddMealForm({ onAddMeal, foodReferences }: AddMealFormProps) {
  const [mealName, setMealName] = useState('')
  const [foods, setFoods] = useState<Food[]>([])
  const [selectedFood, setSelectedFood] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(100)
  const [showSearch, setShowSearch] = useState(false)
  const [showManualAdd, setShowManualAdd] = useState(false)
  const [step, setStep] = useState<'name' | 'foods' | 'review'>('name')
  
  // États pour l'ajout manuel d'aliment
  const [manualFoodName, setManualFoodName] = useState('')
  const [manualCalories, setManualCalories] = useState<number>(0)
  const [manualProteins, setManualProteins] = useState<number>(0)
  const [manualCarbs, setManualCarbs] = useState<number>(0)
  const [manualFats, setManualFats] = useState<number>(0)

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
    setStep('name')
  }

  const handleSelectFoodFromSearch = (food: FoodReference) => {
    const existingFood = foodReferences.find(f => f.id === food.id)
    if (!existingFood) {
      foodReferences.push(food)
    }
    setSelectedFood(food.id)
    setShowSearch(false)
  }

  const selectedFoodRef = foodReferences.find(f => f.id === selectedFood)

  const totalNutrition = foods.reduce((acc, food) => ({
    calories: acc.calories + food.calories,
    proteins: acc.proteins + food.proteins,
    carbs: acc.carbs + food.carbs,
    fats: acc.fats + food.fats
  }), { calories: 0, proteins: 0, carbs: 0, fats: 0 })

  const handleManualAddFood = () => {
    if (!manualFoodName || !quantity) return

    const newFoodRef: FoodReference = {
      id: Date.now().toString(),
      name: manualFoodName,
      calories: manualCalories,
      proteins: manualProteins,
      carbs: manualCarbs,
      fats: manualFats,
      unit: 'g'
    }

    foodReferences.push(newFoodRef)

    const ratio = quantity / 100
    const newFood: Food = {
      id: Date.now().toString(),
      referenceId: newFoodRef.id,
      name: newFoodRef.name,
      quantity,
      calories: Math.round(newFoodRef.calories * ratio),
      proteins: Math.round(newFoodRef.proteins * ratio * 10) / 10,
      carbs: Math.round(newFoodRef.carbs * ratio * 10) / 10,
      fats: Math.round(newFoodRef.fats * ratio * 10) / 10
    }

    setFoods([...foods, newFood])
    setManualFoodName('')
    setManualCalories(0)
    setManualProteins(0)
    setManualCarbs(0)
    setManualFats(0)
    setQuantity(100)
    setShowManualAdd(false)
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Ajouter un nouveau repas</h2>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setStep('name')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                step === 'name' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'
              }`}
            >
              1. Nom
            </button>
            <button
              type="button"
              onClick={() => setStep('foods')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                step === 'foods' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'
              }`}
            >
              2. Aliments
            </button>
            <button
              type="button"
              onClick={() => setStep('review')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                step === 'review' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'
              }`}
            >
              3. Vérification
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 'name' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="mealName" className="block text-sm font-medium text-gray-700">
                Comment souhaitez-vous nommer ce repas ?
              </label>
              <input
                type="text"
                id="mealName"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Ex: Petit-déjeuner, Déjeuner, Dîner..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep('foods')}
                disabled={!mealName.trim()}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {step === 'foods' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Comment ajouter des aliments ?</h3>
              <p className="text-sm text-blue-700">
                1. Cliquez sur "Rechercher un aliment" pour trouver un aliment dans notre base de données<br />
                2. Ou sélectionnez un aliment que vous avez déjà utilisé<br />
                3. Indiquez la quantité souhaitée<br />
                4. Cliquez sur "Ajouter l'aliment" pour l'inclure dans votre repas
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowSearch(!showSearch)
                  setShowManualAdd(false)
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showSearch ? 'Annuler la recherche' : '🔍 Rechercher un aliment'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowManualAdd(!showManualAdd)
                  setShowSearch(false)
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showManualAdd ? 'Annuler' : '➕ Ajouter manuellement'}
              </button>
            </div>

            {showManualAdd ? (
              <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                <div>
                  <label htmlFor="manualFoodName" className="block text-sm font-medium text-gray-700">
                    Nom de l'aliment
                  </label>
                  <input
                    type="text"
                    id="manualFoodName"
                    value={manualFoodName}
                    onChange={(e) => setManualFoodName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Ex: Riz basmati"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="manualCalories" className="block text-sm font-medium text-gray-700">
                      Calories (kcal/100g)
                    </label>
                    <input
                      type="number"
                      id="manualCalories"
                      value={manualCalories}
                      onChange={(e) => setManualCalories(Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      min="0"
                      step="1"
                    />
                  </div>
                  <div>
                    <label htmlFor="manualProteins" className="block text-sm font-medium text-gray-700">
                      Protéines (g/100g)
                    </label>
                    <input
                      type="number"
                      id="manualProteins"
                      value={manualProteins}
                      onChange={(e) => setManualProteins(Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label htmlFor="manualCarbs" className="block text-sm font-medium text-gray-700">
                      Glucides (g/100g)
                    </label>
                    <input
                      type="number"
                      id="manualCarbs"
                      value={manualCarbs}
                      onChange={(e) => setManualCarbs(Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label htmlFor="manualFats" className="block text-sm font-medium text-gray-700">
                      Lipides (g/100g)
                    </label>
                    <input
                      type="number"
                      id="manualFats"
                      value={manualFats}
                      onChange={(e) => setManualFats(Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="manualQuantity" className="block text-sm font-medium text-gray-700">
                    Quantité (g)
                  </label>
                  <input
                    type="number"
                    id="manualQuantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    min="0"
                    step="1"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleManualAddFood}
                    disabled={!manualFoodName || !quantity}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ajouter l'aliment
                  </button>
                </div>
              </div>
            ) : showSearch ? (
              <FoodSearch onSelectFood={handleSelectFoodFromSearch} />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="foodSelect" className="block text-sm font-medium text-gray-700">
                    Aliment
                  </label>
                  <select
                    id="foodSelect"
                    value={selectedFood}
                    onChange={(e) => setSelectedFood(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
            )}

            {selectedFoodRef && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Valeurs nutritionnelles pour {quantity}{selectedFoodRef.unit}
                </h4>
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

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setStep('name')}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={handleAddFood}
                disabled={!selectedFood || !quantity}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajouter l'aliment
              </button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Récapitulatif du repas</h3>
              <p className="text-sm text-blue-700">
                Vérifiez les informations de votre repas avant de le sauvegarder. Vous pouvez revenir en arrière pour modifier les détails.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Nom du repas</h4>
                <p className="mt-1 text-sm text-gray-900">{mealName}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">Aliments ({foods.length})</h4>
                <div className="mt-2 space-y-2">
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

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Total nutritionnel</h4>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-sm text-gray-500">Calories</p>
                    <p className="text-sm font-medium text-gray-900">{totalNutrition.calories} kcal</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Protéines</p>
                    <p className="text-sm font-medium text-gray-900">{totalNutrition.proteins}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Glucides</p>
                    <p className="text-sm font-medium text-gray-900">{totalNutrition.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lipides</p>
                    <p className="text-sm font-medium text-gray-900">{totalNutrition.fats}g</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setStep('foods')}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={!mealName.trim() || foods.length === 0}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sauvegarder le repas
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
} 