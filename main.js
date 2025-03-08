function comp(elemt) {
    // Find the closest parent element with class "todo-cont"
    let todocont = elemt.closest('.todo-cont');

    // Find the child element with class "task" within the parent
    let taskElement = todocont.querySelector('.task');

    let taskContainer = todocont.parentElement;
    // Check if the element with class "task" exists
    
    if (taskElement) {
        // Add the class "strike" to the element
        if (taskElement.classList.contains('strike')) {
            updateWaterLevel(-1);
            taskContainer.insertBefore(todocont, taskContainer.firstChild);
        } else{
            updateWaterLevel(1);
            taskContainer.appendChild(todocont); 
        }
        taskElement.classList.toggle('strike');
        
    } else {
        console.log('No element with class "task" found within the provided element.');
    }
}

d_hold = [];

function expand(elemt) {
    // Find the closest parent element with class "todo-cont"
    let todocont = elemt.closest('.todo-cont');
    todocont.querySelector('.dropdown').classList.toggle('flip');
    // Find the child element with class "task" within the parent
    let desc = todocont.querySelector('desc');
    if (!desc) {
        /*desc = document.createElement('desc');
        desc.textContent = "test"; // Set the task description
        todocont.appendChild(desc);*/
        desc = document.createElement('desc');
        const taskTitle = todocont.querySelector('.task').textContent;
        const taskData = d_hold.find(task => task.title === taskTitle);
        if (taskData) {
            desc.textContent = taskData.description; // Set the description
        } else {
            desc.textContent = "No description found."; // Fallback text
        }
        todocont.appendChild(desc);
    } else {
        desc.remove(); // Remove the description if it already exists
    }

}



function createTask(title, description) {
    // Create the parent container
    const todoContainer = document.createElement('div');
    todoContainer.classList.add('todo-cont');

    // Create the inner span for flex layout
    const innerSpan = document.createElement('span');
    innerSpan.style.display = 'flex';
    innerSpan.style.alignItems = 'center';

    // Create the dropdown button
    const dropdownButton = document.createElement('button');
    dropdownButton.classList.add('dropdown', 'flip');
    dropdownButton.innerHTML = '<span>^</span>';
    dropdownButton.setAttribute('onclick', 'expand(this)');

    // Create the task title element
    const taskTitle = document.createElement('p');
    taskTitle.classList.add('task');
    taskTitle.textContent = title; // Set the task title

    // Create the delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('c-btn');
    deleteButton.textContent = 'x'; // Set the button text
    deleteButton.setAttribute('onclick', 'comp(this)'); // Add the onclick event

    // Append elements to the inner span
    innerSpan.appendChild(dropdownButton);
    innerSpan.appendChild(taskTitle);
    innerSpan.appendChild(deleteButton);

    // Append the inner span to the container
    todoContainer.appendChild(innerSpan);

    // Return the created container
    return todoContainer;
}

function create(title, description) {
    // Create a new task
    let newTask = createTask(title, description);

    // Add the task data to the d_hold array
    d_hold.push({ title, description });
    saveLocalS();

    // Add the new task to the top of the task list
    document.getElementsByClassName('gentaskhold')[0].insertBefore(
        newTask,
        document.getElementsByClassName('gentaskhold')[0].firstChild
    );
}
function screate(){
    let input = document.getElementById('taskinput');
    let desc = document.getElementById('descinput');
    document.getElementById('createtask').remove();
    create(input.value, desc.value);
}
function createNew() {
    console.log("createnew");
    const todoContainer = document.createElement('div');
    todoContainer.setAttribute('id', 'createtask');
    todoContainer.classList.add('todo-cont');

    const innerSpan = document.createElement('span');
    innerSpan.style.display = 'flex';
    innerSpan.style.alignItems = 'center';

    const dropdownButton = document.createElement('button');
    dropdownButton.classList.add('dropdown', 'flip');
    dropdownButton.innerHTML = '<span>^</span>';

    dropdownButton.setAttribute('onclick', `
    try {
        document.getElementById('descinput').remove();
        document.getElementById('dateinput').remove();
    } catch (e) {
        let todocont = this.closest('.todo-cont');
        let i = document.createElement('input');
        i.setAttribute('id', 'descinput');
        let d = document.createElement('input');
        d.setAttribute('id', 'dateinput');
        d.setAttribute('type', 'date');
        todocont.appendChild(i);
        todocont.appendChild(d);
    }`);
    dropdownButton.setAttribute('aria-label', 'Expand task details');

    const taskTitle = document.createElement('input');
    taskTitle.setAttribute('id', 'taskinput');
    taskTitle.setAttribute('placeholder', 'Enter task title');

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('c-btn');
    deleteButton.textContent = 'add';
    deleteButton.setAttribute('onclick', 'screate(this)');
    deleteButton.setAttribute('aria-label', 'Add task');

    innerSpan.appendChild(dropdownButton);
    innerSpan.appendChild(taskTitle);
    innerSpan.appendChild(deleteButton);

    todoContainer.appendChild(innerSpan);

    // Add the new task to the top of the task list
    document.getElementsByClassName('gentaskhold')[0].insertBefore(
        todoContainer,
        document.getElementsByClassName('gentaskhold')[0].firstChild
    );
}

