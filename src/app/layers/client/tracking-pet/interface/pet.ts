export interface ITracking {
  id:            number;
  name:          string;
  age:           number;
  gender:        number;
  race:          string;
  consultas:     Consulta[];
  examenes:      Examene[];
  reservaciones: Reservacione[];
  constancias:   Constancia[];
  servicios:     Servicio[];
}

export interface Constancia {
  id:         number;
  comentario: string;
  createdAt:  Date;
}

export interface Consulta {
  id:          number;
  name:        string;
  description: string;
  dateCreated: Date;
}

export interface Examene {
  id:          number;
  diagnostico: string;
  motivo:      string;
  createdAt:   Date;
}

export interface Reservacione {
  id:         number;
  horaInicio: string;
  horaFin:    string;
  fecha:      Date;
  comentario: string;
  estado:     string;
  createdAt:  Date;
}

export interface Servicio {
  id:          number;
  name:        string;
  time:        number;
  servicio:    string;
  dateCreated: Date;
}

export interface Medicamento {
  id:           number;
  name:         string;
  description:  number;
  dateCreated:  Date;
}
