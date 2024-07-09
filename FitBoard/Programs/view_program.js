console.log("Script loaded"); // Initial debug statement

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed"); // Debug statement
    fetchPrograms();
    document.getElementById('printDownloadButton').addEventListener('click', handlePrintDownload);
});

function fetchPrograms() {
    console.log("Fetching programs"); // Debug statement
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
    console.log("Fetching program details"); // Debug statement
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
                headerRow.innerHTML = '<th>Category</th><th>Exercise</th><th>Sets</th><th>Reps</th><th>Done</th>';
                exerciseTable.appendChild(headerRow);

                day.exercises.forEach(exercise => {
                    const exerciseRow = document.createElement('tr');
                    exerciseRow.innerHTML = `
                        <td>${exercise.category}</td>
                        <td>${exercise.name}</td>
                        <td>${exercise.sets}</td>
                        <td>${exercise.reps}</td>
                        <td><input type="checkbox"></td>
                    `;
                    exerciseTable.appendChild(exerciseRow);
                });

                dayContainer.appendChild(exerciseTable);
                programDetails.appendChild(dayContainer);
            });
        })
        .catch(error => console.error('Error fetching program details:', error));
}

function handlePrintDownload() {
    console.log("handlePrintDownload called"); // Debug statement
    const selectedOption = document.getElementById('printDownloadSelect').value;
    console.log("Selected option:", selectedOption); // Debug statement
    if (selectedOption === 'print') {
        window.print();
    } else if (selectedOption === 'download') {
        downloadPDF();
    }
}

function downloadPDF() {
    const element = document.getElementById('programDetails');
    console.log("Starting PDF download"); // Debug statement
    html2pdf()
        .from(element)
        .save()
        .then(() => {
            console.log("PDF download completed"); // Debug statement
        })
        .catch((error) => {
            console.error("Error during PDF download", error); // Debug statement
        });
}
