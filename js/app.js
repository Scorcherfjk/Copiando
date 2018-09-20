function caracteristicaAlerta(correctiva) {
	return correctiva ? "Correctiva" : "Preventiva";
}
function estadoAlerta(cerrada) {
	return cerrada ? "Cerrada" : "Activa";
}
function estiloGraficaCrece(crece) {
	return crece == 0 ? "igual" : crece == 1 ? "crece" : "decrece";
}
function titleGraficaCrece(crece) {
	return crece == 0 ? "El indicador se mantuvo igual" : crece == 1 ? "El indicador creció" : "El indicador disminuyó";
}
function descripcionTipoEntidad(tipoEntidad) {
	return tipoEntidad == "G" ? "Gestión" : tipoEntidad == "E" ? "Ejecución" : "";
}
function descripcionTipoEvento(tipoEvento) {
	return tipoEvento == 21 ? "Insertar" : tipoEvento == 22 ? "Actualizar" : "Eliminar";
}
function descripcionRango(limiteInferior, limiteSuperior) {
	return "Entre " + limiteInferior + " y " + limiteSuperior + " meses";
}
//Activa / desactiva el Registro
function activarRegistro(id, activar, callback) {
	ajaxJson(id + "/activar/" + activar, 'PUT', null, function(response) {
		respuestaOk(response, function() {
			callback();
		});
	});
}
//Activa / desactiva el Registro
function activarConfirmado(nombre, id, activar, callback) {
	alert ("nombre"+nombre+"id"+id+"activar"+activar+"callback"+callback);
	mostrarMensajeConfirmacionOk("¿Desea " + (activar ? "activar" : "desactivar") + " el registro de " + nombre + "?", function() {
		activarRegistro(id, activar, callback);
	});
}
//Verifica que el registro a eliminar esté activo
function eliminarConfirmado(nombre, id, activo, callback) {
	if (activo) {
		mostrarMensajeConfirmacionOk("¿Está seguro de eliminar el registro de " + nombre + "?", function() {
			ajaxJson(id, 'DELETE', null, function(response) {
				var mensaje = response.mensaje || "";
				if (response.ok || mensaje.indexOf("eliminado") >= 0) {
					mostrarMensajeInfo("El registro se eliminó exitosamente", callback);
				} else {
					mostrarMensajeConfirmacion(response.mensaje + ". ¿Desea desactivarlo?", function(confirm) {
						if (confirm) {
							activarRegistro(id, false, callback);
						} else {
							callback();
						}
					});
				}
			});
		});
	} else {
		mostrarMensaje("No se puede eliminar un registro de " + nombre + " inactivo");
	}
}
//Verifica que el registro a eliminar esté activo
function eliminarConfirmadoSinDesactivar(nombre, id, callback) {
	mostrarMensajeConfirmacionOk("¿Está seguro de eliminar el registro de " + nombre + "?", function() {
		ajaxJson(id, 'DELETE', null, function(response) {
			var mensaje = response.mensaje || "";
			if (response.ok || mensaje.indexOf("eliminado") >= 0) {
				mostrarMensajeInfo("El registro se eliminó exitosamente", callback);
			} else {
				mostrarMensajeVerificarDatos(response.mensaje);
			}
		});
	});
}
function descripcionActivo(activo) {
	return activo ? "Activo" : "Inactivo";
}
//Jfigueroa - SM: funcion para evento contrario de activar o inactivar
function descripcionparaActivaOInactivoUsuarioEvento(activo) {
	return activo ? "Inactivar" : "Activar";
}

function descripcionparaActivaOInactivoUsuarioEvento2(activo) {
//	Alert("aqui");
	return activo ? "boton-opcion sprite-inactivo":  "boton-opcion sprite-activo";
}


//AABG - SM: funcion valor en la tabla
function ActivoOInactivo(estado) {
	if(estado == "1")
		return "Activo";
	if(estado == "0")
		return "Inactivo";
	if(estado == "2")
		return "Pendiente Activación";
	if(estado == "3")
		return "Bloqueado";
}

//AABG - SM: funcion para evento contrario de activar o inactivar
function descripcionActivoInactivo(activo) {
	
	return activo == "0" ? "Activar" : "Inactivar";
}
function descripcionActivoInactivo2(activo) {
	if(activo == "0"){
		return "boton-opcion sprite-inactivo";
	}else{
		if(activo == "1"){
			return "boton-opcion sprite-activo";
		}
		else{
			return "boton-opcion sprite-inactivo";
		}
	}
}

//AABG - SM: funcion para evento contrario de activar o inactivar
function descripcionBloqueadoDesbloqueado(estado) {
	if(estado == "3")
		return "Desbloquear";
	else
	    return  "Bloquear";
}

function activarIcono(estado){
	if(estado == "2")
		return "";
	else
		return "onclick=";
}

function descripcionBloqueadoDesbloqueado2(estado) {
	if(estado == "3")
		return "boton-opcion sprite-bloquear";
	else
	    return "boton-opcion sprite-desbloquear";
}

function agregarValidadorEMailMultiple() {
    jQuery.validator.addMethod("emailmultiple", function (value, element) {
    	if (!isEmpty(value)) {
	    	var correos = value.split(";");
	    	var i;
	    	for (i = 0; i < correos.length; i++) {	    		
		    	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
	    		if (!isEmpty(trim(correos[i])) && !re.test(trim(correos[i]))) {
	    			return false;
	    		}
	    	}
	    }
    	return true;
    }, "La lista de correos electrónicos no es válida."
    );

    // connect it to a css class
    jQuery.validator.addClassRules({
        checkurl: { checkurl: true }
    });
}
//Inicializa la página del sistema
$(document).ready(function () {
    //Crea el menú
    $('#navegacion ul').superfish({
    });
});