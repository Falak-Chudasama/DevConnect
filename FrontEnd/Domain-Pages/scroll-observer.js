const observer = new IntersectionObserver((entries) => {
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
    observer.observe(element);
});
