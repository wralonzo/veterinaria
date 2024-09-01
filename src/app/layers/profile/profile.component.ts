import { Component } from '@angular/core';
import { SharedModule } from '../layer.module';
import { AxiosService } from '../shared/axios.service';
import { IUser } from '../users/interface/user-interface';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule, MatCardModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  showFiller = false;
  public user: IUser = {
    idUser: 0,
    name: '',
    surname: '',
    user: '',
    email: '',
    passwordGenerate: '',
    apps: [],
    rols: [],
  };
  public images: any = [];
  constructor(private axiosService: AxiosService) {}

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    try {
      const idUser = localStorage.getItem('idUser');
      const data = await this.axiosService.get<IUser>(`user/${idUser}`);
      this.user = data;
      const dataImages = await this.axiosService.getImages<any>(
        `urls?tag=user&idReg=${idUser}`
      );
      this.images = dataImages.data;
    } catch (error) {
      this.images = [];
    }
  }
}
