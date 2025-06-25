import { useState, useEffect } from 'react'
import type { UserPreferences } from '../types'

const LOCAL_STORAGE_KEY = 'nutritri_preferences'

export default function Preferences() {
  const [prefs, setPrefs] = useState<UserPreferences>({ 
    allergies: [], 
    dislikes: [], 
    preferredFoods: [] 
  })
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
    const trimmedValue = value.trim()
    if (prefs[type].includes(trimmedValue)) return // Éviter les doublons
    setPrefs({ ...prefs, [type]: [...prefs[type], trimmedValue] })
  }

  const removeFromList = (type: keyof UserPreferences, idx: number) => {
    setPrefs({ ...prefs, [type]: prefs[type].filter((_, i) => i !== idx) })
  }

  const handleKeyPress = (e: React.KeyboardEvent, type: keyof UserPreferences, value: string, setValue: (val: string) => void) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addToList(type, value)
      setValue('')
    }
  }

  const commonAllergies = [
    'Gluten', 'Lactose', 'Œufs', 'Fruits à coque', 'Arachides', 
    'Poisson', 'Crustacés', 'Soja', 'Sésame', 'Sulfites'
  ]

  const commonDislikes = [
    'Champignons', 'Épinards', 'Brocolis', 'Choux', 'Poivrons',
    'Aubergines', 'Courgettes', 'Tomates', 'Oignons', 'Ail'
  ]

  const commonPreferred = [
    'Poulet', 'Saumon', 'Riz', 'Pâtes', 'Pommes de terre',
    'Salade', 'Carottes', 'Pommes', 'Bananes', 'Yaourt'
  ]

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="section-title mb-2">Préférences alimentaires</h1>
              <p className="text-gray-600">Configurez vos allergies, préférences et restrictions alimentaires</p>
            </div>
            <div className="text-3xl">⚙️</div>
          </div>

          {edit ? (
            <form onSubmit={handleSave} className="space-y-8">
              {/* Section Allergies */}
              <div className="bg-red-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">⚠️</span>
                  <h3 className="text-lg font-medium text-red-800">Allergies alimentaires</h3>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ajouter une allergie
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      value={allergyInput} 
                      onChange={e => setAllergyInput(e.target.value)}
                      onKeyPress={e => handleKeyPress(e, 'allergies', allergyInput, setAllergyInput)}
                      className="input-field flex-1" 
                      placeholder="Ex: Gluten, Lactose..."
                    />
                    <button 
                      type="button" 
                      onClick={() => { addToList('allergies', allergyInput); setAllergyInput('') }} 
                      className="btn-secondary"
                    >
                      Ajouter
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-2">Suggestions courantes :</div>
                    <div className="flex flex-wrap gap-2">
                      {commonAllergies.map(allergy => (
                        <button
                          key={allergy}
                          type="button"
                          onClick={() => addToList('allergies', allergy)}
                          className="text-xs px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
                          disabled={prefs.allergies.includes(allergy)}
                        >
                          + {allergy}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {prefs.allergies.map((a, i) => (
                    <span key={i} className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      {a} 
                      <button 
                        type="button" 
                        onClick={() => removeFromList('allergies', i)} 
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {prefs.allergies.length === 0 && (
                    <span className="text-gray-500 text-sm">Aucune allergie déclarée</span>
                  )}
                </div>
              </div>

              {/* Section Aliments non aimés */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">😐</span>
                  <h3 className="text-lg font-medium text-yellow-800">Aliments non appréciés</h3>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ajouter un aliment non apprécié
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      value={dislikeInput} 
                      onChange={e => setDislikeInput(e.target.value)}
                      onKeyPress={e => handleKeyPress(e, 'dislikes', dislikeInput, setDislikeInput)}
                      className="input-field flex-1" 
                      placeholder="Ex: Champignons, Épinards..."
                    />
                    <button 
                      type="button" 
                      onClick={() => { addToList('dislikes', dislikeInput); setDislikeInput('') }} 
                      className="btn-secondary"
                    >
                      Ajouter
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-2">Suggestions courantes :</div>
                    <div className="flex flex-wrap gap-2">
                      {commonDislikes.map(dislike => (
                        <button
                          key={dislike}
                          type="button"
                          onClick={() => addToList('dislikes', dislike)}
                          className="text-xs px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
                          disabled={prefs.dislikes.includes(dislike)}
                        >
                          + {dislike}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {prefs.dislikes.map((d, i) => (
                    <span key={i} className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      {d} 
                      <button 
                        type="button" 
                        onClick={() => removeFromList('dislikes', i)} 
                        className="text-yellow-600 hover:text-yellow-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {prefs.dislikes.length === 0 && (
                    <span className="text-gray-500 text-sm">Aucun aliment non apprécié</span>
                  )}
                </div>
              </div>

              {/* Section Aliments préférés */}
              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">😋</span>
                  <h3 className="text-lg font-medium text-green-800">Aliments préférés</h3>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ajouter un aliment préféré
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      value={preferredInput} 
                      onChange={e => setPreferredInput(e.target.value)}
                      onKeyPress={e => handleKeyPress(e, 'preferredFoods', preferredInput, setPreferredInput)}
                      className="input-field flex-1" 
                      placeholder="Ex: Poulet, Saumon..."
                    />
                    <button 
                      type="button" 
                      onClick={() => { addToList('preferredFoods', preferredInput); setPreferredInput('') }} 
                      className="btn-secondary"
                    >
                      Ajouter
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-2">Suggestions courantes :</div>
                    <div className="flex flex-wrap gap-2">
                      {commonPreferred.map(preferred => (
                        <button
                          key={preferred}
                          type="button"
                          onClick={() => addToList('preferredFoods', preferred)}
                          className="text-xs px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
                          disabled={prefs.preferredFoods.includes(preferred)}
                        >
                          + {preferred}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {prefs.preferredFoods.map((p, i) => (
                    <span key={i} className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {p} 
                      <button 
                        type="button" 
                        onClick={() => removeFromList('preferredFoods', i)} 
                        className="text-green-600 hover:text-green-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {prefs.preferredFoods.length === 0 && (
                    <span className="text-gray-500 text-sm">Aucun aliment préféré défini</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" className="btn-primary">
                  💾 Enregistrer les préférences
                </button>
                <button 
                  type="button" 
                  onClick={() => setEdit(false)} 
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Résumé des préférences */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">⚠️</span>
                    <h3 className="font-medium text-red-800">Allergies</h3>
                  </div>
                  <div className="text-2xl font-bold text-red-600 mb-1">{prefs.allergies.length}</div>
                  <div className="text-sm text-red-700">
                    {prefs.allergies.length === 0 ? 'Aucune allergie' : 'allergie(s) déclarée(s)'}
                  </div>
                  {prefs.allergies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {prefs.allergies.slice(0, 3).map((allergy, i) => (
                        <span key={i} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {allergy}
                        </span>
                      ))}
                      {prefs.allergies.length > 3 && (
                        <span className="text-xs text-red-600">+{prefs.allergies.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">😐</span>
                    <h3 className="font-medium text-yellow-800">Non aimés</h3>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 mb-1">{prefs.dislikes.length}</div>
                  <div className="text-sm text-yellow-700">
                    {prefs.dislikes.length === 0 ? 'Aucune restriction' : 'aliment(s) évité(s)'}
                  </div>
                  {prefs.dislikes.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {prefs.dislikes.slice(0, 3).map((dislike, i) => (
                        <span key={i} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {dislike}
                        </span>
                      ))}
                      {prefs.dislikes.length > 3 && (
                        <span className="text-xs text-yellow-600">+{prefs.dislikes.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">😋</span>
                    <h3 className="font-medium text-green-800">Préférés</h3>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">{prefs.preferredFoods.length}</div>
                  <div className="text-sm text-green-700">
                    {prefs.preferredFoods.length === 0 ? 'Aucune préférence' : 'aliment(s) préféré(s)'}
                  </div>
                  {prefs.preferredFoods.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {prefs.preferredFoods.slice(0, 3).map((preferred, i) => (
                        <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {preferred}
                        </span>
                      ))}
                      {prefs.preferredFoods.length > 3 && (
                        <span className="text-xs text-green-600">+{prefs.preferredFoods.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Détails complets */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Allergies :</h3>
                  {prefs.allergies.length === 0 ? (
                    <span className="text-gray-500">Aucune allergie déclarée</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {prefs.allergies.map((allergy, i) => (
                        <span key={i} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Aliments non aimés :</h3>
                  {prefs.dislikes.length === 0 ? (
                    <span className="text-gray-500">Aucune restriction</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {prefs.dislikes.map((dislike, i) => (
                        <span key={i} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                          {dislike}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Aliments préférés :</h3>
                  {prefs.preferredFoods.length === 0 ? (
                    <span className="text-gray-500">Aucune préférence définie</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {prefs.preferredFoods.map((preferred, i) => (
                        <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {preferred}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <button onClick={() => setEdit(true)} className="btn-primary">
                  ✏️ Modifier les préférences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 