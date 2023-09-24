import dom from './dom.js';
import {isCheckbox, isFormNode} from './utils.js';

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
        this.#initValues();
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
        dom.query('[data-model]').each(el => {
            this.#setValueToElement(el);
        });
    }

    #setValueToElement(el) {
        const path = el.getAttribute('data-model');
        if (path?.length) {
            const value = this.get(path);
            if (isFormNode(el)) {
                if (isCheckbox(el)) {
                    el.checked = !!value;
                } else {
                    el.value = value;
                }
            } else {
                el.innerHTML = value;
            }
        }
    }

    #initListener() {
        dom.query('body').on({
            'input': event => {
                if (event.target.matches('[data-model]')) {
                    const el = event.target;
                    const value = isFormNode(el) ? el.value : el.innerHTML;
                    const path = el.getAttribute('data-model');
                    this.set(path, value);
                }
            },
            'change': event => {
                if (event.target.matches('[data-model]')) {
                    const el = event.target;
                    if (!isCheckbox(el)) {
                        return;
                    }
                    const path = el.getAttribute('data-model');
                    this.set(path, el.checked);
                }
            },
        });

        const observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(el => {
                            this.#setValueToElement(el);
                        });
                    } else if (mutation.removedNodes.length > 0) {
                        // console.log('Usunięto element:', mutation.removedNodes[0]);
                    }
                }
            }
        });

        observer.observe(document, {childList: true, subtree: true});
    }

    #setValueToView(path) {
        const value = this.get(path);
        dom.query(`[data-model="${path}"]`).each(el => {
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
