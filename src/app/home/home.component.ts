import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';
import { SocketService } from '../core/services/socket/socket.service';
import { ApiKeyService } from '../shared/services/api-key.service';
import { StoreService } from '../core/services/store/store.service';
import { PopupService } from '../shared/services/popup.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('marqCont') marqueeContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('marqText') marqueeText!: ElementRef<HTMLDivElement>;

  apiKey = '';
  fontSize = 16;
  color = '#FFF';
  speed = 30; // px par seconde

  innerWidth = window.innerWidth;
  innerHeight = window.innerHeight;

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this.innerWidth = (event.target as Window).innerWidth;
    this.innerHeight = (event.target as Window).innerHeight;
    console.log(`Nouvelle taille : ${this.innerWidth}×${this.innerHeight}`);
    this.startMarquee();
  }

  private marqueeAnimation?: Animation;

  constructor(
    private socketService: SocketService,
    private apiKeyService: ApiKeyService,
    public store: StoreService,
    private popupService: PopupService
  ) { }

  async ngOnInit() {
    this.apiKey = await this.apiKeyService.getApiKey() || '';
    this.socketService.connectWithApplicationKey(this.apiKey);
  }

  ngAfterViewInit() {
    // À chaque nouveau son émis par le service…
    this.socketService.soundPlaying$.subscribe(sound => {
      this.store.soundPlaying = sound;
      // on attend un tick pour que *ngIf ait créé le DOM
      setTimeout(() => this.startMarquee(), 0);
    });
  }

  private startMarquee() {
    const contEl = this.marqueeContainer.nativeElement;
    const textEl = this.marqueeText.nativeElement;

    // Annule l’ancienne animation
    if (this.marqueeAnimation) {
      this.marqueeAnimation.cancel();
    }

    // Styles pour mesurer
    textEl.style.whiteSpace = 'nowrap';
    textEl.style.display = 'inline-block';

    const cw = contEl.clientWidth;
    const sw = textEl.scrollWidth;
    const overflow = sw - cw + 16;
    if (overflow <= 0) { return; }  // pas de scroll nécessaire

    // Durées en ms
    const travelTime = (overflow / this.speed) * 1000;
    const pauseTime = 1500;              // 2 s de pause
    const cycleTime = travelTime + pauseTime * 2;

    // Keyframes avec offsets pour pauses aux deux bouts
    const keyframes = [
      { transform: 'translateX(0)', offset: 0 }, // début
      { transform: 'translateX(0)', offset: pauseTime / cycleTime }, // fin pause départ
      { transform: `translateX(-${overflow}px)`, offset: (pauseTime + travelTime) / cycleTime }, // fin déplacement
      { transform: `translateX(-${overflow}px)`, offset: 1 }  // fin pause arrivée
    ];

    this.marqueeAnimation = textEl.animate(keyframes, {
      duration: cycleTime,
      iterations: Infinity,
      direction: 'alternate',  // fait l’aller-retour
      easing: 'linear'
    });
  }


  openAccountParameters() {
    this.popupService.openAccountPopup();
  }
}
