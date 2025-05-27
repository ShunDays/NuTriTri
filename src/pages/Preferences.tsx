import { useState, useEffect } from 'react'
import type { UserPreferences } from '../types'

const LOCAL_STORAGE_KEY = 'nutritri_preferences'

export default function Preferences() {
  const [prefs, setPrefs] = useState<UserPreferences>({ allergies: [], dislikes: [], preferredFoods: [] })
  const [edit, setEdit] = useState(false)
  const [allergyInput, setAllergyInput] = useState('')
  const [dislikeInput, setDislikeInput] = useState('')
  const [preferredInput, setPreferredInput] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) setPrefs(JSON.parse(saved))
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prefs))
    setEdit(false)
  }

  const addToList = (type: keyof UserPreferences, value: string) => {
    if (!value.trim()) return
    setPrefs({ ...prefs, [type]: [...prefs[type], value.trim()] })
  }
  const removeFromList = (type: keyof UserPreferences, idx: number) => {
    setPrefs({ ...prefs, [type]: prefs[type].filter((_, i) => i !== idx) })
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Préférences et allergies</h1>
      {edit ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label>Allergies</label>
            <div className="flex gap-2 mb-2">
              <input value={allergyInput} onChange={e => setAllergyInput(e.target.value)} className="flex-1" />
              <button type="button" onClick={() => { addToList('allergies', allergyInput); setAllergyInput('') }} className="bg-blue-200 px-2 rounded">Ajouter</button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {prefs.allergies.map((a, i) => (
                <li key={i} className="bg-red-100 px-2 py-1 rounded flex items-center gap-1">{a} <button type="button" onClick={() => removeFromList('allergies', i)} className="text-red-600">×</button></li>
              ))}
            </ul>
          </div>
          <div>
            <label>Aliments non aimés</label>
            <div className="flex gap-2 mb-2">
              <input value={dislikeInput} onChange={e => setDislikeInput(e.target.value)} className="flex-1" />
              <button type="button" onClick={() => { addToList('dislikes', dislikeInput); setDislikeInput('') }} className="bg-blue-200 px-2 rounded">Ajouter</button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {prefs.dislikes.map((d, i) => (
                <li key={i} className="bg-yellow-100 px-2 py-1 rounded flex items-center gap-1">{d} <button type="button" onClick={() => removeFromList('dislikes', i)} className="text-red-600">×</button></li>
              ))}
            </ul>
          </div>
          <div>
            <label>Aliments préférés</label>
            <div className="flex gap-2 mb-2">
              <input value={preferredInput} onChange={e => setPreferredInput(e.target.value)} className="flex-1" />
              <button type="button" onClick={() => { addToList('preferredFoods', preferredInput); setPreferredInput('') }} className="bg-blue-200 px-2 rounded">Ajouter</button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {prefs.preferredFoods.map((p, i) => (
                <li key={i} className="bg-green-100 px-2 py-1 rounded flex items-center gap-1">{p} <button type="button" onClick={() => removeFromList('preferredFoods', i)} className="text-red-600">×</button></li>
              ))}
            </ul>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
        </form>
      ) : (
        <div className="space-y-2">
          <div>Allergies : {prefs.allergies.length === 0 ? <span className="text-gray-400">Aucune</span> : prefs.allergies.join(', ')}</div>
          <div>Non aimés : {prefs.dislikes.length === 0 ? <span className="text-gray-400">Aucun</span> : prefs.dislikes.join(', ')}</div>
          <div>Préférés : {prefs.preferredFoods.length === 0 ? <span className="text-gray-400">Aucun</span> : prefs.preferredFoods.join(', ')}</div>
          <button onClick={() => setEdit(true)} className="mt-4 bg-gray-200 px-4 py-2 rounded">Modifier</button>
        </div>
      )}
    </div>
  )
} 