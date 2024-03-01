import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModalModule } from '../../../modal.module';
import { AxiosService } from '../../../shared/axios.service';
import { IPet } from '../interface/pet';

@Component({
  selector: 'app-modal-pet-add',
  standalone: true,
  imports: [SharedModalModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalPetComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalPetComponent>,
    private axiosService: AxiosService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IPet
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      age: [null, Validators.required],
      gender: ['', Validators.required],
      race: ['', Validators.required],
    });
  }

  async submitForm() {
    if (this.formGroup.valid) {
      const payload = {
        name: this.formGroup.value.name,
        age: +this.formGroup.value.age,
        gender: +this.formGroup.value.gender,
        client: this.data.client,
        idUser: localStorage.getItem('idUser'),
        race: this.formGroup.value.race,
      };

      const data: any = await this.axiosService.post('pet', payload, true);
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
