const homeBtn = document.getElementById('home');
const tryUsBtn = document.getElementById('try-us');

homeBtn.addEventListener('click', () => {
    window.location.href = '../home.html';
})
tryUsBtn.addEventListener('click', () => {
    window.location.href = '../Authentication-Pages/SignUp-Pages/signup1.html';
})