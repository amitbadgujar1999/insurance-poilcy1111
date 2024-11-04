import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

interface Dependent {
  name: string;
  age: string;
}

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.css']
})
export class PolicyFormComponent {
  policyModel = {
    policyNumber: '',
    firstName: '',
    lastName: '',
    insuranceCoverage: '',
    insurancePremium: 0,
    policyStartDate: '',
    policyEndDate: '',
    policyStatus: 'Inactive', // default status value
    dependents: [] as Dependent[] // Explicitly type the dependents array
  };
  isPolicySubmitted = false;
  submittedPolicyNumber = '';
  showDependentForm = false;

  coverageOptions = [
    1000000, 2000000, 3000000, 4000000, 5000000
  ]; // Define coverage options

  constructor(private dataService: DataService, private router: Router) {}

  onSubmit(): void {
    const generatedId = this.generatePolicyNumber();
    const policyData = { ...this.policyModel, id: generatedId, policyNumber: generatedId };

    // Ensure policyStatus is set to 'Inactive' before saving
    policyData.policyStatus = 'Inactive';

    this.dataService.savePolicy(policyData).subscribe(
      response => {
        console.log('Policy saved successfully', response);
        this.submittedPolicyNumber = policyData.policyNumber; // Set the submitted policy number
        this.isPolicySubmitted = true; // Show success message
      },
      error => {
        console.error('Error saving policy', error);
      }
    );
  }

  generatePolicyNumber(): string {
    // Generate and return policy number
    return `POL${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  }

  addDependent(): void {
    this.policyModel.dependents.push({ name: '', age: '' });
    this.showDependentForm = true;
  }

  removeDependent(index: number): void {
    if (this.policyModel.dependents.length > 1) {
      this.policyModel.dependents.splice(index, 1);
    }
    if (this.policyModel.dependents.length === 0) {
      this.showDependentForm = false;
    }
  }
}
