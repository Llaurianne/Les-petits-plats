import recipes from '../../data/recipes.js'
import Recipe from '../factories/recipe.js';
import Filter from '../factories/filter.js';

// DOM elements
const resultsDOM = document.getElementById('results');
const mainSearchBar = document.getElementById('main-bar');
const tagsBar = document.querySelector('.tags');
const advSearchInputs = document.querySelectorAll('#search__advanced div input')
const advSearchDiv = document.querySelectorAll('#search__advanced>div')
const advDOM = {
    ingredients: document.querySelector('.ingredients .list'),
    appliance: document.querySelector('.appliance .list'),
    utensils: document.querySelector('.utensils .list')
};
let currentDiv = '';

// Variables declarations
let results = Object.values(recipes);
let userSearch
let advResults = {
    ingredients: [],
    appliance: [],
    utensils: []
}
let filters = {
    ingredients: [],
    appliance: [],
    utensils: []
}

// Search from the main bar in  the titles, ingredients and  description
function searchRecipes() {
    recipes.forEach(rec => {
        let lcName = rec.name.toLowerCase();
        let lcIngredients;
        rec.ingredients.forEach(ing => {
            lcIngredients += ing.ingredient.toLowerCase();
        })
        let lcDescription = rec.description.toLowerCase();
        if (lcName.includes(userSearch) || lcIngredients.includes(userSearch) || lcDescription.includes(userSearch)) {
            results.push(rec);
        }
    })
}

// Display the recipes in the results area
function displayRecipes() {
    results.forEach(elt => {
        if (filters.ingredients.every(ing1 => (elt.ingredients.findIndex(ing2 => formatStg(ing2.ingredient) === ing1 ) !== -1)) && filters.appliance.every(app => formatStg(elt.appliance) === app ) && filters.utensils.every(ut1 => elt.utensils.findIndex(ut2 => formatStg(ut2) === ut1 ) !== -1 )) {
            let recipe = new Recipe(elt);
            resultsDOM.appendChild(recipe.card);
        }
    })
    if (!resultsDOM.lastChild) {
        let p = document.createElement('p');
        p.setAttribute('id', 'message');
        p.innerText = 'Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc';
        resultsDOM.appendChild(p);
    }
}

function updateFilters() {
    for (let filter  in filters) {
        let nodeList = [...document.querySelectorAll(`.tags .${filter} span`)]
        filters[filter] = nodeList.map(elt => elt.innerText)
    }
}

// Set the arrays of ingredients, appliance and utensils which are in the recipes
function setAdvFields() {
    results.forEach(rec => {
        if (filters.ingredients.every(ing1 => (rec.ingredients.findIndex(ing2 => formatStg(ing2.ingredient) === ing1 ) !== -1)) && filters.appliance.every(app => formatStg(rec.appliance) === app ) && filters.utensils.every(ut1 => rec.utensils.findIndex(ut2 => formatStg(ut2) === ut1 ) !== -1 )) {
            rec.ingredients.forEach(ing => {
                advResults.ingredients.push(formatStg(ing.ingredient))
                advResults.ingredients = [...new Set(advResults.ingredients.sort())]
            })
            advResults.appliance.push(formatStg(rec.appliance));
            advResults.appliance = [...new Set(advResults.appliance.sort())]

            advResults.utensils = advResults.utensils.concat(rec.utensils);
            advResults.utensils = advResults.utensils.map(ut => formatStg(ut))
            advResults.utensils = [...new Set(advResults.utensils.sort())];
        }
    })
}

// Display the ingredients, appliance et utensils in the advanced search fields
function displayAdvFields() {
    advSearchInputs.forEach(input => {
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

// Display the advanced items corresponding to the main search and able the advanced search
function openAdvSearch() {
    advSearchDiv.forEach(div => {
        let input = div.querySelector('input');
        document.addEventListener('click', (evt) => {
            if ((evt.target === div || evt.target === div.querySelector('i') || evt.target === div.querySelector('input')) && !document.querySelector('.open')) {
                initializeAdvFields()
                input.focus();
                input.value = '';
                setAdvFields();
                displayAdvFields();
                filterAdvFields()
                div.classList.add('open');
                currentDiv = div;
                evt.stopImmediatePropagation()
            }
        })
    })
    document.addEventListener('click', (evt) => {
        closeAdvSearch(evt)
    })
    document.addEventListener('keyup', (evt) => {
        closeAdvSearch(evt)
    })
}

function closeAdvSearch(evt) {
    if (document.querySelector('.open') && ((evt.type === 'keyup' && evt.key === 'Escape') || (evt.type==='click' && evt.target !== currentDiv && evt.target.parentNode && evt.target.parentNode !== currentDiv ) || (evt.type==='click' && evt.target === currentDiv.querySelector('i')))) {
        initializeAdvFields()
        currentDiv.querySelector('input').value = formatStg(currentDiv.querySelector('input').placeholder.split('un ')[1] + 's');
        currentDiv.classList.remove('open');
        currentDiv = '';
        evt.stopImmediatePropagation();
    }
}

// Filter advanced items depending on advanced search
function filterAdvFields() {
    advSearchInputs.forEach(input => {
        input.addEventListener('input', () => {
            advDOM[input.id].innerHTML =  '';
            advResults[input.id].forEach(elt => {
                if (elt.toLowerCase().includes(input.value.toLowerCase()) || (input.value === '')) {
                    let newFilteredElt = document.createElement('p')
                    newFilteredElt.innerText = elt;
                    advDOM[input.id].appendChild(newFilteredElt);
                }
            })
            addTag()
        })
    })
    addTag()
}

// Display the tags
function addTag() {
    for (let elt in advDOM) {
        advDOM[elt].childNodes.forEach(item => {
            item.addEventListener('click', () => {
                let filter = new Filter({type: elt, name: item.innerText});
                tagsBar.appendChild(filter.tag);
                resultsDOM.innerHTML =  '';
                updateFilters()
                displayRecipes()
                deleteTag()
            })

        })
    }
}

// Delete filter tag
function deleteTag() {
    let delButton = document.querySelectorAll('.tags i')
    delButton.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.parentElement.remove();
            resultsDOM.innerHTML =  '';
            updateFilters()
            displayRecipes()
        })
    })
}

// Main function
function init() {
    displayRecipes()
    openAdvSearch()
    updateResults()
}

init()