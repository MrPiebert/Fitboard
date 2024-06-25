// #region JS

// #region Inner Button Logic

// #region Row Buttons

function handleKeyDown(e) {
    if (e.key === 'Tab') {
        e.preventDefault(); // Prevent default tab behavior

        console.log("tab pressed")

    }

    console.log("key pressed")

}

function Edit_Row(button) {
    const Row = button.parentNode.parentNode;
    const Cells = Row.getElementsByClassName('editable');
    for (let i = 0; i < Cells.length; i++) {
        const Cell = Cells[i];
        const Text = Cell.innerText;
        Cell.setAttribute('contenteditable','true');
        Cell.classList.add('edit-mode');
        Cell.innerHTML = '<input type = "text" value="' + Text + '">';
        
        const input = Cell.querySelector('input');
        input.addEventListener('keydown', handleKeyDown);
  
    }

    button.style.display = 'none';
    Row.querySelector('button[class="save"]').style.display = 'inline-block';
    Row.querySelector('button[class="delete"]').style.display = 'inline-block';
}

function Save_Row(button){
    const Row = button.parentNode.parentNode;
    const Cells = Row.getElementsByClassName('editable');

    for (let i = 0; i <Cells.length; i++){
        const Cell = Cells[i];
        const Input_Value = Cell.querySelector('input').value;
        Cell.removeAttribute('contenteditable');
        Cell.classList.remove('edit-mode');
        Cell.innerHTML = Input_Value
    }

    button.style.display = 'none';
    Row.querySelector('button[class="delete"]').style.display = 'none';
    Row.querySelector('button[class="edit"]').style.display = 'inline-block';

}

function Delete_Row(button){
    const Row = button.parentNode.parentNode;
    Row.parentNode.removeChild(Row);
}

function Add_New(button, position){

    const Row = button.parentNode.parentNode;
    const New_Row = document.createElement('tr');
    let rowTemplate = `
        <td>
            <span class="editable" contenteditable="false"></span>
        </td>
        <td>
            <span class="editable" contenteditable="false"></span>
        </td>
        <td>
            <span class="editable" contenteditable="false"></span>
        </td>
        <td>
            <button class="edit" onclick="Edit_Row(this)">Edit</button>
            <button class="save" onclick="Save_Row(this)" style="display: none;">Save</button>
            <button class="delete" onclick="Delete_Row(this)" style="display: none;">Delete</button>
        </td>
    `;
    
    New_Row.innerHTML = rowTemplate;

    const tbody = Row.parentNode;
    New_Row.setAttribute('draggable', true);
    New_Row.addEventListener('dragstart', handleDragStart);
    New_Row.addEventListener('dragenter', handleDragEnter);
    New_Row.addEventListener('dragover', handleDragOver);
    New_Row.addEventListener('dragleave', handleDragLeave);
    New_Row.addEventListener('drop', handleDrop);
    New_Row.addEventListener('dragend', handleDragEnd);
    if (position === 'above') {
        tbody.insertBefore(New_Row, Row);
    } else if (position === 'below'){
            tbody.insertBefore(New_Row, Row.nextSibling);
    }
    
}

// #endregion

// #region New Day Logic

function Add_Day(button, position) {
  let table = button.closest('table');
  let newTable = createNewDayTable();

  if (position === 'above') {
    table.parentNode.insertBefore(newTable, table);
  } else {
    table.parentNode.insertBefore(newTable, table.nextSibling);
  }


  // Initialize drag-and-drop for new table rows
  initializeDragAndDrop(newTable);

  // Update the days numbering for all tables
  updateDaysNumbering();
}

function createNewDayTable() {
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
        <tr>
          <td><u>Yoga</u></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td><u>Pre-Hab</u></td>
          <td></td>
          <td></td>
          <td>
            <button class="New_Exercise" onclick="Add_New(this, 'below')">Add Exercise Below</button>
          </td>
        </tr>
        <tr>
          <td><u>Main Workout</u></td>
          <td></td>
          <td></td>
          <td>
            <button class="New_Exercise" onclick="Add_New(this, 'above')">Add Exercise Above</button>
            <button class="New_Exercise" onclick="Add_New(this, 'below')">Add Exercise Below</button>
          </td>
        </tr>
        <tr>
          <td><u>Stretches</u></td>
          <td></td>
          <td></td>
          <td>
            <button class="New_Exercise" onclick="Add_New(this, 'above')">Add Exercise Above</button>
          </td>
        </tr>
        <tr>
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
  
  // Update the days numbering for all tables
  updateDaysNumbering();
}

function updateDaysNumbering() {
  let tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    table.querySelector('th.Col_1').innerText = `Day ${index + 1}`;
  });
}

// #endregion

// #endregion

// #region Dragging Logic

let dragSrcEl = null;
  
function handleDragStart(e) {
    this.classList.add('dragging');
    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';

    return false;
}

function handleDragEnter(e) {
    this.classList.add('dragover');
}

function handleDragLeave(e) {
    this.classList.remove('dragover');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (dragSrcEl != this) {
        const hoveredRect = this.getBoundingClientRect();
        const dragRect = dragSrcEl.getBoundingClientRect();

        // Get all rows
        const rows = Array.from(this.parentNode.children);

        // Get the index of the hovered row
        const hoveredIndex = rows.indexOf(this);

        // Check if the dropped row is being placed before the first, second, or last row
        if (hoveredIndex <= 1 || hoveredIndex >= rows.length - 2) {
            // If dropping at the first, second, or last two row, do not allow dropping
            return false;
        } else {
            // Otherwise, insert the dragged row at the hovered position
            if (e.clientY > (hoveredRect.top + hoveredRect.height / 2)) {
                this.parentNode.insertBefore(dragSrcEl, this.nextSibling);
            } else {
                this.parentNode.insertBefore(dragSrcEl, this);
            }
        }
    }

    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');

    const rows = document.querySelectorAll('tr');
    rows.forEach(row => row.classList.remove('dragover'));
}


function initializeDragAndDrop(element) {
        const rows = element.querySelectorAll('tr');
        rows.forEach(row => {
            row.addEventListener('dragstart', handleDragStart);
            row.addEventListener('dragenter', handleDragEnter);
            row.addEventListener('dragover', handleDragOver);
            row.addEventListener('dragleave', handleDragLeave);
            row.addEventListener('drop', handleDrop);
            row.addEventListener('dragend', handleDragEnd);
        });
    }
    
    // Initialize drag-and-drop for all existing rows on page load
    document.addEventListener('DOMContentLoaded', () => {
        initializeDragAndDrop(document);
    });


// #endregion

// #region Outer Button Logic

    function Save_Program(button){

    }

    function Discard_Changes(button){

    }
    
// #endregion

// #endregion