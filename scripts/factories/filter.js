
class Filter {
    constructor(data) {
        this._type = data.type
        this._name = data.name
    }

    get tag() {
        let p = document.createElement('p');
        p.className = this._type;
        let span = document.createElement('span');
        span.innerText = this._name;
        let i = document.createElement('i');
        i.className = 'material-symbols-outlined';
        i.innerText = 'cancel';
        p.appendChild(span);
        p.appendChild(i);
        return p;
    }
}

export default Filter;