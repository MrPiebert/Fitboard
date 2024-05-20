// #region JS

// #region Inner Button Logic

function handleKeyDown(e) {
    if (e.key === 'Tab') {
        e.preventDefault(); // Prevent default tab behavior
    }
}

function Edit_Row(button) {
    const Row = button.parentNode.parentNode;
    const Cells = Row.getElementsByClassName('editable');

    for (let i = 0; i < Cells.length; i++) {
        const Cell = Cells[i];
        const Text = Cell.innerText;
        Cell.setAttribute('contenteditable','true');
        Cell.classList.add('edit-mode');
        Cell.innerHTML = '<input type="text" value ="' + Text + '">';
        
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
    // change the data for the new row to match with current updates
    New_Row.innerHTML = '<td><span class="editable" contenteditable="false"></span></td><td><span class="editable" contenteditable="false"></span></td><td><span class="editable" contenteditable="false"></span></td><td><button class="edit" onclick="Edit_Row(this)">Edit</button><button class="save" onclick="Save_Row(this)" style="display: none;">Save</button><button class="delete" onclick="Delete_Row(this)" style="display: none;">Delete</button></td>';

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

function Add_Day(button, position){
    
}

function Delete_Day(button){

}

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
        if (hoveredIndex === 0 || hoveredIndex === 1 || hoveredIndex === rows.length - 1) {
            // If dropping at the first, second, or last row, do not allow dropping
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

const rows = document.querySelectorAll('tr');
rows.forEach(row => {
    row.addEventListener('dragstart', handleDragStart);
    row.addEventListener('dragenter', handleDragEnter);
    row.addEventListener('dragover', handleDragOver);
    row.addEventListener('dragleave', handleDragLeave);
    row.addEventListener('drop', handleDrop);
    row.addEventListener('dragend', handleDragEnd);
});

// #endregion

// #region Outer Button Logic

    function Save_Program(button){

    }

    function Discard_Changes(button){

    }
    
// #endregion

// #endregion