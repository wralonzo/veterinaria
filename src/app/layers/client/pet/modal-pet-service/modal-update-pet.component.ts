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
import { IService } from '../interface/service';

@Component({
  selector: 'app-modal-update-pet-service',
  standalone: true,
  imports: [SharedModalModule],
  templateUrl: './modal-update-pet.component.html',
  styleUrl: './modal-update-pet.component.css',
})
export class ModalPetServiceComponent {
  formGroup!: FormGroup;
  userType: boolean = false;
  dataService: IService[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalUpdateClientComponent>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IPet
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      time: ['', Validators.required],
      service: new FormControl(null, Validators.required),
    });
    this.getServices();
  }

  async submitForm() {
    debugger;
    if (this.formGroup.valid) {
      const payload = {
        name: this.formGroup.value.name,
        time: +this.formGroup.value.time,
        idService: +this.formGroup.value.service,
        idUserRegister: localStorage.getItem('idUser'),
        idPet: this.data.id,
      };
      const data: any = await this.axiosService.post(
        `service/pet/`,
        payload,
        true
      );
      if (data) {
        this.openSnackBar('Se agrego el registro ' + name, 'Cerrar');
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
}
