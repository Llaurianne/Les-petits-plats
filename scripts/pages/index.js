import recipes from '../../data/recipes.js'
import Recipe from '../factories/recipe.js';

// DOM elements
const resultsDOM = document.getElementById('results');
const mainBar = document.getElementById('main-bar');

// Variables declarations
let results = Object.values(recipes);
let userSearch

// Display the recipes in the results area
function displayRecipes() {
    results.forEach(elt => {
        let recipe = new Recipe(elt);
        resultsDOM.appendChild(recipe.card);
    })
}

// Search from the main bar in  the titles, ingredients and  description
function searchRecipes() {
    for (let i = 0; i < recipes.length; i++) {
        let lcName = recipes[i].name.toLowerCase()
        let lcIngredients
        for (let j=0; j<recipes[i].ingredients.length; j++) {
            lcIngredients += recipes[i].ingredients[j].ingredient.toLowerCase()
        }
        let lcDescription = recipes[i].description.toLowerCase()
        if (lcName.includes(userSearch) || lcIngredients.includes(userSearch) || lcDescription.includes(userSearch)) {
            results.push(recipes[i]);
        }
    }
}

// Empty DOM in the results area
function initializeResults() {
    resultsDOM.innerHTML =  '';
    results.length = 0;
}

// Listen inputs in the main bar and trigger the corresponding actions
function updateResults() {
    mainBar.addEventListener('input', () =>  {
        userSearch = mainBar.value.toLowerCase();

        if (userSearch.length > 2) {
            initializeResults()
            searchRecipes();
            displayRecipes();
        } else {
            initializeResults()
            results = Object.values(recipes);
            displayRecipes();
        }
    })
}

// Main function
function init() {
    displayRecipes()
    updateResults()
}

init()