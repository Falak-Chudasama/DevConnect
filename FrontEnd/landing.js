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