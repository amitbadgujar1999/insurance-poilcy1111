import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-premium-form',
  templateUrl: './premium-form.component.html',
  styleUrls: ['./premium-form.component.css']
})
export class PremiumFormComponent implements OnInit {
  premiumForm: FormGroup; // Define the FormGroup
  totalPremium: number | null = null; // To store the total premium amount
  age: number | null = null; // To store the calculated age

  constructor(private fb: FormBuilder) {
    // Initialize the form group with default values
    this.premiumForm = this.fb.group({
      customerName: ['', Validators.required],
      birthdate: ['', Validators.required],
      age: [{ value: '', disabled: true }, Validators.required],
      coverageAmount: ['', Validators.required],
      years: ['', Validators.required],
      dependents: this.fb.array([]),
      tobacco: [false],  // Ensure this is a boolean
      smoking: [false],  // Ensure this is a boolean
      alcohol: [false]   // Ensure this is a boolean
    });
  }

  ngOnInit(): void {
    // Any additional initialization can go here
  }

  // Getter for dependents form array
  dependents(): FormArray {
    return this.premiumForm.get('dependents') as FormArray;
  }

  // Method to add a new dependent
  addDependent() {
    this.dependents().push(this.fb.group({
      name: [''],
      age: ['']
    }));
  }

  // Method to remove a dependent
  removeDependent(index: number) {
    this.dependents().removeAt(index);
  }

  // Method to calculate age from birthdate
  calculateAge() {
    const birthdate = this.premiumForm.get('birthdate')?.value;
    if (birthdate) {
      const birthDate = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.age = age;
      this.premiumForm.get('age')?.setValue(this.age);
    }
  }

  // Method to handle form submission
  onSubmit() {
    this.calculateAge(); // Ensure age is updated before calculation
    this.totalPremium = this.calculatePremium(); // Calculate the premium
  }

  // Method to calculate premium based on form values
  calculatePremium(): number {
    if (!this.premiumForm.valid) {
      return 0;
    }

    const { coverageAmount, years, dependents, tobacco, smoking, alcohol } = this.premiumForm.value;
    const coverage = +coverageAmount;
    const yearsCount = +years;
    const basePremium = 5000;
    let premium = basePremium;

    // Adjust base premium based on age
    if (this.age !== null) {
      if (this.age >= 20 && this.age <= 25) {
        premium += 0;
      } else if (this.age >= 26 && this.age <= 30) {
        premium += 500;
      } else if (this.age >= 31 && this.age <= 35) {
        premium += 1000;
      } else if (this.age >= 36 && this.age <= 40) {
        premium += 1500;
      } else if (this.age >= 41 && this.age <= 45) {
        premium += 2000;
      } else if (this.age >= 46 && this.age <= 50) {
        premium += 2500;
      } else if (this.age >= 51 && this.age <= 55) {
        premium += 3000;
      } else if (this.age >= 56 && this.age <= 60) {
        premium += 3500;
      }
    }

    // Adjust premium based on coverage amount, only for amounts greater than 1,000,000
    if (coverage > 1000000) {
      premium += ((coverage - 1000000) / 1000000) * 1000; // Increase premium by 1000 INR for each million coverage above 1,000,000
    }

    // Adjust premium based on duration
    premium *= yearsCount;

    // Adjust premium based on dependents
    if (dependents.length) {
      premium += dependents.length * 1000; // Increase premium by 1000 INR per dependent
    }

    // Adjust premium based on bad habits
    let badHabitsCount = 0;
    if (tobacco) badHabitsCount++;
    if (smoking) badHabitsCount++;
    if (alcohol) badHabitsCount++;

    if (badHabitsCount === 3) {
      premium += 3000; // All three habits selected
    } else if (badHabitsCount === 2) {
      premium += 2000; // Any two habits selected
    } else if (badHabitsCount === 1) {
      premium += 1000; // Any one habit selected
    }

    return premium;
  }
}
