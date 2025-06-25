# 🥗 NuTriTri - Application de Suivi Nutritionnel

Une application web moderne pour gérer votre alimentation au quotidien, suivre vos apports nutritionnels et atteindre vos objectifs de santé.

## ✨ Fonctionnalités

### 📊 Tableau de bord complet
- **Suivi en temps réel** : Visualisation de vos apports quotidiens en calories, protéines, glucides et lipides
- **Objectifs personnalisés** : Définissez et suivez vos objectifs nutritionnels
- **Indicateurs visuels** : Barres de progression et émojis pour un feedback instantané
- **Salutations contextuelles** : Interface qui s'adapte au moment de la journée

### 🍽️ Gestion des repas
- **Ajout facile** : Interface intuitive pour enregistrer vos repas
- **Base de données d'aliments** : Catalogue d'aliments avec informations nutritionnelles
- **Intégration OpenFoodFacts** : Recherche d'aliments en temps réel depuis la base de données mondiale
- **Historique complet** : Consultez tous vos repas passés

### 👨‍🍳 Recettes intelligentes
- **Création de recettes** : Composez vos recettes avec calcul automatique des valeurs nutritionnelles
- **Recherche d'ingrédients** : Trouvez des aliments via l'API OpenFoodFacts
- **Informations nutritionnelles** : Calcul automatique des calories, protéines, glucides et lipides
- **Bibliothèque personnelle** : Sauvegardez et consultez vos recettes favorites

### 📅 Planification de menus
- **Menus personnalisés** : Créez des plans de repas sur plusieurs jours
- **Interface calendrier** : Planification visuelle avec raccourcis pour la semaine courante
- **Nutrition moyenne** : Calcul des apports nutritionnels moyens par jour
- **Organisation flexible** : Ajoutez, modifiez ou supprimez repas et journées facilement

### ⚙️ Préférences alimentaires
- **Gestion des allergies** : Déclarez vos allergies avec suggestions courantes
- **Aliments non appréciés** : Listez ce que vous préférez éviter
- **Aliments préférés** : Identifiez vos aliments favoris
- **Suggestions intelligentes** : Propositions basées sur les préférences communes

## 🎨 Design et UX

### 📱 Responsive Design
- **Mobile-first** : Interface optimisée pour tous les écrans
- **Adaptation fluide** : Layout qui s'adapte de mobile à desktop
- **Navigation intuitive** : Menu hamburger sur mobile, navigation horizontale sur desktop

### 🎭 Interface moderne
- **Design épuré** : Interface claire et moderne avec Tailwind CSS
- **Animations fluides** : Transitions et interactions agréables
- **Feedback visuel** : Toasts de notification pour toutes les actions
- **Thème cohérent** : Palette de couleurs harmonieuse avec émojis expressifs

## 🛠️ Technologies utilisées

- **React 18** avec TypeScript pour une base solide et typée
- **Tailwind CSS** pour un design moderne et responsive
- **Vite** pour un développement rapide et optimisé
- **OpenFoodFacts API** pour la base de données d'aliments
- **LocalStorage** pour la persistance des données côté client
- **ESLint** pour la qualité du code

## 🚀 Installation et démarrage

### Prérequis
- Node.js (version 16+ recommandée)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone https://github.com/votre-username/nutritri.git
cd nutritri

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Builder pour la production
npm run build
```

### Scripts disponibles
- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run preview` - Prévisualise la version de production
- `npm run lint` - Vérifie la qualité du code

## 📁 Structure du projet

```
src/
├── components/           # Composants React réutilisables
│   ├── ui/              # Composants UI de base (Button, Card, Input...)
│   ├── AddMealForm.tsx  # Formulaire d'ajout de repas
│   ├── FoodDatabase.tsx # Gestion de la base d'aliments
│   ├── MealList.tsx     # Liste des repas
│   ├── Navigation.tsx   # Navigation principale
│   └── Toast.tsx        # Notifications
├── pages/               # Pages de l'application
│   ├── Goals.tsx        # Gestion des objectifs
│   ├── Menus.tsx        # Planification des menus
│   ├── Preferences.tsx  # Préférences alimentaires
│   └── Recipes.tsx      # Gestion des recettes
├── hooks/               # Hooks React personnalisés
│   └── useLocalStorage.ts
├── services/            # Services externes
│   └── openFoodFacts.ts # Intégration API OpenFoodFacts
├── types/               # Types TypeScript
│   └── index.ts
├── App.tsx              # Composant principal
├── main.tsx             # Point d'entrée
└── index.css            # Styles globaux
```

## 🎯 Objectifs atteints

✅ **Tableau de bord avec répartition des macronutriments**
- Affichage temps réel des calories, protéines, glucides, lipides
- Barres de progression visuelles
- Pourcentages d'objectifs atteints

✅ **Liste de recettes avec informations nutritionnelles**
- Création de recettes avec ingrédients
- Calcul automatique des valeurs nutritionnelles
- Intégration OpenFoodFacts pour la recherche d'aliments

✅ **Détail des repas incluant tous les macronutriments**
- Vue détaillée de chaque repas
- Informations nutritionnelles complètes
- Historique complet

✅ **Création de menus personnalisés**
- Planification sur plusieurs jours
- Interface calendrier intuitive
- Calcul de nutrition moyenne

✅ **Design responsive intégré**
- Mobile-first approach
- Adaptation fluide sur tous les écrans
- Navigation optimisée pour chaque format

## 🔄 Flux d'utilisation

1. **Configuration initiale** : Définissez vos objectifs nutritionnels et préférences
2. **Ajout d'aliments** : Enrichissez votre base d'aliments via OpenFoodFacts
3. **Création de recettes** : Composez vos recettes favorites
4. **Planification** : Créez des menus pour organiser vos repas
5. **Suivi quotidien** : Enregistrez vos repas et suivez vos progrès

## 🌟 Points forts

- **Interface intuitive** adaptée à tous les utilisateurs
- **Données fiables** grâce à l'intégration OpenFoodFacts
- **Responsive design** pour une utilisation mobile optimale
- **Performance optimisée** avec Vite et React
- **Code propre** avec TypeScript et bonnes pratiques

## 📈 Évolutions possibles

- Export des données nutritionnelles
- Graphiques de progression sur le temps
- Recommandations personnalisées
- Mode sombre
- PWA pour installation mobile
- Synchronisation cloud

---

**Développé avec ❤️ pour un suivi nutritionnel simplifié et efficace**
