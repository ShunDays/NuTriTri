import { useState, useEffect } from 'react'
import type { Recipe, RecipeIngredient, FoodReference } from '../types'
import { searchFood } from '../services/openFoodFacts'

const LOCAL_STORAGE_KEY = 'nutritri_recipes'

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([])
  const [ingredientName, setIngredientName] = useState('')
  const [ingredientQuantity, setIngredientQuantity] = useState<number>(100)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) setRecipes(JSON.parse(saved))
  }, [])

  const handleSearchFood = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([])
      return
    }
    
    setIsSearching(true)
    try {
      const results = await searchFood(query)
      setSearchResults(results.slice(0, 5))
    } catch (error) {
      console.error('Erreur de recherche:', error)
    }
    setIsSearching(false)
  }

  const handleSelectFood = (foodData: any) => {
    const food: FoodReference = {
      id: Date.now().toString(),
      name: foodData.product.product_name,
      calories: foodData.product.nutriments.energy / 4.184 || 0, // Conversion kJ vers kcal
      proteins: foodData.product.nutriments.proteins || 0,
      carbs: foodData.product.nutriments.carbohydrates || 0,
      fats: foodData.product.nutriments.fat || 0,
      unit: 'g',
    }
    setIngredients([...ingredients, { food, quantity: ingredientQuantity }])
    setIngredientName('')
    setIngredientQuantity(100)
    setSearchResults([])
  }

  const handleAddIngredientManually = () => {
    if (!ingredientName || !ingredientQuantity) return
    const food: FoodReference = {
      id: Date.now().toString(),
      name: ingredientName,
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
      unit: 'g',
    }
    setIngredients([...ingredients, { food, quantity: ingredientQuantity }])
    setIngredientName('')
    setIngredientQuantity(100)
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const calculateRecipeNutrition = (recipe: Recipe) => {
    return recipe.ingredients.reduce((acc, ingredient) => {
      const multiplier = ingredient.quantity / 100
      return {
        calories: acc.calories + (ingredient.food.calories * multiplier),
        proteins: acc.proteins + (ingredient.food.proteins * multiplier),
        carbs: acc.carbs + (ingredient.food.carbs * multiplier),
        fats: acc.fats + (ingredient.food.fats * multiplier)
      }
    }, { calories: 0, proteins: 0, carbs: 0, fats: 0 })
  }

  const handleAddRecipe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || ingredients.length === 0) return
    
    const newRecipe: Recipe = {
      id: Date.now().toString(),
      name,
      description,
      ingredients,
    }
    const updated = [...recipes, newRecipe]
    setRecipes(updated)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
    setName('')
    setDescription('')
    setIngredients([])
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    const updated = recipes.filter(r => r.id !== id)
    setRecipes(updated)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="section-title mb-2">Mes recettes</h1>
              <p className="text-gray-600">Créez et gérez vos recettes avec leurs informations nutritionnelles</p>
            </div>
            <div className="text-3xl">👨‍🍳</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="btn-primary"
            >
              {showForm ? 'Annuler' : '+ Nouvelle recette'}
            </button>
          </div>

          {showForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Créer une nouvelle recette</h3>
              <form onSubmit={handleAddRecipe} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de la recette *
                    </label>
                    <input 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="input-field" 
                      placeholder="Ex: Salade César"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      className="input-field" 
                      placeholder="Description courte de la recette"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingrédients
                  </label>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        value={ingredientName} 
                        onChange={e => {
                          setIngredientName(e.target.value)
                          handleSearchFood(e.target.value)
                        }}
                        placeholder="Rechercher un aliment..." 
                        className="input-field flex-1" 
                      />
                      <input 
                        type="number" 
                        value={ingredientQuantity} 
                        onChange={e => setIngredientQuantity(Number(e.target.value))} 
                        className="input-field w-32" 
                        placeholder="Quantité (g)"
                        min="1"
                      />
                      <button 
                        type="button" 
                        onClick={handleAddIngredientManually} 
                        className="btn-secondary whitespace-nowrap"
                      >
                        Ajouter
                      </button>
                    </div>

                    {/* Résultats de recherche OpenFoodFacts */}
                    {isSearching && (
                      <div className="text-sm text-gray-500">Recherche en cours...</div>
                    )}
                    {searchResults.length > 0 && (
                      <div className="bg-white border rounded-lg max-h-48 overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectFood(result)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium">{result.product.product_name}</div>
                            <div className="text-sm text-gray-500">
                              {Math.round(result.product.nutriments.energy / 4.184 || 0)} kcal/100g
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Liste des ingrédients ajoutés */}
                    {ingredients.length > 0 && (
                      <div className="bg-white rounded-lg border p-4">
                        <h4 className="font-medium mb-3">Ingrédients de la recette :</h4>
                        <div className="space-y-2">
                          {ingredients.map((ing, i) => (
                            <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                              <span>{ing.food.name} - {ing.quantity}g</span>
                              <button 
                                type="button" 
                                onClick={() => removeIngredient(i)} 
                                className="text-red-600 hover:text-red-800"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" className="btn-primary">
                    💾 Enregistrer la recette
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

          {/* Liste des recettes */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Mes recettes ({recipes.length})</h2>
            {recipes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📖</div>
                <p>Aucune recette enregistrée.</p>
                <p className="text-sm">Créez votre première recette pour commencer !</p>
              </div>
            ) : (
              <div className="grid-responsive">
                {recipes.map(recipe => {
                  const nutrition = calculateRecipeNutrition(recipe)
                  return (
                    <div key={recipe.id} className="nutrition-card">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg">{recipe.name}</h3>
                        <button 
                          onClick={() => handleDelete(recipe.id)} 
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </button>
                      </div>
                      
                      {recipe.description && (
                        <p className="text-gray-600 text-sm mb-3">{recipe.description}</p>
                      )}
                      
                      <div className="text-xs text-gray-500 mb-3">
                        {recipe.ingredients.length} ingrédient(s)
                      </div>

                      {/* Informations nutritionnelles */}
                      <div className="bg-gray-50 rounded p-3 space-y-1">
                        <div className="text-sm font-medium text-gray-700">Nutrition totale :</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span>Calories:</span>
                            <span className="font-medium">{Math.round(nutrition.calories)} kcal</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Protéines:</span>
                            <span className="font-medium">{nutrition.proteins.toFixed(1)}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Glucides:</span>
                            <span className="font-medium">{nutrition.carbs.toFixed(1)}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lipides:</span>
                            <span className="font-medium">{nutrition.fats.toFixed(1)}g</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedRecipe(recipe)}
                        className="w-full mt-3 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Voir les détails →
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal de détail de recette */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{selectedRecipe.name}</h2>
                  <button 
                    onClick={() => setSelectedRecipe(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                {selectedRecipe.description && (
                  <p className="text-gray-600 mb-4">{selectedRecipe.description}</p>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Ingrédients :</h3>
                    <ul className="space-y-1">
                      {selectedRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="text-sm flex justify-between">
                          <span>{ing.food.name}</span>
                          <span className="text-gray-500">{ing.quantity}g</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Informations nutritionnelles :</h3>
                    <div className="bg-gray-50 rounded p-3">
                      {(() => {
                        const nutrition = calculateRecipeNutrition(selectedRecipe)
                        return (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-600">{Math.round(nutrition.calories)}</div>
                              <div className="text-xs text-gray-500">kcal</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{nutrition.proteins.toFixed(1)}</div>
                              <div className="text-xs text-gray-500">g protéines</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{nutrition.carbs.toFixed(1)}</div>
                              <div className="text-xs text-gray-500">g glucides</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-yellow-600">{nutrition.fats.toFixed(1)}</div>
                              <div className="text-xs text-gray-500">g lipides</div>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 