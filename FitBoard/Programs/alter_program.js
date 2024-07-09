document.addEventListener('DOMContentLoaded', () => {
    fetchPrograms();
    document.getElementById('addExerciseButton').addEventListener('click', addExercise);
    document.getElementById('saveChangesButton').addEventListener('click', saveProgramDetails);
});

function fetchPrograms() {
    fetch('fetch_programs.php')
        .then(response => response.json())
        .then(data => {
            const programSelect = document.getElementById('programSelect');
            data.forEach(program => {
                const option = document.createElement('option');
                option.value = program.id;
                option.textContent = program.name;
                programSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching programs:', error));
}

function fetchProgramDetails() {
    const programId = document.getElementById('programSelect').value;
    fetch('fetch_program_details.php?id=' + programId)
        .then(response => response.json())
        .then(data => {
            const programDetails = document.getElementById('programDetails');
            programDetails.innerHTML = '';

            data.exercises.forEach(day => {
                const dayContainer = document.createElement('div');
                dayContainer.classList.add('day');

                const dayTitle = document.createElement('h2');
                dayTitle.textContent = `Day ${day.day}`;
                dayContainer.appendChild(dayTitle);

                const exerciseTable = document.createElement('table');
                const headerRow = document.createElement('tr');
                headerRow.innerHTML = '<th>Category</th><th>Exercise</th><th>Sets</th><th>Reps</th><th>Actions</th>';
                exerciseTable.appendChild(headerRow);

                day.exercises.forEach((exercise, index) => {
                    const exerciseRow = document.createElement('tr');
                    exerciseRow.innerHTML = `
                        <td><input type="text" value="${exercise.category}" /></td>
                        <td><input type="text" value="${exercise.name}" /></td>
                        <td><input type="number" value="${exercise.sets}" /></td>
                        <td><input type="number" value="${exercise.reps}" /></td>
                        <td>
                            <button onclick="deleteExercise(this)">Delete</button>
                        </td>
                    `;
                    exerciseTable.appendChild(exerciseRow);
                });

                dayContainer.appendChild(exerciseTable);
                programDetails.appendChild(dayContainer);
            });
        })
        .catch(error => console.error('Error fetching program details:', error));
}

function addExercise() {
    const programDetails = document.getElementById('programDetails');
    if (programDetails.children.length === 0) {
        alert('Please select a program first.');
        return;
    }

    const dayContainer = programDetails.children[0];
    const exerciseTable = dayContainer.querySelector('table');

    const exerciseRow = document.createElement('tr');
    exerciseRow.innerHTML = `
        <td><input type="text" placeholder="Category" /></td>
        <td><input type="text" placeholder="Exercise" /></td>
        <td><input type="number" placeholder="Sets" /></td>
        <td><input type="number" placeholder="Reps" /></td>
        <td>
            <button onclick="deleteExercise(this)">Delete</button>
        </td>
    `;
    exerciseTable.appendChild(exerciseRow);
}

function deleteExercise(button) {
    const row = button.closest('tr');
    row.remove();
}

function saveProgramDetails() {
    const programId = document.getElementById('programSelect').value;
    const programDetails = document.getElementById('programDetails');
    const days = programDetails.getElementsByClassName('day');

    const updatedExercises = [];

    for (const day of days) {
        const dayTitle = day.querySelector('h2').textContent.split(' ')[1];
        const rows = day.querySelectorAll('table tr');

        for (let i = 1; i < rows.length; i++) { // skip header row
            const cells = rows[i].querySelectorAll('td input');
            updatedExercises.push({
                day: dayTitle,
                category: cells[0].value,
                name: cells[1].value,
                sets: cells[2].value,
                reps: cells[3].value
            });
        }
    }

    fetch('save_program_details.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            programId: programId,
            exercises: updatedExercises
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Program details saved successfully');
        } else {
            alert('Error saving program details: ' + data.error);
        }
    })
    .catch(error => console.error('Error saving program details:', error));
}
