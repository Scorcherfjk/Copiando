var _sistema = "Innóvate Perú";
var _formatoMoneda = "#,##0.##";
var _formatoEntero = "#,##0";
var _panelProcesandoTodo = '#contenido';
var _panelProcesando = _panelProcesandoTodo;
var _formatoFecha = 'dd/mm/yyyy';

/* Funciones utilitarias para CPV */
function mostrarErrorInesperado() {
	$.alerts.alert("Ocurrió un error inesperado. Por favor comuníquese con el administrador del sistema.", _sistema);
}
/* Funciones utilitarias para CPV */
function mostrarMensaje(mensaje, callback) {
	var mensajes = mensaje.split("\n");
	if (mensajes.length > 15) {
		mensajes.length = 15;
		mensaje = mensajes.join("\n") + "...";
	}
	$.alerts.alert(mensaje, _sistema, callback);
}
/* Funciones utilitarias para CPV */
function mostrarMensajeInfo(mensaje, callback) {
	$.alerts.alertInfo(mensaje, _sistema, callback);
}
/* Funciones utilitarias para CPV */
function mostrarMensajeConfirmacion(mensaje, callback) {
	jConfirm(mensaje, _sistema, callback);
}
/* Funciones utilitarias para CPV */
function mostrarMensajeConfirmacionOk(mensaje, callback) {
    jConfirm(mensaje, _sistema, function (confirm) {
        if (confirm) {
            callback();
        }
    });
}
/* Funciones utilitarias para CPV */
function mostrarMensajeVerificarDatos(mensaje, callback) {
    $.alerts.alert("Por favor verifique los datos: \n" + mensaje, _sistema, callback);
}
/* Da formato a la url para hacer el llamado ajax */
function formatForm(strValor) {
	if (strValor.indexOf('?') != -1) {
		strValor = strValor.substring(0, strValor.indexOf('?'));
	}
	return strValor;
};

