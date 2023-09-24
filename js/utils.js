export function getRandomString(length = 20) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

export const isFormNode = node => ['input', 'textarea', 'select'].includes(node.tagName.toLowerCase());

export const htmlToNodeElements = html => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return [...wrapper.children];
};
