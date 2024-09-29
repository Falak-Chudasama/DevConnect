const form = document.querySelector('#signup-form2');
const first_name_field = document.querySelector('#first-name');
const middle_name_field = document.querySelector('#middle-name');
const last_name_field = document.querySelector('#last-name');
const phone_field = document.querySelector('#phone');
const mail_field = document.querySelector('#mail');
const qualification_field = document.querySelector('#qualification');
const github_field = document.querySelector('#github');
const linkedin_field = document.querySelector('#linkedin');
const signup_btn = document.querySelector('#signup');

function popError(message) {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
        timer: 5000,
        confirmButtonText: 'Alright'
    });
}

function submission() {
    let first_name = first_name_field.value;
    let middle_name = middle_name_field.value;
    let last_name = last_name_field.value;
    let phone = phone_field.value;
    let mail = mail_field.value;
    let qualification = qualification_field.value;
    let githubURL = github_field.value;
    let linkedinURL = linkedin_field.value;

    let execution = true;

    if (first_name == null || middle_name == '' || last_name == '' || phone == '' || mail == '' || qualification == '' || githubURL == '' || linkedinURL == '') {
        popError('Fill All the Fields!');
        execution = false;
    } else if (phone.length != 10) {
        popError('Enter a valid PHONE no');
        execution = false;
    }

    if (execution) {
        storeInLocal(first_name, middle_name, last_name, phone, mail, qualification, githubURL, linkedinURL);
    }
}

function storeInLocal(first_name, middle_name, last_name, phone, mail, qualification, githubURL, linkedinURL) {
    localStorage.setItem('first_name', first_name);
    localStorage.setItem('middle_name', middle_name);
    localStorage.setItem('last_name', last_name);
    localStorage.setItem('phone', phone);
    localStorage.setItem('mail', mail);
    localStorage.setItem('qualification', qualification);
    localStorage.setItem('github_URL', githubURL);
    localStorage.setItem('linkedin_URL', linkedinURL);

    redirectToLastSignUp();
}

function redirectToLastSignUp() {
    window.location.href = './signup3.html';
}

signup_btn.addEventListener('click', (event) => {
    event.preventDefault();
    submission();
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    submission();
});