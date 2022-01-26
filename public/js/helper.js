function getRandomNumber(min, max) {
    let ranFloat = Math.random() * (max - min) + min;
    let ranInt = Math.round(ranFloat);
    return ranInt;
}

function getRandomString(length) {
    let result = '';
    let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        let charPosition = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(charPosition);
    }
    return result;
}

export { getRandomString, getRandomNumber };