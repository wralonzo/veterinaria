import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModalModule } from '../../modal.module';
import { IService } from '../../client/pet/interface/service';
import { AxiosService } from '../../shared/axios.service';
import { IPetService } from '../interface/pet-service.interface';

@Component({
  selector: 'app-modal-update-pet-service-new',
  standalone: true,
  imports: [SharedModalModule],
  templateUrl: './modal-update-pet.component.html',
  styleUrl: './modal-update-pet.component.css',
})
export class ModalPetServiceNewComponent {
  formGroup!: FormGroup;
  userType: boolean = false;
  dataService: IService[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalPetServiceNewComponent>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IPetService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: [this.data.name, Validators.required],
      time: [this.data.time, Validators.required],
      service: new FormControl(this.data.idServicio, Validators.required),
    });
    this.userType = localStorage.getItem('type') == 'admin' ? true : false;
    this.getServices();
  }

  async submitForm() {
    if (this.formGroup.valid) {
      const payload = {
        name: this.formGroup.value.name,
        time: +this.formGroup.value.time,
        idService: +this.formGroup.value.service,
      };
      const data: any = await this.axiosService.patch(
        `service/pet/${this.data.id}`,
        payload,
        true
      );
      if (data) {
        this.openSnackBar('Se agrego el registro ' + name, 'Cerrar');
        const findService = this.dataService.find(
          (item) => item.id == payload.idService
        );
        this.closeDialog({
          id: this.data.id,
          name: this.formGroup.value.name,
          idPet: this.data.idPet,
          namePet: this.data.namePet,
          time: +this.formGroup.value.time,
          idUserRegister: this.data.idUserRegister,
          nameUser: this.data.nameUser,
          idServicio: findService?.id,
          nameServicio: findService?.name,
          dateCreated: this.data.dateCreated,
        });
        return;
      }
      this.openSnackBar('No agrego el registro', 'Cerrar');
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

  async getServices() {
    try {
      return this.axiosService.getApi('service').subscribe(
        (response) => {
          this.dataService.push(...response);
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

  async delete() {
    try {
      const data: any = await this.axiosService.delete(
        `service/pet/${this.data.id}`,
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
}
