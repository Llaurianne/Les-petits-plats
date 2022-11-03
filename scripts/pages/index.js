import recipes from '../../data/recipes.js'
import Recipe from '../factories/recipe.js';

// DOM elements
const resultsDOM = document.getElementById('results');
const mainSearchBar = document.getElementById('main-bar');
const advSearchFields = document.querySelectorAll('#search__advanced div input')
const advDOM = {
    ingredients: document.querySelector('.ingredients .list'),
    appliance: document.querySelector('.appliance .list'),
    utensils: document.querySelector('.utensils .list')
};

// Variables declarations
let results = Object.values(recipes);
let userSearch
let advResults = {
    ingredients: [],
    appliance: [],
    utensils: []
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
            advResults.ingredients.push(formatStg(results[i].ingredients[j].ingredient))
            advResults.ingredients = [...new Set(advResults.ingredients)]
        }
        advResults.appliance.push(formatStg(results[i].appliance));
        advResults.appliance = [...new Set(advResults.appliance)]

        advResults.utensils = advResults.utensils.concat(results[i].utensils);
        for (let j = 0; j < advResults.utensils.length; j++) {
            advResults.utensils[j] = formatStg(advResults.utensils[j])
        }
        advResults.utensils = [...new Set(advResults.utensils)];
    }

}

// Display the ingredients, appliance et utensils in the advanced search fields
function displayAdvFields() {
    advSearchFields.forEach(input => {
        advResults[input.id].forEach(elt => {
            let  newElt = document.createElement('p')
            newElt.innerText = elt;
            advDOM[input.id].appendChild(newElt);
        })
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
    advDOM.ingredients.innerHTML =  '';
    advResults.ingredients.length = 0;
    advDOM.appliance.innerHTML =  '';
    advResults.appliance.length = 0;
    advDOM.utensils.innerHTML =  '';
    advResults.utensils.length = 0;
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
    })
}

function openAdvSearch() {
    advSearchFields.forEach(input => {
        input.addEventListener('focusin', () =>
        {
            input.value = '';
            setAdvFields();
            displayAdvFields();
            filterAdvFields()
            input.parentNode.classList.add('open');

        })
        input.addEventListener('focusout', () =>
        {
            initializeAdvFields()
            input.value = formatStg(input.placeholder.split('un ')[1] + 's');
            input.parentNode.classList.remove('open');
        })
    })
}

// Filter advanced items depending on advanced search
function filterAdvFields() {
    advSearchFields.forEach(input => {
        input.addEventListener('input', () => {
            advDOM[input.id].innerHTML =  '';
            advResults[input.id].forEach(elt => {
                if (elt.toLowerCase().includes(input.value.toLowerCase()) || (input.value === '')) {
                    let newFilteredElt = document.createElement('p')
                    newFilteredElt.innerText = elt;
                    advDOM[input.id].appendChild(newFilteredElt);
                }
            })
        })
    })
}

// Main function
function init() {
    openAdvSearch()
    displayRecipes()
    updateResults()
}

init()