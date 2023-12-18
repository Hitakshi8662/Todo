document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const allTasksBtn = document.getElementById("allTasksBtn");
    const completedTasksBtn = document.getElementById("completedTasksBtn");
    const uncompletedTasksBtn = document.getElementById("uncompletedTasksBtn");
    const taskContainer = document.getElementById("taskContainer");
    const voiceSearchBtn = document.getElementById("voiceSearchBtn");
    const addBtn = document.getElementById("addBtn");
    const tasks = loadTasksFromLocalStorage();
    searchBtn.addEventListener("click", function () {
        const searchTerm = searchInput.value.toLowerCase();
        filterTasks(searchTerm);
    });
    allTasksBtn.addEventListener("click", function () {
        showAllTasks();
    });

    completedTasksBtn.addEventListener("click", function () {
        showCompletedTasks();
    });

    uncompletedTasksBtn.addEventListener("click", function () {
        showUncompletedTasks();
    });

    addBtn.addEventListener("click", function () {
        const taskInput = document.getElementById("task");
        const taskTimeInput = document.getElementById("taskTime");
        const taskTypeInput = document.getElementById("taskType");
        const task = taskInput.value.trim();
        const taskTime = taskTimeInput.value.trim();
        const taskType = taskTypeInput.value;

        if (task !== "") {
            
            if (isFutureTime(taskTime)) {
                const newTask = { task, time: taskTime, type: taskType, completed: false };
                tasks.push(newTask);
                saveTasksToLocalStorage(tasks);
                updateTaskList();
                taskInput.value = "";
                taskTimeInput.value = "";
                taskTypeInput.value = "professional";
            } else {
                alert("Please enter a future time for the task.");
            }
        } else {
            alert("Please enter a valid task name.");
        }
    });

    voiceSearchBtn.addEventListener("click", function () {
        startVoiceRecognition();
    });

    function startVoiceRecognition() {
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.start();

            recognition.onresult = function (event) {
                const spokenText = event.results[0][0].transcript.toLowerCase();
                searchInput.value = spokenText;
                filterTasks(spokenText);
            };

            recognition.onerror = function (event) {
                console.error('Speech recognition error:', event.error);
            };
        } else {
            console.log('Web Speech API is not supported in this browser.');
        }
    }

    function filterTasks(searchTerm) {
        const filteredTasks = tasks.filter(task => task.task.toLowerCase().includes(searchTerm));
        updateTaskList(filteredTasks);
    }

    function showAllTasks() {
        updateTaskList(tasks);
    }

    function showCompletedTasks() {
        const completed = tasks.filter(task => task.completed);
        updateTaskList(completed);
    }

    function showUncompletedTasks() {
        const uncompleted = tasks.filter(task => !task.completed);
        updateTaskList(uncompleted);
    }

    function updateTaskList(taskList = tasks) {
        taskContainer.innerHTML = "";
        for (const task of taskList) {
            if (isFutureTime(task.time)) {
                const taskCard = createTaskCard(task);
                taskContainer.appendChild(taskCard);
            }
        }
    }

    function createTaskCard(task) {
        const card = document.createElement("div");
        card.classList.add("card");

        const content = document.createElement("div");
        content.classList.add("content");
        content.textContent = `${task.task}`;

        if (task.time) {
            const time = document.createElement("div");
            time.classList.add("time");
            time.textContent = `Time: ${task.time}`;
            content.appendChild(time);
        }

        const type = document.createElement("div");
        type.classList.add("type");
        type.textContent = `Type: ${task.type}`;
        content.appendChild(type);

        const btnContainer = document.createElement("div");
        btnContainer.classList.add("btns");

        const editBtn = document.createElement("button");
        editBtn.textContent = "✎";
        editBtn.addEventListener("click", function () {
            const editedTaskName = prompt("Edit task:", task.task);
            if (editedTaskName !== null) {
                task.task = editedTaskName;
                content.textContent = `${task.task}`;
                saveTasksToLocalStorage(tasks);
            }
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", function () {
            if (confirm("Are you sure you want to delete this task?")) {
                const index = tasks.indexOf(task);
                if (index !== -1) {
                    tasks.splice(index, 1);
                    saveTasksToLocalStorage(tasks);
                }
                updateTaskList();
            }
        });

       
        const completeBtn = document.createElement("button");
        completeBtn.classList.add("complete-btn");
        completeBtn.textContent = "✓";
        completeBtn.addEventListener("click", function (event) {
            event.stopPropagation(); 
            task.completed = !task.completed;
            if (task.completed) {
                card.classList.add("completed");
            } else {
                card.classList.remove("completed");
            }
        });

        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(deleteBtn);
        btnContainer.appendChild(completeBtn);

        card.appendChild(content);
        card.appendChild(btnContainer);

        return card;
    }

    function isFutureTime(time) {
        if (!time) return true;
        const taskTime = new Date(time).getTime();
        const currentTime = new Date().getTime();
        return taskTime > currentTime;
    }

    function saveTasksToLocalStorage(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasksJSON = localStorage.getItem("tasks");
        return tasksJSON ? JSON.parse(tasksJSON) : [];
    }

    

    updateTaskList();
    function displayDailyReminder() {
        alert("Don't forget your daily task!");
      }
      
      function getTimeUntilNextReminder() {
        const now = new Date();
        const desiredTime = new Date();
      
        desiredTime.setHours(18, 34, 0);
      
        let timeDifference = desiredTime - now;
      
        
        if (timeDifference < 0) {
          desiredTime.setDate(desiredTime.getDate() + 1);
          timeDifference = desiredTime - now;
        }
      
        return timeDifference;
      }
      
      function scheduleDailyReminder() {
        const timeUntilNextReminder = getTimeUntilNextReminder();
      
      
        setTimeout(displayDailyReminder, timeUntilNextReminder);
      }
      
      
      scheduleDailyReminder();
});
