import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DataService } from '../data.service';
import { ChartData, ChartOptions } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  users: any[] = [];
  paginatedUsers: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  loading: boolean = true;
  statusOptions: string[] = ['active', 'deactivated', 'expired', 'lapsed','pending'];
  changeReason: string = '';
  selectedPolicyNumber: string | null = null;
  currentStatus: string = '';
  originalUsers: any[] = [];
  selectedPolicyStatus: string = '';
  // Chart data and options

  doughnutChartData: ChartData<'doughnut'> = {
    labels: this.statusOptions,
    datasets: [{
      data: [0, 0, 0, 0, 0],  // Updated to match the number of status options
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] // Added color for the new status option
    }]
  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw as number;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.dataService.getUsers().subscribe({
      next: (users) => {
        this.users = users || [];
        this.originalUsers = [...this.users];
        this.fetchClaimDetails();
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.users = [];
        this.paginatedUsers = [];
        this.loading = false;
      }
    });
  }

  fetchClaimDetails(): void {
    const claimDetailsRequests = this.users.map(user =>
      this.dataService.getClaimDetails1(user.policyNumber)
    );

    forkJoin(claimDetailsRequests).subscribe({
      next: (claimDetailsArray) => {
        claimDetailsArray.forEach((claimDetails, index) => {
          this.users[index].claimDetails = claimDetails.length ? claimDetails[0] : {};
        });
        this.paginateUsers();
        this.loading = false;
        this.updateDoughnutChart();
      },
      error: (err) => {
        console.error('Error fetching claim details:', err);
        this.users.forEach(user => user.claimDetails = {});
        this.paginateUsers();
        this.loading = false;
        this.updateDoughnutChart();
      }
    });
  }

  updateDoughnutChart(): void {
    const statusCount = this.statusOptions.reduce((acc, status) => {
      acc[status] = this.users.filter(user => user.policyStatus === status).length;
      return acc;
    }, {} as { [key: string]: number });

    this.doughnutChartData.datasets[0].data = this.statusOptions.map(status => statusCount[status] || 0);
  }

  sortBy(key: string, order: 'asc' | 'desc'): void {
    if (this.users && this.users.length > 0) {
      this.users.sort((a, b) => {
        const compareA = a[key];
        const compareB = b[key];
        if (order === 'asc') {
          return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
        } else {
          return compareA < compareB ? 1 : compareA > compareB ? -1 : 0;
        }
      });
      this.paginateUsers();
    }
  }

  paginateUsers(): void {
    if (this.users) {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.paginatedUsers = this.users.slice(start, end);
    } else {
      this.paginatedUsers = [];
    }
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, i) => i + 1);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.getPageNumbers().length) {
      this.currentPage = page;
      this.paginateUsers();
    }
  }

  viewPolicyDetails(policyNumber: string): void {
    this.router.navigate(['/policy-details', policyNumber]);
  }

  onStatusChange(event: Event, policyNumber: string): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;

    const user = this.users.find(u => u.policyNumber === policyNumber);

    if (user) {
      if (user.policyStatus === 'pending') {
        alert('Cannot change status while policy is pending.');
        selectElement.value = user.policyStatus;
        return;
      }

      this.selectedPolicyNumber = policyNumber;
      this.currentStatus = newStatus;
      this.changeReason = '';
    }
  }

  showReasonInput(policyNumber: string): void {
    this.selectedPolicyNumber = policyNumber;
  }

  confirmStatusChange(): void {
    if (this.selectedPolicyNumber && this.changeReason) {
      const updatedStatus = this.currentStatus;

      if (updatedStatus) {
        this.dataService.updatePolicyStatus(this.selectedPolicyNumber, updatedStatus, this.changeReason).subscribe({
          next: () => {
            console.log('Policy status updated successfully');

            const user = this.users.find(u => u.policyNumber === this.selectedPolicyNumber);
            if (user) {
              user.policyStatus = updatedStatus;
              user.changeReason = this.changeReason;
              this.paginateUsers();
              this.updateDoughnutChart();
            }

            this.selectedPolicyNumber = null;
            this.changeReason = '';
            this.currentStatus = '';
          },
          error: (err) => {
            console.error('Error updating policy status:', err);
          }
        });
      }
    }
  }

  cancelStatusChange(): void {
    this.selectedPolicyNumber = null;
    this.changeReason = '';
    this.currentStatus = '';
  }

  downloadPolicy(policy: any): void {
    const doc = new jsPDF();

    doc.text('Policy Details', 14, 16);
    (doc as any).autoTable({
      startY: 20,
      head: [['Field', 'Value']],
      body: [
        ['Policy Number', policy.policyNumber],
        ['First Name', policy.firstName],
        ['Last Name', policy.lastName],
        ['Insurance Coverage', policy.insuranceCoverage],
        ['Insurance Premium', policy.insurancePremium],
        ['Policy Start Date', policy.policyStartDate],
        ['Policy End Date', policy.policyEndDate],
        ['Claim ID', policy.claimDetails?.id || 'N/A'],
        ['Claim Status', policy.claimDetails?.claimStatus || 'N/A'],
        ['Policy Status', policy.policyStatus || 'N/A'],
        ['Change Reason', policy.changeReason || 'N/A']
      ]
    });

    doc.save(`policy_${policy.policyNumber}.pdf`);
  }

  filterByPolicyStatus(): void {
    if (this.selectedPolicyStatus) {
      this.users = this.originalUsers.filter(user => user.policyStatus === this.selectedPolicyStatus);
    } else {
      this.users = [...this.originalUsers];
    }
    this.paginateUsers();
    this.updateDoughnutChart();
  }

  clearPolicyStatusFilter(): void {
    this.selectedPolicyStatus = '';
    this.users = [...this.originalUsers];
    this.paginateUsers();
    this.updateDoughnutChart();
  }

  sendForApproval(policyNumber: string): void {
    const user = this.users.find(u => u.policyNumber === policyNumber);
    if(user.sentByAdmin)
      {
        alert('Policy sent for approval please wait for sometime');
      }
      else{
    if (user) {
      // Update the existing policy details
      user.policyStatus = 'pending'; // Set the policy status to 'pending'
      user.sentByAdmin = true; // Add or update the field indicating the policy was sent by an admin
  
      // Update policy in the JSON server or backend
      this.dataService.updatePolicy(user).subscribe({
        next: () => {
          alert('Policy sent for approval successfully');
          this.paginateUsers(); // Refresh the paginated list if necessary
          this.updateDoughnutChart();
        },
        error: (err) => {
          alert('Error updating policy for approval');
        }
      });
    } else {
      alert('Policy not found');
    }
    }
  }
}
