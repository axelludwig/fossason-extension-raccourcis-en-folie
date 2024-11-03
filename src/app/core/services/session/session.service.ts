import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AxiosService } from "../axios/axios.service";
import { GoogleToken } from "../../../../types";

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    constructor(private axios: AxiosService) { }

    public isLoggedIn = false;
    mustUseSelectAccount = false;

    public googleToken?: GoogleToken;

    logout() {
        localStorage.removeItem('google-connected-user');
        this.axios.get({ url: "/logout" }).then(() => {
            this.isLoggedIn = false;
            this.mustUseSelectAccount = true;
        });
    }

    hasRessource(ressource: string): boolean {
        this.googleToken = JSON.parse(localStorage.getItem('google-connected-user') || '{}');
        if (!this.googleToken || this.googleToken === undefined) {
            return false;
        }

        let ressources: any[] = JSON.parse(localStorage.getItem('google-connected-user') || '{}')?.userData.ressources;
        let hasRessource: boolean = ressources.map(x => x.Name).includes(ressource);
        console.log(ressources);
        return hasRessource;
    }

    getName(): string {
        if (this.googleToken === undefined) return "";
        return this.googleToken.userData.googleProfile.displayName
    }

    getDisplayName(): string {
        if (this.googleToken === undefined) return "";
        return this.googleToken.userData.name;
    }

    getPfpUrl(): string {
        if (this.googleToken === undefined) return "";
        return this.googleToken.userData.googleProfile.photos[0].value;
    }
}
