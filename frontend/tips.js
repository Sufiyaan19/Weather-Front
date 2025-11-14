// tips.js - Weather tips and quiz functionality

const API_KEY = 'd0ae0f5fe785606aa75bb00fa60cff8f'; // Replace with your API key

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('get-tips').addEventListener('click', getPersonalizedTips);
    document.getElementById('start-quiz').addEventListener('click', startQuiz);
    document.getElementById('next-question').addEventListener('click', nextQuestion);
    document.getElementById('restart-quiz').addEventListener('click', restartQuiz);
    document.getElementById('new-fact').addEventListener('click', showNewFact);
    document.getElementById('share-tip').addEventListener('click', shareTip);

    loadSharedTips();
});

async function getPersonalizedTips() {
    const city = document.getElementById('tips-city').value.trim();
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (data.cod === 200) {
            const tips = generateTips(data);
            displayTips(tips);
        } else {
            document.getElementById('personalized-tips').innerHTML = '<p>City not found. Please try again.</p>';
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('personalized-tips').innerHTML = '<p>Error fetching weather data.</p>';
    }
}

function generateTips(data) {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weather = data.weather[0].main.toLowerCase();

    let tips = [];

    // Temperature-based tips
    if (temp < 10) {
        tips.push("It's cold! Wear warm layers and consider a scarf and gloves.");
    } else if (temp > 25) {
        tips.push("It's warm! Stay hydrated and wear light clothing. Don't forget sunscreen!");
    } else {
        tips.push("Comfortable temperature today. Dress according to your activities.");
    }

    // Weather condition tips
    switch (weather) {
        case 'rain':
        case 'drizzle':
            tips.push("Rain expected! Carry an umbrella and wear waterproof shoes.");
            break;
        case 'snow':
            tips.push("Snow on the way! Drive carefully and dress warmly.");
            break;
        case 'clear':
            tips.push("Clear skies! Great day for outdoor activities.");
            break;
        case 'clouds':
            tips.push("Cloudy weather. A light jacket might be useful.");
            break;
    }

    // Humidity tips
    if (humidity > 70) {
        tips.push("High humidity! You might feel warmer than the actual temperature.");
    } else if (humidity < 30) {
        tips.push("Low humidity! Stay hydrated and moisturize your skin.");
    }

    // Wind tips
    if (windSpeed > 10) {
        tips.push("Windy conditions! Secure loose objects and be cautious outdoors.");
    }

    return tips;
}

function displayTips(tips) {
    const container = document.getElementById('personalized-tips');
    container.innerHTML = '<h6>Personalized Tips:</h6><ul>';
    tips.forEach(tip => {
        container.innerHTML += `<li>${tip}</li>`;
    });
    container.innerHTML += '</ul>';
}

// Quiz functionality
const quizQuestions = [
    {
        question: "What is the highest temperature ever recorded on Earth?",
        answers: ["56.7°C in Death Valley", "50°C in the Sahara", "60°C in Iran", "45°C in Australia"],
        correct: 0
    },
    {
        question: "Which type of cloud is highest in the sky?",
        answers: ["Cumulus", "Stratus", "Cirrus", "Nimbus"],
        correct: 2
    },
    {
        question: "What does a barometer measure?",
        answers: ["Wind speed", "Atmospheric pressure", "Humidity", "Temperature"],
        correct: 1
    },
    {
        question: "Which ocean is known for having the most hurricanes?",
        answers: ["Pacific Ocean", "Indian Ocean", "Atlantic Ocean", "Arctic Ocean"],
        correct: 2
    },
    {
        question: "What is the average temperature of Earth?",
        answers: ["10°C", "15°C", "20°C", "25°C"],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    document.getElementById('quiz-container').classList.add('d-none');
    document.getElementById('quiz-question').classList.remove('d-none');
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    document.getElementById('question-text').textContent = question.question;

    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-light me-2 mb-2';
        button.textContent = answer;
        button.onclick = () => selectAnswer(index);
        answersContainer.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    const question = quizQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll('#answers button');

    buttons.forEach((button, index) => {
        if (index === question.correct) {
            button.classList.remove('btn-outline-light');
            button.classList.add('btn-success');
        } else if (index === selectedIndex && index !== question.correct) {
            button.classList.remove('btn-outline-light');
            button.classList.add('btn-danger');
        }
    });

    if (selectedIndex === question.correct) {
        score++;
    }

    document.getElementById('next-question').classList.remove('d-none');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
        document.getElementById('next-question').classList.add('d-none');
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quiz-question').classList.add('d-none');
    document.getElementById('quiz-results').classList.remove('d-none');
    document.getElementById('score-text').textContent = `You scored ${score} out of ${quizQuestions.length}!`;
}

function restartQuiz() {
    document.getElementById('quiz-results').classList.add('d-none');
    document.getElementById('quiz-container').classList.remove('d-none');
}

// Weather facts
const weatherFacts = [
    "The highest temperature ever recorded on Earth was 56.7°C (134°F) in Death Valley, California, USA.",
    "The lowest temperature ever recorded was -89.2°C (-128.6°F) at Vostok Station, Antarctica.",
    "Lightning strikes the Earth about 100 times per second.",
    "A single bolt of lightning contains enough energy to toast 100,000 slices of bread.",
    "The driest place on Earth is the Atacama Desert in Chile, which hasn't seen rain in over 400 years.",
    "The wettest place on Earth is Mawsynram, India, with an average annual rainfall of 11,872 mm.",
    "Hurricanes can produce winds of up to 320 km/h (200 mph).",
    "The word 'hurricane' comes from the Taino word 'huracan', meaning 'god of the storm'.",
    "Earth's atmosphere weighs about 5.5 quadrillion tons.",
    "The jet stream can reach speeds of up to 400 km/h (250 mph)."
];

function showNewFact() {
    const randomFact = weatherFacts[Math.floor(Math.random() * weatherFacts.length)];
    document.getElementById('weather-fact').innerHTML = `<p>${randomFact}</p>`;
}

// Share tips functionality
function shareTip() {
    const tip = document.getElementById('user-tip').value.trim();
    if (tip) {
        const sharedTips = JSON.parse(localStorage.getItem('sharedTips') || '[]');
        sharedTips.push({
            tip: tip,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('sharedTips', JSON.stringify(sharedTips));
        document.getElementById('user-tip').value = '';
        loadSharedTips();
    }
}

function loadSharedTips() {
    const sharedTips = JSON.parse(localStorage.getItem('sharedTips') || '[]');
    const container = document.getElementById('shared-tips');
    container.innerHTML = '';

    if (sharedTips.length > 0) {
        container.innerHTML = '<h6>Community Tips:</h6>';
        sharedTips.slice(-5).forEach(item => { // Show last 5 tips
            container.innerHTML += `<div class="border-bottom pb-2 mb-2"><small class="text-muted">${item.date}</small><br>${item.tip}</div>`;
        });
    }
}
