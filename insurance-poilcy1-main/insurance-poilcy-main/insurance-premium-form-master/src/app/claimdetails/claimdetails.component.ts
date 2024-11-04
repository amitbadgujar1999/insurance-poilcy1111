import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-claimdetails',
  templateUrl: './claimdetails.component.html',
  styleUrls: ['./claimdetails.component.css']
})
export class ClaimdetailsComponent implements OnInit {
  claimNumber: string = '';
  claimDetails: any;
  loading: boolean = true;
  approvalMessage: string = '';  // For feedback message
  showRejectModal: boolean = false;  // For modal visibility
  rejectionReason: string = '';      // For storing rejection reason
$last: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.claimNumber = params['claimNumber'];
      if (this.claimNumber) {
        this.loadClaimDetails();
      } else {
        console.error('Claim number not provided');
        this.loading = false;
      }
    });
  }

  loadClaimDetails(): void {
    if (this.claimNumber) {
      this.dataService.getClaimDetails(this.claimNumber).subscribe({
        next: (data: any) => {
          this.claimDetails = data;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error fetching claim details:', err);
          this.loading = false;
        }
      });
    }
  }

  approveClaim(): void {
    if (this.claimNumber) {
      // Prepare the updated claim status
      const updatedClaim = { ...this.claimDetails, claimStatus: 'Approved' };

      this.dataService.updateClaim(this.claimNumber, updatedClaim).subscribe({
        next: (response: any) => {
          console.log('Claim approved:', response);
          this.claimDetails = response; // Update the claimDetails with the latest status
          this.approvalMessage = 'Claim has been approved successfully!';  // Set success message
          // Optionally, you can refresh or navigate back
        },
        error: (err: any) => {
          console.error('Error approving claim:', err);
          this.approvalMessage = 'Error approving claim. Please try again.';  // Set error message
        }
      });
    }
  }

  rejectClaim(): void {
    this.showRejectModal = true; // Show rejection modal
  }

  confirmReject(): void {
    if (this.rejectionReason.trim()) {
      // Prepare the updated claim status with rejection reason
      const updatedClaim = { ...this.claimDetails, claimStatus: 'Rejected', remarks: this.rejectionReason };

      this.dataService.updateClaim(this.claimNumber, updatedClaim).subscribe({
        next: (response: any) => {
          console.log('Claim rejected:', response);
          this.claimDetails = response; // Update the claimDetails with the latest status
          this.approvalMessage = 'Claim has been rejected successfully!';  // Set success message
          this.showRejectModal = false;  // Hide the modal
          this.rejectionReason = '';     // Clear rejection reason
        },
        error: (err: any) => {
          console.error('Error rejecting claim:', err);
          this.approvalMessage = 'Error rejecting claim. Please try again.';  // Set error message
        }
      });
    } else {
      alert('Please provide a reason for rejection.');
    }
  }

  cancelReject(): void {
    this.showRejectModal = false;  // Hide the modal
  }

  goBack(): void {
    this.router.navigate(['/dataclaim']);
  }
}
