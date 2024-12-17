const questions = [
    { 
        question: 'kuu.png',
        audio: 'kuu.mp3',
        correct: 'luu.png',
        wrong: 'koira.png'
    },
    {
        question: 'suu.png',
        audio: 'suu.mp3',
        correct: 'puu.png',
        wrong: 'kukka.png'
    },
    {
        question: 'luu.png',
        audio: 'luu.mp3',
        correct: 'kuu.png',
        wrong: 'kana.png'
    },
    {
        question: 'puu.png',
        audio: 'puu.mp3',
        correct: 'suu.png',
        wrong: 'silmat.png'
    },
    {
        question: 'kuu.png',
        audio: 'kuu.mp3',
        correct: 'suu.png',
        wrong: 'hampaat.png'
    },
    {
        question: 'suu.png',
        audio: 'suu.mp3',
        correct: 'luu.png',
        wrong: 'lusikka.png'
    },
    {
        question: 'luu.png',
        audio: 'luu.mp3',
        correct: 'puu.png',
        wrong: 'omena.png'
    },
    {
        question: 'puu.png',
        audio: 'puu.mp3',
        correct: 'kuu.png',
        wrong: 'metsa.png'
    }
];

let currentQuestions = [];
let currentQuestion = 0;
let selectedOption = 0;
let correctAnswers = 0;
let checkButtonClicked = false;
let currentAudio = null;

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('stars-container').style.display = 'block';
    currentQuestions = getRandomQuestions(5);
    loadQuestion();
    playAudio('valitse.mp3', () => {
        playQuestionAudio();
    });
}

function getRandomQuestions(count) {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

function loadQuestion() {
    const question = currentQuestions[currentQuestion];
    document.getElementById('question-image').src = question.question;
    
    const options = [question.correct, question.wrong];
    shuffleArray(options);

    document.getElementById('option1').src = options[0];
    document.getElementById('option2').src = options[1];
    document.getElementById('check-button').style.display = 'block';
    document.getElementById('next-arrow').style.display = 'none';
    checkButtonClicked = false;
    selectedOption = 0;
    
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    updateCheckButtonState();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function selectOption(option) {
    selectedOption = option;
    const options = document.querySelectorAll('.option');
    options.forEach(optionElement => {
        optionElement.classList.remove('selected');
    });
    document.getElementById(`option${option}`).classList.add('selected');
    updateCheckButtonState();
}

function updateCheckButtonState() {
    const checkButton = document.getElementById('check-button');
    checkButton.disabled = selectedOption === 0;
    checkButton.classList.toggle('disabled', selectedOption === 0);
}

function checkAnswer() {
    if (checkButtonClicked || selectedOption === 0) return;
    
    checkButtonClicked = true;
    const question = currentQuestions[currentQuestion];
    const selectedElement = document.getElementById(`option${selectedOption}`);
    const correctOption = document.getElementById('option1').src.includes(question.correct) ? 1 : 2;
    
    if (selectedOption === correctOption) {
        selectedElement.classList.add('correct');
        correctAnswers++;
        updateStars();
        playAudio('oikein.mp3');
    } else {
        selectedElement.classList.add('incorrect');
        document.getElementById(`option${correctOption}`).classList.add('correct');
        playAudio('vaarin.mp3');
    }
    
    document.getElementById('check-button').style.display = 'none';
    document.getElementById('next-arrow').style.display = 'block';
}

function updateStars() {
    const starsContainer = document.getElementById('stars-container');
    starsContainer.innerHTML = '<img src="tahti.png" alt="Star" class="star-icon">'.repeat(correctAnswers);
}

function playQuestionAudio() {
    const question = currentQuestions[currentQuestion];
    playAudio(question.audio);
}

function nextQuestion() {
    stopAllAudio();
    currentQuestion++;
    if (currentQuestion >= currentQuestions.length) {
        showResult();
    } else {
        loadQuestion();
        playQuestionAudio();
    }
}

function showResult() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h1>TAIVAALLA ON KUU</h1>
        <p id="result">Sait ${correctAnswers} / ${currentQuestions.length} oikein</p>
        <div id="final-stars-container">${'<img src="tahti.png" alt="Star" class="star-icon">'.repeat(correctAnswers)}</div>
        <button onclick="restartGame()">PELAA UUDELLEEN</button>
    `;
    document.getElementById('stars-container').style.display = 'none';
}

function restartGame() {
    stopAllAudio();
    currentQuestion = 0;
    selectedOption = 0;
    correctAnswers = 0;
    checkButtonClicked = false;
    currentQuestions = getRandomQuestions(5);
    
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `
        <h2>VALITSE OIKEA KUVA:</h2>
        <img id="question-image" class="question-image">
        <div class="options">
            <img id="option1" class="option" onclick="selectOption(1)">
            <img id="option2" class="option" onclick="selectOption(2)">
        </div>
        <div id="game-controls">
            <button id="check-button" onclick="checkAnswer()">TARKISTA</button>
            <img id="next-arrow" src="nuoli.png" onclick="nextQuestion()">
        </div>
    `;
    
    document.getElementById('stars-container').innerHTML = '';
    document.getElementById('stars-container').style.display = 'block';
    
    loadQuestion();
    playAudio('valitse.mp3', () => {
        playQuestionAudio();
    });
}

function stopAllAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}

function playAudio(src, callback) {
    stopAllAudio();
    currentAudio = new Audio(src);
    currentAudio.play().catch(error => console.error('Error playing audio:', error));
    if (callback) {
        currentAudio.onended = callback;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', startGame);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' && document.getElementById('next-arrow').style.display !== 'none') {
            nextQuestion();
        }
    });
});