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
import { IConsult } from '../interfaces/ consult.interface';
import { IClient } from '../../client/interface/cliente-interface';
import { IPet } from '../../client/pet/interface/pet';

@Component({
  selector: 'app-modal-update-consult',
  standalone: true,
  imports: [SharedModalModule],
  templateUrl: './modal-update.component.html',
  styleUrl: './modal-update.component.css',
})
export class ModalUpdateConsultComponent {
  formGroup!: FormGroup;
  userType: boolean = false;
  clientData: IClient[] = [];
  petData: IPet[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalUpdateConsultComponent>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IConsult
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: [this.data.name, Validators.required],
      description: [this.data.description, Validators.required],
      pet: new FormControl(this.data.idPet, Validators.required),
      client: new FormControl(this.data.idClient, Validators.required),
    });
    this.userType = localStorage.getItem('type') == 'admin' ? true : false;
    this.getClient();
    this.getOnePet(this.data.idPet);
  }

  async submitForm() {
    if (this.formGroup.valid) {
      const payload = {
        name: this.formGroup.value.name,
        description: this.formGroup.value.description,
        pet: +this.formGroup.value.pet,
      };
      const dataResponse: any = await this.axiosService.patch(
        `consult/${this.data.id}`,
        payload,
        true
      );
      if (dataResponse) {
        this.openSnackBar('Se Modifico el registro ' + name, 'Cerrar');
        const client = this.clientData.find(
          (item) => item.id == Number(this.formGroup.value.client)
        );
        const pet = this.petData.find(
          (item) => item.id == Number(this.formGroup.value.pet)
        );
        this.closeDialog({
          id: this.data.id,
          name: payload.name,
          client: `${client?.name} ${client?.surname}`,
          descripcion: payload.description,
          pet: pet?.name,
          dateCreated: this.data.dateCreated,
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
        `consult/${this.data.id}`,
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

  async getClient() {
    try {
      return this.axiosService.getApi('client').subscribe(
        (response) => {
          this.clientData.push(...response);
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

  async loadSecondSelectData(selectedValue: any) {
    try {
      return this.axiosService.getApi(`pet/client/${selectedValue}`).subscribe(
        (data: any[]) => {
          this.petData = data;
        },
        (error) => {
          this.petData = [];
          this.openSnackBar('No se obtuvieron mascotas', 'Cerrar');
        }
      );
    } catch (error) {
      this.openSnackBar('No se obtuvieron mascotas', 'Cerrar');
      return;
    }
  }

  async getOnePet(id: number) {
    try {
      return this.axiosService.getApi(`pet/${id}`).subscribe(
        (data) => {
          this.petData.push(data);
        },
        (error) => {
          this.petData = [];
          this.openSnackBar('No se obtuvieron mascotas', 'Cerrar');
        }
      );
    } catch (error) {
      this.openSnackBar('No se obtuvieron mascotas', 'Cerrar');
      return;
    }
  }

  onFirstSelectChange(event: any): void {
    const selectedValue = event.value;
    this.loadSecondSelectData(selectedValue);
  }
}
