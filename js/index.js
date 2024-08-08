let toggles, mobileMenuTargets;

document.addEventListener('DOMContentLoaded', function () {
    toggles = document.querySelectorAll("[data-mobile-menu-toggle]");
    mobileMenuTargets = document.querySelectorAll("[data-mobile-menu-state]");

    initMobileMenu();
    initAnimations();
});

function initMobileMenu() {

    const states = {
        open: true,
        close: false,
        toggle: undefined
    };

    toggles.forEach(el => {
        const state = states[el.dataset.mobileMenuToggle];

        el.addEventListener("click", (e) => {
            e.preventDefault();
            toggleMobileMenuState(state);
        });
    });
}

function toggleMobileMenuState(shouldOpenArg) {
    let shouldOpen = shouldOpenArg;

    if (shouldOpen == null) {
        let currentState = mobileMenuTargets[0].dataset.mobileMenuState;
        shouldOpen = currentState === "closed" ? true : false;
    }

    mobileMenuTargets.forEach(el => el.dataset.mobileMenuState = shouldOpen ? "open" : "closed");
}

function initAnimations() {
    gsap.registerPlugin(MotionPathPlugin);

    const createAnimation = (progress = 0) => {
        return gsap.timeline({repeat: -1}).to('#plane-a', {
            motionPath: {
                path: '#plane-path-a',
                align: '#plane-path-a',
                alignOrigin: [1.2, 0.3],
                autoRotate: true,
                transformOrigin: "50% 50%"
            },
            duration: 8,
            ease: 'none'
        }).progress(progress);
    }

    let planeAnimation = createAnimation();

    const resizeAnimation = () => {
        const progress = planeAnimation.progress();
        planeAnimation.progress(0).kill();
        planeAnimation = createAnimation(progress);
    }

    const throttledResize = throttle(resizeAnimation, 250);

    window.addEventListener('resize', throttledResize);
}

function throttle(fn, time) {
    let timeout = null;
    return function () {
        if(timeout) return;
        const context = this;
        const args = arguments;
        const later = () => {
            fn.call(context, ...args);
            timeout = null;
        }
        timeout = setTimeout(later, time);
    }
}