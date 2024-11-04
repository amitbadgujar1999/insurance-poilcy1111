import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { PremiumFormComponent } from './premium-form/premium-form.component';
import { HomeComponent } from './home/home.component';
import { DataTableComponent } from './data-table/data-table.component';
import { PolicyDetailsComponent } from './policy-details/policy-details.component';
import { DoctorComponentComponent } from './doctor-component/doctor-component.component';
import { DataclaimComponent } from './dataclaim/dataclaim.component';
import { ClaimdetailsComponent } from './claimdetails/claimdetails.component';
import { PolicyFormComponent } from './policy-form/policy-form.component';
import { ClaimFormComponent } from './claim-form/claim-form.component';
import { PolicyStatusCheckComponent } from './policy-status-check/policy-status-check.component';
import { VerificationComponent } from './verification/verification.component';

const routes: Routes = [
  { 
    path: 'home', 
    component: HomeComponent},
      { path: 'premium-form', component: PremiumFormComponent },
      { path: 'policy-form', component: PolicyFormComponent },
      { path: 'claim-form', component: ClaimFormComponent },
      { path: 'policystatuscheck', component: PolicyStatusCheckComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'data-table', component: DataTableComponent },
      { path: 'verification', component: VerificationComponent },
      { path: 'policy-details/:policyNumber', component: PolicyDetailsComponent },
      { path: 'doctor', component: DoctorComponentComponent },
      { path: 'dataclaim', component: DataclaimComponent },
      { path: 'claim-details/:claimNumber', component: ClaimdetailsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' } ,// Default to premium-form within home
    
  
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect empty path to /home
  { path: '**', redirectTo: '/home', pathMatch: 'full' } // Wildcard route redirects to /home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
