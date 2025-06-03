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
import { Toast } from './components/Toast'

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
  const [toast, setToast] = useState<{ message: string, type?: 'success' | 'error' | 'info' } | null>(null)

  const handleAddMeal = (newMeal: Meal) => {
    setMeals([...meals, newMeal])
    setShowAddMeal(false)
    showToast('Repas ajouté avec succès', 'success')
  }

  const handleDeleteMeal = (id: string) => {
    setMeals(meals.filter(meal => meal.id !== id))
    showToast('Repas supprimé avec succès', 'success')
  }

  const handleAddFoodReference = (food: FoodReference) => {
    setFoodReferences([...foodReferences, food])
    showToast('Aliment ajouté avec succès', 'success')
  }

  const handleEditFoodReference = (food: FoodReference) => {
    setFoodReferences(foodReferences.map(f => f.id === food.id ? food : f))
    showToast('Aliment modifié avec succès', 'success')
  }

  const handleDeleteFoodReference = (id: string) => {
    setFoodReferences(foodReferences.filter(f => f.id !== id))
    showToast('Aliment supprimé avec succès', 'success')
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

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bonjour'
    if (hour < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }

  const getSmiley = (percent: number) => {
    if (percent >= 95 && percent <= 105) return '😃'
    if (percent > 105) return '⚠️'
    if (percent > 80) return '🙂'
    return '😐'
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': {
        const daily = calculateDailyNutrition()
        const percent = (val: number, goal: number) => goal ? Math.round((val / goal) * 100) : 0
        return (
          <>
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{getGreeting()} !</h1>
                  <p className="text-gray-600">Voici votre suivi nutritionnel du jour.</p>
                </div>
                <div className="text-4xl">{getSmiley(percent(daily.calories, goals.calories))}</div>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm text-gray-500 mb-1">Calories</div>
                  <div className="text-lg font-bold text-gray-900 mb-2">{daily.calories} / {goals.calories} kcal</div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-3 rounded-full bg-red-500 transition-all" style={{ width: `${percent(daily.calories, goals.calories)}%` }} />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm text-gray-500 mb-1">Protéines</div>
                  <div className="text-lg font-bold text-gray-900 mb-2">{daily.proteins.toFixed(1)}g / {goals.proteins.toFixed(1)}g</div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-3 rounded-full bg-blue-500 transition-all" style={{ width: `${percent(daily.proteins, goals.proteins)}%` }} />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm text-gray-500 mb-1">Glucides</div>
                  <div className="text-lg font-bold text-gray-900 mb-2">{daily.carbs.toFixed(1)}g / {goals.carbs.toFixed(1)}g</div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-3 rounded-full bg-green-500 transition-all" style={{ width: `${percent(daily.carbs, goals.carbs)}%` }} />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm text-gray-500 mb-1">Lipides</div>
                  <div className="text-lg font-bold text-gray-900 mb-2">{daily.fats.toFixed(1)}g / {goals.fats.toFixed(1)}g</div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-3 rounded-full bg-yellow-500 transition-all" style={{ width: `${percent(daily.fats, goals.fats)}%` }} />
                  </div>
                </div>
              </div>
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
      }
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
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default App
