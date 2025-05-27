import { useState, useEffect } from 'react'
import type { Menu, MenuDay, Meal } from '../types'

const LOCAL_STORAGE_KEY = 'nutritri_menus'

export default function Menus() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [days, setDays] = useState<MenuDay[]>([])
  const [dayDate, setDayDate] = useState('')
  const [meals, setMeals] = useState<Meal[]>([])
  const [mealName, setMealName] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) setMenus(JSON.parse(saved))
  }, [])

  const handleAddMeal = () => {
    if (!mealName) return
    const meal: Meal = {
      id: Date.now().toString(),
      name: mealName,
      foods: [],
      date: dayDate || new Date().toISOString(),
    }
    setMeals([...meals, meal])
    setMealName('')
  }

  const handleAddDay = () => {
    if (!dayDate || meals.length === 0) return
    setDays([...days, { date: dayDate, meals }])
    setDayDate('')
    setMeals([])
  }

  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || days.length === 0) return
    const newMenu: Menu = {
      id: Date.now().toString(),
      name,
      days,
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Menus / Planning</h1>
      <button onClick={() => setShowForm(!showForm)} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">{showForm ? 'Annuler' : 'Créer un menu'}</button>
      {showForm && (
        <form onSubmit={handleAddMenu} className="space-y-4 mb-6">
          <div>
            <label>Nom du menu</label>
            <input value={name} onChange={e => setName(e.target.value)} className="block w-full" />
          </div>
          <div>
            <label>Ajouter un jour</label>
            <div className="flex gap-2 mb-2">
              <input type="date" value={dayDate} onChange={e => setDayDate(e.target.value)} className="flex-1" />
              <input value={mealName} onChange={e => setMealName(e.target.value)} placeholder="Nom du repas" className="flex-1" />
              <button type="button" onClick={handleAddMeal} className="bg-blue-200 px-2 rounded">Ajouter repas</button>
              <button type="button" onClick={handleAddDay} className="bg-blue-400 px-2 rounded text-white">Ajouter jour</button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {meals.map((m, i) => (
                <li key={i} className="bg-gray-100 px-2 py-1 rounded">{m.name}</li>
              ))}
            </ul>
            <ul className="mt-2">
              {days.map((d, i) => (
                <li key={i} className="bg-blue-50 px-2 py-1 rounded mb-1">{d.date} : {d.meals.map(m => m.name).join(', ')}</li>
              ))}
            </ul>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer le menu</button>
        </form>
      )}
      <h2 className="text-lg font-semibold mb-2">Mes menus</h2>
      <ul className="space-y-2">
        {menus.length === 0 && <li className="text-gray-400">Aucun menu enregistré.</li>}
        {menus.map(m => (
          <li key={m.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
            <div>
              <div className="font-bold">{m.name}</div>
              <div className="text-xs text-gray-500">{m.days.length} jour(s)</div>
            </div>
            <button onClick={() => handleDelete(m.id)} className="text-red-600">Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  )
} 