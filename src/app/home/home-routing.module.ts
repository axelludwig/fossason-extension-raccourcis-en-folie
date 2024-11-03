import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AxiosService, GetOptions } from '../core/services/axios/axios.service';
import { SessionService } from '../core/services/session/session.service';
import { SocketService } from '../core/services/socket/socket.service';
import { environment } from '../core/environments/environment';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {

  constructor(private axiosService: AxiosService, private sessionStorage: SessionService, private socketService: SocketService) { } 
 
}


