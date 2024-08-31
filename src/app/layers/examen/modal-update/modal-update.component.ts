import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModalModule } from '../../modal.module';
import { AxiosService } from '../../shared/axios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IPet } from '../../client/pet/interface/pet';
import { IExamen } from '../interface/examen.interface';

@Component({
  selector: 'app-modal-update-examen',
  standalone: true,
  imports: [SharedModalModule],
  templateUrl: './modal-update.component.html',
  styleUrl: './modal-update.component.css',
})
export class ModalUpdateExamenComponent {
  formGroup!: FormGroup;
  userType: boolean = false;
  deleted: boolean = false;
  petData: IPet[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalUpdateExamenComponent>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IExamen
  ) {}

  ngOnInit(): void {
    this.getPeet();
    this.formGroup = this.formBuilder.group({
      motivo: [this.data.motivo, Validators.required],
      diagnostico: [this.data.diagnostico, Validators.required],
      pet: new FormControl(this.data.idPet, Validators.required),
    });
    this.userType = localStorage.getItem('type') == 'admin' ? true : false;
  }

  async submitForm() {
    if (this.formGroup.valid) {
      const payload = {
        motivo: this.formGroup.value.motivo,
        diagnostico: this.formGroup.value.diagnostico,
        idPet: this.formGroup.value.pet,
      };
      const dataResponse: any = await this.axiosService.patch(
        `examen/${this.data.id}`,
        payload,
        true
      );
      if (this.deleted) return;
      if (dataResponse) {
        this.openSnackBar('Se Modifico el registro ' + name, 'Cerrar');
        const pet = this.petData.find(
          (item) => item.id == Number(this.formGroup.value.pet)
        );
        const returnData: IExamen = {
          id: this.data.id,
          motivo: payload.motivo,
          diagnostico: payload.diagnostico,
          idPet: pet?.id,
          namePet: pet?.name,
          idClient: pet?.id,
          nameClient: '',
          createdAt: this.data.createdAt,
        };
        this.closeDialog(returnData);
        return;
      }
      this.openSnackBar('No agrego el registro', 'Cerrar');
      return;
    }
  }

  async delete() {
    try {
      const data: any = await this.axiosService.delete(
        `examen/${this.data.id}`,
        true
      );
      if (data) {
        this.deleted = true;
        this.openSnackBar('Se eliminó el registro ' + name, 'Cerrar');
        this.closeDialog({ delete: true });
        return;
      }
      this.openSnackBar('No se eliminó el registro', 'Cerrar');
      return;
    } catch (error) {
      this.openSnackBar('No se eliminó el registro', 'Cerrar');
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  closeDialog(data: any) {
    this.dialogRef.close(data);
    return;
  }

  async getPeet() {
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
}
