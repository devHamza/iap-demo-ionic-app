import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CreditType } from "../../models/credits/CreditType";

@Injectable()
export class CreditsProvider {

    constructor(private httpClient: HttpClient) { }

    public purchase(_type: CreditType, _receipt: string): Observable<any> {

        //TODO : REMOVE MOCK URL AND REPLACE IT WITH YOUR API URL THIS WAS DONE JUST FOR TESTING PURPOSES
        return this.httpClient.post<any>('https://demo8791648.mockable.io/credits/purchases', {
            type: _type,
            receipt: _receipt
        });
    }
}