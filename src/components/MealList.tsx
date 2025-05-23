import type { Meal } from '../types'

interface MealListProps {
  meals: Meal[]
  onDeleteMeal: (id: string) => void
}

export function MealList({ meals, onDeleteMeal }: MealListProps) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900">Repas du jour</h2>
      <div className="mt-4 space-y-4">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="bg-white shadow rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{meal.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(meal.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <button
                onClick={() => onDeleteMeal(meal.id)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-700">Aliments :</h4>
              <ul className="mt-1 space-y-1">
                {meal.foods.map((food) => (
                  <li key={food.id} className="text-sm text-gray-600">
                    {food.name} - {food.calories} kcal
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 