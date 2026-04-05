import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AppService {
    constructor(private httpClient: HttpClient){

    }

    getUsers(){
        return this.httpClient.get('https://api.thecatapi.com/v1/images/search?limit=10')
    }
}