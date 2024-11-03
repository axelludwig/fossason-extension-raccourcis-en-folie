import { ErrorHandler, Injectable } from '@angular/core';
import axios from "axios";
import { AxiosInstance } from "axios";
import { environment } from '../../environments/environment';


export interface Params {
  [key: string]: any;
}

export interface GetOptions {
  url: string;
  params?: Params;
}

export interface ErrorResponse {
  id: string;
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AxiosService {
  private axiosClient: AxiosInstance;
  private errorHandler: ErrorHandler;

  constructor(errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler;

    this.axiosClient = axios.create({
      timeout: 0,
      headers: {
        "X-Initialized-At": Date.now().toString()
      }, withCredentials: true
    });
  }

  public async get<T>(options: GetOptions): Promise<T> {
    try {
      var axiosResponse = await this.axiosClient.request<T>({
        method: "get",
        url: environment.serverURL + options.url,
        params: options.params
      });
      return (axiosResponse.data);
    }
    catch (error) {
      return (Promise.reject(this.normalizeError(error)));
    }
  }

  public async post<T>(options: GetOptions): Promise<T> {
    try {
      var axiosResponse = await this.axiosClient.request<T>({
        method: "post",
        url: environment.serverURL + options.url,
        data: options.params
      });
      return (axiosResponse.data);
    } catch (error) {
      return (Promise.reject(this.normalizeError(error)));
    }
  }

  public async put<T>(options: GetOptions): Promise<T> {
    try {
      var axiosResponse = await this.axiosClient.request<T>({
        method: "put",
        url: environment.serverURL + options.url,
        data: options.params
      });
      return (axiosResponse.data);
    } catch (error) {
      return (Promise.reject(this.normalizeError(error)));
    }
  }

  public async getOutside<T>(options: GetOptions): Promise<T> {
    try {
      var axiosResponse = await this.axiosClient.request<T>({
        method: "get",
        url: options.url,
        params: options.params
      });
      return (axiosResponse.data);
    }
    catch (error) {
      return (Promise.reject(this.normalizeError(error)));
    }
  }
  // Errors can occur for a variety of reasons. I normalize the error response so that
  // the calling context can assume a standard error structure.
  private normalizeError(error: any): ErrorResponse {
    this.errorHandler.handleError(error);
    // NOTE: Since I'm not really dealing with a production API, this doesn't really
    // normalize anything (ie, this is not the focus of this demo).
    return ({
      id: "-1",
      code: "UnknownError",
      message: "An unexpected error occurred."
    });
  }
}
