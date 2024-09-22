const form = document.querySelector('#login-form');
const username_field = document.querySelector('#username');
const password_field = document.querySelector('#password');
const signup_btn = document.querySelector('#signup');
const login_btn = document.querySelector('#login');


function submission(event) {
    event.preventDefault();

    let username = username_field.value;
    let password = password_field.value;

    console.log('--SIGN UP--');
    console.log('username : ' + username);
    console.log('password : ' + password);

    let execute = true;

    if (username === '' || password === '') {
        console.log('ENTER ALL FIELDS!');
        execute = false;
    }

    // Using fetch if you dont match username or password then execute = false

    if (execute === true) {
        // POST shit using fetch
        console.log('POST logged in');
    } else {
        // not POST shit using fetch
        console.log('!POST');
    }
}

function redirectToSignUp(event) {
    event.preventDefault();
    window.location.href = '../SignUp-Pages/signup1.html';
}

form.addEventListener('submit', (event) => {
    submission(event);
});
login_btn.addEventListener('click', (event) => {
    submission(event);
});
signup_btn.addEventListener('click', (event) => {
    redirectToSignUp(event);
})