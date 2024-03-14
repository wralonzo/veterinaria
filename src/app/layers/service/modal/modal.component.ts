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
import { IClient } from '../../client/interface/cliente-interface';
import { IPet } from '../../client/pet/interface/pet';

@Component({
  selector: 'app-modal-service-catalog',
  standalone: true,
  imports: [SharedModalModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalServiceComponent implements OnInit {
  formGroup!: FormGroup;
  clientData: IClient[] = [];
  petData: IPet[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalServiceComponent>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.getClient();
  }

  async submitForm() {
    try {
      if (this.formGroup.valid) {
        const payload = {
          name: this.formGroup.value.name,
          description: this.formGroup.value.description,
        };
        const data: any = await this.axiosService.post(
          'service',
          payload,
          true
        );
        if (data) {
          this.openSnackBar('Se agrego el registro', 'Cerrar');
          const client = this.clientData.find(
            (item) => item.id == Number(this.formGroup.value.client)
          );
          const pet = this.petData.find(
            (item) => item.id == Number(this.formGroup.value.pet)
          );
          const dataResponse = {
            id: data.id,
            name: payload.name,
            client: `${client?.name} ${client?.surname}`,
            descripcion: payload.description,
            dateCreated: data.dateCreated,
            pet: pet?.name,
          };
          this.closeDialog(dataResponse);
          return;
        }
      }
      this.openSnackBar('No agrego el registro', 'Cerrar');
      return;
    } catch (error) {
      this.openSnackBar('No agrego el registro', 'Cerrar');
    }
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

  onFirstSelectChange(event: any): void {
    const selectedValue = event.value;
    this.loadSecondSelectData(selectedValue);
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
