# 📝 Gestor de Tareas Universitarias (Task Planner)

## Objetivo del Proyecto
Aplicación Frontend interactiva diseñada para la organización y planificación de entregas académicas. Permite a los estudiantes registrar asignaciones con validaciones rigurosas en tiempo real y asegurar la persistencia de los datos de manera local.

## Requerimientos Cumplidos (Rúbrica Unidad III)
* **Estructura y Maqueta**: Separación estricta de responsabilidades (HTML5, CSS3, JS Vanilla). Diseño modular de dos columnas con adaptabilidad responsive para dispositivos móviles.

* **Interacción con el DOM y Eventos**: Implementación y escucha de 4 eventos nativos (`DOMContentLoaded`, `click`, `submit`, `input`). Inserción y remoción dinámica de elementos del árbol DOM (`createElement`, `appendChild`, `remove`) sin refrescar la página.

* **Formulario y Validaciones Sobresalientes**: Formulario de **5 campos configurados** (Título de la Tarea, Descripción, Ramo/Asignatura, Fecha de Entrega y Confirmar Título) evaluados bajo **5 reglas de validación personalizadas**:

  1. Campo obligatorio general.
  2. Longitud mínima de caracteres para títulos (mínimo 5).
  3. Selección obligatoria de asignatura de la lista desplegable.
  4. Restricción lógica de fechas (bloqueo de días pasados/exigencia de fechas futuras).
  5. Coincidencia exacta de campos (verificación de coincidencia de título).

* **Persistencia Local**: Gestión completa del estado y persistencia de datos mediante el uso nativo de la API `LocalStorage` para guardar, leer y eliminar registros.

* **Calidad de Código y Diseño UI**: Interfaz gráfica optimizada con **mapeo cromático dinámico**. Las tarjetas de tareas adaptan automáticamente el color de su borde izquierdo y de su píldora informativa según la asignatura seleccionada (Cian para Web, Magenta para Bases de Datos, Naranja para Sistemas Operativos). Testing completado con éxito en múltiples navegadores (Google Chrome, Microsoft Edge, Mozilla Firefox) manteniendo la consola (`DevTools`) completamente libre de advertencias o errores críticos.
