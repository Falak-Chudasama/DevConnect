const form = document.querySelector('#login-form');
const username_field = document.querySelector('#username');
const password_field = document.querySelector('#password');
const signup_btn = document.querySelector('#signup');
const login_btn = document.querySelector('#login');

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

// Submission handler
function submission(event) {
    event.preventDefault();

    let username = username_field.value;
    let password = password_field.value;

    let execute = true;
    if (username === '' || password === '') {
        popError('Enter all of the Fields!')
        execute = false;
    } else if (username.length < 10) {
        popError('Invalid Username');
        execute = false;
    } else if (password.length < 8) {
        popError('Invalid Password');
        execute = false;
    }

    if (execute === true) {
        login(username, password);
    }
}

// Api call
function login(username, password) {
    fetch(`http://localhost:8080/Api/User/Authenticate/${username}/?Password=${password}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'charset': 'utf-8'      
        }
    })
    .then((response) => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message);
            })
        }
        return response.json();
    })
    .then((success) => {
        localStorage.clear();
        redirectToHome(username);
    })
    .catch((error) => {
        popError(error.message);
    })
}

// Redirectors
function redirectToSignUp(event) {
    event.preventDefault();
    window.location.replace('../SignUp-Pages/signup1.html');
}
function redirectToHome(username) {
    localStorage.setItem('username', username)
    window.location.replace('../../home.html');
}

// Button executors
form.addEventListener('submit', (event) => {
    submission(event);
});
login_btn.addEventListener('click', (event) => {
    submission(event);
});
signup_btn.addEventListener('click', (event) => {
    redirectToSignUp(event);
})