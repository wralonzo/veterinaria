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
import { IMedicamentos } from '../interface/medicamentos.interface';

@Component({
  selector: 'app-modal-medicamento',
  standalone: true,
  imports: [SharedModalModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalMedicamentoComponent implements OnInit {
  formGroup!: FormGroup;
  petData: IPet[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalMedicamentoComponent>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      pet: new FormControl(null, Validators.required),
    });
    this.getPet();
  }

  async submitForm() {
    try {
      if (this.formGroup.valid) {
        const petResult = this.petData.find(
          (item) => item.id == Number(this.formGroup.value.pet)
        );

        const payload = {
          name: this.formGroup.value.name,
          description: this.formGroup.value.description,
          idUser: Number(localStorage.getItem('idUser')),
          idPet: petResult?.id,
        };
        const data: any = await this.axiosService.post(
          `medicamento`,
          payload,
          true
        );
        const dataResponse: IMedicamentos = {
          id: data.id,
          name: payload.name,
          description: payload.description,
          createdAt: data.createdAt,
          idPet: petResult?.id,
          namePet: petResult?.name,
        };

        if (data) {
          this.openSnackBar(
            'Se agrego el medicamento a la mascota ' + name,
            'Cerrar'
          );
          this.closeDialog(dataResponse);
          return;
        }
        this.closeDialog(dataResponse);
        return;
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
      this.openSnackBar('No se obtuvieron mascotas', 'Cerrar');
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
