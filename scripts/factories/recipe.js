
class Recipe {
    constructor(data) {
        this._id = data.id
        this._name = data.name
        this._ingredients = data.ingredients
        this._time = data.time
        this._description = data.description
    }

    get card() {
        let article = document.createElement('article');
        let img = document.createElement('img');
        img.setAttribute('src', '../assets/img_background.png');
        img.setAttribute('alt', `${this._name}`);
        let div = document.createElement('div');
        let h2 = document.createElement('h2');
        h2.innerText = `${this._name}`;
        let span = document.createElement('span')
        span.className ='material-symbols-outlined';
        span.innerText = 'schedule';
        let time = document.createElement('p')
        time.appendChild(span);
        time.innerText = `${this._time} min`;
        let ul = document.createElement('ul')
        this._ingredients.forEach(elt => {
            let li = document.createElement('li');
            let spanBold = document.createElement('span');
            let spanQuantity = document.createElement('span');
            ul.appendChild(li);
            li.appendChild(spanBold);
            li.appendChild(spanQuantity)
            spanBold.className = 'bold';
            spanBold.innerText = `${elt.ingredient}`;
            if (elt.quantity) {
                spanQuantity.innerText += `: ${elt.quantity}`;
            }
            if (elt.unit) {
                spanQuantity.innerText += ` ${elt.unit}`;
            }
        })
        let description = document.createElement('p');
        description.innerText = `${this._description}`;

        article.appendChild(img)
        article.appendChild(div)
        div.appendChild(h2)
        div.appendChild(time)
        div.appendChild(ul)
        div.appendChild(description)

        return article
    }
}

export default Recipe;