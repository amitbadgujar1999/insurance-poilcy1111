import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

interface Dependent {
  id: number;
  name: string;
}

interface User {
  id: number;
  firstName: string;
  dependents?: Dependent[];
}

@Component({
  selector: 'app-claim-form',
  templateUrl: './claim-form.component.html',
  styleUrls: ['./claim-form.component.css']
})
export class ClaimFormComponent implements OnInit {
  claim = {
    id: '',
    claimNumber: '',
    patientName: '',
    policyNumber: '',
    dateOfClaim: '',
    claimAmount: 0,
    claimStatus: 'Pending',
    dateOfIncident: '',
    incidentDescription: '',
    hospitalName: '',
    doctorName: '',
    diagnosis: '',
    treatmentDetails: '',
    amountApproved: 0,
    amountPaid: 0,
    pendingAmount: 0,
    documentsSubmitted: ''
  };

  private claimIdCounter: number = 1;
  successMessage: string = '';
  users: any[] = []; // Store users and dependents

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadClaimIdCounter();
    this.generateClaimId();
  }

  loadClaimIdCounter() {
    const storedCounter = localStorage.getItem('claimIdCounter');
    this.claimIdCounter = storedCounter ? parseInt(storedCounter, 10) : 1;
  }

  generateClaimId() {
    const prefix = 'CLM';
    const paddedCounter = this.claimIdCounter.toString().padStart(2, '0');
    this.claim.id = `${prefix}${paddedCounter}`;
    this.claimIdCounter++;
    localStorage.setItem('claimIdCounter', this.claimIdCounter.toString());
  }

  loadUsers() {
    this.dataService.getUsersByPolicyNumber(this.claim.policyNumber).subscribe(users => {
      console.log('Users loaded:', users); // Check data in console
      this.users = users.flatMap(user => [
        { name: user.firstName, id: user.id },
        ...(user.dependents || []).map((dependent: Dependent) => ({ name: dependent.name, id: dependent.id }))
      ]);
    });
  }

  onPolicyNumberChange() {
    if (this.claim.policyNumber) {
      this.loadUsers(); // Fetch users only when the policy number is entered
    } else {
      this.users = []; // Clear user list if no policy number
    }
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.saveClaim(this.claim);
    }
  }

  saveClaim(claim: any) {
    this.dataService.addClaimToPrimary(claim).subscribe(response => {
      console.log('Claim saved to primary:', response);
      this.dataService.addClaimToSecondary(claim).subscribe(response => {
        console.log('Claim saved to secondary:', response);
        this.successMessage = `Claim submitted successfully! Your claim number is ${claim.claimNumber}.`;
        this.resetForm();
      }, error => {
        console.error('Error saving claim to secondary:', error);
      });
    }, error => {
      console.error('Error saving claim to primary:', error);
    });
  }

  resetForm() {
    this.claim = {
      id: '',
      claimNumber: '',
      patientName: '',
      policyNumber: '',
      dateOfClaim: '',
      claimAmount: 0,
      claimStatus: 'Pending',
      dateOfIncident: '',
      incidentDescription: '',
      hospitalName: '',
      doctorName: '',
      diagnosis: '',
      treatmentDetails: '',
      amountApproved: 0,
      amountPaid: 0,
      pendingAmount: 0,
      documentsSubmitted: ''
    };
    this.generateClaimId();
  }

  onFileChange(event: any) {
    const files = event.target.files;
    console.log(files);
  }
}
