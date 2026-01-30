// 1. The Data "Database"
const sportsData = {
    soccer: {
        focus: "Knees (ACL) & Ankles",
        image: "images/body-soccer.png", // Make sure these file names match exactly!
        exercises: [
            "<strong>High Knees:</strong> 3 sets of 30 seconds to activate hips.",
            "<strong>Glute Bridges:</strong> 15 reps to support knee stability.",
            "<strong>Single-Leg Balance:</strong> 30 seconds each leg (eyes closed if able)."
        ]
    },
    tennis: {
        focus: "Shoulders (Rotator Cuff) & Elbows",
        image: "images/body-tennis.png",
        exercises: [
            "<strong>Arm Circles:</strong> Small to big, 30 seconds forward/back.",
            "<strong>Band Pull-Aparts:</strong> 15 reps to warm up rear delts.",
            "<strong>Wrist Flexion/Extension:</strong> Gentle stretching for 20 seconds."
        ]
    },
    running: {
        focus: "Calves, Achilles & Hips",
        image: "images/body-running.png",
        exercises: [
            "<strong>Calf Raises:</strong> 20 reps (slow eccentric).",
            "<strong>Leg Swings:</strong> 10 forward/back, 10 side-to-side.",
            "<strong>Walking Lunges:</strong> 10 each leg to open hips."
        ]
    },
    basketball: {
        focus: "Ankles & Landing Mechanics",
        image: "images/body-basketball.png",
        exercises: [
            "<strong>Ankle Rotations:</strong> 30 seconds each direction.",
            "<strong>Jump Squats:</strong> 10 reps (Focus on SOFT silent landings).",
            "<strong>Lateral Shuffles:</strong> 30 seconds low stance."
        ]
    },
    gaming: {
        focus: "Wrists, Neck & Lower Back",
        image: "images/body-gaming.png", // Yes, gamers need injury prevention too!
        exercises: [
            "<strong>Wrist Prayer Stretch:</strong> Hold for 15 seconds.",
            "<strong>Neck Tucks:</strong> Pull chin back to align spine (10 reps).",
            "<strong>Thoracic Extension:</strong> Stretch arms overhead and lean back."
        ]
    }
};

// 2. The Logic
function loadSport() {
    // Get the User Selection
    const select = document.getElementById('sport-select');
    const selectedSport = select.value;

    // Get the Elements we need to change
    const dashboard = document.getElementById('dashboard');
    const focusText = document.getElementById('focus-area');
    const imageDisplay = document.getElementById('body-image');
    const list = document.getElementById('exercise-list');

    // Check if data exists
    if (sportsData[selectedSport]) {
        // Get the specific data
        const data = sportsData[selectedSport];

        // A. Update Text
        focusText.innerText = data.focus;

        // B. Update Image
        imageDisplay.src = data.image;

        // C. Update List (Clear old ones first)
        list.innerHTML = ''; 
        data.exercises.forEach(exercise => {
            let li = document.createElement('li');
            li.innerHTML = exercise; // Using innerHTML so we can make text bold
            list.appendChild(li);
        });

        // D. Reveal the dashboard
        dashboard.classList.remove('hidden');
    }
}
function speakRoutine() {
    // 1. RESET the voice engine (This fixes the silence bug)
    window.speechSynthesis.cancel();

    const sport = document.getElementById('sport-select').value;
    
    if (sportsData[sport]) {
        const data = sportsData[sport];
        
        // Build the speech text
        let speechText = `Starting Pre Game session for ${data.title}. Focus area is ${data.focus}. `;
        
        data.exercises.forEach((ex, index) => {
            // Remove HTML tags so it doesn't say "Strong" or "Bold"
            let cleanText = ex.replace(/<[^>]*>?/gm, ''); 
            speechText += `Exercise ${index + 1}: ${cleanText}. `;
        });

        // Setup the speaker
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.rate = 1.0; // Normal speed
        utterance.pitch = 1;
        utterance.volume = 1; // Max volume

        // Speak
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Please select a sport first!");
    }
}
