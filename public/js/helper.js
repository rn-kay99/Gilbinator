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

function getRandomProfile() {
    fetch("https://randomuser.me/api/?nat=de")
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            return data.results;
        })
        .catch((err) => {
            console.log(err);
        });
}

async function getRandomName(){
    let randomProfile = await getRandomProfile();

    return randomProfile;
}


// console.log(getRandomName());

export { getRandomString, getRandomNumber, getRandomName };