import { useState, useEffect } from 'react'
import type { Recipe, RecipeIngredient, FoodReference } from '../types'

const LOCAL_STORAGE_KEY = 'nutritri_recipes'

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([])
  const [ingredientName, setIngredientName] = useState('')
  const [ingredientQuantity, setIngredientQuantity] = useState<number>(100)

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) setRecipes(JSON.parse(saved))
  }, [])

  const handleAddIngredient = () => {
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Recettes</h1>
      <button onClick={() => setShowForm(!showForm)} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">{showForm ? 'Annuler' : 'Ajouter une recette'}</button>
      {showForm && (
        <form onSubmit={handleAddRecipe} className="space-y-4 mb-6">
          <div>
            <label>Nom de la recette</label>
            <input value={name} onChange={e => setName(e.target.value)} className="block w-full" />
          </div>
          <div>
            <label>Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} className="block w-full" />
          </div>
          <div>
            <label>Ingrédients</label>
            <div className="flex gap-2 mb-2">
              <input value={ingredientName} onChange={e => setIngredientName(e.target.value)} placeholder="Nom de l'aliment" className="flex-1" />
              <input type="number" value={ingredientQuantity} onChange={e => setIngredientQuantity(Number(e.target.value))} className="w-24" />
              <button type="button" onClick={handleAddIngredient} className="bg-blue-200 px-2 rounded">Ajouter</button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {ingredients.map((ing, i) => (
                <li key={i} className="bg-gray-100 px-2 py-1 rounded">{ing.food.name} ({ing.quantity}g)</li>
              ))}
            </ul>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer la recette</button>
        </form>
      )}
      <h2 className="text-lg font-semibold mb-2">Mes recettes</h2>
      <ul className="space-y-2">
        {recipes.length === 0 && <li className="text-gray-400">Aucune recette enregistrée.</li>}
        {recipes.map(r => (
          <li key={r.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
            <div>
              <div className="font-bold">{r.name}</div>
              <div className="text-sm text-gray-600">{r.description}</div>
              <div className="text-xs text-gray-500">{r.ingredients.length} ingrédient(s)</div>
            </div>
            <button onClick={() => handleDelete(r.id)} className="text-red-600">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  )
} 