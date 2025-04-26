import { Component, HostListener, SimpleChanges } from '@angular/core';
import { SocketService } from 'src/services/socket/socket.service';
import { Sound } from '../declarations';
import { StoreService } from 'src/services/store/store.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsModalComponent } from '../modals/settings-modal/settings-modal.component';
import { BlindTestModalComponent } from '../modals/blind-test-modal/blind-test-modal.component';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: any) {
    if (event.code === 'MediaPlayPause') this.togglePause();
    else if (event.code === 'MediaTrackNext') this.skipSound();
  }

  // public isPaused = true;
  public volume: number = 0;
  public isDevEnv: boolean = !environment.production;

  public blindTestIcon: string = "";

  constructor(private socketService: SocketService, public store: StoreService, public dialog: MatDialog, private toastr: ToastrService) {
    this.blindTestIcon = this.showRandomly() ? 'blind' : 'visibility_off';

    

    this.socketService.soundPlaying$.subscribe((sound: Sound) => {
      this.store.soundPlaying = sound;
    });

    this.socketService.botChangeVolume$.subscribe((value: number) => {
      this.volume = value;
    });
  }

  skipSound() {
    this.socketService.skipSound();
  }

  togglePause() {
    // this.socketService.botChangePauseState(this.isPaused);
  }

  onSliderChange(event: any) {
    this.socketService.setVolume(event.value)
  }

  openSettings(event: Event) {
    event.stopPropagation()
    let dialog = this.dialog.open(SettingsModalComponent, {
      disableClose: false,
      width: '400px',
    });

    dialog.afterClosed().subscribe((result: string | null | undefined) => {
      if (result === undefined || result === null || result === '') return;
    });
  }

  openBlindTest(event: Event) {
    event.stopPropagation()
    let dialog = this.dialog.open(BlindTestModalComponent, {
      disableClose: false,
      width: '400px',
    });
  }

  playRandom(event: any) {
    let sounds: Sound[];
    let count = 1;
    if (event.shiftKey) {
      count = 10;
    } else if (event.ctrlKey) {
      count = 100;
    }

    sounds = this.store.displayedSounds;
    let randomSoundsToPlay: Sound[] = [];

    while (count > 0) {
      if (this.store.avoidDuplicates) {
        sounds = this.store.displayedSounds.filter((sound: { ID: any; }) => {
          return !this.store.randomlyPlayedIDs.includes(sound.ID);
        });
        if (sounds.length === 0) {
          sounds = this.store.displayedSounds;
          this.store.randomlyPlayedIDs = [];
        }
      }

      let random = Math.floor(Math.random() * sounds.length);
      let randomSoundID = sounds[random].ID;

      randomSoundsToPlay.push(sounds[random]);

      if (this.store.avoidDuplicates) {
        this.store.randomlyPlayedIDs.push(randomSoundID);
      }
      count--;
    }

    this.socketService.playSound(randomSoundsToPlay.map(x => x.ID));
  }

  isEllipsisActive(e: any) {
    return false;
  }

  showRandomly(): boolean {
    return Math.random() < 0.01;
  }

  debug() {
    // this.toastr.success('Hello world!', 'Toastr fun!');
    // this.store.openCustomSnackBar('loader');
  }
}
