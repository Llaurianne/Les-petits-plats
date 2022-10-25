import recipes from '../../data/recipes.js'
import Recipe from '../factories/recipe.js';

// DOM elements
const resultsDOM = document.getElementById('results');

// Variables declarations
let results = Object.values(recipes);

// Display the recipes in the results area
function displayRecipes() {
    results.forEach(elt => {
        let recipe = new Recipe(elt);
        resultsDOM.appendChild(recipe.card);
    })
}

// Main function
function init() {
    displayRecipes()
}

init()