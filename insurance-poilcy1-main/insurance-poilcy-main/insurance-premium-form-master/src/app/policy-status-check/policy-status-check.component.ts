import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataService } from '../data.service';

@Component({
  selector: 'app-policy-status-check',
  templateUrl: './policy-status-check.component.html',
  styleUrls: ['./policy-status-check.component.css']
})
export class PolicyStatusCheckComponent {
  policyNumber: string = '';
  claimNumber: string = '';
  policyStatus: any;
  claimStatus: any;
  selectedPolicy: any; // Property to hold the selected policy
  selectedClaim: any; // Property to hold the selected claim

  constructor(private dataService: DataService) { }

  checkPolicyStatus(): void {
    if (this.policyNumber) {
      this.dataService.getPolicyStatus(this.policyNumber).subscribe({
        next: (data: any) => {
          this.policyStatus = data[0]; // Adjust as needed
          this.selectedPolicy = this.policyStatus; // Assign the policy to selectedPolicy
        },
        error: (err: any) => {
          console.error('Error fetching policy status:', err);
          this.policyStatus = null;
        }
      });
    }
  }

  checkClaimStatus(): void {
    if (this.claimNumber) {
      this.dataService.getClaimStatus(this.claimNumber).subscribe({
        next: (data: any) => {
          this.claimStatus = data[0]; // Adjust as needed
          this.selectedClaim = this.claimStatus; // Assign the claim to selectedClaim
        },
        error: (err: any) => {
          console.error('Error fetching claim status:', err);
          this.claimStatus = null;
        }
      });
    }
  }

  downloadPolicy(policy: any): void {
    const doc = new jsPDF();

    doc.text('Policy Details', 14, 16);

    autoTable(doc, {
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

    doc.save(`${policy.policyNumber}_PolicyDetails.pdf`);
  }

  downloadClaimDetails(claim: any): void {
    const doc = new jsPDF();

    doc.text('Claim Details', 14, 16);

    autoTable(doc, {
      startY: 20,
      head: [['Field', 'Value']],
      body: [
        ['Claim ID', claim.id],
        ['Claim Status', claim.claimStatus],
        ['Claim Amount', claim.claimAmount || 'N/A'],
        ['Claim Date', claim.claimDate || 'N/A'],
        ['Description', claim.description || 'N/A']
      ]
    });

    doc.save(`${claim.id}_ClaimDetails.pdf`);
  }
}