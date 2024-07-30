"use strict";

//Variables y constantes 
const emailObj = 
{
	email:"",
	asunto: "",
	mensaje: ""
}

let btnSubmit;
let btnReset;
let inputEmail;
let inputSubject;
let inputCc;
let inputMessage;
let formulario;

//Funciones
const activateSpinner = ()=>
{
	const spinner = document.querySelector("#spinner");
	
	spinner.classList.remove("hidden");

	setTimeout(()=>
	{
		spinner.classList.add("hidden");
		resetForm();

		//Mensaje de emial enviado
		const alertSuccess = document.createElement("div");
		alertSuccess.textContent = "Email enviado..."
		alertSuccess.classList.add("alertSuccess");

		formulario.appendChild(alertSuccess);

		setTimeout(()=>
		{
			alertSuccess.remove();
		}, 3000);
	}, 3000);
}

const sendForm = (event)=>
{
	event.preventDefault();

	//Activación de spinner
	activateSpinner();

	console.log("Enviando form...");
}

const resetForm = ()=>
{
	//En caso de que el json de email tenga la llave cc, se elimina
	if(Object.keys(emailObj).includes("cc")) delete emailObj["cc"];
	emailObj["email"] = "";
	emailObj["asunto"] = "";
	emailObj["mensaje"] = "";

	checkValidation();

	formulario.reset();
}
//Comprobación de alerta
const removeAlertMessage = (reference)=>
{
	const alertMessageExist = reference.querySelector(".alertaError") || reference.querySelector(".alertaAdvertencia");
	if(alertMessageExist) alertMessageExist.remove();
}

//Mostrar mensaje alerta
const showAlertMessage = (message, type, reference)=>
{
	//Comprobar si existe una alerta actual
	removeAlertMessage(reference);

	//Creaciòn de alerta
	const alertMessage = document.createElement("div");
	alertMessage.textContent = message;

	//Condiciones para aplicación de Tailwind CSS
	if(type==="error") alertMessage.classList.add("alertaError");
	if(type==="errorEmail") alertMessage.classList.add("alertaAdvertencia");

	//Agregar alerta al DOM
	reference.appendChild(alertMessage);
}

//Validación de campos

//Validación de campo email, (callback function)
const validateEmailField = (email)=>
{
	//Expresión regular para validar email
	/* 
	    El correo ingresado se convierte a minúsculas, ya que 
	    la expresión regular no es sensible a minúsculas y 
		mayúsculas.
	*/
	const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
	const result = regex.test(email);
	return result;
}

//Comprobar la validación
const checkValidation = ()=>
{
	const valuesEmailObj = Object.values(emailObj).includes("");
	
	if(valuesEmailObj)
	{
		btnSubmit.disabled = true;
		btnSubmit.classList.add("opacity-50");
		btnSubmit.style.cursor = "default";
		return;
	}
	
	btnSubmit.disabled = false;
	btnSubmit.classList.remove("opacity-50");
	btnSubmit.style.cursor = "pointer"
}

const validateField = (event)=>
{
	//Id de campo actal:
	const fieldId = event.target.id;
	//Valor de campo actual:
	let fieldValue = event.target.value.trim();
	//Referencia al nodo padre del campo actual:
	const referenceDOM = event.target.parentElement;

	/* 
		El campo cc es opcional, por lo tanto
		si especificamos que si un campo está vacío y
		es diferente del campo cc, sí Mostrará la 
		alerta de error.
	*/
	
	//Validación del campo cc 
	if (fieldId === "cc" && fieldValue !== "") 
	{
		if (!validateEmailField(fieldValue))
		{
			showAlertMessage(`El email no es válido`, "errorEmail", referenceDOM);
			return;
		}

		//Se agrega la propiedad "cc" en emailObj si el email es válido
		else emailObj["cc"] = "";
	}
	else if (fieldId === "cc" && fieldValue === "") 
	{
		removeAlertMessage(referenceDOM);
		delete emailObj["cc"];
		checkValidation();
		return;
	}
	
	//Validación de campo email.
	if (fieldId === "email") 
	{
		//Conversión de minúsculas, en caso de que el correo tenga mayúsculas 
		fieldValue = fieldValue.toLowerCase();

		if (!validateEmailField(fieldValue)) 
		{
			showAlertMessage(`El email no es válido`, "errorEmail", referenceDOM);
			emailObj[fieldId] = "";
			//Comprobación de validación
			checkValidation();
			return;
		}
	}

	//Validación de campos
	//if (fieldValue === "" && fieldId !== "cc")
	if (fieldValue === "") 
	{
		//Mensaje de alerta de campo vacío
		showAlertMessage(`El campo ${fieldId} esta vacío`, "error", referenceDOM);
		emailObj[fieldId] = "";
		//Comprobación de validación
		checkValidation();
		return;
	}

	//Agregando valor actual a objeto de mensaje
	emailObj[fieldId] = fieldValue;

	//Comprobación de validación
	checkValidation();

	//Ocultar alerta si pasa comprobación de validación
	removeAlertMessage(referenceDOM);
}

//Inicializar eventListeners
const startWebApplication = ()=>
{
	btnSubmit = document.querySelector("#formulario button[type='submit']");
	btnReset = document.querySelector("#formulario button[type='reset']");
	
	//Campos
	inputEmail = document.querySelector("#email");
	inputSubject = document.querySelector("#asunto");
	inputCc = document.querySelector("#cc");
	inputMessage = document.querySelector("#mensaje");

	//Formulario
	formulario = document.querySelector("#formulario");

	//Validación de campos
	inputEmail.addEventListener("input", validateField);
	inputSubject.addEventListener("input", validateField);
	inputCc.addEventListener("input", validateField);
	inputMessage.addEventListener("input", validateField);

	//Resetear formulario
	btnReset.addEventListener("click", resetForm);

	//Enviar formulario
	btnSubmit.addEventListener("click", sendForm);
}

//Iniciar aplicación 
document.addEventListener("DOMContentLoaded", startWebApplication);