import { useState, useEffect } from 'react'
import type { Menu, MenuDay, Meal, Recipe } from '../types'

const LOCAL_STORAGE_KEY = 'nutritri_menus'
const RECIPES_STORAGE_KEY = 'nutritri_recipes'

export default function Menus() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [days, setDays] = useState<MenuDay[]>([])
  const [currentDate, setCurrentDate] = useState('')
  const [currentMealName, setCurrentMealName] = useState('')
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)

  useEffect(() => {
    const savedMenus = localStorage.getItem(LOCAL_STORAGE_KEY)
    const savedRecipes = localStorage.getItem(RECIPES_STORAGE_KEY)
    if (savedMenus) setMenus(JSON.parse(savedMenus))
    if (savedRecipes) setRecipes(JSON.parse(savedRecipes))
  }, [])

  const addMealToDay = () => {
    if (!currentDate || !currentMealName) return
    
    const meal: Meal = {
      id: Date.now().toString(),
      name: currentMealName,
      foods: [],
      date: currentDate,
    }

    const existingDayIndex = days.findIndex(day => day.date === currentDate)
    if (existingDayIndex >= 0) {
      const updatedDays = [...days]
      updatedDays[existingDayIndex].meals.push(meal)
      setDays(updatedDays)
    } else {
      setDays([...days, { date: currentDate, meals: [meal] }])
    }
    
    setCurrentMealName('')
  }

  const removeMealFromDay = (dayDate: string, mealId: string) => {
    const updatedDays = days.map(day => 
      day.date === dayDate 
        ? { ...day, meals: day.meals.filter(meal => meal.id !== mealId) }
        : day
    ).filter(day => day.meals.length > 0)
    setDays(updatedDays)
  }

  const removeDay = (dayDate: string) => {
    setDays(days.filter(day => day.date !== dayDate))
  }

  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || days.length === 0) return
    
    const newMenu: Menu = {
      id: Date.now().toString(),
      name,
      days: days.sort((a, b) => a.date.localeCompare(b.date)),
    }
    const updated = [...menus, newMenu]
    setMenus(updated)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
    setName('')
    setDays([])
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    const updated = menus.filter(m => m.id !== id)
    setMenus(updated)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getWeekDates = () => {
    const today = new Date()
    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      weekDates.push(date.toISOString().split('T')[0])
    }
    return weekDates
  }

  const calculateMenuNutrition = (menu: Menu) => {
    return menu.days.reduce((total, day) => {
      const dayNutrition = day.meals.reduce((dayAcc, meal) => {
        const mealNutrition = meal.foods.reduce((mealAcc, food) => ({
          calories: mealAcc.calories + food.calories,
          proteins: mealAcc.proteins + food.proteins,
          carbs: mealAcc.carbs + food.carbs,
          fats: mealAcc.fats + food.fats
        }), { calories: 0, proteins: 0, carbs: 0, fats: 0 })
        
        return {
          calories: dayAcc.calories + mealNutrition.calories,
          proteins: dayAcc.proteins + mealNutrition.proteins,
          carbs: dayAcc.carbs + mealNutrition.carbs,
          fats: dayAcc.fats + mealNutrition.fats
        }
      }, { calories: 0, proteins: 0, carbs: 0, fats: 0 })
      
      return {
        calories: total.calories + dayNutrition.calories,
        proteins: total.proteins + dayNutrition.proteins,
        carbs: total.carbs + dayNutrition.carbs,
        fats: total.fats + dayNutrition.fats
      }
    }, { calories: 0, proteins: 0, carbs: 0, fats: 0 })
  }

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="section-title mb-2">Mes menus</h1>
              <p className="text-gray-600">Planifiez vos repas et créez des menus personnalisés</p>
            </div>
            <div className="text-3xl">📅</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="btn-primary"
            >
              {showForm ? 'Annuler' : '+ Nouveau menu'}
            </button>
          </div>

          {showForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Créer un nouveau menu</h3>
              <form onSubmit={handleAddMenu} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du menu *
                  </label>
                  <input 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="input-field max-w-md" 
                    placeholder="Ex: Menu de la semaine"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Planifier les repas
                  </label>
                  <div className="space-y-4">
                    {/* Raccourcis pour la semaine */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium mb-3">Raccourcis - Cette semaine :</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
                        {getWeekDates().map(date => (
                          <button
                            key={date}
                            type="button"
                            onClick={() => setCurrentDate(date)}
                            className={`p-2 text-xs rounded border ${
                              currentDate === date 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            {new Date(date).toLocaleDateString('fr-FR', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ajout de repas */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="date" 
                        value={currentDate} 
                        onChange={e => setCurrentDate(e.target.value)} 
                        className="input-field"
                      />
                      <input 
                        value={currentMealName} 
                        onChange={e => setCurrentMealName(e.target.value)} 
                        placeholder="Nom du repas (ex: Petit-déjeuner)" 
                        className="input-field flex-1"
                      />
                      <button 
                        type="button" 
                        onClick={addMealToDay} 
                        className="btn-secondary whitespace-nowrap"
                        disabled={!currentDate || !currentMealName}
                      >
                        + Ajouter
                      </button>
                    </div>

                    {/* Aperçu des jours planifiés */}
                    {days.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Jours planifiés :</h4>
                        {days.map(day => (
                          <div key={day.date} className="bg-white rounded-lg border p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900">
                                {formatDate(day.date)}
                              </h5>
                              <button 
                                type="button"
                                onClick={() => removeDay(day.date)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Supprimer le jour
                              </button>
                            </div>
                            <div className="space-y-2">
                              {day.meals.map(meal => (
                                <div 
                                  key={meal.id}
                                  className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded"
                                >
                                  <span className="text-sm">{meal.name}</span>
                                  <button 
                                    type="button"
                                    onClick={() => removeMealFromDay(day.date, meal.id)}
                                    className="text-red-600 hover:text-red-800 text-xs"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" className="btn-primary">
                    💾 Enregistrer le menu
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)} 
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Liste des menus */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Mes menus ({menus.length})</h2>
            {menus.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📋</div>
                <p>Aucun menu planifié.</p>
                <p className="text-sm">Créez votre premier menu pour organiser vos repas !</p>
              </div>
            ) : (
              <div className="grid-responsive">
                {menus.map(menu => {
                  const nutrition = calculateMenuNutrition(menu)
                  const avgDailyNutrition = {
                    calories: nutrition.calories / menu.days.length,
                    proteins: nutrition.proteins / menu.days.length,
                    carbs: nutrition.carbs / menu.days.length,
                    fats: nutrition.fats / menu.days.length
                  }
                  
                  return (
                    <div key={menu.id} className="nutrition-card">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg">{menu.name}</h3>
                        <button 
                          onClick={() => handleDelete(menu.id)} 
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </button>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-3">
                        {menu.days.length} jour(s) • {menu.days.reduce((total, day) => total + day.meals.length, 0)} repas
                      </div>

                      {/* Nutrition moyenne par jour */}
                      <div className="bg-gray-50 rounded p-3 space-y-1">
                        <div className="text-sm font-medium text-gray-700">Moyenne par jour :</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span>Calories:</span>
                            <span className="font-medium">{Math.round(avgDailyNutrition.calories)} kcal</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Protéines:</span>
                            <span className="font-medium">{avgDailyNutrition.proteins.toFixed(1)}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Glucides:</span>
                            <span className="font-medium">{avgDailyNutrition.carbs.toFixed(1)}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lipides:</span>
                            <span className="font-medium">{avgDailyNutrition.fats.toFixed(1)}g</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1">
                        {menu.days.slice(0, 3).map(day => (
                          <div key={day.date} className="text-xs text-gray-600">
                            {new Date(day.date).toLocaleDateString('fr-FR', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })} : {day.meals.map(m => m.name).join(', ')}
                          </div>
                        ))}
                        {menu.days.length > 3 && (
                          <div className="text-xs text-gray-500">
                            ... et {menu.days.length - 3} jour(s) de plus
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => setSelectedMenu(menu)}
                        className="w-full mt-3 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Voir le détail →
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal de détail de menu */}
        {selectedMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{selectedMenu.name}</h2>
                  <button 
                    onClick={() => setSelectedMenu(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {selectedMenu.days.map(day => (
                    <div key={day.date} className="border rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-3">
                        {formatDate(day.date)}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {day.meals.map(meal => (
                          <div key={meal.id} className="bg-gray-50 rounded p-3">
                            <div className="font-medium text-sm">{meal.name}</div>
                            {meal.foods.length > 0 && (
                              <div className="text-xs text-gray-600 mt-1">
                                {meal.foods.length} aliment(s)
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 