import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { ApiService } from '../../core/services/api-service';
import { map, Observable } from 'rxjs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    BaseChartDirective,
    MatCardModule,
    MatChipsModule,
    MatTableModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  isLoading = signal(true);
  private apiService = inject(ApiService);
  tenants$: Observable<any[]>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  totalTenants: any;
  activeUsers: any;
  monthlyRevenue: any;
  activeTenants: any;
  matricsData: any = [];

  revenueChartData: any;
  usersChartData: any;
  planChartData: any;
  statusChartData: any;

  /* private _sort: MatSort;
  private _paginator: MatPaginator;

  @ViewChild(MatSort) set sort(value: MatSort) {
    if (value) {
      this._sort = value;
      this.dataSource.sort = this._sort;
    }
  }

  @ViewChild(MatPaginator) set paginator(value: MatPaginator) {
    if (value) {
      this._paginator = value;
      this.dataSource.paginator = this._paginator;
    }
  } */

  displayedColumns = ['companyName','plan','users','status','createdAt'];
  dataSource = new MatTableDataSource([]);

  constructor() {
      this.tenants$ = this.apiService.getTenants().pipe(
        map((response: any) => response.data)
      );
    }

  ngOnInit() {
    this.isLoading.set(true);
    this.tenants$.subscribe((data: any) => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading.set(false);
      this.getMatricsData();
      this.getCharts();
    });   
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'active';
      case 'inactive':
        return 'inactive';
      case 'trial':
        return 'trial';
      default:
        return 'status-default';
    }
  }
  
  getMatricsData() {
    this.totalTenants = this.dataSource.data.length;
    this.activeUsers = this.dataSource.data.reduce((sum, t: any) => sum + t.activeUsers, 0);
    this.monthlyRevenue = this.dataSource.data.reduce((sum, t: any) => sum + t.monthlyRevenue, 0);
    this.activeTenants = this.dataSource.data.filter((t: any) => t.status === 'Active').length;
    
    this.matricsData = [
      {title: 'Total Tenants', value: this.totalTenants, change: '+8 this week'},
      {title: 'Active Users', value: this.activeUsers, change: '+12%'},
      {title: 'MRR (CR)', value: this.monthlyRevenue, change: '+3.1k'},
      {title: 'Active Tenants', value: this.activeTenants, change: '+0.3%'},
    ]
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCharts() {
    this.revenueChartData = {
      labels: this.dataSource.data.map((t: any) => t.companyName),
      datasets: [
        {
          label: 'Revenue',
          data: this.dataSource.data.map((t: any) => t.monthlyRevenue)
        }
      ]
    };

    this.usersChartData = {
      labels: this.dataSource.data.map((t: any) => t.companyName),
      datasets: [
        {
          label: 'Users',
          data: this.dataSource.data.map((t: any) => t.users),
          tension: 0.4
        }
      ]
    };

    this.planChartData = {
      labels: ['Enterprise', 'Pro', 'Basic'],
      datasets: [
        {
          data: [
            this.dataSource.data.filter((t: any) => t.plan === 'Enterprise').length,
            this.dataSource.data.filter((t: any) => t.plan === 'Pro').length,
            this.dataSource.data.filter((t: any) => t.plan === 'Basic').length
          ]
        }
      ]
    };

    this.statusChartData = {
      labels: ['Active', 'Inactive', 'Trial'],
      datasets: [
        {
          data: [
            this.dataSource.data.filter((t: any) => t.status === 'Active').length,
            this.dataSource.data.filter((t: any) => t.status === 'Inactive').length,
            this.dataSource.data.filter((t: any) => t.status === 'Trial').length
          ]
        }
      ]
    };
  }
}
