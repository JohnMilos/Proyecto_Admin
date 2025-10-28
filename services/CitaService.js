const EstadoCita = require("../enums/EstadoCita.js");

//Crear metodo de actualizar estado, este metodo solo debe recibir la cita y el estado
// al que quiero cambiar
function actualizarEstado(cita, estado) {
    if (cita.estado === EstadoCita.SOLICITADA){
        console.log ("Estado actual: Es solicitada y se cambiara a " + cita.estado);
    }
    else if (cita.estado === EstadoCita.CANCELADA){
        console.log ("Estado actual: No se puede cambiar una " + cita.estado);
    }
}

actualizarEstado({"estado":EstadoCita.SOLICITADA}, EstadoCita.CANCELADA);
actualizarEstado({"estado":EstadoCita.CANCELADA}, EstadoCita.CANCELADA)