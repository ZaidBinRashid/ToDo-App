// ── Grab references to the HTML elements we need ──
// These let us read input values, listen for clicks, and update the page.
const addButtonEl = document.getElementById("AddButton"); // The "Add" button
const addTaskEl = document.getElementById("AddTask"); // The text input field
const taskConEl = document.getElementById("TaskContainer"); // The div that holds the task list

// ── Create the inline banner element and insert it into the page ──
// Instead of using the browser's built-in alert() popup, we make our own
// banner div and place it right below the Add button in the HTML.
const banner = document.createElement("div"); // Creates a new empty <div>
banner.classList.add("alert-banner"); // Gives it the base CSS class (hidden by default)
addButtonEl.insertAdjacentElement("afterend", banner);
// "afterend" means: insert the banner as the next sibling after the button,
// so in the DOM it appears: [input] → [button] → [banner] → [task list]

// ── Timer reference for the banner auto-hide ──
// We store the timer ID here so we can cancel it if the banner
// needs to be shown again before the previous one has disappeared.
let bannerTimer = null;

// ── showBanner(message, type, duration) ──
// This function handles showing, styling, and auto-hiding the banner.
// Parameters:
//   message  – the text to display (e.g. "✓ Task added!")
//   type     – "success" or "error", controls the color via CSS class
//   duration – how long (ms) the banner stays visible before fading out
function showBanner(message, type = "success", duration = 2800) {
  // If a banner is already showing and its hide-timer is running,
  // cancel that timer first. Without this, rapid clicks would cause
  // the banner to disappear at unexpected times.
  if (bannerTimer) clearTimeout(bannerTimer);

  // Set the text the user will read inside the banner
  banner.textContent = message;

  // Reset ALL classes and apply the right ones in one go:
  //   "alert-banner" = base styles (width, font, border, etc.)
  //   type           = either "success" (green) or "error" (red)
  //   "show"         = overrides display:none and triggers the slide-in animation
  banner.className = `alert-banner ${type} show`;

  // After `duration` ms, start the fade-out sequence
  bannerTimer = setTimeout(() => {
    // Adding "fade-out" triggers the CSS opacity + translate animation (0.2s)
    banner.classList.add("fade-out");

    // Wait for that 0.2s animation to finish, then fully reset the banner
    // back to its original hidden state (no classes except the base one)
    setTimeout(() => {
      banner.className = "alert-banner"; // back to hidden, no "show" or type class
    }, 200);
  }, duration);
}

// ── Listen for a click on the Add button ──
addButtonEl.addEventListener("click", () => {
  // Read the input value and strip leading/trailing whitespace.
  // .trim() prevents adding a task that's just spaces.
  let addTaskContent = addTaskEl.value.trim();

  let taskObj = {
    'task': addTaskContent,
    'completed': false
  }
  

  if (addTaskContent.length !== 0) {
    // Valid input — save the task and update the UI

    addTaskToLocalStorage("task", taskObj); // Persist to localStorage
    addTaskEl.value = ""; // Clear the input field
    showBanner("✓ Task added!", "success"); // Show green success banner
    displayTask(); // Re-render the task list
  } else {
    // Empty input — show red error banner and put focus back in the field
    showBanner("Please enter a valid task.", "error");
    addTaskEl.focus(); // Moves the cursor back into the input so user can type immediately
  }
});

// ── addTaskToLocalStorage(task, newTask) ──
// Saves a new task string into localStorage under the key "task".
// localStorage only stores strings, so we use JSON to handle the array.
function addTaskToLocalStorage(task, newTask) {
  // Step 1: Read whatever is currently saved under this key (may be null if nothing saved yet)
  let existingData = localStorage.getItem(task);

  // Step 2: If data exists, parse the JSON string back into a JS array.
  //         If nothing is saved yet (null), start with an empty array.
  let dataArray = existingData ? JSON.parse(existingData) : [];
  
  // Step 3: Add the new task string to the end of the array
  dataArray.push(newTask);

  // Step 4: Convert the array back to a JSON string and save it.
  //         localStorage can only hold strings, not arrays/objects directly.
  localStorage.setItem(task, JSON.stringify(dataArray));
}

// ── displayTask() ──
// Reads all tasks from localStorage and renders them into the task container div.
function displayTask() {
  // Get the saved tasks array, or an empty array if nothing is saved yet.
  // JSON.parse turns the stored string back into a JS array.
  const localStorageCon = JSON.parse(localStorage.getItem("task")) || [];

  // Reverse a copy of the array so the newest task appears at the top.
  // We spread into a new array [...] first so we don't mutate the original.
  const tasks = [...localStorageCon].reverse();

  // Build an HTML string: each task becomes a <div class="taskItem">
  // .map() transforms each task string into an HTML snippet,
  // .join("") merges all snippets into one big string with no separator.
  taskConEl.innerHTML = tasks
    .map(
      (task) => `<div class="taskItem">${task.task}
                    <button type="submit" class="checkBoxBtn"><input type="checkbox" name="checkBox" id="checkBox"></button></div>
                    `,
    )
    .join("");
    
}

// ── Run displayTask on page load ──
// This ensures any tasks saved from a previous session are shown immediately
// when the page opens, before the user does anything.
displayTask();

function taskStatus(){
  const checkBtn = document.querySelectorAll(".checkBoxBtn")
  const  getTask = JSON.parse(localStorage.getItem('task')) 
  console.log(getTask["completed"]);
  
}

taskStatus()