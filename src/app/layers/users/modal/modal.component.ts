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

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [SharedModalModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponentUser implements OnInit {
  formGroup!: FormGroup;
  files?: File;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalComponentUser>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', Validators.required],
      type: new FormControl(null, Validators.required),
    });
  }

  async submitForm() {
    if (this.formGroup.valid) {
      const typeUserForm = this.formGroup.value.type;
      const payload = {
        name: this.formGroup.value.name,
        surname: this.formGroup.value.surname,
        mobile: this.formGroup.value.mobile,
        email: this.formGroup.value.email,
        typeUser: typeUserForm ? typeUserForm : 'vendor',
      };
      const data: any = await this.axiosService.post('user', payload, true);
      if (data) {
        data.type = payload.typeUser;
        await this.sendImage(data.id, this.files);
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

  onChangeSelect() {
    console.log(this.formGroup.value.type);
  }

  private async sendImage(idUser: string, files: any) {
    try {
      const formData = new FormData();
      formData.append('user', idUser);
      formData.append('tag', 'user');
      formData.append('idReg', idUser);
      formData.append('file', files);
      const data = await this.axiosService.postImage('upload', formData);
      console.log(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public onFileSelected = (event: any & { target: any }) => {
    this.files = event.target.files?.[0];
  };
}
