import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class ApiService {

  constructor(private readonly httpService: HttpService, private readonly configService:ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService
  ) {}

  // Example: GET request
  async fetchData(endpoint: string): Promise<any> {
    try {
      const response: AxiosResponse = await lastValueFrom(this.httpService.get(endpoint));
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  // Example: POST request
  async postData(endpoint: string, payload: any): Promise<any> {
    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.post(endpoint, payload)
      );
      return response.data;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  }

  // Example: PUT request
  async updateData(endpoint: string, payload: any): Promise<any> {
    try {
      const response: AxiosResponse = await lastValueFrom(
        this.httpService.put(endpoint, payload)
      );
      return response.data;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }

  // Example: DELETE request
  async deleteData(endpoint: string): Promise<any> {
    try {
      const response: AxiosResponse = await lastValueFrom(this.httpService.delete(endpoint));
      return response.data;
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  }
}
