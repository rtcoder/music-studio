const htmlToNodeElements = html => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return [...wrapper.children];
};

class Dom {
    /**
     *
     * @type {NodeListOf<any>}
     */
    #elements = null;
    #selector = null;

    constructor(selectorOrElement) {
        this.#selector = selectorOrElement;
        this.#elements = document.querySelectorAll(selectorOrElement);
    }

    query(selector) {
        return new Dom(`${this.#selector} ${selector}`);
    }

    addClass(className) {
        const classList = className.split(' ');
        this.#elements.forEach(el => {
            el.classList.add(...classList);
        });
        return this;
    }

    removeClass(className) {
        const classList = className.split(' ');
        this.#elements.forEach(el => {
            el.classList.remove(...classList);
        });
        return this;
    }

    attr(name, value) {
        if (value !== undefined) {
            this.#elements.forEach(el => {
                el.setAttribute(name, value);
            });
            return this;
        }
        return this.#elements.item(0).getAttribute(name);
    }

    text(value) {
        if (value !== undefined) {
            this.#elements.forEach(el => {
                el.innerText = value;
            });
            return this;
        }
        return this.#elements.item(0).innerText;
    }

    html(value) {
        if (value !== undefined) {
            this.#elements.forEach(el => {
                el.innerHTML = value;
            });
            return this;
        }
        return this.#elements.item(0).innerHTML;
    }

    append(html) {
        const elements = htmlToNodeElements(html);
        this.#elements.forEach(el => {
            el.append(...elements);
        });
        return this;
    }

    prepend(html) {
        const elements = htmlToNodeElements(html);
        this.#elements.forEach(el => {
            el.prepend(...elements);
        });
        return this;
    }

    on(event, callback) {
        this.#elements.forEach(el => el.addEventListener(event, callback));
    }

    empty() {
        this.#elements.forEach(el => el.innerHTML = '');
    }

    nativeElement(single = false) {
        return single
            ? this.#elements.item(0)
            : this.#elements;
    }

    style(arg) {
        if (typeof arg === 'string') {
            return this.nativeElement(true).style[arg];
        }
        if (typeof arg === 'object') {
            this.#elements.forEach(el => {
                Object.keys(arg).forEach(key => {
                    el.style[key] = arg[key];
                });
            });
        }
    }
}

export default {
    query: (selector) => {
        return new Dom(selector);
    },
};
