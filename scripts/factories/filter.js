
class Filter {
    constructor(data) {
        this._type = data.type
        this._name = data.name
    }

    get tag() {
        let p = document.createElement('p');
        p.className = this._type;
        p.innerText = this._name;
        let span = document.createElement('span');
        span.className = 'material-symbols-outlined';
        span.innerText = 'cancel';
        p.appendChild(span);
        span.addEventListener('click', () => {
            p.remove();
        })
        return p;
    }
}

export default Filter;