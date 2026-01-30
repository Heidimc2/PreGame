// 1. The Data
const sportsData = {
    soccer: {
        title: "Soccer",
        focus: "Knees (ACL) & Ankles",
        image: "body-soccer.png",
        exercises: [
            "High Knees - Drive knees up to chest",
            "Glute Bridges - Squeeze glutes at the top",
            "Single Leg Balance - Hold steady"
        ]
    },
    tennis: {
        title: "Tennis",
        focus: "Shoulders & Rotator Cuff",
        image: "body-tennis.png.png",
        exercises: [
            "Arm Circles - Start small, get bigger",
            "Band Pull-Aparts - Squeeze shoulder blades",
            "Shadow Swings - Practice motion slowly"
        ]
    },
    running: {
        title: "Running",
        focus: "Calves, Achilles & Hips",
        image: "body-running.png",
        exercises: [
            "Calf Raises - Slow on the way down",
            "Leg Swings - Forward and back",
            "Walking Lunges - Keep chest up"
        ]
    },
    basketball: {
        title: "Basketball",
        focus: "Ankles & Landing Mechanics",
        image: "body-soccer.png", // Fallback
        exercises: [
            "Ankle Rotations - Both directions",
            "Jump Squats - Land softly/silently",
            "Lateral Shuffles - Stay low"
        ]
    }
};

let currentRoutine = [];
let currentIndex = 0;
let timerInterval = null;
let isPaused = false; 

// 2. MAIN FUNCTION: Generate Plan & Risk
function generatePlan() {
    const sportSelect = document.getElementById('sport-select');
    const selectedSport = sportSelect.value;
    const errorBox = document.getElementById('error-box');
    
    // --- ERROR CHECKING ---
    if (!selectedSport) {
        errorBox.classList.remove('hidden'); // Show red box
        return; // Stop here
    } else {
        errorBox.classList.add('hidden'); // Hide it
    }

    // Calculate Risk
    const injuryScore = parseInt(document.getElementById('q-injury').value);
    const freqScore = parseInt(document.getElementById('q-freq').value);
    const warmupScore = parseInt(document.getElementById('q-warmup').value);

    let totalRisk = 10 + injuryScore + freqScore + warmupScore;
    if (totalRisk > 95) totalRisk = 95;

    // Show Risk Bar
    const resultBar = document.getElementById('risk-result-bar');
    const fill = document.getElementById('risk-fill');
    const text = document.getElementById('risk-percent-text');

    resultBar.classList.remove('hidden');
    text.innerText = totalRisk + "%";
    
    setTimeout(() => {
        fill.style.width = totalRisk + "%";
        if (totalRisk < 30) {
            fill.style.backgroundColor = "#2ecc71"; // Green
            text.style.color = "#2ecc71";
        } else if (totalRisk < 60) {
            fill.style.backgroundColor = "#f1c40f"; // Orange
            text.style.color = "#f1c40f";
        } else {
            fill.style.backgroundColor = "#ff4757"; // Red
            text.style.color = "#ff4757";
        }
    }, 100);

    loadSportData(selectedSport);
}

function hideError() {
    document.getElementById('error-box').classList.add('hidden');
}

function loadSportData(sportName) {
    const dashboard = document.getElementById('dashboard');
    const imageDisplay = document.getElementById('body-image');
    const focusText = document.getElementById('focus-area');
    const list = document.getElementById('exercise-list');

    if (sportsData[sportName]) {
        const data = sportsData[sportName];
        focusText.innerText = data.focus;
        imageDisplay.src = data.image; 

        list.innerHTML = ''; 
        data.exercises.forEach(exercise => {
            let li = document.createElement('li');
            li.innerText = exercise;
            list.appendChild(li);
        });

        dashboard.classList.remove('hidden');
        dashboard.scrollIntoView({ behavior: 'smooth' });
    }
}

function speakRoutine() {
    window.speechSynthesis.cancel();
    const sport = document.getElementById('sport-select').value;
    if (sportsData[sport]) {
        const msg = new SpeechSynthesisUtterance("Here is your plan for " + sportsData[sport].title);
        window.speechSynthesis.speak(msg);
    }
}

// 4. Guided Workout Logic
function startGuidedWorkout() {
    const sport = document.getElementById('sport-select').value;
    if (!sport) return;

    currentRoutine = sportsData[sport].exercises;
    currentIndex = 0;

    // RESET UI: Show Timer, Show Controls, Hide Finish Button
    document.getElementById('timer-container').classList.remove('hidden');
    document.getElementById('overlay-controls').classList.remove('hidden');
    document.getElementById('finish-btn').classList.add('hidden');

    document.getElementById('workout-overlay').classList.remove('hidden');
    runExerciseStep();
}

function runExerciseStep() {
    if (currentIndex >= currentRoutine.length) {
        finishWorkout();
        return;
    }

    isPaused = false;
    document.getElementById('pause-btn').innerText = "Pause";

    const rawText = currentRoutine[currentIndex];
    let parts = rawText.split("-");
    let name = parts[0];
    let instruction = parts[1] || "Keep steady form";

    document.getElementById('wo-step-title').innerText = `Exercise ${currentIndex + 1} of ${currentRoutine.length}`;
    document.getElementById('wo-exercise-name').innerText = name;
    document.getElementById('wo-instruction').innerText = instruction;

    let msg = new SpeechSynthesisUtterance(name + ". " + instruction);
    window.speechSynthesis.speak(msg);

    let timeLeft = 15; 
    document.getElementById('wo-timer').innerText = timeLeft;

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            document.getElementById('wo-timer').innerText = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                nextExercise(); 
            }
        }
    }, 1000);
}

function togglePause() {
    isPaused = !isPaused;
    const btn = document.getElementById('pause-btn');
    if (isPaused) {
        btn.innerText = "Resume";
        window.speechSynthesis.cancel();
    } else {
        btn.innerText = "Pause";
    }
}

function nextExercise(manualClick = false) {
    if(manualClick) clearInterval(timerInterval);
    currentIndex++;
    runExerciseStep();
}

// --- NEW FINISH LOGIC (No Alert) ---
function finishWorkout() {
    clearInterval(timerInterval);
    
    // Change Text to Success
    document.getElementById('wo-step-title').innerText = "🎉";
    document.getElementById('wo-exercise-name').innerText = "Workout Complete!";
    document.getElementById('wo-instruction').innerText = "Good luck in the game!";
    
    // Hide Timer & Controls
    document.getElementById('timer-container').classList.add('hidden');
    document.getElementById('overlay-controls').classList.add('hidden');

    // Show Finish Button
    document.getElementById('finish-btn').classList.remove('hidden');

    // Speak Success
    let msg = new SpeechSynthesisUtterance("Workout Complete! Good luck!");
    window.speechSynthesis.speak(msg);
}

function quitWorkout() {
    clearInterval(timerInterval);
    document.getElementById('workout-overlay').classList.add('hidden');
    window.speechSynthesis.cancel();
}
