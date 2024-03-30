export interface IReservation {
  id?: number;
  horaInicio?: string;
  horaFin?: string;
  fecha?: Date;
  comentario?: string;
  estado?: string;
  idPet?: number;
  namePet?: string;
  createdAt?: Date;
}
