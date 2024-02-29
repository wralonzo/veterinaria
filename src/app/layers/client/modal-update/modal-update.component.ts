import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AxiosService } from '../../shared/axios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModalModule } from '../../modal.module';
import { IClient } from '../interface/cliente-interface';

@Component({
  selector: 'app-modal-update',
  standalone: true,
  imports: [SharedModalModule],
  templateUrl: './modal-update.component.html',
  styleUrl: './modal-update.component.css',
})
export class ModalUpdateClientComponent {
  formGroup!: FormGroup;
  userType: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalUpdateClientComponent>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IClient
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: [this.data.name, Validators.required],
      surname: [this.data.surname, Validators.required],
      mobile: [this.data.mobile, Validators.required],
      email: [this.data.email, Validators.required],
      address: [this.data.address, [Validators.required]],
    });
    this.userType = localStorage.getItem('type')=='admin' ? true : false;
  }

  async submitForm() {
    if (this.formGroup.valid) {
      const payload = {
        user: {
          name: this.formGroup.value.name,
          surname: this.formGroup.value.surname,
          mobile: this.formGroup.value.mobile,
          email: this.formGroup.value.email,
          typeUser: 'client',
        },
        client: {
          address: this.formGroup.value.address,
          idUserRegister: localStorage.getItem('idUser'),
        },
      };

      console.log(payload);
      const data: any = await this.axiosService.patch(
        `client/${this.data.id}`,
        payload,
        true
      );
      if (data) {
        this.openSnackBar('Se Modifico el cliente ' + name, 'Cerrar');
        this.closeDialog({
          name: this.formGroup.value.name,
          surname: this.formGroup.value.surname,
          mobile: this.formGroup.value.mobile,
          email: this.formGroup.value.email,
          typeUser: 'client',
          address: this.formGroup.value.address,
          idUserRegister: localStorage.getItem('idUser'),
          id: this.data.id,
          user: this.data.user,
          passwordGenerate: this.data.passwordGenerate,
        });
        return;
      }
      this.openSnackBar('No agrego el cliente', 'Cerrar');
      return;
    }
  }

  async delete() {
    try {
      const data: any = await this.axiosService.delete(
        `client/${this.data.id}`,
        true
      );
      if (data) {
        this.openSnackBar('Se Eliminó el cliente ' + name, 'Cerrar');
        this.closeDialog({ delete: true });
        return;
      }
      this.openSnackBar('No se eliminó el cliente', 'Cerrar');
      return;
    } catch (error) {
      this.openSnackBar('No se eliminó el cliente', 'Cerrar');
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
