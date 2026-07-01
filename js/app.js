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

            if (task.subject === 'Programación WEB') {
                card.style.borderLeftColor = '#00ABC1';
            } else if (task.subject === 'Cálculo Integral') {
                card.style.borderLeftColor = '#FF5A00';
            } else if (task.subject === 'Bases de Datos') {
                card.style.borderLeftColor = '#E6007E';
            } else {
                card.style.borderLeftColor = '#70a1ff'; 
            }

            const infoDiv = document.createElement('div');
            infoDiv.className = 'task-info';

            const titleNode = document.createElement('h3');
            titleNode.textContent = task.title;

            const subjectNode = document.createElement('strong');
            subjectNode.textContent = task.subject;
            
            if (task.subject === 'Programación WEB') {
                card.style.borderLeftColor = '#00ABC1';
            } else if (task.subject === 'Diseño de Bases de Datos') {
                card.style.borderLeftColor = '#E6007E';
            } else if (task.subject === 'Sistemas Operativos GNU/ Linux') {
                card.style.borderLeftColor = '#FF5A00';
            } else if (task.subject === 'Programación.NET') {
                card.style.borderLeftColor = '#70a1ff';
            } else {
                card.style.borderLeftColor = '#cbd5e1';
            }

            if (task.subject === 'Programación WEB') {
                subjectNode.style.backgroundColor = '#E0F7FA';
                subjectNode.style.color = '#00838F';
            } else if (task.subject === 'Diseño de Bases de Datos') {
                subjectNode.style.backgroundColor = '#FCE4EC';
                subjectNode.style.color = '#C2185B';
            } else if (task.subject === 'Sistemas Operativos GNU/ Linux') {
                subjectNode.style.backgroundColor = '#FFF3E0';
                subjectNode.style.color = '#E65100';
            } else if (task.subject === 'Programación.NET') {
                subjectNode.style.backgroundColor = '#E8EAF6';
                subjectNode.style.color = '#3F51B5';
            } else {
                subjectNode.style.backgroundColor = '#f1f5f9';
                subjectNode.style.color = '#64748b';
            }

            const descNode = document.createElement('p');
            descNode.textContent = task.description;

            const dateNode = document.createElement('small');
            dateNode.textContent = `Entrega: ${task.date}`;

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