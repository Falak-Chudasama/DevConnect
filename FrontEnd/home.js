const observer1 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const element = entry.target;
        const stepClass = element.dataset.step;
        
        if (entry.isIntersecting) {
            element.classList.add(`step-${stepClass}-show`);
            element.classList.remove(`step-${stepClass}-hide`);
            console.log(`step-${stepClass}-show is appended`);
        } else {
            element.classList.add(`step-${stepClass}-hide`);
            element.classList.remove(`step-${stepClass}-show`);
            console.log(`step-${stepClass}-hide is removed`);
        }
    });
});
const hiddenSteps = document.querySelectorAll('.step-one-hide, .step-two-hide, .step-three-hide, .step-four-hide');
hiddenSteps.forEach((element, index) => {
    element.dataset.step = ['one', 'two', 'three', 'four'][index];
    observer1.observe(element);
});

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
