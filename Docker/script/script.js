// Expresiones regulares para validación de nombre y correo electrónico
let validNameRegex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ]+$/;
let validEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

// Función para validar correo electrónico
let validateEmail = (email) => {
  return validEmailRegex.test(email);
};

// Función para validar nombre
let validateName = (name) => {
  // Utiliza la expresión regular para verificar que el campo de nombre no contenga solo espacios
  return validNameRegex.test(name) && name.trim() !== '';
};

// Función para validar todos los campos del formulario
let validateFields = () => {
  const camposDeEntrada = [nombre, surname, email, cantidad];
  let hasError = false;

  camposDeEntrada.forEach(input => {
    input.style.borderColor = "";

    if (input === cantidad) {
      if (input.value.trim() === '' || parseFloat(input.value) <= 0) {
        // Verifica que la cantidad no esté vacía y sea mayor que cero
        input.style.borderColor = "red";
        hasError = true;
      } else {
        input.style.borderColor = "green"; // Campo válido, color verde
      }
    } else if (input === email) {
      if (!validateEmail(input.value)) {
        // Verifica que el correo electrónico cumpla con la expresión regular
        input.style.borderColor = "red";
        hasError = true;
      } else {
        input.style.borderColor = "green"; // Campo válido, color verde
      }
    } else {
      if (!validateName(input.value)) {
        // Verifica que el nombre cumpla con la expresión regular y no contenga solo espacios
        input.style.borderColor = "red";
        hasError = true;
      } else {
        input.style.borderColor = "green"; // Campo válido, color verde
      }
    }
  });

  return !hasError;
};

// Selecciona elementos del DOM
let select = document.querySelector("#select");
let divTotal = document.querySelector(".total");
let cantidad = document.querySelector(".cantidad");
let nombre = document.querySelector(".name");
let surname = document.querySelector(".surname");
let email = document.querySelector(".email");
let resume = document.querySelector(".resume");

// Función para calcular el total a pagar
let total = (cantidad, categoria, div) => {
  if (categoria === "1") {
    div.textContent = `Total a pagar: $ ${200 * cantidad * 0.2}`;
  }

  if (categoria === "2") {
    div.textContent = `Total a pagar: $ ${200 * cantidad * 0.5}`;
  }

  if (categoria === "3") {
    div.textContent = `Total a pagar: $ ${200 * cantidad * 0.85}`;
  }
};

// Manejador de evento para el botón de Resumen
resume.addEventListener("click", (e) => {
  e.preventDefault();

  if (validateFields()) {
    // Si todos los campos son válidos, muestra un mensaje de éxito
    Swal.fire({
      icon: "success",
      title: "Gracias por realizar tu compra",
      html: `<p>${nombre.value} ${surname.value}</p>
      <p>Hemos enviado la información a: ${email.value}</p>
      <p>${divTotal.textContent}</p>`,
      confirmButtonText: "Continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí puedes realizar otras acciones después de completar el proceso
      }
    });
  } else {
    // Si hay errores de validación, muestra un mensaje de error
    Swal.fire({
      icon: "error",
      title: "Por favor, complete todos los campos obligatorios correctamente",
    });
  }
});

// Manejador de evento para el selector de categoría
select.addEventListener("change", (e) => {
  if (e.target.value === "Seleccione categoria") {
    divTotal.textContent = "Total a pagar: $";
  }
  total(cantidad.value, select.value, divTotal);
});

// Manejador de evento para la entrada de cantidad
cantidad.addEventListener("input", (e) => {
  total(cantidad.value, select.value, divTotal);
});

// Manejador de evento para el botón de Borrar para restablecer los estilos
const botonBorrar = document.querySelector('input[type="reset"]');
botonBorrar.addEventListener("click", function() {
  const camposDeEntrada = [nombre, surname, email, cantidad];
  camposDeEntrada.forEach(function(input) {
    input.style.borderColor = ""; // Restablece el color de borde a su estado inicial
  });

});