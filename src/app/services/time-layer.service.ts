import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = 'https://wttr.in';

  private readonly axios: AxiosInstance = axios;

  constructor() {
    this.axios = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Función para obtener el clima según la ciudad
  public async getWeather<T>(city: string): Promise<T> {
    const url = `${this.apiUrl}/${city}?format=j1`;
    const response: AxiosResponse = await this.axios.get<any>(url);
    return response.data;
  }

  public async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject('Geolocation no está soportado por este navegador');
      }
    });
  }
}
