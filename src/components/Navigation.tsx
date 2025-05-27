import { useState } from 'react'

interface NavigationProps {
  currentView: string
  onViewChange: (view: string) => void
  onAddMeal: () => void
}

export function Navigation({ currentView, onViewChange, onAddMeal }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">NutriTrack</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => onViewChange('dashboard')}
                className={`${
                  currentView === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-blue-600'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Tableau de bord
              </button>
              <button
                onClick={() => onViewChange('history')}
                className={`${
                  currentView === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-blue-600'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Historique
              </button>
              <button
                onClick={() => onViewChange('goals')}
                className={`${
                  currentView === 'goals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-blue-600'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Objectifs
              </button>
              <button
                onClick={() => onViewChange('recipes')}
                className={`${
                  currentView === 'recipes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-blue-600'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Recettes
              </button>
              <button
                onClick={() => onViewChange('menus')}
                className={`${
                  currentView === 'menus'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-blue-600'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Menus
              </button>
              <button
                onClick={() => onViewChange('preferences')}
                className={`${
                  currentView === 'preferences'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-blue-600'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Préférences
              </button>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              onClick={onAddMeal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Nouveau repas
            </button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                onViewChange('dashboard')
                setIsOpen(false)
              }}
              className={`${
                currentView === 'dashboard'
                  ? 'bg-blue-50 border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-blue-600'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Tableau de bord
            </button>
            <button
              onClick={() => {
                onViewChange('history')
                setIsOpen(false)
              }}
              className={`${
                currentView === 'history'
                  ? 'bg-blue-50 border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-blue-600'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Historique
            </button>
            <button
              onClick={() => {
                onViewChange('goals')
                setIsOpen(false)
              }}
              className={`${
                currentView === 'goals'
                  ? 'bg-blue-50 border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-blue-600'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Objectifs
            </button>
            <button
              onClick={() => {
                onViewChange('recipes')
                setIsOpen(false)
              }}
              className={`${
                currentView === 'recipes'
                  ? 'bg-blue-50 border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-blue-600'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Recettes
            </button>
            <button
              onClick={() => {
                onViewChange('menus')
                setIsOpen(false)
              }}
              className={`${
                currentView === 'menus'
                  ? 'bg-blue-50 border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-blue-600'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Menus
            </button>
            <button
              onClick={() => {
                onViewChange('preferences')
                setIsOpen(false)
              }}
              className={`${
                currentView === 'preferences'
                  ? 'bg-blue-50 border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-blue-600'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Préférences
            </button>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <button
                onClick={() => {
                  onAddMeal()
                  setIsOpen(false)
                }}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Nouveau repas
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 