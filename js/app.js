// Variables del DOM
const taskForm = document.getElementById('taskForm');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const dueDateInput = document.getElementById('dueDate');
const confirmTitleInput = document.getElementById('confirmTitle');
const taskListContainer = document.getElementById('taskList');

// Almacenamiento local en memoria
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// VALIDACIONES DE FORMULARIO

// Función utilitaria para aplicar feedback visual
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

// Validar campo individual
const validateField = (input, ruleFn, errorMsg) => {
    const isValid = ruleFn(input.value);
    setFieldStatus(input, isValid ? '' : errorMsg, isValid);
    return isValid;
};

// Reglas específicas de validación
const rules = {
    isRequired: val => val.trim() !== '',
    hasMinLength: val => val.trim().length >= 5,
    isFutureDate: val => {
        if (!val) return false;
        const selected = new Date(val + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
    },
    matches: (val1, val2) => val1 === val2 && val1 !== ''
};

// Validar todo el formulario
const validateForm = () => {
    // (Título)
    const isTitleValid = validateField(titleInput, 
        val => rules.isRequired(val) && rules.hasMinLength(val), 
        'El título es requerido y debe tener al menos 5 caracteres.'
    );

    // (Descripción)
    const isDescValid = validateField(descriptionInput, 
        rules.isRequired, 
        'La descripción es de carácter obligatorio.'
    );

    // (Fecha)
    const isDateValid = validateField(dueDateInput, 
        rules.isFutureDate, 
        'Seleccione una fecha válida (hoy o posterior).'
    );

    // (Confirmación)
    const isConfirmValid = validateField(confirmTitleInput, 
        val => rules.matches(val, titleInput.value), 
        'El título de confirmación no coincide con el original.'
    );

    return isTitleValid && isDescValid && isDateValid && isConfirmValid;
};

// ESCUCHA DE EVENTOS

// Evento 1: 'input' para validación en tiempo real (Mejora la UX)
taskForm.addEventListener('input', (e) => {
    if (e.target.id === 'title' || e.target.id === 'confirmTitle') {
        validateField(titleInput, val => rules.isRequired(val) && rules.hasMinLength(val), 'Título no válido.');
        validateField(confirmTitleInput, val => rules.matches(val, titleInput.value), 'Los campos no coinciden.');
    }
});