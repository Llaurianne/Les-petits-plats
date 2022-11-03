import recipes from '../../data/recipes.js'
import Recipe from '../factories/recipe.js';

// DOM elements
const resultsDOM = document.getElementById('results');
const mainSearchBar = document.getElementById('main-bar');
const advSearchFields = document.querySelectorAll('#search__advanced div input')
const ingredientsDOM = document.querySelector('.ingredients .list')
const applianceDOM = document.querySelector('.appliance .list')
const utensilsDOM = document.querySelector('.utensils .list')

// Variables declarations
let results = Object.values(recipes);
let userSearch
let ingredients = []
let appliance = []
let utensils = []

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

// Display the recipes in the results area
function displayRecipes() {
    results.forEach(elt => {
        let recipe = new Recipe(elt);
        resultsDOM.appendChild(recipe.card);
    })
}

// Set the arrays of ingredients, appliance and utensils which are in the recipes
function setAdvFields() {
    for (let i = 0; i < results.length; i++) {
        for (let j = 0; j < results[i].ingredients.length; j++) {
            ingredients.push(formatStg(results[i].ingredients[j].ingredient))
            ingredients = [...new Set(ingredients)]
        }
        appliance.push(formatStg(results[i].appliance));
        appliance = [...new Set(appliance)]

        utensils = utensils.concat(results[i].utensils);
        for (let j = 0; j < utensils.length; j++) {
            utensils[j] = formatStg(utensils[j])
        }
        utensils = [...new Set(utensils)];
    }
}

// Display the ingredients, appliance et utensils in the advanced search fields
function displayAdvFields() {
    ingredients.forEach(elt => {
        let newIngredient = document.createElement('p')
        newIngredient.innerText = elt;
        ingredientsDOM.appendChild(newIngredient);
    })
    appliance.forEach(elt => {
        let newAppliance = document.createElement('p')
        newAppliance.innerText = elt;
        applianceDOM.appendChild(newAppliance);
    })
    utensils.forEach(elt => {
        let  newUtensil = document.createElement('p')
        newUtensil.innerText = elt;
        utensilsDOM.appendChild(newUtensil);
    })
}

// Format string with first letter in upper case
function formatStg(string) {
    let newStg = string[0].toUpperCase() + string.slice(1).toLowerCase()
    newStg = newStg.split('(')[0]
    return newStg
}

// Empty DOM in the results area
function initializeResults() {
    resultsDOM.innerHTML =  '';
    results.length = 0;
}

// Empty DOM in the advanced research fields areas
function initializeAdvFields() {
    ingredientsDOM.innerHTML =  '';
    ingredients.length = 0;
    applianceDOM.innerHTML =  '';
    appliance.length = 0;
    utensilsDOM.innerHTML =  '';
    utensils.length = 0;
}

// Listen inputs in the main bar and trigger the corresponding actions
function updateResults() {
    mainSearchBar.addEventListener('input', () =>  {
        userSearch = mainSearchBar.value.toLowerCase();
        initializeResults()
        initializeAdvFields();
        if (userSearch.length > 2) {
            searchRecipes();
        } else {
            results = Object.values(recipes);
        }
        displayRecipes();
        setAdvFields();
        displayAdvFields();
    })
}

function openAdvSearch() {
    advSearchFields.forEach(input => {
        input.addEventListener('focusin', () =>
        {
            input.value = '';
            input.parentNode.classList.add('open');
        })
        input.addEventListener('focusout', () =>
        {
            input.value = formatStg(input.placeholder.split('un ')[1] + 's');
            input.parentNode.classList.remove('open');
        })
    })
}

// Main function
function init() {
    openAdvSearch()
    displayRecipes()
    setAdvFields()
    displayAdvFields()
    updateResults()
}

init()