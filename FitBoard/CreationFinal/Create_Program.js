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

function Edit_Row(button) {
    const Row = button.parentNode.parentNode;
    const Cells = Row.getElementsByClassName('Editable');
    for (let i = 0; i < Cells.length; i++) {
        const Cell = Cells[i];
        const Text = Cell.innerText;
        Cell.setAttribute('contenteditable', 'true');
        Cell.classList.add('edit-mode');
        Cell.innerHTML = '<input type="text" value="' + Text + '">';
        
        const input = Cell.querySelector('input');
        input.addEventListener('keydown', handleKeyDown);
    }

    button.style.display = 'none';
    Row.querySelector('button[class="Save"]').style.display = 'inline-block';
    Row.querySelector('button[class="Delete"]').style.display = 'inline-block';
}

function Save_Row(button) {
    const Row = button.parentNode.parentNode;
    const Cells = Row.getElementsByClassName('Editable');

    for (let i = 0; i < Cells.length; i++) {
        const Cell = Cells[i];
        const Input_Value = Cell.querySelector('input').value;
        Cell.removeAttribute('contenteditable');
        Cell.classList.remove('edit-mode');
        Cell.innerHTML = Input_Value;
    }

    button.style.display = 'none';
    Row.querySelector('button[class="Delete"]').style.display = 'none';
    Row.querySelector('button[class="Edit"]').style.display = 'inline-block';
}

function Delete_Row(button) {
    const Row = button.parentNode.parentNode;
    Row.parentNode.removeChild(Row);
}

function Add_New(button, position) {
    const Row = button.parentNode.parentNode;
    const New_Row = document.createElement('tr');
    let rowTemplate = `
        <td>
            <span class="Editable" contenteditable="false"></span>
        </td>
        <td>
            <span class="Editable" contenteditable="false"></span>
        </td>
        <td>
            <span class="Editable" contenteditable="false"></span>
        </td>
        <td>
            <button class="Edit" onclick="Edit_Row(this)">Edit</button>
            <button class="Save" onclick="Save_Row(this)" style="display: none;">Save</button>
            <button class="Delete" onclick="Delete_Row(this)" style="display: none;">Delete</button>
        </td>
    `;
    
    New_Row.innerHTML = rowTemplate;

    const tbody = Row.parentNode;
    New_Row.setAttribute('draggable', true);
    New_Row.addEventListener('dragstart', Handle_Drag_Start);
    New_Row.addEventListener('dragenter', Handle_Drag_Enter);
    New_Row.addEventListener('dragover', Handle_Drag_Over);
    New_Row.addEventListener('dragleave', Handle_Drag_Leave);
    New_Row.addEventListener('drop', Handle_Drop);
    New_Row.addEventListener('dragend', Handle_Drag_End);
    if (position === 'above') {
        tbody.insertBefore(New_Row, Row);
    } else if (position === 'below') {
        tbody.insertBefore(New_Row, Row.nextSibling);
    }
}

function Add_Day(button, position) {
    let table = button.closest('table');
    let newTable = Create_New_Day_Table();

    if (position === 'above') {
        table.parentNode.insertBefore(newTable, table);
    } else {
        table.parentNode.insertBefore(newTable, table.nextSibling);
    }

    Initialise_Drag_And_Drop(newTable);
    Update_Days_Numbering();
    Check_Delete_Buttons();
}

function Create_New_Day_Table() {
    let tableTemplate = `
    <table>
        <thead>
            <tr draggable="true">
                <th class="Col_1"><u>Day 1</u></th>
                <th class="Col_2"><u>Sets</u></th>
                <th class="Col_3"><u>Reps</u></th>
                <th class="Col_4"></th>
            </tr>
        </thead>
        <tbody>
            <tr class="Yoga">
                <td><u>Yoga</u></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr class="Pre_Hab">
                <td><u>Pre-Hab</u></td>
                <td></td>
                <td></td>
                <td>
                    <button class="New_Exercise" onclick="Add_New(this, 'below')">Add Exercise Below</button>
                </td>
            </tr>
            <tr class="Main_Workout">
                <td><u>Main Workout</u></td>
                <td></td>
                <td></td>
                <td>
                    <button class="New_Exercise" onclick="Add_New(this, 'above')">Add Exercise Above</button>
                    <button class="New_Exercise" onclick="Add_New(this, 'below')">Add Exercise Below</button>
                </td>
            </tr>
            <tr class="Stretches">
                <td><u>Stretches</u></td>
                <td></td>
                <td></td>
                <td>
                    <button class="New_Exercise" onclick="Add_New(this, 'above')">Add Exercise Above</button>
                </td>
            </tr>
            <tr class="Bottom_Row">
                <td></td>
                <td></td>
                <td></td>
                <td>
                    <button class="New_Day" onclick="Add_Day(this, 'above')">Add Day Above</button>
                    <button class="New_Day" onclick="Add_Day(this, 'below')">Add Day Below</button>
                    <button class="Delete_Day" onclick="Delete_Day(this)">Delete Day</button>
                </td>
            </tr>
        </tbody>
    </table>
    `;

    let tableTemplateElement = document.createElement('div');
    tableTemplateElement.innerHTML = tableTemplate.trim();

    return tableTemplateElement.firstChild;
}

function Delete_Day(button) {
    let table = button.closest('table');
    table.parentNode.removeChild(table);
    Update_Days_Numbering();
    Check_Delete_Buttons();
}

function Update_Days_Numbering() {
    let tables = document.querySelectorAll('table');
    tables.forEach((table, index) => {
        table.querySelector('th.Col_1').innerText = `Day ${index + 1}`;
    });
}

function Check_Delete_Buttons() {
    const tables = document.getElementsByTagName('table');
    let deleteButtons = document.getElementsByClassName('Delete_Day');
    
    if (tables.length === 1) {
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].disabled = true;
        }
    } else if (tables.length > 1) {
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].disabled = false;
        }
    }
}

function handleKeyDown(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        console.log("tab pressed")
    }
    console.log("key pressed")
}

function Handle_Drag_Start(e) {
    this.classList.add('dragging');
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function Handle_Drag_Over(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function Handle_Drag_Enter(e) {
    this.classList.add('dragover');
}

function Handle_Drag_Leave(e) {
    this.classList.remove('dragover');
}

function Handle_Drop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }
    return false;
}

function Handle_Drag_End(e) {
    this.classList.remove('dragging');
    let items = document.querySelectorAll('.sortable-table tr');
    items.forEach(item => item.classList.remove('dragover'));
}
