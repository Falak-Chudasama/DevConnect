const form = document.querySelector('#signup-form1');
const username_field = document.querySelector('#username');
const password_1_field = document.querySelector('#password1');
const password_2_field = document.querySelector('#password2');
const signup_btn = document.querySelector('#signup');
const login_btn = document.querySelector('#login');

// Error popper
function popError(message) {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
        timer: 5000
    });
}

// Submission handler
function submission(event) {
    event.preventDefault();

    let username = username_field.value;
    let password1 = password_1_field.value;
    let password2 = password_2_field.value;

    let proceedExecution = true;

    if (username == '' || password1 == '' || password2 == '') {
        popError('Fill Every Single Field');
        proceedExecution = false;
    } else if (username.length < 10) {
        popError('Enter a username with atleast 10 characters')
        proceedExecution = false;
    } else if (password1 != password2) {
        popError('Your Passwords Must Match');
        proceedExecution = false;
    } else if (password1.length < 8) {
        popError('Your Password Must Have Atleast 8 Characters or Numbers')
        proceedExecution = false;
    }

    if (proceedExecution) {
        console.log('Submitted');
        storeInLocal(username, password1);
        redirectToSecondSignUp();
    } else {
        console.log('Not submitted');
    }
}

// Storage manipulator
function storeInLocal(username, password) {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
}

// Page redirectors
function redirectToSecondSignUp() {
    window.location.href = './signup2.html';
}
function redirectToLogin(event) {
    event.preventDefault();
    window.location.href = '../Login-Page/login.html';
}

// Button executors
form.addEventListener('submit', (event) => {
    submission(event);
});
signup_btn.addEventListener('click', (event) => {
    submission(event);
});
login_btn.addEventListener('click', (event) => {
    redirectToLogin(event);
})