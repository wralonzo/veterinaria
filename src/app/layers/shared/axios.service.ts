import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AxiosService {
  private readonly axios: AxiosInstance = axios;
  // private readonly urlApi: string =
  //   'https://api-veterinaria-production.up.railway.app/api/v1/';
  private readonly urlApi: string = 'http://localhost:3000/api/v1/';
  public readonly urlApiPdf = 'http://localhost:8080/pdf/';
  public readonly urlApiImage = 'http://localhost:8081/';
  constructor() {
    this.axios = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async get<T>(url: string, isActive: boolean = false): Promise<T> {
    try {
      if (isActive) {
        const token = localStorage.getItem('token');
        const response: AxiosResponse = await this.axios.get(
          `${this.urlApi}${url}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      }
      const response: AxiosResponse = await this.axios.get(
        `${this.urlApi}${url}`!
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getImages<T>(url: string): Promise<T> {
    try {
      const response: AxiosResponse = await this.axios.get(
        `${this.urlApiImage}${url}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(url: string, body: any, isActive: boolean = false): Promise<T> {
    try {
      if (isActive) {
        const token = localStorage.getItem('token');
        const response: AxiosResponse = await this.axios.post(
          `${this.urlApi}${url}`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      }
      const response: AxiosResponse = await this.axios.post(
        `${this.urlApi}${url}`,
        body
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async postImage<T>(url: string, body: any): Promise<T> {
    try {
      const response: AxiosResponse = await this.axios.post(
        `${this.urlApiImage}${url}`,
        body,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async patch<T>(
    url: string,
    body: any,
    isActive: boolean = false
  ): Promise<T> {
    try {
      if (isActive) {
        const token = localStorage.getItem('token');
        const response: AxiosResponse = await this.axios.patch(
          `${this.urlApi}${url}`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      }
      const response: AxiosResponse = await this.axios.patch(
        `${this.urlApi}${url}`,
        body
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(url: string, isActive: boolean = false): Promise<T> {
    try {
      if (isActive) {
        const token = localStorage.getItem('token');
        const response: AxiosResponse = await this.axios.delete(
          `${this.urlApi}${url}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      }
      const response: AxiosResponse = await this.axios.delete(
        `${this.urlApi}${url}`!
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public getApi(url: string): Observable<any> {
    const token = localStorage.getItem('token');

    return new Observable<any>((observer) => {
      axios
        .get(`${this.urlApi}${url}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response: AxiosResponse<any>) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
