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
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200">
          {results.map((food) => (
            <button
              key={food.code}
              onClick={() => handleSelectFood(food)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 focus:outline-none focus:bg-blue-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{food.product.product_name}</div>
              <div className="text-gray-500 text-xs mt-1">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">
                  {food.product.nutriments.energy} kcal/100g
                </span>
                <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 rounded mr-2">
                  P: {Number(food.product.nutriments.proteins).toFixed(1)}g
                </span>
                <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 rounded mr-2">
                  G: {Number(food.product.nutriments.carbohydrates).toFixed(1)}g
                </span>
                <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                  L: {Number(food.product.nutriments.fat).toFixed(1)}g
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {query.length > 0 && results.length === 0 && !isLoading && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-2 px-4 text-sm text-gray-500 border border-gray-200">
          Aucun résultat trouvé pour "{query}"
        </div>
      )}
    </div>
  )
} 