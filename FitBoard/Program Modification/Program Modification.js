// #region JS

// Joseph's Work

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
    const Cells = Row.getElementsByClassName('Editable');
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
    Row.querySelector('button[class="Save"]').style.display = 'inline-block';
    Row.querySelector('button[class="Delete"]').style.display = 'inline-block';
}

function Save_Row(button){
    const Row = button.parentNode.parentNode;
    const Cells = Row.getElementsByClassName('Editable');

    for (let i = 0; i <Cells.length; i++){
        const Cell = Cells[i];
        const Input_Value = Cell.querySelector('input').value;
        Cell.removeAttribute('contenteditable');
        Cell.classList.remove('edit-mode');
        Cell.innerHTML = Input_Value
    }

    button.style.display = 'none';
    Row.querySelector('button[class="Edit"]').style.display = 'inline-block';
    Row.querySelector('button[class="Delete"]').style.display = 'none';
}

function Delete_Row(button){
    const Row = button.parentNode.parentNode;
    Row.parentNode.removeChild(Row);
}

function Create_Row(button, position){
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
    } else if (position === 'below'){
            tbody.insertBefore(New_Row, Row.nextSibling);
    }
    
}

// #endregion

// #region New Day Logic

function Add_Day(button, position) {
  let table = button.closest('table');
  let newTable = Create_New_Day_Table();

  if (position === 'above') {
    table.parentNode.insertBefore(newTable, table);
  } else {
    table.parentNode.insertBefore(newTable, table.nextSibling);
  }

  // Initialize drag-and-drop for new table rows
  Initialise_Drag_And_Drop(newTable);

  // Update the days numbering for all tables
  Update_Days_Numbering();

  // Checks if the delete day buttons should be disabled or not
  Check_Delete_Buttons();
}

