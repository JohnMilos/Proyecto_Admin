// Se manejara como interfas??? Aun no se xd
class ICitaState {
    constructor(cita) {
        this.cita = cita;
    }

    confirmar() {}
    cancelar() {}
    terminar() {}
    reagendar() {}
    puedeCancelar() {}
}

class SolicitadaState extends ICitaState {
    confirmar() {
        this.cita.estado = 'confirmada';
        this.cita.setState(new ConfirmadaState(this.cita));

    }

    cancelar() {
        if (this.puedeCancelar()) {
            this.cita.estado = 'cancelada';
            this.cita.setState(new CanceladaState(this.cita));

        }
    }

    puedeCancelar() {
        const diferenciaHoras = (this.cita.fecha - new Date()) / (1000 * 60 * 60);
        return diferenciaHoras >= 24;
    }
}

class ConfirmadaState extends ICitaState {
    terminar() {
        this.cita.estado = 'terminada';
        this.cita.setState(new TerminadaState(this.cita));

    }

    cancelar() {
        if (this.puedeCancelar()) {
            this.cita.estado = 'cancelada';
            this.cita.setState(new CanceladaState(this.cita));
        } else {

            this.cita.estado = 'penalizada';
            this.cita.setState(new PenalizadaState(this.cita));
        }
    }
}


class Cita {
    constructor(datos) {
        this.id = datos.id;
        this.folio = datos.folio;
        this.estado = datos.estado;
        this.fecha = datos.fecha;
        this.setState(this.createState(datos.estado));
    }

    setState(state) {
        this.state = state;
    }

    createState(estado) {
        switch (estado) {
            case 'solicitada': return new SolicitadaState(this);
            case 'confirmada': return new ConfirmadaState(this);
            case 'cancelada': return new CanceladaState(this);
            case 'terminada': return new TerminadaState(this);
            case 'penalizada': return new PenalizadaState(this);
        }
    }

    // Delegar al state actual
    confirmar() { this.state.confirmar(); }
    cancelar() { this.state.cancelar(); }
    terminar() { this.state.terminar(); }
}