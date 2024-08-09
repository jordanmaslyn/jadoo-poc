import { fetchWeatherApi } from 'openmeteo';
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Splide from '@splidejs/splide';

let toggles, mobileMenuTargets;

document.addEventListener('DOMContentLoaded', function () {
    toggles = document.querySelectorAll("[data-mobile-menu-toggle]");
    mobileMenuTargets = document.querySelectorAll("[data-mobile-menu-state]");

    initMobileMenu();
    initAnimations();
    initWeather();
    initSlider();
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
    const isReducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    gsap.registerPlugin(MotionPathPlugin);

    const createAnimation = (progress = 0) => {
        const tl = gsap.timeline({ repeat: -1 }).to('#plane-a', {
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

        if (isReducedMotion) {
            tl.pause(1);
        }

        return tl;
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

async function initWeather() {
    if (process.env.NODE_ENV === "development") {
        console.log("DEV MODE");
        updateWeather([
            {
                current: {
                    temp: 86.71640014648438,
                    conditions: "Partly cloudy",
                }
            },
            {
                current: {
                    temp: 66.6500015258789,
                    conditions: "Partly cloudy",
                }
            },
            {
                current: {
                    temp: 69.44000244140625,
                    conditions: "Clear",
                }
            },
        ]);
        
        return;
    }

    const url = "https://api.open-meteo.com/v1/forecast";
    const params = {
        "latitude": [41.9, 51.509865, 60.192059].map(String),
        "longitude": [12.49, -0.118092, 24.945831].map(String),
        "current": ["temperature_2m", "weather_code"],
        "temperature_unit": "fahrenheit",
        "wind_speed_unit": "mph",
        "precipitation_unit": "inch",
        "forecast_days": 1
    };

    const responses = await fetchWeatherApi(url, params);
    updateWeather(responses.map(response => {
        const current = response.current();
        return {
            current: {
                temp: current.variables(0).value(),
                conditions: getWeatherCodeTranslation(current.variables(1).value()),
            }
        }
    }));
}

function initSlider() {
    new Splide('.splide', {
        type: "loop",
        mediaQuery: "min",
        perPage: 1,
        autoWidth: true,
        breakpoints: {
            768: {
                padding: "15%",
            },
            1180: {
                padding: "25%",
            },
        }
    }).mount();
}

function updateWeather(weather) {
    const rome = document.getElementById("weather-rome");
    const london = document.getElementById("weather-london");
    const helsinki = document.getElementById("weather-helsinki");

    const formatWeatherString = (weatherRecord) => `${Math.round(weatherRecord.current.temp)}&deg; F - ${weatherRecord.current.conditions}`;

    rome.innerHTML = formatWeatherString(weather[0]);
    london.innerHTML = formatWeatherString(weather[1]);
    helsinki.innerHTML = formatWeatherString(weather[2]);
}

function getWeatherCodeTranslation(code) {
    switch (code) {
        case 0:
            return "Clear";
        case 1:
        case 2:
        case 3:
            return "Partly cloudy";
        case 45:
        case 48:
            return "Fog";
        case 51:
        case 53:
        case 54:
            return "Light drizzle";
        case 56:
        case 57:
            return "Freezing drizzle";
        case 61:
        case 63:
        case 65:
            return "Rain";
        case 66:
        case 67:
            return "Freezing rain";
        case 71:
        case 73:
        case 75:
            return "Snow";
        case 77:
            return "Snow grains";
        case 80:
        case 81:
        case 82:
            return "Rain showers";
        case 85:
        case 86:
            return "Snow showers"
        case 95:
            return "Thunderstorm";
        case 96:
        case 99:
            return "Thunderstorm with hail";
        default:
            return "Unknown conditions";
    }
}

function throttle(fn, time) {
    let timeout = null;
    return function () {
        if (timeout) return;
        const context = this;
        const args = arguments;
        const later = () => {
            fn.call(context, ...args);
            timeout = null;
        }
        timeout = setTimeout(later, time);
    }
}