// Configura el control de calendario con el formato
function configurarCalendario() {
	var listCalendario = {
			closeText : 'Cerrar',
			prevText : '&#x3c;Ant',
			nextText : 'Sig&#x3e;',
			currentText : 'Hoy',
			monthNames : [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
					'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre',
					'Diciembre' ],
			monthNamesShort : [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
					'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre',
					'Noviembre', 'Diciembre' ],
			dayNames : [ 'Domingo', 'Lunes', 'Martes', 'Mi&eacute;rcoles',
					'Jueves', 'Viernes', 'S&aacute;bado' ],
			dayNamesShort : [ 'Dom', 'Lun', 'Mar', 'Mi&eacute;', 'Juv', 'Vie',
					'S&aacute;b' ],
			dayNamesMin : [ 'Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'S&aacute;' ],
			weekHeader : 'Sm',
			dateFormat : 'dd/mm/yy',
			firstDay : 1,
			isRTL : false,
			showMonthAfterYear : false,
			yearSuffix : ''
		};
	$.datepicker.regional['es'] = listCalendario;
	$.datepicker.setDefaults($.datepicker.regional['es']);
	
	agregarValidadorFormatoFecha();
	asignarDatePicker('.fecha');
}

/* Asigna el estilo de fecha al control de texto . */
function asignarDatePicker(control) {
	$(control).datepicker({
		changeMonth : true,
		changeYear : true
	});
	$(control).mask("99/99/9999");
}

/* Convierte la fecha a una cadena con formato. */
function convertDateToStringFormato(fecha, formato) {
    if (fecha == null) { return ""; }
    if (typeof fecha == "string") {
    	return dateFormat(fecha.replace(new RegExp('-', 'g'), '/'), formato);
    } else {
    	return dateFormat(fecha, formato);
    }
}

/* Convierte la fecha a una cadena que se asigna al control. */
function convertDateToStringFechaHora(fecha) {
    return convertDateToStringFormato(fecha, _formatoFecha + " h:MM:ss TT");
}

/* Convierte la fecha a una cadena que se asigna al control. */
function convertDateToString(fecha) {
    return convertDateToStringFormato(fecha, _formatoFecha);
}

/* Convierte el texto ingresado por el usuario a formato Date de javascript. */
function convertStringToDate(date) {
	if (date == null || date == "") {
		return null;	//Internet explorer no regresa bien las fechas vacías.  Este código soluciona el problema.
	}
	var elem = date.split('/');
	var d, m, y;
	d = elem[0];
	m = elem[1];
	y = elem[2];
	var resultado = new Date(y, m - 1, d, 0, 0, 0, 0);
	return resultado;
}

/* Indica si el texto recibido es una fecha válida */
function esFechaValida(value) {
	if (value == null || value == "") {
		return true;
	}
	var fecha = convertStringToDate(value);
	var textoFechaConvertido = dateFormat(fecha, _formatoFecha);
	return textoFechaConvertido == value;
}

/* Agrega la función para validar el formato de fecha */
function agregarValidadorFormatoFecha() {
	jQuery.validator.addMethod("fecha", function(value, element, param) {
		 if (value == "__/__/____") {
			 return true;
		 } else {
			 return esFechaValida(value);
		 }
	});
}

/*
 * Debido a que el formato numérico agrega caracteres, la longitud final puede
 * llegar a se superior a la permitida para el control. Si esto ocurre, la
 * función borra el contenido del control.
 */
function verificarLongitudMaxima(control) {
	if ($(control).val().length > control.maxLength) {
		mostrarMensaje("El texto es demasiado largo");
		$(control).val("");
	}
}

// Regresa el valor del control. Si el control no existe (está oculto) regresa
// cadena vacía.
function leerTexto(nombre) {
	var control = $(nombre);
	var resultado = "";
	if (control != null) {
		resultado = control.val();
	    if (resultado == control.attr("'placeholder'")) {
	    	resultado = "";
	    }		
	}
	return resultado;
}

//Regresa el valor del control. Si el control no existe (está oculto) regresa
//cadena vacía.
function leerCheck(nombre) {
	return $(nombre).is(':checked');
}

//Regresa el valor del control. Si el control no existe regresa null.
function leerFecha(nombre) {
	return convertStringToDate(leerTexto(nombre));
}

/*
 * Regresa un número a partir del contenido del texto. Si está vacío regresa
 * null.
 */
function leerNumero(control) {
    return convertStringToNumber($(control).val());
}
/*
 * Regresa un número a partir del contenido del texto. Si está vacío regresa
 * null.
 */
function leerNumeroDesdeTexto(control) {
    return convertStringToNumber($(control).text());
}

/*
 * Regresa un número a partir del contenido del texto. Si está vacío regresa
 * null.
 */
function convertStringToNumber(texto) {
	if (isEmpty(texto)) {
		return null;
	}
	var sinTokens = texto.replace("\$", "");
	sinTokens = sinTokens.replace(/,/g, "");
	if (isEmpty(sinTokens)) {
		return null;
	} else {
		return parseFloat(sinTokens);
	}
}
/*
 * Regresa un número a partir del contenido del texto. Si está vacío regresa
 * cero.
 */
function leerNumeroCeroSiVacio(control) {
	if ($(control).val() == "") {
		return 0;
	}
	var resultado = $(control).parseNumber({
		format : _formatoMoneda,
		locale : "us"
	}, false);
	return resultado;
}

function formatoMonedaAplicar() {
	if (leerNumero(this) == null) {
		//No hace nada cuando recibe null porque el formato lo como cero
		$(this).val("");
		return;
	}
	$(this).parseNumber({
		format : _formatoMoneda,
		locale : "us"
	});
	$(this).formatNumber({
		format : _formatoMoneda,
		locale : "us"
	});
	verificarLongitudMaxima(this);
}

/* Regresa true si se trata de un caracter especial como backspace */
function esCaracterEspecial(event)
{
    var whichCode = !event.charCode ? event.which : event.charCode;

    if(whichCode == 0) return true;
    if(whichCode == 8) return true;
    if(whichCode == 9) return true;
    if(whichCode == 13) return true;
    if(whichCode == 16) return true;
    if(whichCode == 17) return true;
    if(whichCode == 27) return true;
    return false;
}


/* Formato Moneda */
function formatoMoneda(control) {
	limitarCaracteres(control, "^[0-9\,\.]+$");
	$(control).blur(formatoMonedaAplicar);
	$(control).blur();
}

/* Da el formato de moneda a un número */
function monedaAString(valor) {
	if (valor == null) {
		return "";
	}
	return '$' + $.formatNumber(valor, {
		format : _formatoMoneda,
		locale : "us"
	});
}

function formatoEnteroAplicar() {
	if (leerNumero(this) == null) {
		//No hace nada cuando recibe null porque el formato lo como cero
		$(this).val("");
		return;
	}
	$(this).parseNumber({
		format : _formatoEntero,
		locale : "us"
	});
	$(this).formatNumber({
		format : _formatoEntero,
		locale : "us"
	});
	verificarLongitudMaxima(this);
}

/* Únicamente permite digitar los caracteres que cumplan la expresión regular */
function limitarCaracteres(control, expresion) {
	$(control).bind('keypress', function (event) {
	    var regex = new RegExp(expresion);
	    if (esCaracterEspecial(event)) {
	    	return true;
	    }
	    else {
		    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
		    if (!regex.test(key)) {
		       event.preventDefault();
		       return false;
		    }
		}
	});		
}

/* Formato Entero */
function formatoEntero(control) {
	limitarCaracteres(control, "^[0-9\,]+$");
	$(control).blur(formatoEnteroAplicar);
	$(control).blur();
}

/* Permite digitar únicamente números en el texto */
function soloNumeros(control) {
	limitarCaracteres(control, "^[0-9]+$");
}

/* Permite digitar únicamente letras en el texto */
function soloLetras(control) {
	limitarCaracteres(control, "^[ a-zA-Z]+$");
}

/* Da el formato entero a un número */
function numeroAString(valor) {
	if (valor == null) {
		return "";
	}
	return $.formatNumber(valor, {
		format : _formatoEntero,
		locale : "us"
	});
}

/* Muestra un mensaje Sí / No */
function booleanAString(valor) {
	if (valor == null) {
		return "";
	}
	return valor ? "Sí" : "No";
}

/* Muestra un enlace */
function urlAString(url, texto) {
	if (url == null || url == "") {
		return "";
	}
	return '<a href="' + url + "'>" + texto + "</a>";
}

/* Remplaza los fin de línea por br */
function remplazarFinLinea(texto) {
	if (texto == null) {
		return "";
	}
	return texto.replace("\n", "<br />");
}

/* Regresa la clase CSS para ocultar campos en caso que aplique */
function claseMostrar(mostrar) {
	var clase;
	if (mostrar == null || !mostrar) {
		clase = "oculto";
	}
	else {
		clase = "";
	}
	return clase;
}
/* Verifica el error en la llamada ajax y muestra un mensaje */
function procesarErrorAjax(jqXHR, textStatus) {
	if (textStatus == "timeout") {
		mostrarMensaje('El tiempo de espera en la comunicación se ha superado. Por favor intente de nuevo.');
	}
	else if (textStatus == "abort") {
		mostrarMensaje('Se detuvo la operación con el servidor. Por favor intente de nuevo.');
	}
	else if (jqXHR.status == 404) {
    	mostrarMensaje('El recurso no existe en el servidor.');
    }
	else if (jqXHR.status == 403) {
		mostrarMensaje("No tiene privilegios suficientes para realizar esta acción.");
    }
	else if (jqXHR.status == 500) {
		mostrarMensaje('Ha ocurrido un error en el servidor. Por favor comuníquese con el administrador del sistema.');
    }
	else if (jqXHR.status == 2000) {
		mostrarMensaje('Su sesión ha expirado, por favor haga clic en Salir e ingrese de nuevo.');
    }
	else if (jqXHR.status == 0) {
		mostrarMensaje('El servidor no está disponible en este momento.  Por favor haga clic en Salir e intente más tarde.');
    }
	else if (jqXHR.status == 200){			
		var host = window.location.hostname;
		var port = window.location.port;
		var contexparam = $("#paramContexDat").val();
		if(contexparam == undefined){
			desbloquearPagina();
			mostrarMensaje('Ha ocurrido un error, por favor comuníquese con el administrador.');
			//mostrarMensaje('Ha ocurrido un error desconocido. Por favor comuníquese con el administrador del sistema. ' + jqXHR.status + ' ' + jqXHR.getAllResponseHeaders());
		}else{
		var contxSeg = contexparam.substr(contexparam.lastIndexOf('/com-fincyt-seguridad'));
		location.replace('http://'+host+':'+port+contxSeg);
		}
		
	}
	else{
		desbloquearPagina();
		mostrarMensaje('Ha ocurrido un error desconocido. Por favor comuníquese con el administrador del sistema. ' + jqXHR.status + ' ' + jqXHR.getAllResponseHeaders());
	}
}

/* Abre el popup con los parámetros indicados. */
function mostrarPopup(div, titulo, ancho, alto) {
    $(div).dialog({
        width: ancho,
        height: alto,
        resizable: false,
        modal: true,
        title: titulo,
        open: function () {
            $(this).parent().appendTo($('body'));
        }
    });
    $("#dialog").dialog("option", "position", "center");
}

/* Abre el popup con los parámetros indicados. */
function mostrarPopupAsocPerf(div, titulo, ancho, alto) {
    $(div).dialog({
        width: ancho,
        height: alto,
        resizable: false,
        modal: true,
        title: titulo,
        open: function () {
            $(this).parent().appendTo($('body'));
        }
    });
    $("#dialog").dialog("option", "position", "center");
    $(".ui-dialog").css({top: '240px',left: '170px'});
}

function mostrarPopupPregFrecuentes(div, titulo, ancho, alto) {
    $(div).dialog({
        width: ancho,
        height: alto,
        resizable: false,
        modal: true,
        title: titulo,
        open: function () {
            $(this).parent().appendTo($('body'));
        },
        buttons: {
            Cerrar: function() {
              $( this ).dialog( "close" );
            }
          }
    });
    $("#dialog").dialog("option", "position", "center");
}


/* Abre el popup con los parámetros indicados. */
function mostrarPopupUsuarios(div, titulo, ancho, alto, tp, der) {
    $(div).dialog({
        width: ancho,
        height: alto,
        top: tp,
        left: der,
        resizable: false,
        modal: true,
        title: titulo,
        open: function () {
            $(this).parent().appendTo($('body'));
        }
    });
    $("#dialog").dialog("option", "position", "center");
}

/* Indica que si se trata de una cadena vacía o null */
function isEmpty(valor) {
	return (valor == null || valor == '');
}


//Verifica que la extensión del archivo corresponda al array de extensiones permitidas
function verificarExtension(value, extensionesPermitidas) {
	var ext = '';
	if (!isEmpty(value) && value.indexOf('.') >= 0) {
		ext = value.split('.').pop().toLowerCase();
	}
	var resultado = (isEmpty(value) || jQuery.inArray(ext, extensionesPermitidas) >= 0);
	return resultado;
}
//Agrega la función para validar la extensión del archivo
function agregarValidadorExtension(extensionEsperada) {
	jQuery.validator.addMethod("archivoExtension", function(value, element, param) {
		return verificarExtension(value, extensionEsperada.split(','));
	});
}

//Agrega la función para validar la extensión del archivo
function agregarValidadorExtensionXlsx() {
	agregarValidadorExtension('xlsx');
}

//Ubica los mensajes de validación
function errorPlacement(error, element) {
	var parent;
	var tagName;
	do{
		element = element.parent();
		tagName = element.get(0).tagName;
	}while(tagName != 'P' && tagName != 'TABLE');
    error.insertAfter(element);
}

//Muestra el indicador de progreso
function mostrarProcesando() {
	var panel = _panelProcesando || _panelProcesandoTodo;
	$(panel).loadmask("Procesando...");
	return true;
}

//Muestra el indicador de progreso
function mostrarProcesandoTodo(mostrar) {
	if (mostrar == null || mostrar) {
		mostrarProcesando(_panelProcesandoTodo);
	} else {
		$(_panelProcesandoTodo).unloadmask();
	}
	
}
/* Función estándar para el complete de una invocación ajax */
function completeAjax(jqXHR, textStatus) {
	var panel = _panelProcesando || _panelProcesandoTodo;
	$(panel).unloadmask();
	$(_panelProcesandoTodo).unloadmask();
	if (textStatus != "success") {
		procesarErrorAjax(jqXHR, textStatus);
	}	
}

/* Asigna valores por defecto a propiedades */
function setDefault(objeto, propiedad, defaultValue) {	
	if (objeto[propiedad] == null) {
		objeto[propiedad] = defaultValue;
	}
}

/* Envía una llamada ajax */
function ajaxJson(url, type, data, success, panelProcesando, propiedades) {
	_panelProcesando = panelProcesando;
	if (propiedades == null) {
		propiedades = {};
	}
	propiedades.url = url;
	propiedades.type = type;
	propiedades.success = success;
	if (data != null) {
		propiedades.data = JSON.stringify(data);
	}
	//Propiedades fijas
	propiedades.dataType = 'json';
	propiedades.contentType = "application/json; charset=utf-8";
	
	//Propiedades por defecto
	setDefault(propiedades, 'cache', false);
	setDefault(propiedades, 'async', true);	
	setDefault(propiedades, 'beforeSend', mostrarProcesando);
	setDefault(propiedades, 'complete', completeAjax);
	
	$.ajax(propiedades);	
}

/* Envía una llamada ajax */
function ajaxJsonCambiarClave(url, type, data, success, panelProcesando, propiedades) {
	_panelProcesando = panelProcesando;
	if (propiedades == null) {
		propiedades = {};
	}
	propiedades.url = url;
	propiedades.type = type;
	propiedades.success = success;
	if (data != null) {
		propiedades.data = JSON.stringify(data);
	}
	//Propiedades fijas
	propiedades.dataType = 'json';
	propiedades.contentType = "application/json; charset=utf-8";
	
	//Propiedades por defecto
	setDefault(propiedades, 'cache', false);
	setDefault(propiedades, 'async', true);	
	setDefault(propiedades, 'complete', completeAjax);
	
	$.ajax(propiedades);	
}

/* Envía una llamada ajax */
function ajaxJsonSinIndicadorProcesando(url, type, data, success, propiedades) {
	if (propiedades == null) {
		propiedades = {};
	}
	propiedades.beforeSend = function(objeto) {};
	ajaxJson(url, type, data, success, null, propiedades);
}

/* Configura la opción autocompletar para el texto */
function autocompletar(nombre, url) {	
	$(nombre).autocomplete({
		minLength: 0,
	    source : function(request, response) {
	    	var data = {term: request.term};
	    	ajaxJsonSinIndicadorProcesando(url, 'POST', data, response);
	    }
	});
}

/* Configura la opción autocompletar para el texto */
function autocompletarFuncionario(nombre, url, funcSel) {	
	$(nombre).autocomplete({
		minLength: 0,
	    source : function(request, response) {
	    	var data = {term: request.term, funcionario: funcSel};
	    	ajaxJsonSinIndicadorProcesando(url, 'POST', data, response);
	    }
	});
}


/* Configura la opción autocompletar URL variable */
function autocompletarConUrlProvider(nombre, urlProvider) {
        $(nombre).autocomplete({
                minLength: 0,
            source : function(request, response) {
            	var url = urlProvider(this.element);
                if (!isEmpty(url)) {
                        var data = {term: request.term};
                        ajaxJsonSinIndicadorProcesando(url, 'POST', data, response);
                }
            }
        });
}

/* Cierra el diálogo */
function botonCancelar(control, dialogo) {
    $(control).click(function () {
        cerrarPopup(dialogo);
        return false;
    });
}
/* Cierra el diálogo */
function cerrarPopup(dialogo) {
    $(dialogo).unloadmask();
    $(dialogo).dialog("close");
    return false;
}
/* Quita el submit del formulario */
function noSubmit(control) {
    $(control).submit(function () {
        return false;
    });
}

/* Ubica el error de Validate en la posición correcta */
function posicionarError(error, element) {
    var parent;
    var tagName;
    do {
        element = element.parent();
        tagName = element.get(0).tagName;
    } while (tagName != 'P' && tagName != 'FIELDSET');
    error.insertAfter(element);
}

/* Mostrar errores de validación */
function mostrarErrores(form, validator) {
	var numeroErrores = validator.numberOfInvalids();
    if (numeroErrores) {
        var errores = "";
        if (validator.errorList.length > 0) {
            for (var x = 0; x < validator.errorList.length; x++) {
            	errores += "\n\u25CF " + validator.errorList[x].message;
            }
        }
        mostrarMensaje("Por favor verifique los datos:" + errores);
    }
	validator.focusInvalid();
}

/* Inicializa la validación. Es necesario establecer la propiedad name de cada campo para que los mensajes se vean bien. */
function validar(formulario, validaciones) {
	if (validaciones == null) {
		validaciones = {};
	}
	setDefault(validaciones, 'highlight', function(element) {
        $(element).addClass('error');
    });
	setDefault(validaciones, 'unhighlight', function(element) {
		$(element).removeClass('error');
    });
	setDefault(validaciones, 'errorPlacement', function(error, element) {});
	setDefault(validaciones, 'invalidHandler', mostrarErrores);
	$(formulario).validate(validaciones);
}

//Limpia las validaciones del formulario
function limpiarValidaciones(formulario) {
	$(formulario).find('.error').removeClass('error');
}

function padLeft(i,l,s) {
	var o = i.toString();
	if (!s) { s = '0'; }
	while (o.length < l) {
		o = s + o;
	}
	return o;
}
function trim(texto) {
    return texto.replace(/^\s+|\s+$/g, ''); 
}


//Desactiva el backspace para que IExplore no regrese a la página anterior
$(document).keydown(function(e) {
	var element = e.target.nodeName.toLowerCase();
	if (element != 'input' && element != 'textarea') {
	    if (e.keyCode === 8) {
	        return false;
	    }
	}
	});
/*
$("'[placeholder]'").focus(function() {
	  var input = $(this);
	  if (input.val() == input.attr("'placeholder'")) {
	    input.val("''");
	    input.removeClass("'placeholder'");
	  }
	}).blur(function() {
	  var input = $(this);
	  if (input.val() == "''" || input.val() == input.attr("'placeholder'")) {
	    input.addClass("'placeholder'");
	    input.val(input.attr("'placeholder'"));
	  }
	}).blur();
*/

//Mensaje estándar para campos obligatorios
function mensajeObligatorio(nombreCampo) {
    return 'El campo ' + nombreCampo + ' es obligatorio';
}
//Cambia el estado de un checkbox
function check(control, checked) {
	$(control).prop('checked', checked);
}
/* Muestra el mensaje indicando que el registro se ha creado / actualizado exitosamente */
function mostrarMensajeAlmacenado(descripcionUsuario, reg, callback) {
	var estado = reg.id == null ? "creado" : "actualizado";
	var mensaje = descripcionUsuario + " " + estado + " exitosamente";
	$.alerts.alertInfo(mensaje, _sistema, callback);
}
//Verifica que la respuesta del servidor sea Ok o muestra el mensaje de verificar datos
//Si se especifica descripcionUsuario y reg, intenta mostrar un mensaje al usuario indicando que se creó / actualizó el registro
function respuestaOk(response, callback, descripcionUsuario, reg) {
	if (response.ok) {
		if (!isEmpty(descripcionUsuario) && reg != null) {
			mostrarMensajeAlmacenado(descripcionUsuario, reg, callback);
		} else {
			callback();
		}
	} else {
		mostrarMensajeVerificarDatos(response.mensaje);
	}
}

//Indica si el control es visible
function visible(control) {
  return $(control).is(':visible');
}

function habilitar(control, habilitar) {
  if (habilitar) {
      $(control).prop('disabled', false);
  } else {
      $(control).prop('disabled', 'disabled');
  }
}
//Actualiza la lista
function llenarComboSeleccione(control, lista, valorId, nombre, mensajeSeleccione) {
    var labelSeleccione = mensajeSeleccione || '(Seleccione)';
    var combo = $(control).get(0);
    combo.options.length = 0;
    combo.options[0] = new Option(labelSeleccione, "");
    if (lista != null) {
        $.each(lista, function () {
            combo.options[combo.options.length] = new Option(this[nombre], this[valorId]);
        });
    }
}
//Cambia el estado de selección para un option
function seleccionarRadio(name, valor) {
	if (isEmpty(valor)) {
		//Si está vacío, no se debe seleccionar ninguna opción del control
		$('input[name="' + name + '"]').prop('checked', false);
	} else {
		$('input[name="' + name + '"][value="' + valor + '"]').prop('checked', true);
	}
}
//Lee un control por nombre
function leerTextoPorNombre(name) {
	return $('input[name="' + name + '"]').val();
}
//Establece un control por nombre
function setPorNombre(name, valor) {
	$('input[name="' + name + '"]').val(valor);
}
//Lee un control por nombre
function leerTextoRadio(name) {
	return $('input[name="' + name + '"]:checked').val();
}
//Lee un control por nombre
function leerNumeroRadio(name) {
	return convertStringToNumber(leerTextoRadio(name));
}
//Asigna una lista de valores al control multiselect
function asignarValoresMulti(control, valores, seleccione) {
	valores = valores || [];
	 $(control + " option" ).each(function() {
		 $(this).prop('selected', false);
	 });
	$.each(valores, function(i, val) {
		$(control + ' option[value="' + val + '"]').prop('selected', true);
	});
	$(control).multiselect('destroy');
	asignarMulti(control, seleccione || "(Seleccione)");
}
//Inicializa el control multiselect
function asignarMulti(control, ninguno, seleccionarTodos, seleccionarNinguno) {
	$(control).multiselect({
	    selectedList: 100,
	    checkAllText: seleccionarTodos || "Todos",
	    uncheckAllText: seleccionarNinguno || "Ninguno",
	    noneSelectedText: ninguno
	});
}

function mensajesFineUploader() {
    return {
        typeError: "{file} tiene una extensión incorrecta. Las extensiones permitidas son: {extensions}."
        , sizeError: "{file} es demasiado grande, el tamaño máximo permitido es {sizeLimit}."
        , minSizeError: "{file} es demasiado pequeño, el tamaño mínimo es {minSizeLimit}."
        , emptyError: "{file} está vacío, por favor seleccione otro archivo."
        , noFilesError: "No hay archivos para enviar."
        , tooManyItemsError: "Demasiados elementos ({netItems}) serán enviados.  El límite es {itemLimit}."
        , retryFailTooManyItems: "Reintento fallido - ha alcanzado el límite máximo."
        , onLeave: "Los archivos se están enviando, el proceso será cancelado."
    };
}

//Cambia el estado de un checkbox
function check(control, checked) {
	$(control).prop('checked', checked);
}

//Regresa a la página anterior
function regresar() {
  history.back();
}

//Verifica si el rango de fechas es válido o regresa false
function verificarRangoFechas(fechaInicial, fechaFinal) {
	return (fechaInicial == null || fechaFinal == null || fechaInicial <= fechaFinal);
}

/* Establece el botón por defecto para el formulario */
function defaultButton(form, control) {
	$(form).keypress(function (e) {
	    if (e.keyCode == 13) {
	    	$(control).trigger('click');
	    	e.preventDefault();
	    	return false;
	    }
	});
}

/* Cambia el scroll a la posición del control */
function scrollTop(control) {
	$('html, body').scrollTop($(control).offset().top);
}


function mensajesFineUploader() {
    return {
        typeError: "{file} tiene una extensión incorrecta. Las extensiones permitidas son: {extensions}."
        , sizeError: "{file} es demasiado grande, el tamaño máximo permitido es {sizeLimit}."
        , minSizeError: "{file} es demasiado pequeño, el tamaño mínimo es {minSizeLimit}."
        , emptyError: "{file} está vacío, por favor seleccione otro archivo."
        , noFilesError: "No hay archivos para enviar."
        , tooManyItemsError: "Demasiados elementos ({netItems}) serán enviados.  El límite es {itemLimit}."
        , retryFailTooManyItems: "Reintento fallido - ha alcanzado el límite máximo."
        , onLeave: "Los archivos se están enviando, el proceso será cancelado."
    };
}

function calcularDigitoVerificacionNit(nit1) {
	var dv1;
	if (isNaN(nit1))
	{
		dv1 = null;
	} else {
		var vpri = new Array(16);
		var x=0 ; 
		var y=0 ; 
		var z=nit1.length ;
	    vpri[1]=3;
	    vpri[2]=7;
	    vpri[3]=13;
	    vpri[4]=17;
	    vpri[5]=19;
	    vpri[6]=23;
	    vpri[7]=29;
	    vpri[8]=37;
	    vpri[9]=41;
	    vpri[10]=43;
	    vpri[11]=47;  
	    vpri[12]=53;  
	    vpri[13]=59;
	    vpri[14]=67;
	    vpri[15]=71;
	    for(var i=0 ; i<z ; i++)
	    {
	    	y=(nit1.substr(i,1));
	    	x+=(y*vpri[z-i]);
	    }
	    y=x%11;
	    if (y > 1)
	    {
	    	dv1=11-y;
	    } else {
	    	dv1=y;	
	    }
	}
	return dv1;
}

function eliminarArchivoDeLista(control) {
    mostrarMensajeConfirmacionOk("¿Está seguro de eliminar el archivo?", function () {
        $(control).parent().remove();
    });
}

function asignarUploader(listaArchivos, listaIdDescripcion) {
	$(listaArchivos).empty();
	if (listaIdDescripcion != null) {
		for (var i = 0; i < listaIdDescripcion.length; i++) {
			var reg = listaIdDescripcion[i];
			var idArchivo = reg.id;
			var name = reg.descripcion;
			$(listaArchivos).append("<li><span class='boton-opcion sprite-trash ui-corner-all' href='javascript: void(0)' title='Eliminar registro' onclick='return eliminarArchivoDeLista(this);' /><a href='" + leerTexto('#urlDownload') + idArchivo + "'>" + name + "</a></li>");
		}
	}	
}

function crearUploader(control, listaArchivos, extensiones, sizeLimit) {
    new qq.FineUploader({
        element: $(control)[0],
        request: {
            endpoint: leerTexto('#urlUpload')
        },
        editFilename: {
            enabled: false
        },
        autoUpload: true,
        text: {
            uploadButton: '<i class="icon-plus icon-white"></i> Seleccionar Archivos'
        },
        validation: {
            allowedExtensions: extensiones,
            sizeLimit: sizeLimit
        },
        messages: mensajesFineUploader(),
        callbacks: {
            onComplete: function (id, name, response) {
            	var idArchivo = response.idArchivo;
            	if (idArchivo != null) {
            		$(listaArchivos).append("<li><span class='boton-opcion sprite-trash ui-corner-all' href='javascript: void(0)' title='Eliminar registro' onclick='return eliminarArchivoDeLista(this);' /><a href='" + leerTexto('#urlDownload') + idArchivo + "'>" + name + "</a></li>");
            	} else {
            		mostrarMensaje("No fue posible enviar el archivo al servidor");
            	}            		
            }
        }
    });
}

function asignarUploaderUnico(listaArchivos, idDescripcion) {
	$(listaArchivos).empty();
	if (idDescripcion != null && idDescripcion.id != null) {
		var reg = idDescripcion;
		var idArchivo = reg.id;
		var name = reg.descripcion;
		$(listaArchivos).append("<li><span class='boton-opcion sprite-trash ui-corner-all' href='javascript: void(0)' title='Eliminar registro' onclick='return eliminarArchivoDeLista(this);' /><a href='" + leerTexto('#urlDownload') + idArchivo + "'>" + name + "</a></li>");
	}
}

function crearUploaderUnico(control, listaArchivos, extensiones, sizeLimit) {
    new qq.FineUploader({
        element: $(control)[0],
        request: {
            endpoint: leerTexto('#urlUpload')
        },
        editFilename: {
            enabled: false
        },
        autoUpload: true,
        text: {
            uploadButton: '<i class="icon-plus icon-white"></i> Seleccionar Archivos'
        },
        validation: {
            allowedExtensions: extensiones,
            sizeLimit: sizeLimit
        },
        messages: mensajesFineUploader(),
        callbacks: {
            onComplete: function (id, name, response) {
            	var idArchivo = response.idArchivo;
            	if (idArchivo != null) {
	            	$(listaArchivos).empty();
	                $(listaArchivos).append("<li><span class='boton-opcion sprite-trash ui-corner-all' href='javascript: void(0)' title='Eliminar registro' onclick='return eliminarArchivoDeLista(this);' /><a href='" + leerTexto('#urlDownload') + idArchivo + "'>" + name + "</a></li>");
            	} else {
            		mostrarMensaje("No fue posible enviar el archivo al servidor");
            	}
            }
        }
    });
}

function leerArchivosUnico(lista) {
    var archivos = leerArchivos(lista);
    var id;
    if (archivos.length > 0) {
    	id = archivos[0];
    } else {
    	id = null;
    }
    return id;
}

function leerArchivos(lista) {
    var archivos = [];
    $("li", lista).each(function () {
        archivos.push(leerArchivo(this));
    });
    return archivos;
}

function leerArchivo(li) {
    var href = $(li).find("a").prop('href');
    var idArchivo = null;
    if (!isEmpty(href)) {
        var ultimo = href.lastIndexOf("/");
        if (ultimo >= 0) {
        	idArchivo = convertStringToNumber(href.substr(ultimo + 1));
        }
    }
    return idArchivo;
}

//OACD - 24/09/2014
//Funcion encargada de realizar el registro en el LOG cuando un usuario sale del sistema
function logOut(url,path){

	ajaxJson(path+"auditarLogout", 'GET', null, function(response) {
		window.location.href = path+url;
	});
}

function bloquearPagina() {
	$('#div-bloqueo-pantalla').show();
	mostrarAjaxLoader();
}

function desbloquearPagina() {
	$('#div-bloqueo-pantalla').hide();
	ocultarAjaxLoader();
}

function mostrarAjaxLoader() {
	$('#ajax_loader').show();
}

function ocultarAjaxLoader() {
	$('#ajax_loader').hide();
}

//Funcion para bloquear la tecla Enter
function bloquearEnter(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    return (tecla != 13);
}
	
