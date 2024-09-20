import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AxiosService } from '../../../shared/axios.service';
import { IPet } from '../interface/pet';
import { SharedModalModule } from '../../../modal.module';
import { IService } from '../interface/service';

@Component({
  selector: 'app-modal-pet-medicamento',
  standalone: true,
  imports: [SharedModalModule],
  templateUrl: './modal-pet-medicamento.html',
  styleUrl: './modal-pet-medicamento.css',
})
export class ModalPetMedicamentoComponent {
  formGroup!: FormGroup;
  userType: boolean = false;
  dataService: IService[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalPetMedicamentoComponent>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IPet
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  async submitForm() {
    if (this.formGroup.valid) {
      const payload = {
        name: this.formGroup.value.name,
        description: this.formGroup.value.description,
        idUser: Number(localStorage.getItem('idUser')),
        idPet: this.data.id,
      };
      const data: any = await this.axiosService.post(
        `medicamento`,
        payload,
        true
      );
      if (data) {
        this.openSnackBar(
          'Se agrego el medicamento a la mascota ' + name,
          'Cerrar'
        );
        this.closeDialog(payload);
        return;
      }
      this.openSnackBar('No se agrego el medicamento a la mascota', 'Cerrar');
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
