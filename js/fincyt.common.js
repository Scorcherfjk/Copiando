function mostrarAjaxLoader() {
	$('#ajax_loader').show();
}

function ocultarAjaxLoader() {
	$('#ajax_loader').hide();
}

function bloquearPagina() {
	$('#div-bloqueo-pantalla').show();
	mostrarAjaxLoader();
}

function desbloquearPagina() {
	$('#div-bloqueo-pantalla').hide();
	ocultarAjaxLoader();
}

function adicionarMensajeWarningTopPantalla(options) {
	var defaultOptions = {
		text: 'Texto',
		onClose: function(){}
	};
	
	options = $.extend(defaultOptions, options);
	
//	console.debug("adicionarMensajeWarningTopPantalla");
	var divPadre = $(document.createElement("div")).addClass("mensaje-top-pantalla ui-state-highlight ui-corner-all")
	var divHijo = $(document.createElement("div"));
	$(document.createElement("span"))
		.addClass("icono-izquierda ui-icon ui-icon-alert")
		.appendTo(divHijo);
	$(document.createElement("span"))
		.addClass("texto-mensaje")
		.html(options.text)
		.appendTo(divHijo);
	$(document.createElement("span"))
		.addClass("icono-derecha ui-icon ui-icon-close")
		.click(function() {
			$(this).parents('div.mensaje-top-pantalla:first')
				.fadeOut(600, function() {
					$(this).remove();
					options.onClose();
				});	
			})
		.appendTo(divHijo);
	divPadre.append(divHijo).appendTo("body");
}

function redirectSeguridad() {
	window.location.href = "/com-fincyt-seguridad-web/";
}

/* Establece un objeto en el SessionStorage */
function setSessionStorage(key, value) {
	if (window.sessionStorage){
		sessionStorage[key] = JSON.stringify(value);
	}	
}

/* Lee un objeto del SessionStorage */
function getSessionStorage(key) {
	var resultado = null;
	if (window.sessionStorage){
		var valor = sessionStorage[key];
		if (valor != null && valor != "") {
			resultado = JSON.parse(valor);
		}
	}
	return resultado;
}

$.fn.deshabilitarBoton = function() {
//	console.debug('deshabilitarBoton');
	this.button("option", "disabled", true);
	return this;
}

$.fn.habilitarBoton = function() {
//	console.debug('habilitarBoton');
	this.button("option", "disabled", false);
	return this;
}

$.validator.addMethod("validacionDiferente", function(value, element, param) {
	if(value.length > 0){
		return value != param.val();
	}
	return true;
});

/**
 * Valida que la longitud del DNI sea de 8 dígitos.
 * params es un objeto con los siguientes atributos:
 * 		campoTipoDocumento: Select de tipo de documento para validar el tipo de documento seleccionado
 * 		tipoDocumentoDni: Par�metro del sistema con el valor del tipo de documento DNI
 */
$.validator.addMethod("validacionDni", function(value, element, params) {
//	console.debug("validacionDni. params: ");
//	console.dir(params);
	var valorTipoDocumento = $(params.campoTipoDocumento).val();
//	console.debug("Valor Tipo Documento: " + valorTipoDocumento);
	if (valorTipoDocumento == params.tipoDocumentoDni) {
		return value.length == 8;
	} else {
		return true;
	}
});

$.validator.addMethod('validacionRangoFechas', function(value, element, param) {
	var separador = "/"; 
	var fechaSeparada = param.val().split(separador);
    var startDate = new Date(fechaSeparada[2], fechaSeparada[1]-1, fechaSeparada[0]);
    
    fechaSeparada = value.split(separador);
    var endDate = new Date(fechaSeparada[2], fechaSeparada[1]-1, fechaSeparada[0]);
    
    if(value.length > 0){
//    	Retorna true si la validacion es correcta
		return endDate > startDate;
	}
	return true;

});

$.validator.addMethod('validacionRangoFechasHitos', function(value, element, param) {
	var separador = "/"; 
	var fechaSeparada = param.val().split(separador);
    var startDate = new Date(fechaSeparada[2], fechaSeparada[1]-1, fechaSeparada[0]);
    
    fechaSeparada = value.split(separador);
    var endDate = new Date(fechaSeparada[2], fechaSeparada[1]-1, fechaSeparada[0]);
    
    if(value.length > 0){
//    	Retorna true si la validacion es correcta
		return endDate > startDate;
	}
	return true;

});

$.validator.addMethod('validacionTamanoArchivo', function(value, element, param) {
//	El parametro llega en Megabytes. Se debe hacer la conversion a bytes
	var tamMaxBytes = param * 1024 * 1024;
	if(value.length > 0){
		return element.files[0].size < tamMaxBytes;
	}	
	return true;
});

$.validator.addMethod("extensionArchivo", function(value, element, param) {
	param = typeof param === "string" ? param.replace(/,/g, "|") : "png|jpe?g|gif";
	return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
});

$.validator.addMethod("validacionFechaPersonalizado", function(value, element, param) {
	 var validDate = /^(\d{2})\/(\d{2})\/(\d{4})?$/;    
     return validDate.test(value);
});

$.validator.addMethod("validacionEmail", function(value, element, param) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
}, $.validator.messages.email);

//Seccion para los mensajes de los metodos customizados.
$.validator.messages.validacionDiferente="Debe ser diferente al correo principal";
$.validator.messages.validacionRangoFechas="La fecha Hasta debe ser mayor a la fecha Desde";
$.validator.messages.validacionRangoFechasHitos="La fecha de Finalizaci&oacute;n debe ser mayor a la fecha Inicio";
$.validator.messages.validacionTamanoArchivo="El tama&ntilde;o m&aacute;ximo de archivo es {0} Mb";
$.validator.messages.extensionArchivo="La extensi&oacute;n del archivo debe ser {0}";
$.validator.messages.validacionDni="La longitud del tipo de documento DNI debe ser de 8 d\u00edgitos";
$.validator.messages.validacionFechaPersonalizado="Por favor, escribe una fecha v&aacute;lida";

/**
 * Implementación estandar de Jquery Real Person
 */
$.fn.captcha = function(label) {
	this.realperson({
		chars: $.realperson.alphanumeric, 
		length: 5,
		regenerate: label
	});
	return this;
}