 let tasks = JSON.parse(localStorage.getItem('tasks')) || {};

        function addTask() {
            const taskInput = document.getElementById('new-task');
            const taskDate = document.getElementById('task-date').value;
            const taskText = taskInput.value.trim();

            if (!taskText || !taskDate) {
                alert("Por favor, insira uma tarefa e selecione uma data.");
                return;
            }

            if (!tasks[taskDate]) {
                tasks[taskDate] = { tasks: [], inProgress: [], completed: [] };
            }

            tasks[taskDate].tasks.push(taskText);
            taskInput.value = '';
            renderTasks(taskDate);

            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function renderTasks(date) {
            if (!tasks[date]) {
                tasks[date] = { tasks: [], inProgress: [], completed: [] };
            }

            const tasksUl = document.getElementById('tasks');
            const inProgressUl = document.getElementById('in-progress-tasks');
            const completedUl = document.getElementById('completed-tasks');

            tasksUl.innerHTML = '';
            inProgressUl.innerHTML = '';
            completedUl.innerHTML = '';

            tasks[date].tasks.forEach((task, index) => {
                const li = document.createElement('li');
                li.innerHTML = `${task} <button onclick="moveTask('${date}', ${index}, 'inProgress')">Iniciar</button>`;
                tasksUl.appendChild(li);
            });

            tasks[date].inProgress.forEach((task, index) => {
                const li = document.createElement('li');
                li.innerHTML = `${task} <button onclick="moveTask('${date}', ${index}, 'completed')">Concluir</button>`;
                inProgressUl.appendChild(li);
            });

            tasks[date].completed.forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `${task} <span>✔️</span>`;
                completedUl.appendChild(li);
            });
        }

        function moveTask(date, index, target) {
            if (target === 'inProgress') {
                const task = tasks[date].tasks.splice(index, 1)[0];
                tasks[date].inProgress.push(task);
            } else if (target === 'completed') {
                const task = tasks[date].inProgress.splice(index, 1)[0];
                tasks[date].completed.push(task);
            }
            renderTasks(date);

            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        document.getElementById('task-date').addEventListener('change', (e) => {
            renderTasks(e.target.value);
        });

        // Renderiza as tarefas ao carregar a página
        renderTasks(new Date().toISOString().split('T')[0]);