import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AxiosService } from '../../shared/axios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModalModule } from '../../modal.module';
import { IUser } from '../interface/user-interface';

@Component({
  selector: 'app-modal-update-user',
  standalone: true,
  imports: [SharedModalModule],
  templateUrl: './modalupdate.component.html',
  styleUrl: './modalupdate.component.css',
})
export class ModalUpdateComponentUser implements OnInit {
  formGroup!: FormGroup;
  files?: File;
  userType: boolean = false;
  deleted: boolean = false;
  public images: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalUpdateComponentUser>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IUser
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.formGroup = this.formBuilder.group({
      name: [this.data.name, Validators.required],
      surname: [this.data.surname, Validators.required],
      email: [this.data.email, Validators.required],
      mobile: [this.data.mobile, Validators.required],
      type: new FormControl(this.data.type, Validators.required),
    });
    this.userType = localStorage.getItem('type') == 'admin' ? true : false;
    this.loadDataImage();
  }

  public async submitForm() {
    if (this.formGroup.valid) {
      const typeUserForm = this.formGroup.value.type;
      const payload = {
        name: this.formGroup.value.name,
        surname: this.formGroup.value.surname,
        mobile: this.formGroup.value.mobile,
        email: this.formGroup.value.email,
        typeUser: typeUserForm ? typeUserForm : 'vendor',
      };
      const data: any = await this.axiosService.patch('user', payload, true);
      if (data) {
        if (this.files) {
          await this.sendImage(this.data.idUser.toString(), this.files);
        }
        this.openSnackBar('Se modifico el usuario', 'Cerrar');
        const responseModal: IUser = {
          idUser: this.data.idUser,
          name: payload.name,
          surname: payload.surname,
          mobile: payload.mobile,
          user: this.data.user,
          email: payload.email,
          passwordGenerate: this.data.passwordGenerate,
          type: this.data.type,
          apps: [],
          rols: [],
        };
        this.closeDialog(responseModal);
        return;
      }
      this.openSnackBar('No agrego el usuario', 'Cerrar');
      return;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  closeDialog(data: any) {
    this.dialogRef.close(null);
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

  public async delete() {
    try {
      const data: any = await this.axiosService.delete(
        `medicamento/${this.data.idUser}`,
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

  private async loadDataImage() {
    try {
      const data = await this.axiosService.get<IUser>(
        `user/${this.data.idUser}`
      );
      const dataImages = await this.axiosService.getImages<any>(
        `urls?tag=user&idReg=${this.data.idUser}`
      );
      this.images = dataImages.data;
    } catch (error) {
      this.images = [];
    }
  }
}
