// #region JS

// J's Work

// #region Top Logic

    // Executes program fetching function on load
    document.addEventListener('DOMContentLoaded', () => {
        console.log("DOM fully loaded and parsed");
        Fetch_Programs(); 
    });

    // Loads program names from the database into the dropdown 
    function Fetch_Programs() {

        console.log("Fetching programs");

        fetch('Program Fetching.php')
        .then(response => response.json())
        .then(data => {

            const programSelect = document.getElementById('Select_Program');

            // Sort the data alphabetically by program name
            data.sort((a, b) => a.name.localeCompare(b.name));

            data.forEach(program => {
                const option = document.createElement('option');
                option.value = program.program_id;
                option.textContent = program.name;
                option.dataset.sessions = program.number_of_sessions;
                option.dataset.tier = program.tier
                programSelect.appendChild(option);
            });

        })
        .catch(error => console.error('Error fetching programs:', error));
    }   

    /*

        function Load_Database_Program(programData) {

            console.log("Loading Program Onto Page");

            console.log("Program Name: ", programData.name);
            console.log("Number of Sessions: ", programData.number_of_sessions);
            console.log("Tier: ", programData.tier);
            console.log("Tables and Exercises: ", programData.tables);

            // Example: Loop through the tables and log details
            for (let tableId in programData.tables) {

                let table = programData.tables[tableId];
                console.log(`Table ${table.table_number} (ID: ${table.table_id}):`);

                table.exercises.forEach(exercise => {
                    console.log(`  Exercise: ${exercise.name}, Sets: ${exercise.sets}, Reps: ${exercise.reps}, Type: ${exercise.type}`);
                });

            }
        }
    */

    function Fetch_Program_Details() {
        console.log("Fetching program details");

        const Program_Selector = document.getElementById('Select_Program')

        const programId = Program_Selector.value;
        console.log(programId)
        
        let Program_Name = document.getElementById("Program_Name");
        let Program_Sessions = document.getElementById("Program_Sessions");
        let Program_Tier = document.getElementById("Program_Tier");

        const Table_Container = document.getElementById("Table_Container");
        const Save_Program_Button = document.getElementsByClassName("Save_Program")[0];
        const Discard_Changes_Button = document.getElementsByClassName("Discard_Changes")[0];
        const Delete_Program_Button = document.getElementsByClassName("Delete_Program")[0];
        
        // Make the container and buttons visible
        Table_Container.style.display = 'inline-block';
        Save_Program_Button.style.display = 'inline-block';
        Discard_Changes_Button.style.display = 'inline-block';
        Delete_Program_Button.style.display = 'inline-block';

        Table_Container.innerHTML = ""; // Clear existing tables
        let Empty_Table = Create_New_Day_Table();

        if (programId === "Empty Program"){ // Sets the editor to default settings
            
            Table_Container.appendChild(Empty_Table);

            Program_Name.value = '';
            Program_Sessions.value = '';
            Program_Tier.value = 'I_1';
            
            Delete_Program_Button.disabled = true;

        } else if (programId) {    

            Delete_Program_Button.disabled = false;

            fetch(`Program Exercise Fetching.php?program_id=${programId}`)
            .then(response => response.json())  // Parse the JSON from the response
            .then(data => {
                console.log(data);  // Log the data for debugging

                Load_Database_Program(data, Program_Selector, Program_Name, Program_Sessions, Program_Tier, Table_Container, Empty_Table);

                // Add a function called "Edit_Choice" that alerts the user to ask if they want to edit, rename or delete the program, calling 3 other functions to do so.
                Request_Modification_Type()
            })
            .catch(error => console.error('Error fetching program details:', error));
        }
    }

    function Load_Database_Program(programData, Program_Selector, Program_Name, Program_Sessions, Program_Tier, Table_Container, Empty_Table) {
        
        console.log("Loading Program Onto Page");

        Program_Name.value = Program_Selector.selectedOptions[0].textContent;
        Program_Sessions.value = Program_Selector.selectedOptions[0].dataset.sessions;
        Program_Tier.value = Program_Selector.selectedOptions[0].dataset.tier;

        // add code to create a new day table for each day and then insert programs into them using insertbefore()

        // Group exercises by day and category
        const exercisesByDay = programData.program.reduce((acc, exercise) => {

            const day = exercise.table_number || 'Unknown';

            if (!acc[day]) {

                acc[day] = [];

            }

            acc[day].push(exercise);
            return acc;

        }, {});

        // Create a table for each day

        Object.keys(exercisesByDay).forEach(day => {

            const dayExercises = exercisesByDay[day];

        // #region Customise_Table_Template
                
            // Change the heading for the day

            let tableTemplate = `
            <table>

            <thead>
                <tr>
                <th class = "Col_1"><u>Day ${day}</u></th>
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

                <td><u><span class="Editable" contenteditable="false">Mobility</span></u></td>
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
                
            Day_Template = tableTemplateElement.firstChild;

            Table_Container.appendChild(Day_Template);

            Check_Delete_Buttons();

            dayExercises.forEach(exercise => {

                const Exercise_Category = exercise.type;
                const Exercise_Name = exercise.exercise_name;
                const Exercise_Sets = exercise.sets;
                const Exercise_Reps = exercise.reps;

                console.log(Exercise_Category);
                console.log(Exercise_Name);
                console.log(Exercise_Sets);
                console.log(Exercise_Reps);
            
                // Create a new row and populate it with the correct exercise data (change where this is put (put it in the casewhere) )
                let New_Row = document.createElement('tr');
                

                let rowTemplate = `
                    <td>
                        <span class="Editable" contenteditable="false">${Exercise_Name}</span>
                    </td>
                    <td>
                        <span class="Editable" contenteditable="false">${Exercise_Sets}</span>
                    </td>
                    <td>
                        <span class="Editable" contenteditable="false">${Exercise_Reps}</span>
                    </td>
                    <td>
                        <button class="Edit" onclick="Edit_Row(this)">Edit</button>
                        <button class="Save" onclick="Save_Row(this)" style="display: none;">Save</button>
                        <button class="Delete" onclick="Delete_Row(this)" style="display: none;">Delete</button>
                    </td>
                `;
    
                New_Row.innerHTML = rowTemplate;

                New_Row.setAttribute('draggable', true);
                New_Row.addEventListener('dragstart', Handle_Drag_Start);
                New_Row.addEventListener('dragenter', Handle_Drag_Enter);
                New_Row.addEventListener('dragover', Handle_Drag_Over);
                New_Row.addEventListener('dragleave', Handle_Drag_Leave);
                New_Row.addEventListener('drop', Handle_Drop);
                New_Row.addEventListener('dragend', Handle_Drag_End);

                // Get the day number to search
                let Search_Text = `Day ${day}`;

                // Select all tables on the page
                let tables = document.querySelectorAll('table');

                // Variable to hold the specific table
                let Target_Table = null;

                // Loop through each table
                tables.forEach(table => {
                    // Find the first cell in the table
                    Checked_Text = table.querySelector('th.Col_1').innerText;
                    console.log(Checked_Text);
                    // Check if the first cell exists and its text matches the search text
                    if (Checked_Text == Search_Text) {
                        Target_Table = table;
                        console.log(`'TABLE WITH VALUE ${day} FOUND'`)
                        Target_Table_Body = Target_Table.querySelector('tbody')
                    }
                });

                let Target_Row = null;

                // CHANGE TO A CASEWHERE THAT CHANGES WHAT THE TARGET INSERT ROW IS, AND THE INTERACTION PERFORMED
                switch (Exercise_Category) {

                    case "yoga":

                        console.log("TARGET VALUE IS YOGA");

                        Target_Row = Target_Table.getElementsByClassName("Yoga")[0];
                        console.log(Target_Row);

                        // Access the <span> elements within each <td> in the row
                        Target_Row_Spans = Target_Row.getElementsByClassName('Editable');

                        // Update the content of the <span> elements
                        Target_Row_Spans[0].innerHTML = Exercise_Name;
                        Target_Row_Spans[1].innerHTML = Exercise_Sets;
                        Target_Row_Spans[2].innerHTML = Exercise_Reps;

                        break;

                    case "pre_hab":

                        console.log("TARGET VALUE IS PREHAB");

                        Target_Row = Target_Table.getElementsByClassName("Main_Workout")[0];
                        console.log(Target_Table.body)
                        console.log(Target_Row);

                        Target_Table_Body.insertBefore(New_Row, Target_Row);

                        break;

                    case "main_workout":

                        console.log("TARGET VALUE IS MAIN WORKOUT");

                        Target_Row = Target_Table.getElementsByClassName("Mobility")[0];
                        console.log(Target_Table.body)
                        console.log(Target_Row);

                        Target_Table_Body.insertBefore(New_Row, Target_Row);
                        
                        break;

                    case "mobility":

                        console.log("TARGET VALUE IS MOBILITY");

                        Target_Row = Target_Table.getElementsByClassName("Mobility")[0];
                        console.log(Target_Row);

                        // Access the <span> elements within each <td> in the row
                        Target_Row_Spans = Target_Row.getElementsByClassName('Editable');

                        // Update the content of the <span> elements
                        Target_Row_Spans[0].innerHTML = Exercise_Name;
                        Target_Row_Spans[1].innerHTML = Exercise_Sets;
                        Target_Row_Spans[2].innerHTML = Exercise_Reps;

                        break;
                    
                    default:

                        console.log("TARGET VALUE IS NONE")

                        break;
                }


            });

            // #endregion

        });

    }

    // Ask the user if they want to edit, rename, or delete the program and do so accordingly
    function Request_Modification_Type(){
        
    }

// #endregion

// #region Inner Button Logic

// #region Row Buttons

function handleKeyDown(e) {
    if (e.key === 'Tab') {
        e.preventDefault(); // Prevent default tab behavior
    }
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
    const tbody = Row.parentNode;
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

          <td><u><span class="Editable" contenteditable="false">Mobility</span></u></td>
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

// #region Bottom Logic

/*
    Program Structure:

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

    function Save_Program(button) {

        let Program_Name = document.getElementById("Program_Name").value.trim();
        let Program_Sessions = document.getElementById("Program_Sessions").value.trim();
        let Program_Tier = document.getElementById("Program_Tier").value;
        let Program_Tables = document.querySelectorAll('table');

        // Ensure that all top fields are filled
        if (!Program_Name || !Program_Sessions || !Program_Tier) {
            alert("Please fill in all required fields.");
            return;
        }

        // Ensure that session is an integer greater than zero
        let Sessions_Test = Number(Program_Sessions);

        // Check if the converted value is an integer and greater than 0
        if (!isNaN(Sessions_Test) && Number.isInteger(Sessions_Test) && Sessions_Test > 0) {
            console.log("Program_Sessions is a valid integer greater than 0.");
        } else {
            console.log("Program_Sessions is not a valid integer greater than 0.");
            alert("Program sessions must be an integer greater than 0.");
            return;
        }

        // Validate that no duplicate exercise names are used in the same day
        let duplicateExerciseFound = false;
        Program_Tables.forEach((table) => {
            let exerciseNames = [];
            const rows = table.querySelectorAll('tr');

            rows.forEach((row) => {
                const exerciseName = row.querySelector('.Editable')?.innerText.trim();
                if (exerciseName) {
                    if (exerciseNames.includes(exerciseName)) {
                        duplicateExerciseFound = true;
                    }
                    exerciseNames.push(exerciseName);
                }
            });
        });

        if (duplicateExerciseFound) {
            alert("Duplicate exercise names found within the same day. Please correct this.");
            return;
        }

        // Check for empty cells in rows that are not header or bottom rows
        let emptyCellsFound = false;
        Program_Tables.forEach((table) => {
            const rows = table.querySelectorAll('tr');
            rows.forEach((row) => {
                const rowClass = row.className;
                if (rowClass !== "Pre_Hab" && rowClass !== "Main_Workout" && rowClass !== "Bottom_Row" && !row.querySelector('th')) { // Skip bottom and header rows
                    const cells = row.querySelectorAll('td');
                    cells.forEach((cell) => {
                        if (!cell.innerText.trim()) {
                            emptyCellsFound = true;
                        }
                    });
                }
            });
        });

        if (emptyCellsFound) {
            alert("Empty cells found in some rows. Please ensure all exercise details are filled in.");
            return;
        }

        // Ensure the program name is unique by fetching existing program names from the database
        fetch('Program Fetching.php')
            .then(response => response.json())
            .then(data => {
                const existingProgram = data.find(program => program.name.toLowerCase() === Program_Name.toLowerCase());
                
                if (existingProgram) {

                    alert("Duplicate program name found within the database. Either delete the old program or rename the current one.");
                    return;

                } else {
                    // No existing program, save the new one directly
                    Save_New_Program(Program_Name, Program_Sessions, Program_Tier, Program_Tables);
                }
            })
            .catch(error => console.error('Error fetching existing programs:', error));
    }

    // Function to save the new program data
    function Save_New_Program(Program_Name, Program_Sessions, Program_Tier, Program_Tables) {

        let Tables_Data = {};

        Program_Tables.forEach((table) => {

            const tableHeader = table.querySelector('th.Col_1').innerText;
            const tableNum = tableHeader.match(/Day (\d+)/)[1];

            Tables_Data[tableNum] = {
                yoga: [],
                pre_hab: [],
                main_workout: [],
                mobility: []
            };

            let currentCategory = null;

            for (let i = 1; i < table.rows.length; i++) {

                const row = table.rows[i];
                const rowClass = row.className;

                switch (rowClass) {

                    case "Yoga":
                        currentCategory = "yoga";
                        const yog_exercise = {
                            name: row.cells[0].innerText.trim(),
                            sets: row.cells[1].innerText.trim(),
                            reps: row.cells[2].innerText.trim()
                        };
                        Tables_Data[tableNum][currentCategory].push(yog_exercise);
                        break;

                    case "Pre_Hab":
                        currentCategory = "pre_hab";
                        break;

                    case "Main_Workout":
                        currentCategory = "main_workout";
                        break;

                    case "Mobility":
                        currentCategory = "mobility";
                        const mob_exercise = {
                            name: row.cells[0].innerText.trim(),
                            sets: row.cells[1].innerText.trim(),
                            reps: row.cells[2].innerText.trim()
                        };
                        Tables_Data[tableNum][currentCategory].push(mob_exercise);
                        break;

                    case "Bottom_Row":
                        currentCategory = null;
                        break;

                    default:
                        const norm_exercise = {
                            name: row.cells[0].innerText.trim(),
                            sets: row.cells[1].innerText.trim(),
                            reps: row.cells[2].innerText.trim()
                        };
                        Tables_Data[tableNum][currentCategory].push(norm_exercise);
                        break;
                }
            }
        });

        const Program_Data = {
            programName: Program_Name,
            programSessions: Program_Sessions,
            programTier: Program_Tier,
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
                alert('Program saved successfully.');
                location.reload(true);
            } else {
                alert('Failed to save the program.');
                console.error(data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to delete an existing program by ID (Currently Broken)
    function Delete_Existing_Program() {
        // Get the selected program ID from a dropdown or other UI element
        const Program_Selector = document.getElementById('Select_Program')

        const programId = Program_Selector.value;
        console.log(programId)

        if (!programId) {
            alert("Please select a program to delete.");
            return;
        }

        // Confirm deletion with the user
        if (!confirm(`Are you sure you want to delete this program? This action cannot be undone.`)) {
            return;
        }

        // Define the server endpoint for deleting the program
        const deleteUrl = 'Program Deletion.php'; // Replace with your actual endpoint

        // Send a request to delete the program by its ID
        fetch(deleteUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ programId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Program deleted successfully.');
                location.reload(true);
            } else {
                alert('Failed to delete the program.');
                console.error(data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }


    function Discard_Changes(button){
      alert('Unsaved changes discarded.')
      location.reload(true)
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
