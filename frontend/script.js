let tasks = [];
let editTaskId = null;

document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  const currentDate = document.getElementById('current-date');
  const taskListTitle = document.getElementById('task-list-title');

  // Date display
  const today = new Date();
  currentDate.textContent = today.toLocaleDateString();

  // Form submit
  taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const due_date = document.getElementById('due_date').value;
    const priority = document.getElementById('priority').value;
    const status = document.getElementById('status').value;

    if(editTaskId !== null) {
      // Update existing task
      const task = tasks.find(t => t.id === editTaskId);
      task.title = title;
      task.description = description;
      task.due_date = due_date;
      task.priority = priority;
      task.status = status;
      editTaskId = null;
    } else {
      // Add new task
      const task = {
        id: Date.now(),
        title,
        description,
        due_date,
        priority,
        status
      };
      tasks.push(task);
    }
    taskForm.reset();
    document.getElementById('task-id').value = '';
    showTasks('all');
  });

  // Show tasks function
  function showTasks(filter) {
    taskList.innerHTML = '';
    let filteredTasks = tasks;
    if(filter === 'pending') {
      filteredTasks = tasks.filter(task => task.status === 'pending');
      taskListTitle.textContent = "Pending Tasks";
    } else if(filter === 'completed') {
      filteredTasks = tasks.filter(task => task.status === 'completed');
      taskListTitle.textContent = "Completed Tasks";
    } else {
      taskListTitle.textContent = "All Tasks";
    }

    filteredTasks.forEach(task => {
      const taskEl = document.createElement('div');
      taskEl.className = 'task-item';
      taskEl.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Due: ${task.due_date}</p>
        <p>Priority: ${task.priority}</p>
        <p>Status: ${task.status}</p>
        <div class="task-actions">
          <button class="update" onclick="editTask(${task.id})">Update</button>
          <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
          <button class="toggle-status" onclick="toggleStatus(${task.id})">${task.status === 'pending' ? 'Complete' : 'Undo'}</button>
        </div>
      `;
      taskList.appendChild(taskEl);
    });
  }

  // Expose functions globally
  window.editTask = function(id) {
    const task = tasks.find(t => t.id === id);
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('due_date').value = task.due_date;
    document.getElementById('priority').value = task.priority;
    document.getElementById('status').value = task.status;
    document.getElementById('task-id').value = task.id;
    editTaskId = id;
  };

  window.deleteTask = function(id) {
    tasks = tasks.filter(task => task.id !== id);
    showTasks('all');
  };

  window.toggleStatus = function(id) {
    const task = tasks.find(t => t.id === id);
    task.status = task.status === 'pending' ? 'completed' : 'pending';
    showTasks('all');
  };

  // Sidebar buttons
  document.getElementById('all-tasks-btn').addEventListener('click', () => {
    setActiveButton('all-tasks-btn');
    showTasks('all');
  });
  document.getElementById('pending-tasks-btn').addEventListener('click', () => {
    setActiveButton('pending-tasks-btn');
    showTasks('pending');
  });
  document.getElementById('completed-tasks-btn').addEventListener('click', () => {
    setActiveButton('completed-tasks-btn');
    showTasks('completed');
  });

  function setActiveButton(id) {
    document.querySelectorAll('.sidebar ul li').forEach(btn => btn.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  // Initially show all tasks
  showTasks('all');
});
