import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AxiosService } from '../shared/axios.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatToolbarModule,
    FlexLayoutModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private axiosService: AxiosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async login() {
    if (this.loginForm.valid) {
      try {
        const dataLogin = {
          email: this.loginForm.value.username,
          password: this.loginForm.value.password,
        };
        const data: any = await this.axiosService.post('auth/login', dataLogin);
        if (data) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('email', data.email);
          localStorage.setItem('name', data.name);
          localStorage.setItem('surname', data.surname);
          localStorage.setItem('user', data.user);
          localStorage.setItem('type', data.typeUser);
          localStorage.setItem('rols', JSON.stringify(data.rols));
          localStorage.setItem('apps', JSON.stringify(data.apps));
          localStorage.setItem('idUser', data.idUser);
          this.router.navigateByUrl('/admin/time');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}
