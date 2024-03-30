import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AxiosService } from '../../shared/axios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModalModule } from '../../modal.module';
import { IPet } from '../../client/pet/interface/pet';
import { IReservation } from '../interface/reservation.interface';

@Component({
  selector: 'app-modal-examen',
  standalone: true,
  imports: [SharedModalModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalReservationComponent implements OnInit {
  formGroup!: FormGroup;
  petData: IPet[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalReservationComponent>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      fecha: ['', Validators.required],
      comentario: ['', Validators.required],
      pet: new FormControl(null, Validators.required),
      estado: new FormControl(null, Validators.required),
    });
    this.getPet();
  }

  async submitForm() {
    try {
      if (this.formGroup.valid) {
        const payload = {
          horaInicio: this.formGroup.value.horaInicio,
          horaFin: this.formGroup.value.horaFin,
          fecha: this.formGroup.value.fecha,
          comentario: this.formGroup.value.comentario,
          idPet: this.formGroup.value.pet,
          estado: this.formGroup.value.estado,
        };
        const data: any = await this.axiosService.post(
          'reservation',
          payload,
          true
        );
        if (data) {
          this.openSnackBar('Se agrego el registro', 'Cerrar');
          const petResult = this.petData.find(
            (item) => item.id == Number(this.formGroup.value.pet)
          );
          const dataResponse: IReservation = {
            id: data.id,
            horaInicio: payload.horaInicio,
            horaFin: payload.horaFin,
            fecha: payload.fecha,
            comentario: payload.comentario,
            estado: payload.estado,
            idPet: petResult?.id,
            namePet: petResult?.name,
            createdAt: data.createdAt
          };
          this.closeDialog(dataResponse);
          return;
        }
      }
      this.openSnackBar('No se agrego el registro', 'Cerrar');
      return;
    } catch (error) {
      this.openSnackBar('No se agrego el registro', 'Cerrar');
    }
  }

  async getPet() {
    try {
      return this.axiosService.getApi('pet').subscribe(
        (response) => {
          this.petData.push(...response);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    } catch (error) {
      this.openSnackBar('No se obtuvieron clientes', 'Cerrar');
      return;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  closeDialog(data: any) {
    this.dialogRef.close(data);
  }
}
