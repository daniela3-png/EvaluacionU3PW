document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SELECCIÓN DE ELEMENTOS DEL DOM ---
    const taskForm = document.getElementById('taskForm');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const subjectSelect = document.getElementById('subject'); // <- NUEVO
    const dueDateInput = document.getElementById('dueDate');
    const confirmTitleInput = document.getElementById('confirmTitle');
    const taskListContainer = document.getElementById('taskList');

    // ESTADO DE LA APLICACIÓN
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // REGLAS Y FUNCIONES DE VALIDACIÓN
    const setFieldStatus = (input, message, isSuccess) => {
        const formGroup = input.parentElement;
        const errorSpan = formGroup.querySelector('.error-message');
        
        if (isSuccess) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
            errorSpan.textContent = '';
        } else {
            formGroup.classList.remove('success');
            formGroup.classList.add('error');
            errorSpan.textContent = message;
        }
    };

    const validationRules = {
        isRequired: val => val.trim() !== '',
        hasMinLength: val => val.trim().length >= 5,
        isFutureDate: val => {
            if (!val) return false;
            const selectedDate = new Date(val + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        },
        matches: (val1, val2) => val1 === val2 && val1 !== ''
    };

    const validateForm = () => {
        const isTitleValid = validationRules.isRequired(titleInput.value) && validationRules.hasMinLength(titleInput.value);
        setFieldStatus(titleInput, isTitleValid ? '' : 'El título es obligatorio (mínimo 5 caracteres).', isTitleValid);

        const isDescValid = validationRules.isRequired(descriptionInput.value);
        setFieldStatus(descriptionInput, isDescValid ? '' : 'La descripción de la tarea es obligatoria.', isDescValid);

        const isSubjectValid = validationRules.isRequired(subjectSelect.value);
        setFieldStatus(subjectSelect, isSubjectValid ? '' : 'Por favor, seleccione una asignatura.', isSubjectValid);

        const isDateValid = validationRules.isFutureDate(dueDateInput.value);
        setFieldStatus(dueDateInput, isDateValid ? '' : 'Seleccione una fecha de entrega válida (hoy o futura).', isDateValid);

        const isConfirmValid = validationRules.matches(confirmTitleInput.value, titleInput.value);
        setFieldStatus(confirmTitleInput, isConfirmValid ? '' : 'El título de confirmación no coincide.', isConfirmValid);

        return isTitleValid && isDescValid && isSubjectValid && isDateValid && isConfirmValid;
    };

    // MANIPULACIÓN DINÁMICA DEL DOM
    const renderTasks = () => {
        taskListContainer.innerHTML = '';

        if (tasks.length === 0) {
            taskListContainer.innerHTML = '<p style="color: #888; text-align: center; grid-column: 1/-1;">No tienes tareas universitarias pendientes.</p>';
            return;
        }

        tasks.forEach(task => {
            const card = document.createElement('div');
            card.className = 'task-card';
            card.setAttribute('data-id', task.id);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'task-info';

            const titleNode = document.createElement('h3');
            titleNode.textContent = task.title;

            // NUEVO: Mostrar la asignatura en la tarjeta con un estilo destacado
            const subjectNode = document.createElement('p');
            subjectNode.innerHTML = `<strong>${task.subject}</strong>`;
            subjectNode.style.color = 'var(--primary)';
            subjectNode.style.fontSize = '13px';
            subjectNode.style.marginBottom = '4px';

            const descNode = document.createElement('p');
            descNode.textContent = task.description;

            const dateNode = document.createElement('small');
            dateNode.textContent = `Entrega: ${task.date}`;

            // Insertamos el nodo de la asignatura en la interfaz
            infoDiv.append(titleNode, subjectNode, descNode, dateNode);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Eliminar';

            card.append(infoDiv, deleteBtn);
            taskListContainer.appendChild(card);
        });
    };

    const saveToLocalStorage = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // GESTIÓN DE EVENTOS
    taskForm.addEventListener('input', (e) => {
        if (e.target.id === 'title' || e.target.id === 'confirmTitle') {
            const isTitleOk = validationRules.isRequired(titleInput.value) && validationRules.hasMinLength(titleInput.value);
            setFieldStatus(titleInput, isTitleOk ? '' : 'Título inválido (mínimo 5 caracteres).', isTitleOk);
            
            const isMatchOk = validationRules.matches(confirmTitleInput.value, titleInput.value);
            setFieldStatus(confirmTitleInput, isMatchOk ? '' : 'Los campos de título no coinciden.', isMatchOk);
        }
        // Evento complementario para el select
        if (e.target.id === 'subject') {
            const isSubjOk = validationRules.isRequired(subjectSelect.value);
            setFieldStatus(subjectSelect, isSubjOk ? '' : 'Seleccione una asignatura.', isSubjOk);
        }
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        if (validateForm()) {
            const newTask = {
                id: Date.now().toString(),
                title: titleInput.value.trim(),
                subject: subjectSelect.value, // <- GUARDAMOS LA MATERIA
                description: descriptionInput.value.trim(),
                date: dueDateInput.value
            };

            tasks.push(newTask);
            saveToLocalStorage();
            renderTasks();

            taskForm.reset();
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('success');
            });
        }
    });

    taskListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const cardElement = e.target.closest('.task-card');
            const taskId = cardElement.getAttribute('data-id');
            tasks = tasks.filter(task => task.id !== taskId);
            saveToLocalStorage();
            renderTasks();
        }
    });

    renderTasks();
});