import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { DataService } from '../data.service'; // Adjust path as per your service location

@Component({
  selector: 'app-policy-details',
  templateUrl: './policy-details.component.html',
  styleUrls: ['./policy-details.component.css']
})
export class PolicyDetailsComponent implements OnInit {
  policyNumber: string = '';
  policyDetails: any;
  loading: boolean = true;
  claimDetails: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject Router
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const policyNumberParam = params['policyNumber'];
      if (policyNumberParam) {
        this.policyNumber = policyNumberParam;
        this.loadPolicyDetails();
        this.fetchClaimDetails(this.policyNumber); // Pass policy number here
      } else {
        console.error('Policy number not provided');
        this.loading = false;
      }
    });
  }

  loadPolicyDetails(): void {
    if (this.policyNumber) {
      this.dataService.getPolicyDetails(this.policyNumber).subscribe(
        data => {
          this.policyDetails = data;
          this.loading = false;
        },
        error => {
          console.error('Error fetching policy details:', error);
          this.loading = false;
        }
      );
    }
  }

  fetchClaimDetails(policyNumber: string): void {
    this.dataService.getClaimDetails2().subscribe(
      data => {
        if (Array.isArray(data)) {
          // Assuming claim details contain a property 'policyNumber' to filter by
          this.claimDetails = data.filter(claim => claim.policyNumber === policyNumber);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      },
      error => {
        console.error('Error fetching claim details:', error);
      }
    );
  }

  viewClaimDetails(claimNumber: string): void {
    this.router.navigate(['/claim-details', claimNumber]);
  }

  goBack(): void {
    this.router.navigate(['/data-table']); // Adjust the route as needed
  }
}
