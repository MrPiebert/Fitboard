// Function to update container color and save hue to localStorage
function updateContainerColor(hue) {
    const container = document.getElementById('container');
    if (container) {
        container.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
        localStorage.setItem('containerColorHue', hue);
    }
}

// Function to reset container color to bisque and remove hue from localStorage
function resetContainerColor() {
    const container = document.getElementById('container');
    if (container) {
        container.style.backgroundColor = 'bisque';
        localStorage.removeItem('containerColorHue');
    }
    const slider = document.getElementById('myRange');
    if (slider) {
        slider.value = 0;
    }
}

// Event listener for slider input
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('myRange');
    if (slider) {
        slider.addEventListener('input', function() {
            updateContainerColor(slider.value);
        });

        // Set container color if hue is stored
        const storedHue = localStorage.getItem('containerColorHue');
        if (storedHue !== null) {
            slider.value = storedHue;
            updateContainerColor(storedHue);
        }
    } else {
        // Set container color if hue is stored and slider is not present
        const storedHue = localStorage.getItem('containerColorHue');
        if (storedHue !== null) {
            updateContainerColor(storedHue);
        }
    }

    // Event listener for reset button
    const resetButton = document.getElementById('reset_button');
    if (resetButton) {
        resetButton.addEventListener('click', resetContainerColor);
    }
});