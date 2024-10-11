const userImage = document.getElementById('user-image');
const userName = document.getElementById('user-name');
const userId = document.getElementById('user-id');
const githubBtn = document.getElementById('github-btn');
const linkedinBtn = document.getElementById('linkedin-btn');
const qualification = document.getElementById('qualification');
const contact = document.getElementById('contact');
const email = document.getElementById('email');
const interests = document.getElementById('interests');
const homeBtn = document.getElementById('home-btn');

let githubURL;
let linkedinURL;

function getObject() {
    return new Promise((resolve, reject) => {
        const username = localStorage.getItem('username');
        fetch(`http://localhost:8080/Api/User/${username}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Reponse Error');
            } else {
                return response.json();
            }
        })
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

function makeThisContact(contact) {
    return '+91 ' + contact.slice(0, 5) + '-' + contact.slice(5, 10);
}

function parseQualifications(qualification) {
    return qualification.split('₹');
}

function parseInterests(interests) {
    let result = interests[0];

    for (let i = 1; i < interests.length - 1; i++) {
        result += ', ' + interests[i];
    }

    if (interests.length > 1) {
        result += ' and ' + interests[interests.length - 1]
    }

    return result;
}

function manipulateElements(userObject) {
    console.log(userObject);

    let [qual, linkedin, github] = parseQualifications(userObject.qualification);

    userName.innerText = userObject.first_name + ' ' + userObject.last_name;
    userId.innerText = '@' + userObject.username;
    contact.innerText = makeThisContact(userObject.mobile_no[0]);
    email.innerText = userObject.email_id;
    interests.innerText = parseInterests(userObject.interest);
    qualification.innerText = qual;
    githubURL = github;
    linkedinURL = linkedin;
}

document.addEventListener('DOMContentLoaded', async (event) => {
    event.preventDefault();
    try {
        const userObject = await getObject();
        manipulateElements(userObject);
    } catch (error) {
        console.log(error);
    }
});

githubBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.open(githubURL, '_blank');
});

linkedinBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.open(linkedinURL, '_blank');
});

homeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '../home.html';
});