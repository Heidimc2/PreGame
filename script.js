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
        image: "body-tennis.png",
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
        image: "body-soccer.png",
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

// 2. Load Visuals
function loadSport() {
    const select = document.getElementById('sport-select');
    const selectedSport = select.value;
    const dashboard = document.getElementById('dashboard');
    const imageDisplay = document.getElementById('body-image');
    const focusText = document.getElementById('focus-area');
    const list = document.getElementById('exercise-list');

    if (sportsData[selectedSport]) {
        const data = sportsData[selectedSport];
        focusText.innerText = data.focus;
        imageDisplay.src = data.image;

        list.innerHTML = ''; 
        data.exercises.forEach(exercise => {
            let li = document.createElement('li');
            li.innerText = exercise;
            list.appendChild(li);
        });

        dashboard.classList.remove('hidden');
    }
}

// 3. Read Overview (Optional)
function speakRoutine() {
    window.speechSynthesis.cancel();
    const sport = document.getElementById('sport-select').value;
    if (sportsData[sport]) {
        const msg = new SpeechSynthesisUtterance("Here is your plan for " + sportsData[sport].title);
        window.speechSynthesis.speak(msg);
    }
}

function startGuidedWorkout() {
    const sport = document.getElementById('sport-select').value;
    if (!sport) return;

    // 1. Setup Data
    currentRoutine = sportsData[sport].exercises;
    currentIndex = 0;

    // 2. Show Overlay
    document.getElementById('workout-overlay').classList.remove('hidden');

    // 3. Start First Exercise
    runExerciseStep();
}

let isPaused = false; 

function runExerciseStep() 
{
    // Check if finished
    if (currentIndex >= currentRoutine.length) {
        finishWorkout();
        return;
    }

    // Reset Pause State for new exercise
    isPaused = false;
    document.getElementById('pause-btn').innerText = "❚❚ Pause";

    // Get current exercise text
    const rawText = currentRoutine[currentIndex];
    let parts = rawText.split("-");
    let name = parts[0];
    let instruction = parts[1] || "Keep steady form";

    // Update UI
    document.getElementById('wo-step-title').innerText = `Exercise ${currentIndex + 1} of ${currentRoutine.length}`;
    document.getElementById('wo-exercise-name').innerText = name;
    document.getElementById('wo-instruction').innerText = instruction;

    // Speak it
    let msg = new SpeechSynthesisUtterance(name + ". " + instruction);
    window.speechSynthesis.speak(msg);

    // Start Timer (15 seconds)
    let timeLeft = 15; 
    document.getElementById('wo-timer').innerText = timeLeft;

    // Clear any old timers
    if (timerInterval) clearInterval(timerInterval);

    // --- THE NEW LOGIC ---
    timerInterval = setInterval(() => {
        // Only count down if NOT paused
        if (!isPaused) {
            timeLeft--;
            document.getElementById('wo-timer').innerText = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                nextExercise(); // Auto-advance
            }
        }
    }, 1000);
}

// --- NEW FUNCTION ---
function togglePause() {
    isPaused = !isPaused; // Switch between true and false
    const btn = document.getElementById('pause-btn');
    
    if (isPaused) {
        btn.innerText = "Resume";
        // Optional: Speak "Paused"
        window.speechSynthesis.cancel();
    } else {
        btn.innerText = "Pause";
    }
}

function nextExercise(manualClick = false) {
    if(manualClick) clearInterval(timerInterval); // Stop timer if user clicked Next
    currentIndex++;
    runExerciseStep();
}

function finishWorkout() {
    clearInterval(timerInterval);
    document.getElementById('workout-overlay').classList.add('hidden');
    alert("Workout Complete! Good luck in the game!");
}

function quitWorkout() {
    clearInterval(timerInterval);
    document.getElementById('workout-overlay').classList.add('hidden');
    window.speechSynthesis.cancel();
}
