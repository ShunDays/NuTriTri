import { useState, useEffect } from 'react'
import { searchFood } from '../services/openFoodFacts'
import type { FoodReference } from '../types'

interface FoodSearchProps {
  onSelectFood: (food: FoodReference) => void
}

export function FoodSearch({ onSelectFood }: FoodSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const foods = await searchFood(query)
        setResults(foods)
      } catch (err) {
        setError('Erreur lors de la recherche')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }, 500)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleSelectFood = (food: any) => {
    const newFood: FoodReference = {
      id: food.code,
      name: food.product.product_name,
      calories: food.product.nutriments.energy,
      proteins: food.product.nutriments.proteins,
      carbs: food.product.nutriments.carbohydrates,
      fats: food.product.nutriments.fat,
      unit: 'g'
    }
    onSelectFood(newFood)
    setQuery('')
    setResults([])
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un aliment..."
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
          {results.map((food) => (
            <button
              key={food.code}
              onClick={() => handleSelectFood(food)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              <div className="font-medium text-gray-900">{food.product.product_name}</div>
              <div className="text-gray-500 text-xs">
                {food.product.nutriments.energy} kcal/100g • 
                P: {food.product.nutriments.proteins}g • 
                G: {food.product.nutriments.carbohydrates}g • 
                L: {food.product.nutriments.fat}g
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 