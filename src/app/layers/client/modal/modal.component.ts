import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AxiosService } from '../../shared/axios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModalModule } from '../../modal.module';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    SharedModalModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalComponent>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', [Validators.required]],
    });
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

      const data: any = await this.axiosService.post('client', payload, true);
      if (data) {
        this.openSnackBar('Se agrego un cliente', 'Cerrar');
        this.closeDialog(data);
        return;
      }
      this.openSnackBar('No agrego el cliente', 'Cerrar');
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
