import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service'; // Adjust the path as needed

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  policies: any[] = []; // Array to hold policies awaiting approval

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.dataService.getPoliciesForApproval().subscribe({
      next: (policies) => {
        // Filter policies with 'pending' status and sent by admin
        this.policies = policies.filter(policy =>
          policy.policyStatus === 'pending' && policy.sentByAdmin === true
        );
      },
      error: (error) => {
        console.error('Error loading policies:', error);
      }
    });
  }

  approvePolicy(policyNumber: string): void {
    this.dataService.approvePolicy(policyNumber).subscribe({
      next: (response) => {
        console.log('Policy approved:', response);
        // Remove the approved policy from the list
        this.policies = this.policies.filter(policy => policy.policyNumber !== policyNumber);
      },
      error: (error) => {
        console.error('Error approving policy:', error);
      }
    });
  }

  rejectPolicy(policyNumber: string): void {
    this.dataService.rejectPolicy(policyNumber).subscribe({
      next: (response) => {
        console.log('Policy rejected:', response);
        // Remove the rejected policy from the list
        this.policies = this.policies.filter(policy => policy.policyNumber !== policyNumber);
      },
      error: (error) => {
        console.error('Error rejecting policy:', error);
      }
    });
  }
}
