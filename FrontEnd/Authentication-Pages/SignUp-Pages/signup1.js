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

function checkForUsername(username) {
    return new Promise((resolve, reject) => {
        const url = `http://localhost:8080/Api/User/Unique/?Username=${username}`;
        fetch(url ,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (response.status === 409) {
                throw new Error('Username is taken');
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

// Submission handler
async function submission(event) {
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

    if (proceedExecution === false) {
        console.log('Not Submitted');
        return;
    }

    try {
        let response = await checkForUsername(username);
    } catch (error) {
        popError(error.message);
        return;
    }

    if (proceedExecution) {
        storeInLocal(username, password1);
        redirectToSecondSignUp();
    }
}

// Storage manipulator
function storeInLocal(username, password) {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
}

// Page redirectors
function redirectToSecondSignUp() {
    window.location.replace('./signup2.html');
    // window.location.href = './signup2.html';
}
function redirectToLogin(event) {
    event.preventDefault();
    window.location.replace('../Login-Page/login.html');
    // window.location.href = '../Login-Page/login.html';
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