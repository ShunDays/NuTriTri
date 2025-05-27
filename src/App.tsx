import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Meal, NutritionGoals, FoodReference } from './types'
import { Navigation } from './components/Navigation'
import { AddMealForm } from './components/AddMealForm'
import { MealList } from './components/MealList'
import { NutritionStats } from './components/NutritionStats'
import { FoodDatabase } from './components/FoodDatabase'
import Goals from './pages/Goals'
import Preferences from './pages/Preferences'
import Recipes from './pages/Recipes'
import Menus from './pages/Menus'

const defaultGoals: NutritionGoals = {
  calories: 2000,
  proteins: 150,
  carbs: 250,
  fats: 70
}

const defaultFoodReferences: FoodReference[] = [
  {
    id: '1',
    name: 'Poulet (blanc)',
    calories: 165,
    proteins: 31,
    carbs: 0,
    fats: 3.6,
    unit: 'g'
  },
  {
    id: '2',
    name: 'Riz blanc cuit',
    calories: 130,
    proteins: 2.7,
    carbs: 28,
    fats: 0.3,
    unit: 'g'
  },
  {
    id: '3',
    name: 'Œuf entier',
    calories: 155,
    proteins: 12.6,
    carbs: 0.6,
    fats: 11.3,
    unit: 'unité'
  }
]

function App() {
  const [meals, setMeals] = useLocalStorage<Meal[]>('meals', [])
  const [goals, setGoals] = useLocalStorage<NutritionGoals>('goals', defaultGoals)
  const [foodReferences, setFoodReferences] = useLocalStorage<FoodReference[]>('foodReferences', defaultFoodReferences)
  const [showAddMeal, setShowAddMeal] = useState(false)
  const [currentView, setCurrentView] = useState<'dashboard' | 'history' | 'goals' | 'foods' | 'preferences' | 'recipes' | 'menus'>('dashboard')

  const handleAddMeal = (newMeal: Meal) => {
    setMeals([...meals, newMeal])
    setShowAddMeal(false)
  }

  const handleDeleteMeal = (id: string) => {
    setMeals(meals.filter(meal => meal.id !== id))
  }

  const handleAddFoodReference = (food: FoodReference) => {
    setFoodReferences([...foodReferences, food])
  }

  const handleEditFoodReference = (food: FoodReference) => {
    setFoodReferences(foodReferences.map(f => f.id === food.id ? food : f))
  }

  const handleDeleteFoodReference = (id: string) => {
    setFoodReferences(foodReferences.filter(f => f.id !== id))
  }

  const calculateDailyNutrition = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayMeals = meals.filter(meal => meal.date.startsWith(today))
    
    return todayMeals.reduce((acc, meal) => {
      const mealNutrition = meal.foods.reduce((foodAcc, food) => ({
        calories: foodAcc.calories + food.calories,
        proteins: foodAcc.proteins + food.proteins,
        carbs: foodAcc.carbs + food.carbs,
        fats: foodAcc.fats + food.fats
      }), { calories: 0, proteins: 0, carbs: 0, fats: 0 })

      return {
        calories: acc.calories + mealNutrition.calories,
        proteins: acc.proteins + mealNutrition.proteins,
        carbs: acc.carbs + mealNutrition.carbs,
        fats: acc.fats + mealNutrition.fats
      }
    }, { calories: 0, proteins: 0, carbs: 0, fats: 0 })
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <div className="mb-8">
              <NutritionStats
                goals={goals}
                current={calculateDailyNutrition()}
              />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Repas du jour</h2>
                <button
                  onClick={() => setShowAddMeal(!showAddMeal)}
                  className="btn-primary"
                >
                  {showAddMeal ? 'Annuler' : 'Ajouter un repas'}
                </button>
              </div>

              {showAddMeal && (
                <div className="mb-8">
                  <AddMealForm 
                    onAddMeal={handleAddMeal}
                    foodReferences={foodReferences}
                  />
                </div>
              )}

              <MealList meals={meals} onDeleteMeal={handleDeleteMeal} />
            </div>
          </>
        )
      case 'history':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Historique des repas</h2>
            <MealList meals={meals} onDeleteMeal={handleDeleteMeal} />
          </div>
        )
      case 'goals':
        return <Goals />
      case 'preferences':
        return <Preferences />
      case 'recipes':
        return <Recipes />
      case 'menus':
        return <Menus />
      case 'foods':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <FoodDatabase
              foods={foodReferences}
              onAddFood={handleAddFoodReference}
              onEditFood={handleEditFoodReference}
              onDeleteFood={handleDeleteFoodReference}
            />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view as typeof currentView)}
        onAddMeal={() => setShowAddMeal(true)}
      />
      
      <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App
