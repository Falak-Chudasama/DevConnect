const learnMoreBtn1 = document.getElementById('learn-more');
const learnMoreBtn2 = document.getElementById('svg-learn-more');

learnMoreBtn1.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = './LearnMore-Page/index.html';
})  
learnMoreBtn2.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = './LearnMore-Page/index.html';
})

const observer = new IntersectionObserver((entities) => {
    entities.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
})

const hiddenItems = document.querySelectorAll('.hidden');
hiddenItems.forEach((element) => {
    observer.observe(element);
});

function redirectToLogin() {
    window.location.href = './Authentication-Pages/Login-Page/login.html';
}
function redirectToSignUp() {
    window.location.href = './Authentication-Pages/SignUp-Pages/signup1.html';
}

if (localStorage.getItem('username')) {
    Swal.fire({
        title: "Wanna Continue?",
        text: `login as ${localStorage.getItem('username')}?`,
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = './home.html';
        } else if (result.isDenied) {
            Swal.fire("Login or Signup", "Kindly login via your desired account or signup", "info");
        }
    });
}