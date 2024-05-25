// This script handles the task management and calendar
document.addEventListener('DOMContentLoaded', function () {
    let addTaskButton = document.querySelector('.app__button--add-task');
    let taskForm = document.querySelector('.app__form-add-task');
    let taskTextarea = taskForm.querySelector('textarea');
    let saveTaskButton = taskForm.querySelector('.app__form-footer__button--confirm');
    let cancelTaskButton = taskForm.querySelector('.app__form-footer__button--cancel');
    let deleteTaskButton = taskForm.querySelector('.app__form-footer__button--delete');
    let tasks = [];
    let inProgressTasks = [];
    let completedTasks = [];

    addTaskButton.addEventListener('click', function () {
        taskForm.style.display = 'block';
    });

    cancelTaskButton.addEventListener('click', function () {
        taskForm.style.display = 'none';
        taskTextarea.value = '';
    });

    saveTaskButton.addEventListener('click', function () {
        let taskText = taskTextarea.value.trim();
        if (taskText) {
            tasks.push(taskText);
            taskTextarea.value = '';
            taskForm.style.display = 'none';
            updateTaskLists();
        }
    });

    deleteTaskButton.addEventListener('click', function () {
        let taskText = taskTextarea.value.trim();
        tasks = tasks.filter(task => task !== taskText);
        inProgressTasks = inProgressTasks.filter(task => task !== taskText);
        completedTasks = completedTasks.filter(task => task !== taskText);
        taskTextarea.value = '';
        taskForm.style.display = 'none';
        updateTaskLists();
    });

    function updateTaskLists() {
        let toDoList = document.querySelector('#todo-list');
        let inProgressList = document.querySelector('#in-progress-list');
        let doneList = document.querySelector('#done-list');

        toDoList.innerHTML = '';
        inProgressList.innerHTML = '';
        doneList.innerHTML = '';

        tasks.forEach(function (task) {
            let taskItem = createTaskItem(task, 'todo');
            toDoList.appendChild(taskItem);
        });

        inProgressTasks.forEach(function (task) {
            let taskItem = createTaskItem(task, 'in-progress');
            inProgressList.appendChild(taskItem);
        });

        completedTasks.forEach(function (task) {
            let taskItem = createTaskItem(task, 'done');
            doneList.appendChild(taskItem);
        });
    }

    function createTaskItem(task, status) {
        let taskItem = document.createElement('li');
        taskItem.textContent = task;
        taskItem.className = 'app__section-task-list-item';
        taskItem.draggable = true;

        taskItem.addEventListener('dragstart', function () {
            taskItem.classList.add('dragging');
            taskItem.dataset.status = status;
        });

        taskItem.addEventListener('dragend', function () {
            taskItem.classList.remove('dragging');
        });

        return taskItem;
    }

    let kanbanColumns = document.querySelectorAll('.app__kanban-column');
    kanbanColumns.forEach(function (column) {
        column.addEventListener('dragover', function (event) {
            event.preventDefault();
            let draggingItem = document.querySelector('.dragging');
            if (draggingItem) {
                column.appendChild(draggingItem);
            }
        });

        column.addEventListener('drop', function (event) {
            let draggingItem = document.querySelector('.dragging');
            let fromStatus = draggingItem.dataset.status;
            let toStatus = column.dataset.status;

            if (fromStatus === 'todo') {
                tasks = tasks.filter(task => task !== draggingItem.textContent);
            } else if (fromStatus === 'in-progress') {
                inProgressTasks = inProgressTasks.filter(task => task !== draggingItem.textContent);
            } else if (fromStatus === 'done') {
                completedTasks = completedTasks.filter(task => task !== draggingItem.textContent);
            }

            if (toStatus === 'todo') {
                tasks.push(draggingItem.textContent);
            } else if (toStatus === 'in-progress') {
                inProgressTasks.push(draggingItem.textContent);
            } else if (toStatus === 'done') {
                completedTasks.push(draggingItem.textContent);
            }

            updateTaskLists();
        });
    });

    // Initialize task lists
    updateTaskLists();
});
