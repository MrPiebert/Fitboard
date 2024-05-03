function Edit_Row(button) {
    const Row = button.parentNode.parentNode;
    const Cells = Row.getElementsByClassName('editable');

    for (let i = 0; i < Cells.length; i++) {
        const Cell = Cells[i];
        const Text = Cell.innerText;
        Cell.setAttribute('contenteditable','true');
        Cell.classList.add('edit-mode');
        Cell.innerHTML = '<input type="text" value ="' + Text + '">';
    }

    button.style.display = 'none';
    Row.querySelector('button[class="newabove"]').style.display = 'none';
    Row.querySelector('button[class="newbelow"]').style.display = 'none';
    Row.querySelector('button[class="save"]').style.display = 'inline-block';
    Row.querySelector('button[class="delete"]').style.display = 'inline-block';
}

function Add_New(button, position){
    const Row = button.parentNode.parentNode;
    const New_Row = document.createElement('tr');
    // change the data for the new row to match with current updates
    New_Row.innerHTML = '<td><span class="editable" contenteditable="false"></span></td><td><span class="editable" contenteditable="false"></span></td><td><span class="editable" contenteditable="false"></span></td><td><button onclick="Edit_Row(this)">Edit</button><button onclick="Add_Above(this)">Add Exercise Above</button><button onclick="Add_Below(this)">Add Exercise Below</button><button onclick="Save_Row(this)" style="display: none;">Save</button><button onclick="Delete_Row(this)" style="display: none;">Delete</button></td>';

    const tbody = Row.parentNode;

    if (position === 'above') {
        tbody.insertBefore(New_Row, Row);
    } else if (position === 'below'){
            tbody.insertBefore(New_Row, Row.nextSibling);
    }
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
    Row.querySelector('button[class="newabove"]').style.display = 'inline-block';
    Row.querySelector('button[class="newbelow"]').style.display = 'inline-block';
}

function Delete_Row(button){
    const Row = button.parentNode.parentNode;
    Row.parentNode.removeChild(Row);
}