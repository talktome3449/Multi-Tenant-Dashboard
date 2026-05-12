import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
    private http = inject(HttpClient);
    // private url = "http://localhost:5000/api/";
    private url = "https://multi-tenant-dashboard-node-js.onrender.com/api/";

    getTenants() {
      return this.http.get(this.url+'tenants');
    }

    addTenant(payload: any) {
      return this.http.post(this.url+'tenants', payload);
    }


    getTenantNames() {
      return this.http.get(`${this.url}tenants/names`);
    }
    

    getUsers() {
      return this.http.get(this.url+'users');
    }

    addUser(payload: any) {
      console.log('user payload', payload);
      return this.http.post(this.url+'users', payload);
    }

    editUser(id: string, data: any) {
      return this.http.put(`${this.url}users/${id}`, data);
    }

    deleteUser(id: string) {
      return this.http.delete(`${this.url}users/${id}`);
    }
}
