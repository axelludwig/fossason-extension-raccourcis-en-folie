import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AxiosService, GetOptions } from '../core/services/axios/axios.service';
import { SessionService } from '../core/services/session/session.service';
import { SocketService } from '../core/services/socket/socket.service';
import { environment } from '../core/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public isPlaying: boolean = false;

  constructor(private router: Router, private axiosService: AxiosService, private sessionStorage: SessionService, private socketService: SocketService) { }

  ngOnInit() {
    this.getUserInfos();
  }

  getUserInfos() {
    var options: GetOptions = {
      url: "/profile"
    }
    this.axiosService.get(options)
      .then((res: any) => {
        if (res) {
          localStorage.setItem('google-connected-user', JSON.stringify(res));

          this.sessionStorage.googleToken = res.token;
          this.socketService.connectWithToken();

          this.sessionStorage.isLoggedIn = true;
          this.sessionStorage.mustUseSelectAccount = false;
        }
      })
      .catch((err) => {
        //On est pas connecté, go se connecter !
        this.sessionStorage.isLoggedIn = false;
        window.location.href = environment.serverURL + '/auth/google' + (this.sessionStorage.mustUseSelectAccount ? '_select_account' : '');
      })
  }

  play() {
    console.log("play");
    this.socketService.botChangePauseState(this.isPlaying);
  }
}
