import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap ,map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private usersUrl = 'http://localhost:3000/users'; // this is url for get user details
  private claimsUrl = 'http://localhost:3000/claim'; // Assuming the endpoint is plural
  private claimDetailsUrl = 'http://localhost:3000/claimNumber'; // Endpoint for individual claims

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.usersUrl).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return of([]); // Return an empty array on error
      })
    );
  }

 

  getPolicyDetails(policyNumber: string): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}/${policyNumber}`).pipe(
      catchError(error => {
        console.error('Error fetching policy details:', error);
        return of(null); // Return null on error
      })
    );
  }
  


  getClaims(): Observable<any[]> {
    return this.http.get<any[]>(this.claimsUrl).pipe(
      catchError(error => {
        console.error('Error fetching claims:', error);
        return of([]); // Return an empty array on error
      })
    );
  }

  getClaimDetails(claimNumber: string): Observable<any> {
    return this.http.get<any>(`${this.claimDetailsUrl}/${claimNumber}`).pipe(
      catchError(error => {
        console.error('Error fetching claim details:', error);
        return of(null); // Return null on error
      })
    );
  }

  getClaimByNumber(claimNumber: string): Observable<any> {
    return this.http.get<any[]>(`${this.claimsUrl}?claimNumber=${claimNumber}`).pipe(
      switchMap(claims => claims.length ? of(claims[0]) : of(null)),
      catchError(error => {
        console.error('Error fetching claim by number:', error);
        return of(null); // Return null on error
      })
    );
  }
  savePolicy(policy: any): Observable<any> {
    return this.http.post(this.usersUrl, policy);
  }
  updateClaim(claimNumber: string, updatedClaim: any): Observable<any> {
    return this.http.patch<any>(`${this.claimDetailsUrl}/${claimNumber}`, updatedClaim).pipe(
      catchError(error => {
        console.error('Error updating claim:', error);
        return of(null); // Return null on error
      })
    );
  }

  approveClaim(claimNumber: string): Observable<any> {
    return this.getClaimByNumber(claimNumber).pipe(
      switchMap(claim => {
        if (claim) {
          // Update the claim status to 'approved'
          return this.http.patch<any>(`${this.claimDetailsUrl}/${claim.claimNumber}`, { claimStatus: 'Approved' });
        } else {
          // Provide meaningful error handling
          return of(null); // Return null or handle as needed
        }
      }),
      catchError(error => {
        console.error('Error approving claim:', error);
        return of(null); // Return null on error
      })
    );
  }
  addClaimToPrimary(claim: any): Observable<any> {
    return this.http.post<any>(this.claimsUrl, claim);
  }

  addClaimToSecondary(claim: any): Observable<any> {
    return this.http.post<any>(this.claimDetailsUrl, claim);
  }
  getClaimDetails1(policyNumber: string): Observable<any> {
    return this.http.get<any>(`${this.claimDetailsUrl}?policyNumber=${policyNumber}`);
  }
  updatePolicyStatus(policyNumber: string, status: string, reason: string): Observable<void> {
    return this.http.patch<void>(`${this.usersUrl}/${policyNumber}`, {
      policyStatus: status,
      changeReason: reason
    });
  }
  
  getPolicyStatus(policyNumber: string): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}?policyNumber=${policyNumber}`).pipe(
      catchError(error => {
        console.error('Error fetching policy status:', error);
        return of(null); // Return null on error
      })
    );
  }

  // Method to get claim status by claim number
  getClaimStatus(claimNumber: string): Observable<any> {
    return this.http.get<any>(`${this.claimDetailsUrl}?claimNumber=${claimNumber}`).pipe(
      catchError(error => {
        console.error('Error fetching claim status:', error);
        return of(null); // Return null on error
      })
    );
  }
  getUsersByPolicyNumber(policyNumber: string): Observable<any[]> {
    // Replace the URL with your endpoint for fetching users by policy number
    return this.http.get<any[]>(`${this.usersUrl}?policyNumber=${policyNumber}`);
  }
  
  getPolicyByNumber(policyNumber: string): Observable<any> {
  return this.http.get<any[]>(`${this.usersUrl}?policyNumber=${policyNumber}`).pipe(
    switchMap(policies => policies.length ? of(policies[0]) : of(null)),
    catchError(error => {
      console.error('Error fetching policy by number:', error);
      return of(null); // Handle error
    })
  );
}
sendPolicyForApproval(policy: any): Observable<any> {
  return this.http.post(`${this.usersUrl}/sendForApproval`, policy).pipe(
    map(response => response),
  );
}
updatePolicy(policy: any): Observable<any> {
  return this.http.put(`${this.usersUrl}/${policy.policyNumber}`, policy).pipe(
    map(response => response),
  );
}
verifyPolicy(policyId: string, status: string, reason: string): Observable<any> {
  return this.http.patch<any>(`${this.usersUrl}/${policyId}`, { status, reason }).pipe(
    catchError(error => {
      console.error('Error verifying policy:', error);
      return of(null);
    })
  );
}
getPoliciesForApproval(): Observable<any[]> {
  return this.http.get<any[]>(`${this.usersUrl}`).pipe(
    catchError(error => {
      console.error('Error fetching policies for approval:', error);
      return of([]); // Return an empty array on error
    })
  );
}

approvePolicy(policyNumber: string): Observable<any> {
  return this.http.patch<any>(`${this.usersUrl}/${policyNumber}`, { policyStatus: 'Approved' }).pipe(
    catchError(error => {
      console.error('Error approving policy:', error);
      return of(null); // Return null on error
    })
  );
}

rejectPolicy(policyNumber: string): Observable<any> {
  return this.http.patch<any>(`${this.usersUrl}/${policyNumber}`, { policyStatus: 'Rejected' }).pipe(
    catchError(error => {
      console.error('Error rejecting policy:', error);
      return of(null); // Return null on error
    })
  );
}
getClaimDetails2(): Observable<any[]> {
    return this.http.get<any[]>(this.claimDetailsUrl);
  }
}



