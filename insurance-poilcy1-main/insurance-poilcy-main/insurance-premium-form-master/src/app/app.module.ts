// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { PremiumFormComponent } from './premium-form/premium-form.component';
import { HomeComponent } from './home/home.component';
import { DataTableComponent } from './data-table/data-table.component';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { PolicyDetailsComponent } from './policy-details/policy-details.component';
import { DoctorComponentComponent } from './doctor-component/doctor-component.component';
import { DataclaimComponent } from './dataclaim/dataclaim.component';
import { ClaimdetailsComponent } from './claimdetails/claimdetails.component';
import { PolicyFormComponent } from './policy-form/policy-form.component';
import { ClaimFormComponent } from './claim-form/claim-form.component';
import { PolicyStatusCheckComponent } from './policy-status-check/policy-status-check.component'; // Import HttpClientModule
import { ReactiveFormsModule } from '@angular/forms';
import { VerificationComponent } from './verification/verification.component';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    PremiumFormComponent,
    HomeComponent,
    DataTableComponent,
    PolicyDetailsComponent,
    DoctorComponentComponent,
    DataclaimComponent,
    ClaimdetailsComponent,
    PolicyFormComponent,
    ClaimFormComponent,
    PolicyStatusCheckComponent,
    VerificationComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule ,
    HttpClientModule,
    ReactiveFormsModule,
    NgChartsModule


  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
 