function Create_New_Day_Table() {
  let tableTemplate = `
      <table>

      <thead>
        <tr>
          <th class = "Col_1"><u>Day 1</u></th>
          <th class = "Col_2"><u>Sets</u></th>
          <th class = "Col_3"><u>Reps</u></th>
          <th class = "Col_4"></th>
        </tr>
      </thead>

      <tbody>

        <tr class = "Yoga">

          <td><u><span class="Editable" contenteditable="false">Yoga Sequence</span></u></td>
          <td><span class="Editable" contenteditable="false"></span></td>
          <td><span class="Editable" contenteditable="false"></span></td>
          
          <td>
            <button class="Edit" onclick="Edit_Row(this)">Edit</button>
            <button class="Save" onclick="Save_Row(this)" style="display: none;">Save</button>
          </td>

        </tr>

        <tr class = "Pre_Hab">

          <td><u>Pre-Hab</u></td>
          <td></td>
          <td></td>

          <td>
            <button class="New_Exercise" onclick="Create_Row(this, 'below')">Add Exercise Below</button>
          </td>

        </tr>

        <tr class = "Main_Workout">

          <td><u>Main Workout</u></td>
          <td></td>
          <td></td>

          <td>
            <button class= "New_Exercise" onclick="Create_Row(this, 'above')">Add Exercise Above</button>
            <button class= "New_Exercise" onclick="Create_Row(this, 'below')">Add Exercise Below</button>
          </td>

        
        </tr>

        <tr class = "Mobility">

          <td><u><span class="Editable" contenteditable="false">Moblity</span></u></td>
          <td><span class="Editable" contenteditable="false"></span></td>
          <td><span class="Editable" contenteditable="false"></span></td>
          
          <td>
            <button class = "New_Exercise" onclick="Create_Row(this, 'above')">Add Exercise Above</button>
            <button class="Edit" onclick="Edit_Row(this)">Edit</button>
            <button class="Save" onclick="Save_Row(this)" style="display: none;">Save</button>
          </td>

        </tr>

        <tr class = "Bottom_Row">

          <td></td>
          <td></td>
          <td></td>

          <td>
                 <button class="New_Day" onclick="Add_Day(this, 'above')">Add Day Above</button>
                 <button class="New_Day" onclick="Add_Day(this, 'below')">Add Day Below</button>
                 <button class="Delete_Day" onclick="Delete_Day(this)" disabled>Delete Day</button>
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
  Update_Days_Numbering();

  // Checks if the delete day buttons should be disabled or not
  Check_Delete_Buttons();
}

function Update_Days_Numbering() {
  let tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    table.querySelector('th.Col_1').innerText = `Day ${index + 1}`;
  });
}

function Check_Delete_Buttons(){
    // Get all tables in the document
    const tables = document.getElementsByTagName('table');
    
    // Get all buttons with the class 'Delete_Button'
    let deleteButtons = document.getElementsByClassName('Delete_Day');
    
    if (tables.length === 1) {
      console.log("One Table")
        // If there is only one table, disable the Delete_Button in that table
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].disabled = true;
            
        }
    } else if (tables.length > 1) {
      console.log("Multiple Tables")
        // If there are multiple tables, enable all Delete_Buttons
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].disabled = false;
        }
    }
}

// #endregion

// #endregion

// #region Outer Button Logic

  function Save_Program(button){

    /* 
    Save button should:
    Check Program Name is Valid and Exclusive
    Check no reserved terms are being used
    Group info in the same table together
    Group exercises within each table between pre-hab, main workout and mobility
    Check no duplicate exercise names are used in the same day
    Check validity of exercise names
    Check all exercise info has been filled in for each exercise
    */      

    /*
            Program Architecture:

            -- Create table for exercise programs
            CREATE TABLE exercise_programs (
                program_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                number_of_sessions INT NOT NULL,
                tier VARCHAR(50) NOT NULL
            );

            -- Create table for tables within each exercise program
            CREATE TABLE program_tables (
                table_id INT AUTO_INCREMENT PRIMARY KEY,
                program_id INT NOT NULL,
                table_number INT NOT NULL,
                FOREIGN KEY (program_id) REFERENCES exercise_programs(program_id)
            );

            -- Create table for exercises within each table
            CREATE TABLE program_exercises (
                exercise_id INT AUTO_INCREMENT PRIMARY KEY,
                table_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                sets VARCHAR(50) NOT NULL,
                reps VARCHAR(50) NOT NULL,
                type ENUM('yoga', 'pre_hab', 'main_workout', 'mobility') NOT NULL,
                FOREIGN KEY (table_id) REFERENCES program_tables(table_id)
            );
    */

    let Program_Name = document.getElementById("Program_Name");
    let Program_Sessions = document.getElementById("Program_Sessions");
    let Program_Tier = document.getElementById("Program_Tier");
    let Program_Tables = document.querySelectorAll('table');
  
    console.log(Program_Name.value);
    console.log(Program_Sessions.value);
    console.log(Program_Tier.value);

    // Collects Table info

    let Tables_Data = {};

    Program_Tables.forEach((table) => {
        // Extract the table number from the string "Day x"
        const tableHeader = table.querySelector('th.Col_1').innerText;
        const tableNum = tableHeader.match(/Day (\d+)/)[1];
        console.log(`Table Number: Day ${tableNum}`);

        // Initialize the lists for the current table
        Tables_Data[tableNum] = {
            yoga: [],
            pre_hab: [],
            main_workout: [],
            mobility: []
        };

        let currentCategory = null;

        // Iterate through each row in the table, starting from the second row
        for (let i = 1; i < table.rows.length; i++) {
            const row = table.rows[i];
            const rowClass = row.className;
            console.log(`Row ${i} class: ${rowClass}`);

            switch (rowClass) {

                case "Yoga":

                    console.log("Value is yoga");
                    currentCategory = "yoga";

                    const yog_exercise = {
                        name: row.cells[0].innerText,
                        sets: row.cells[1].innerText,
                        reps: row.cells[2].innerText
                    };

                    Tables_Data[tableNum][currentCategory].push(yog_exercise);
                    console.log("success...!")
                    

                    break;

                case "Pre_Hab":

                    console.log("Value is pre_hab");
                    currentCategory = "pre_hab";
                    break;

                case "Main_Workout":

                    console.log("Value is main_workout");
                    currentCategory = "main_workout";
                    break;

                case "Mobility":

                    console.log("Value is mobility");
                    currentCategory = "mobility";

                    const mob_exercise = {
                        name: row.cells[0].innerText,
                        sets: row.cells[1].innerText,
                        reps: row.cells[2].innerText
                    };
                    Tables_Data[tableNum][currentCategory].push(mob_exercise);
                    

                    break;

                case "Bottom_Row":

                    console.log("Value is bottom_row");
                    currentCategory = null;
                    break;

                default:

                    // If the row is not a category label or bottom row, add it to the current category list
                    console.log("Value is something else");
       
                    if (currentCategory && row.cells.length >= 3) {
                        const norm_exercise = {
                            name: row.cells[0].innerText,
                            sets: row.cells[1].innerText,
                            reps: row.cells[2].innerText
                        };
                        Tables_Data[tableNum][currentCategory].push(norm_exercise);
                    }
                    
                    break;
            }
        }
    });

    console.log("Tables Data:", Tables_Data);


    const Program_Data = {

      programName: Program_Name.value,

      programSessions: Program_Sessions.value,

      programTier: Program_Tier.value,

      tablesData: Tables_Data

  };

  const Save_Url = 'Program Saving.php';

  fetch(Save_Url, {

      method: 'POST',

      headers: {

          'Content-Type': 'application/json'

      },

      body: JSON.stringify(Program_Data)

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

// #region Database

    // Collect exercise data

    const exercises = [];

    document.querySelectorAll('tbody tr').forEach(row => {

        const cells = row.querySelectorAll('td');

        if (cells.length > 1) {

            const day = row.closest('table').querySelector('th.Col_1').innerText.replace('Day ', '');

            const category = cells[0].innerText.trim();

            const sets = cells[1].innerText.trim();

            const reps = cells[2].innerText.trim();

            exercises.push({ day, category, sets, reps });

        }

    });


    const data = {

        programName: Program_Name.value,

        programSessions: Program_Sessions.value,

        programTier: Program_Tier.value,

        exercises

    };


    const url = 'save_program.php';

    fetch(url, {

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

// #endregion

  }

  function Discard_Changes(button){

  }
    
// #endregion

// #region Dragging Logic

let dragSrcEl = null;
  
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

function Handle_Drag_End(e) {
    this.classList.remove('dragging');

    const rows = document.querySelectorAll('tr');
    rows.forEach(row => row.classList.remove('dragover'));
}


function Initialise_Drag_And_Drop(element) {
        const rows = element.querySelectorAll('tr');
        rows.forEach(row => {
            row.addEventListener('dragstart', Handle_Drag_Start);
            row.addEventListener('dragenter', Handle_Drag_Enter);
            row.addEventListener('dragover', Handle_Drag_Over);
            row.addEventListener('dragleave', Handle_Drag_Leave);
            row.addEventListener('drop', Handle_Drop);
            row.addEventListener('dragend', Handle_Drag_End);
        });
  }
    
// Initialize drag-and-drop for all existing rows on page load
document.addEventListener('DOMContentLoaded', () => {
    Initialise_Drag_And_Drop(document);
});


// #endregion

// #endregion