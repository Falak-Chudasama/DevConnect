const form = document.querySelector('#signup-form1');
const username_field = document.querySelector('#username');
const password_1_field = document.querySelector('#password1');
const password_2_field = document.querySelector('#password2');
const signup_btn = document.querySelector('#signup');
const login_btn = document.querySelector('#login');


function submission(event) {
    event.preventDefault();

    let username = username_field.value;
    let password1 = password_1_field.value;
    let password2 = password_2_field.value;

    console.log('--SIGN UP--');
    console.log('username : ' + username);
    console.log('password1 : ' + password1);
    console.log('password2 : ' + password2);

    let execute = true;

    if (username === '' || password1 === '' || password2 === '') {
        console.log('ENTER ALL FIELDS!');
        execute = false;
    } else if (password1 != password2) {
        console.log('ENTER SAME PASSWORDS!');
        execute = false;
    }

    // Using fetch if find a username in the db then execute = false;

    if (execute === true) {
        // POST shit using fetch
        console.log('POST signed up');
        window.location.href = './signup2.html'
    } else {
        // not POST shit using fetch
        console.log('!POST');
    }
}

function redirectToLogin(event) {
    event.preventDefault();
    window.location.href = '../Login-Page/login.html';
}

form.addEventListener('submit', (event) => {
    submission(event);
});
signup_btn.addEventListener('click', (event) => {
    submission(event);
});
login_btn.addEventListener('click', (event) => {
    redirectToLogin(event);
})