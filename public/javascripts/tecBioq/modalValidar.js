// Variable global para almacenar el ID de la orden actual
let ordenIdActual = null;

// Función para mostrar el modal personalizado
function mostrarModalValidar(ordenId) {
    console.log('Mostrando modal para orden:', ordenId);
    ordenIdActual = ordenId;
    
    const modal = document.getElementById('modalValidarPersonalizado');
    if (modal) {
        modal.style.display = 'block';
        
        // Enfocar el botón de confirmar para mejor accesibilidad
        setTimeout(() => {
            const btnConfirmar = document.getElementById('btnConfirmarValidar');
            if (btnConfirmar) {
                btnConfirmar.focus();
            }
        }, 100);
    }
}

// Función para cerrar el modal personalizado
function cerrarModalValidar() {
    console.log('Cerrando modal');
    const modal = document.getElementById('modalValidarPersonalizado');
    if (modal) {
        modal.style.display = 'none';
        ordenIdActual = null;
    }
}

// Función para confirmar la validación de una orden
function confirmarValidarOrden() {
    if (!ordenIdActual) {
        console.error('No hay orden ID disponible');
        return;
    }
    
    console.log('Confirmando validación para orden:', ordenIdActual);
    
    // Crear un formulario dinámicamente y enviarlo
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `http://localhost:3000/tecBioq/estadoOrden/${ordenIdActual}?_method=put`;
    
    // Agregar el campo _method para method-override
    const methodInput = document.createElement('input');
    methodInput.type = 'hidden';
    methodInput.name = '_method';
    methodInput.value = 'put';
    form.appendChild(methodInput);
    
    // Agregar el formulario al DOM y enviarlo
    document.body.appendChild(form);
    form.submit();
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Script de modal de validación cargado');
    
    // Cerrar modal al hacer clic fuera de él
    const modal = document.getElementById('modalValidarPersonalizado');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModalValidar();
            }
        });
    }
    
    // Cerrar modal con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cerrarModalValidar();
        }
    });
    
    // Agregar event listeners para debugging
    const botonesValidar = document.querySelectorAll('button[onclick^="mostrarModalValidar"]');
    botonesValidar.forEach(boton => {
        boton.addEventListener('click', function(e) {
            console.log('Botón de validar clickeado');
        });
    });
}); 