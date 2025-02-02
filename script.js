const questions = [
    { 
        question: 'kuu.png',
        questionAudio: 'kuu.mp3',
        correct: 'luu.png',
        wrong: 'koira.png',
        correctAudio: 'luu.mp3',
        wrongAudio: 'koira.mp3'
    },
    {
        question: 'suu.png',
        questionAudio: 'suu.mp3',
        correct: 'puu.png',
        wrong: 'kukka.png',
        correctAudio: 'puu.mp3',
        wrongAudio: 'kukka.mp3'
    },
    {
        question: 'luu.png',
        questionAudio: 'luu.mp3',
        correct: 'kuu.png',
        wrong: 'kana.png',
        correctAudio: 'kuu.mp3',
        wrongAudio: 'kana.mp3'
    },
    {
        question: 'puu.png',
        questionAudio: 'puu.mp3',
        correct: 'suu.png',
        wrong: 'silmat.png',
        correctAudio: 'suu.mp3',
        wrongAudio: 'silmat.mp3'
    },
    {
        question: 'kuu.png',
        questionAudio: 'kuu.mp3',
        correct: 'suu.png',
        wrong: 'hampaat.png',
        correctAudio: 'suu.mp3',
        wrongAudio: 'hampaat.mp3'
    },
    {
        question: 'suu.png',
        questionAudio: 'suu.mp3',
        correct: 'luu.png',
        wrong: 'lusikka.png',
        correctAudio: 'luu.mp3',
        wrongAudio: 'lusikka.mp3'
    },
    {
        question: 'luu.png',
        questionAudio: 'luu.mp3',
        correct: 'puu.png',
        wrong: 'omena.png',
        correctAudio: 'puu.mp3',
        wrongAudio: 'omena.mp3'
    },
    {
        question: 'puu.png',
        questionAudio: 'puu.mp3',
        correct: 'kuu.png',
        wrong: 'metsa.png',
        correctAudio: 'kuu.mp3',
        wrongAudio: 'metsa.mp3'
    }
];

let currentQuestions = [];
let currentQuestion = 0;
let selectedOption = 0;
let correctAnswers = 0;
let checkButtonClicked = false;
let currentAudio = null;
let isQuestionAudioPlaying = false;
let clicksEnabled = false;

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('stars-container').style.display = 'block';
    currentQuestions = getRandomQuestions(5);
    loadQuestion();
    clicksEnabled = false; // Disable clicks at start
    isQuestionAudioPlaying = true;
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
    const questionImage = document.getElementById('question-image');
    questionImage.src = question.question;
    
    // Lisätään click handler pääkuvalle
    questionImage.onclick = () => {
        if (clicksEnabled) {
            playQuestionAudio();
        }
    };
    
    const options = [question.correct, question.wrong];
    shuffleArray(options);

    document.getElementById('option1').src = options[0];
    document.getElementById('option2').src = options[1];
    document.getElementById('check-button').style.display = 'block';
    document.getElementById('next-arrow').style.display = 'none';
    checkButtonClicked = false;
    selectedOption = 0;
    clicksEnabled = false;
    
    setupOptionAudioListeners();
    
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    updateCheckButtonState();
}

function setupOptionAudioListeners() {
    const question = currentQuestions[currentQuestion];
    const option1 = document.getElementById('option1');
    const option2 = document.getElementById('option2');
    
    option1.onclick = (e) => {
        if (clicksEnabled) {  // Only handle clicks if enabled
            const audioFile = option1.src.includes(question.correct) ? question.correctAudio : question.wrongAudio;
            playOptionAudio(audioFile);
            selectOption(1);
        }
    };
    
    option2.onclick = (e) => {
        if (clicksEnabled) {  // Only handle clicks if enabled
            const audioFile = option2.src.includes(question.correct) ? question.correctAudio : question.wrongAudio;
            playOptionAudio(audioFile);
            selectOption(2);
        }
    };
}

function playOptionAudio(audioFile) {
    if (clicksEnabled) {
        playAudio(audioFile);
    }
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
    isQuestionAudioPlaying = true;
    clicksEnabled = false;  // Ensure clicks are disabled during question audio
    playAudio(question.questionAudio, () => {
        isQuestionAudioPlaying = false;
        clicksEnabled = true;  // Enable clicks only after question audio is complete
    });
}


function nextQuestion() {
    stopAllAudio();
    clicksEnabled = false;  // Disable clicks when moving to next question
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
            <img id="option1" class="option">
            <img id="option2" class="option">
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
    isQuestionAudioPlaying = false;
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