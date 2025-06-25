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
  },
  {
    id: '4',
    name: 'Avocat',
    calories: 160,
    proteins: 2,
    carbs: 9,
    fats: 15,
    unit: 'g'
  },
  {
    id: '5',
    name: 'Banane',
    calories: 89,
    proteins: 1.1,
    carbs: 23,
    fats: 0.3,
    unit: 'g'
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
        const todayMeals = meals.filter(meal => meal.date.startsWith(new Date().toISOString().split('T')[0]))
        
        return (
          <div className="space-y-6">
            {/* En-tête avec salutation */}
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{getGreeting()} !</h1>
                  <p className="text-gray-600">Voici votre suivi nutritionnel du jour.</p>
                </div>
                <div className="text-4xl sm:text-5xl mt-4 sm:mt-0">{getSmiley(percent(daily.calories, goals.calories))}</div>
              </div>
            </div>

            {/* Statistiques nutritionnelles */}
            <div className="grid-nutrition">
              <div className="nutrition-card">
                <div className="text-sm text-gray-500 mb-1">Calories</div>
                <div className="text-lg font-bold text-gray-900 mb-2">
                  {Math.round(daily.calories)} / {goals.calories} kcal
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill bg-red-500" 
                    style={{ width: `${Math.min(percent(daily.calories, goals.calories), 100)}%` }} 
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{percent(daily.calories, goals.calories)}%</div>
              </div>
              
              <div className="nutrition-card">
                <div className="text-sm text-gray-500 mb-1">Protéines</div>
                <div className="text-lg font-bold text-gray-900 mb-2">
                  {daily.proteins.toFixed(1)}g / {goals.proteins}g
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill bg-blue-500" 
                    style={{ width: `${Math.min(percent(daily.proteins, goals.proteins), 100)}%` }} 
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{percent(daily.proteins, goals.proteins)}%</div>
              </div>
              
              <div className="nutrition-card">
                <div className="text-sm text-gray-500 mb-1">Glucides</div>
                <div className="text-lg font-bold text-gray-900 mb-2">
                  {daily.carbs.toFixed(1)}g / {goals.carbs}g
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill bg-green-500" 
                    style={{ width: `${Math.min(percent(daily.carbs, goals.carbs), 100)}%` }} 
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{percent(daily.carbs, goals.carbs)}%</div>
              </div>
              
              <div className="nutrition-card">
                <div className="text-sm text-gray-500 mb-1">Lipides</div>
                <div className="text-lg font-bold text-gray-900 mb-2">
                  {daily.fats.toFixed(1)}g / {goals.fats}g
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill bg-yellow-500" 
                    style={{ width: `${Math.min(percent(daily.fats, goals.fats), 100)}%` }} 
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{percent(daily.fats, goals.fats)}%</div>
              </div>
            </div>

            {/* Section des repas */}
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="section-title mb-0">Repas du jour ({todayMeals.length})</h2>
                <button
                  onClick={() => setShowAddMeal(!showAddMeal)}
                  className="btn-primary mt-4 sm:mt-0"
                >
                  {showAddMeal ? 'Annuler' : '+ Ajouter un repas'}
                </button>
              </div>
              
              {showAddMeal && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <AddMealForm 
                    onAddMeal={handleAddMeal}
                    foodReferences={foodReferences}
                  />
                </div>
              )}
              
              <MealList meals={todayMeals} onDeleteMeal={handleDeleteMeal} />
              
              {todayMeals.length === 0 && !showAddMeal && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🍽️</div>
                  <p>Aucun repas enregistré aujourd'hui.</p>
                  <p className="text-sm">Ajoutez votre premier repas pour commencer le suivi !</p>
                </div>
              )}
            </div>
          </div>
        )
      }
      case 'history':
        return (
          <div className="card">
            <h2 className="section-title">Historique des repas</h2>
            <MealList meals={meals} onDeleteMeal={handleDeleteMeal} />
            {meals.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📚</div>
                <p>Aucun repas dans l'historique.</p>
              </div>
            )}
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
          <div className="card">
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
      
      <main className="page-container">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
