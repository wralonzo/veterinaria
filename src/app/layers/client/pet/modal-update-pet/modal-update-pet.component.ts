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
import { ModalUpdateClientComponent } from '../../modal-update/modal-update.component';
import { IPet } from '../interface/pet';
import { SharedModalModule } from '../../../modal.module';

@Component({
  selector: 'app-modal-update-pet',
  standalone: true,
  imports: [SharedModalModule],
  templateUrl: './modal-update-pet.component.html',
  styleUrl: './modal-update-pet.component.css',
})
export class ModalUpdatePetComponent {
  formGroup!: FormGroup;
  userType: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalUpdateClientComponent>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IPet
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: [this.data.name, Validators.required],
      age: [this.data.age, Validators.required],
      gender: new FormControl(this.data.gender.toString(), Validators.required),
      race: [this.data.race, Validators.required],
    });
    this.userType = localStorage.getItem('type') == 'admin' ? true : false;
  }

  async submitForm() {
    if (this.formGroup.valid) {
      const payload = {
        name: this.formGroup.value.name,
        age: +this.formGroup.value.age,
        gender: +this.formGroup.value.gender,
        client: this.data.client,
        race: this.formGroup.value.race,
      };
      const data: any = await this.axiosService.patch(
        `pet/${this.data.id}`,
        payload,
        true
      );
      if (data) {
        this.openSnackBar('Se Modifico el registro ' + name, 'Cerrar');
        this.closeDialog({
          name: this.formGroup.value.name,
          age: +this.formGroup.value.age,
          gender: +this.formGroup.value.gender,
          client: this.data.client,
          idUser: localStorage.getItem('idUser'),
          race: this.formGroup.value.race,
          id: this.data.id,
        });
        return;
      }
      this.openSnackBar('No agrego el registro', 'Cerrar');
      return;
    }
  }

  async delete() {
    try {
      const data: any = await this.axiosService.delete(
        `pet/${this.data.id}`,
        true
      );
      if (data) {
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
  }
}
