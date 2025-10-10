// MODEL
export interface Cita {
    id: number;
    folio: string;
    pacienteId: number;
    dentistaId: number;
    fecha: Date;
    estado: string;
}

// VIEW (Component Template)
@Component({
    template: `
    <div class="cita-card">
      <h3>{{ cita.folio }}</h3>
      <p>Fecha: {{ cita.fecha | date }}</p>
      <p>Estado: {{ cita.estado }}</p>
      <button (click)="cancelarCita()">Cancelar</button>
    </div>
  `
})

// CONTROLLER (Component Class)
export class CitaComponent {
    @Input() cita: Cita;

    constructor(private citaService: CitaService) {}

    cancelarCita() {
        this.citaService.cancelarCita(this.cita.id)
            .subscribe(resultado => {
                this.cita.estado = 'cancelada';
            });
    }
}