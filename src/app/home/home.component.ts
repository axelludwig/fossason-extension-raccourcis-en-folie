import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AxiosService, GetOptions } from '../core/services/axios/axios.service';
import { SessionService } from '../core/services/session/session.service';
import { SocketService } from '../core/services/socket/socket.service';
import { environment } from '../core/environments/environment';
import { ApiKeyService } from '../shared/services/api-key.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public isPlaying: boolean = false;
  inputApiKey: string = '';
  apiKey: string = '';

  constructor(private socketService: SocketService, private apiKeyService: ApiKeyService) { }

  async ngOnInit() {
    this.apiKey = await this.apiKeyService.getApiKey() || '';
    this.getUserInfos();
  }

  getUserInfos() {
    console.log("Connecting to API with API key: ", this.apiKey);
    this.socketService.connectWithApplicationKey(this.apiKey);
  }

  play() {
    this.socketService.botChangePauseState(this.isPlaying);
  }
}
