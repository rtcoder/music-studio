import {htmlToNodeElements} from './utils.js';

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

    /**
     * @param {string} selector
     * @return {Dom}
     */
    query(selector) {
        return new Dom(`${this.#selector} ${selector}`);
    }

    /**
     * @param {string} className
     * @return {Dom}
     */
    addClass(className) {
        const classList = className.split(' ');
        this.#elements.forEach(el => {
            el.classList.add(...classList);
        });
        return this;
    }

    /**
     * @param {string} className
     * @return {Dom}
     */
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

    /**
     *
     * @param value {string|undefined}
     * @return {Dom|string}
     */
    text(value) {
        if (value !== undefined) {
            this.#elements.forEach(el => {
                el.innerText = value;
            });
            return this;
        }
        return this.#elements.item(0).innerText;
    }

    /**
     *
     * @param value {string|undefined}
     * @return {Dom|string}
     */
    html(value) {
        if (value !== undefined) {
            this.#elements.forEach(el => {
                el.innerHTML = value;
            });
            return this;
        }
        return this.#elements.item(0).innerHTML;
    }

    /**
     *
     * @param html {string}
     * @return {Dom}
     */
    append(html) {
        const elements = htmlToNodeElements(html);
        this.#elements.forEach(el => {
            el.append(...elements);
        });
        return this;
    }

    /**
     *
     * @param html {string}
     * @return {Dom}
     */
    prepend(html) {
        const elements = htmlToNodeElements(html);
        this.#elements.forEach(el => {
            el.prepend(...elements);
        });
        return this;
    }

    /**
     * Adds one or multiple event listeners to all elements in the collection.
     *
     * @param {string|Object} event - The event name or an object where keys are event names, and values are functions to handle those events.
     * @param {function|undefined} callback - The event handling function.
     * @returns {Dom} - Returns the same collection object for chainable usage.
     *
     * @example
     * // Adding a click handler to all elements with the 'my-element' class:
     * const elements = document.querySelectorAll('.my-element');
     * elements.on('click', (event) => {
     *     console.log('Clicked element:', event.target);
     * });
     *
     * // Adding multiple event handlers using an object:
     * elements.on({
     *     click: (event) => {
     *         console.log('Clicked element:', event.target);
     *     },
     *     mouseover: (event) => {
     *         console.log('Mouse over element:', event.target);
     *     }
     * });
     */
    on(event, callback = undefined) {
        if (typeof callback === 'function' && typeof event === 'string') {
            this.#elements.forEach(el => el.addEventListener(event, callback));
        }
        if (callback === undefined && typeof event === 'object') {
            Object.keys(event).forEach(ev => {
                const cb = event[ev];
                this.#elements.forEach(el => el.addEventListener(ev, cb));
            });
        }
        return this;
    }

    empty() {
        this.#elements.forEach(el => el.innerHTML = '');
        return this;
    }

    nativeElement(single = false) {
        return single
            ? this.#elements.item(0)
            : this.#elements;
    }

    /**
     *
     * @param arg {string|object}
     * @return {Dom|string}
     */
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

        return this;
    }
}

export default {
    query: (selector) => {
        return new Dom(selector);
    },
};
