// Scroll Observer for 'how does it work' section
const observer1 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const element = entry.target;
        const stepClass = element.dataset.step;
        
        if (entry.isIntersecting) {
            element.classList.add(`step-${stepClass}-show`);
            element.classList.remove(`step-${stepClass}-hide`);
        } else {
            element.classList.add(`step-${stepClass}-hide`);
            element.classList.remove(`step-${stepClass}-show`);
        }
    });
});
const hiddenSteps = document.querySelectorAll('.step-one-hide, .step-two-hide, .step-three-hide, .step-four-hide');
hiddenSteps.forEach((element, index) => {
    element.dataset.step = ['one', 'two', 'three', 'four'][index];
    observer1.observe(element);
});

// Scroll Observer for hero section
const observer2 = new IntersectionObserver((entities) => {
    entities.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show'); 
        } else {
            entry.target.classList.remove('show');
        }
    });
});

const hiddenItems = document.querySelectorAll('.hidden');
hiddenItems.forEach((element) => {
    observer2.observe(element);
});

// Domain pages' buttons and redirections
const webDevBtn = document.querySelector('#web-development-btn');
const androidDevBtn = document.querySelector('#android-development-btn');
const iosDevBtn = document.querySelector('#ios-development-btn');
const gameDevBtn = document.querySelector('#game-development-btn');
const aiBtn = document.querySelector('#ai-btn');
const cloudComputingBtn = document.querySelector('#cloud-computing-btn');

webDevBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = './Domain-Pages/web-development.html';
});
androidDevBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = './Domain-Pages/android-development.html';
});
iosDevBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = './Domain-Pages/ios-development.html';
});
gameDevBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = './Domain-Pages/game-development.html';
});
aiBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = './Domain-Pages/ai-development.html';
});
cloudComputingBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = './Domain-Pages/cloud-computing.html';
});