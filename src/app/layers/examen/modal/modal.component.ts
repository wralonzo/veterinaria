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
import { IExamen } from '../interface/examen.interface';

@Component({
  selector: 'app-modal-examen',
  standalone: true,
  imports: [SharedModalModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalExamenComponent implements OnInit {
  formGroup!: FormGroup;
  clientData: IExamen[] = [];
  petData: IPet[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalExamenComponent>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      motivo: ['', Validators.required],
      diagnostico: ['', Validators.required],
      pet: new FormControl(null, Validators.required),
    });
    this.getPet();
  }

  async submitForm() {
    try {
      if (this.formGroup.valid) {
        const payload = {
          motivo: this.formGroup.value.motivo,
          diagnostico: this.formGroup.value.diagnostico,
          idPet: this.formGroup.value.pet,
        };
        const data: any = await this.axiosService.post('examen', payload, true);
        if (data) {
          this.openSnackBar('Se agrego el registro', 'Cerrar');
          const petResult = this.petData.find(
            (item) => item.id == Number(this.formGroup.value.pet)
          );
          const dataResponse: IExamen = {
            id: data.id,
            motivo: payload.motivo,
            diagnostico: payload.diagnostico,
            createdAt: data.createdAt,
            idPet: petResult?.id,
            namePet: petResult?.name,
            idClient: petResult?.id,
            nameClient: '',
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
