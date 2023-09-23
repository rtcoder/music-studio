const isFormNode = node => ['input', 'textarea', 'select'].includes(node.tagName.toLowerCase());

class Store {
    static #data = {};

    constructor() {
        this.#initValues();
        this.#initListener();
    }

    /**
     *
     * @param value {object}
     */
    init(value) {
        Store.#data = value;
    }

    /**
     *
     * @param path {string}
     * @return {any}
     */
    get(path) {
        let data = Store.#data;
        if (!path) {
            return data;
        }
        path.split('.').forEach(part => {
            data = data[part];
        });

        return data;
    }

    /**
     *
     * @param path {string}
     * @param value {any}
     */
    set(path, value) {
        const keys = path.split('.');
        let current = Store.#data;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }

        const lastKey = keys[keys.length - 1];
        current[lastKey] = value;

        this.#setValueToView(path, value);
    }

    #initValues() {
        document.querySelectorAll('[data-model]').forEach(el => {
            this.#setValueToElement(el);
        });
    }

    #setValueToElement(el) {
        const path = el.getAttribute('data-model');
        if (path?.length) {
            if (isFormNode(el)) {
                el.value = this.get(path);
            } else {
                el.innerHTML = this.get(path);
            }
        }
    }

    #initListener() {
        document.body.addEventListener('input', event => {
            if (event.target.matches('[data-model]')) {
                const el = event.target;
                const value = isFormNode(el) ? el.value : el.innerHTML;
                const path = el.getAttribute('data-model');
                this.set(path, value);
            }
        });

        const observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // Znaleziono zmianę w strukturze dziecka (dodanie/usunięcie elementu)
                    if (mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(el => {
                            this.#setValueToElement(el);
                        });
                    } else if (mutation.removedNodes.length > 0) {
                        console.log('Usunięto element:', mutation.removedNodes[0]);
                        // Tutaj można dodać kod obsługi, gdy element jest usuwany
                    }
                }
            }
        });

        observer.observe(document, {childList: true, subtree: true});
    }

    #setValueToView(path) {
        const value = this.get(path);
        document.querySelectorAll(`[data-model="${path}"]`).forEach(el => {
            if (isFormNode(el)) {
                el.value = value;
            } else {
                el.innerHTML = value;
            }
        });
    }
}

const instance = new Store();
export default instance;
