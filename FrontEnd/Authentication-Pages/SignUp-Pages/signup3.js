let webDevelopmentBtn = document.querySelector('.web-development');
let androidDevelopmentBtn = document.querySelector('.android-development');
let iosDevelopmentBtn = document.querySelector('.ios-development');
let gameDevelopmentBtn = document.querySelector('.game-development');
let AIBtn = document.querySelector('.artificial-intelligence');
let cloudComputingBtn = document.querySelector('.cloud-computing');
let domainButtons = document.querySelectorAll('.domain-button');
let submit_btn = document.querySelector('#create-account');

let domainBtnFlags = [false, false, false, false, false, false];
let domains = ['web-development', 'android-development', 'ios-development', 'game-development', 'artificial-intelligence', 'cloud-computing'];

// Error popper
function popError(message) {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
        timer: 5000,
        confirmButtonText: 'Alright'
    });
}

//Storage manipulator and Account Creator
function createAccount() {
    let username = localStorage.getItem('username');
    let password = localStorage.getItem('password');
    let first_name = localStorage.getItem('first_name');
    let middle_name = localStorage.getItem('middle_name');
    let last_name = localStorage.getItem('last_name');
    let phone = localStorage.getItem('phone');
    let mail = localStorage.getItem('mail');
    let qualification = localStorage.getItem('qualification');
    let linkedin_URL = localStorage.getItem('linkedin_URL');
    let github_URL = localStorage.getItem('github_URL');

    let interests = [];

    let count = 0;
    for (let i = 0; i < 6; i++) {
        if (domainBtnFlags[i] === true) {
            interests.push(domains[i]);
            count++;
        }
    }

    if (count === 0) {
        popError('Select Any One of the Domains!');
        return;
    }

    let object = {
        "username": username,
        "password": password,
        "first_name": first_name,
        "middle_name": middle_name,
        "last_name": last_name,
        "email_id": [mail],
        "mobile_no": [phone],
        "interest": interests,
        "qualification": `${qualification}₹${linkedin_URL}₹${github_URL}`
    }

    fetch('http://localhost:8080/Api/User/Add/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'charset': 'utf-8'
        },
        body: JSON.stringify(object)
    })  
    .then((response) => {
        if (!response.ok) {
            return response.json().then((errMessage) => {
                throw new Error(errMessage.message);
            })
        }
        return response.json();
    })
    .then((success) => {
        localStorage.clear();
        redirectToHome();
    })
    .catch((error) => {
        popError(error.message);
    })
}

// Page redirector
function redirectToHome() {
    window.location.href = '../../home.html';
}

// Button executors
webDevelopmentBtn.addEventListener('click', (event) => {
    event.preventDefault();
    domainBtnFlags[0] = !domainBtnFlags[0];
    webDevelopmentBtn.classList.toggle('selected');
});

androidDevelopmentBtn.addEventListener('click', (event) => {
    event.preventDefault();
    domainBtnFlags[1] = !domainBtnFlags[1];
    androidDevelopmentBtn.classList.toggle('selected');
});

iosDevelopmentBtn.addEventListener('click', (event) => {
    event.preventDefault();
    domainBtnFlags[2] = !domainBtnFlags[2];
    iosDevelopmentBtn.classList.toggle('selected');
});

gameDevelopmentBtn.addEventListener('click', (event) => {
    event.preventDefault();
    domainBtnFlags[3] = !domainBtnFlags[3];
    gameDevelopmentBtn.classList.toggle('selected');
});

AIBtn.addEventListener('click', (event) => {
    event.preventDefault();
    domainBtnFlags[4] = !domainBtnFlags[4];
    AIBtn.classList.toggle('selected');
});

cloudComputingBtn.addEventListener('click', (event) => {
    event.preventDefault();
    domainBtnFlags[5] = !domainBtnFlags[5];
    cloudComputingBtn.classList.toggle('selected');
});

submit_btn.addEventListener('click', (event) => {
    event.preventDefault();
    createAccount();
})