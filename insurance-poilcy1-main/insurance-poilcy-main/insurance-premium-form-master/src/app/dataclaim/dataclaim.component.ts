// src/app/dataclaim/dataclaim.component.ts
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service'; // Adjust the path as per your service location
import { Router } from '@angular/router';

@Component({
  selector: 'app-dataclaim',
  templateUrl: './dataclaim.component.html',
  styleUrls: ['./dataclaim.component.css']
})
export class DataclaimComponent implements OnInit {
  claims: any[] = [];
  paginatedClaims: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.dataService.getClaims().subscribe((data: any[]) => {
      this.claims = data;
      this.updatePagination();
    });
  }

  getPageNumbers(): number[] {
    return Array(Math.ceil(this.claims.length / this.itemsPerPage))
      .fill(0)
      .map((x, i) => i + 1);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedClaims = this.claims.slice(startIndex, endIndex);
  }
  viewPolicyDetails(policyNumber: string): void {
    this.router.navigate(['/policy-details', policyNumber]);
  }
  viewclaimDetails(claimNumber: string): void {
    this.router.navigate(['/claim-details', claimNumber]);
  }
  goBack(): void {
    this.router.navigate(['/dataclaim']);
  }
}
