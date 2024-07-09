document.getElementById('programForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const programName = document.getElementById('programName').value;
    const programSessions = document.getElementById('programSessions').value;
    const programTier = document.getElementById('programTier').value;

    const exercises = [];
    document.querySelectorAll('#exercisesContainer .exercise').forEach(exerciseDiv => {
        const day = exerciseDiv.querySelector('input[name="day"]').value;
        const category = exerciseDiv.querySelector('input[name="category"]').value;
        const name = exerciseDiv.querySelector('input[name="name"]').value;
        const sets = exerciseDiv.querySelector('input[name="sets"]').value;
        const reps = exerciseDiv.querySelector('input[name="reps"]').value;
        exercises.push({ day, category, name, sets, reps });
    });

    const data = {
        programName,
        programSessions,
        programTier,
        exercises
    };

    fetch('save_program.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Program saved successfully!');
        } else {
            alert('Failed to save the program.');
            console.error(data.error);
        }
    })
    .catch(error => console.error('Error:', error));
});

function addExercise() {
    const exerciseContainer = document.createElement('div');
    exerciseContainer.classList.add('exercise');
    exerciseContainer.innerHTML = `
        <label>Day:</label>
        <input type="number" name="day" required>
        <label>Category:</label>
        <input type="text" name="category" required>
        <label>Name:</label>
        <input type="text" name="name" required>
        <label>Sets:</label>
        <input type="number" name="sets" required>
        <label>Reps:</label>
        <input type="number" name="reps" required>
        <button type="button" onclick="removeExercise(this)">Remove Exercise</button>
        <br><br>
    `;
    document.getElementById('exercisesContainer').appendChild(exerciseContainer);
}

function removeExercise(button) {
    button.parentElement.remove();
}