let waterLevel = 0;

function updateWaterLevel(by) {
    let tofill = document.getElementsByClassName('todo-cont').length;
    waterLevel += by;
    const waterElement = document.getElementById('water');
    document.getElementById('ccounter').innerHTML = `${waterLevel}/${tofill}`;
    console.log(`${(waterLevel / tofill) * 100}%`, waterLevel, tofill);
    waterElement.style.height = `${(waterLevel / tofill) * 100}%`;
}
function remove() {
    // Add a single event listener to the document
    document.addEventListener('click', function handleClick(e) {
        // Check if the clicked element has the class 'c-btn'
        if (e.target && e.target.matches('.delbtn')) {
            updateWaterLevel(-1); // Update the water level
            console.log("remove")
            document.removeEventListener('click', remove);
        }
        if (e.target && e.target.matches('.c-btn')) {
            updateWaterLevel(-1); // Update the water level
            // Find the closest parent element with the class 'todo-cont'
            const taskContainer = e.target.closest('.todo-cont');
            e.target.closest('.task').textContent;
            const taskData = d_hold.find(task => task.title === e.target.closest('.task').textContent);
            const index = d_hold.indexOf(taskData);
            d_hold.splice(index, 1);
            saveLocalS();
            if (taskContainer) {
                taskContainer.remove(); // Remove the task container
                document.removeEventListener('click', remove);
            } else {
                console.warn('Task container not found.'); // Handle missing container
            }
        }

    });
}

function saveLocalS(){
    localStorage.setItem('tasks', JSON.stringify(d_hold)); //add completion status
}
function loadLocalS(){
    d_hold = JSON.parse(localStorage.getItem('tasks'));
    d_hold.forEach(task => {
        create(task.title, task.description);
    });
    updateWaterLevel(0);
}
function saveLocalF(){

}
/*function remove(){
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('c-btn')) {
            e.target.parentElement.parentElement.remove();
        }
    }
    );
}*/
/*function openCreateMenu() {
    let cbtn = document.getElementById("createbtn");
    cbtn.classList.add("createmenu");
    cbtn.classList.add("create-btn");
    cbtn.innerHTML = "<input></input>";
    
    //create('test', 'test')
}*/
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
function showinfo(){
    let maindiv = document.createElement('div');
    maindiv.setAttribute('id', 'info');
    maindiv.classList.add('info');
    let p = document.createElement('p');
    let np = document.createElement('p');
    let line = document.createElement('hr');
    let img = document.createElement('img');
    let close = document.createElement('button');
    close.textContent = 'close';
    close.setAttribute('onclick', 'document.getElementById("info").remove()');
    p.textContent = "This is a pretty simple todo app. Not much more than that.";
    np.textContent = "to the best dog ever, love you buddy, and to my grandma, i'll always miss you. This project is dedicated to you. <3";
    img.setAttribute('src', `assets/foster/${getRandomIntInclusive(1, 8)}.jpeg`) //<img src="assets/foster/1.jpeg" height="200vh"></img>
    img.setAttribute('height', '200vh');
    maindiv.appendChild(p);
    maindiv.appendChild(line);
    maindiv.appendChild(np);
    maindiv.appendChild(img);
    maindiv.appendChild(close);
    document.body.appendChild(maindiv);
}