export class GoogleToken {
    token: string;
    id_token: string;
    userData: UserData;

    constructor(data: any) {
        this.token = data.token;
        this.id_token = data.id_token;
        this.userData = new UserData(data.userData);
    }
}

export class UserData {
    id: number;
    name: string;
    role: string;
    ressources: Ressource[];
    googleId: string;
    googleProfile: GoogleProfile;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.role = data.role;
        this.ressources = data.ressources.map((r: any) => new Ressource(r));
        this.googleId = data.googleId;
        this.googleProfile = new GoogleProfile(data.googleProfile);
    }
}

export class Ressource {
    Name: string;
    Description: string;

    constructor(data: any) {
        this.Name = data.Name;
        this.Description = data.Description;
    }
}

export class GoogleProfile {
    id: string;
    displayName: string;
    name: Name;
    photos: Photo[];
    provider: string;
    _raw: string;
    _json: ProfileJson;

    constructor(data: any) {
        this.id = data.id;
        this.displayName = data.displayName;
        this.name = new Name(data.name);
        this.photos = data.photos.map((p: any) => new Photo(p));
        this.provider = data.provider;
        this._raw = data._raw;
        this._json = new ProfileJson(data._json);
    }
}

export class Name {
    givenName: string;

    constructor(data: any) {
        this.givenName = data.givenName;
    }
}

export class Photo {
    value: string;

    constructor(data: any) {
        this.value = data.value;
    }
}

export class ProfileJson {
    sub: string;
    name: string;
    given_name: string;
    picture: string;

    constructor(data: any) {
        this.sub = data.sub;
        this.name = data.name;
        this.given_name = data.given_name;
        this.picture = data.picture;
    }
}
