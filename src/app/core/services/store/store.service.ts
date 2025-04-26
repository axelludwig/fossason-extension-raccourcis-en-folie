import { Injectable, NgZone } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Sound } from '../../../../declarations';

@Injectable({
    providedIn: 'root'
})
export class StoreService {

    isPlaying = true;
    soundPlaying: Sound | undefined;
    volume = 0;

    constructor(
        private socketService: SocketService,
        private zone: NgZone    // pour ramener l’event dans Angular Zone
    ) {
        // Vérifier que l’API electron est présente
        if (window && window.electronAPI) {
            // Play/Pause
            window.electronAPI.onMediaPlayPause(() =>
                this.zone.run(() => { this.playPauseToggle() })
            );
            // Next Track → on appelle skipSound
            window.electronAPI.onMediaNext(() =>
                this.zone.run(() => { this.skipSound() })
            );
            // Previous Track → si vous voulez gérer un “back”, ajoutez une méthode dédiée
            window.electronAPI.onMediaPrev(() =>
                this.zone.run(() => { })  // ou une autre action
            );
            // Volume up/down/mute si besoin…
            window.electronAPI.onVolumeUp(() =>
                this.zone.run(() => {
                    this.volumeUp();
                })
            );
            window.electronAPI.onVolumeDown(() =>
                this.zone.run(() => {
                    this.volumeDown();
                })
            );
            window.electronAPI.onVolumeMute(() =>
                this.zone.run(() => {
                    this.volumeMute();
                })
            );
        }

        this.socketService.botChangePauseState$.subscribe((state: boolean) => {
            this.isPlaying = state;
        });

        this.socketService.botChangeVolume$.subscribe((value: number) => {
            this.volume = value;
        });
    }

    playPauseToggle() {
        this.socketService.botChangePauseState(this.isPlaying);
    }

    skipSound() {
        this.socketService.skipSound();
    }

    volumeUp() {
        this.socketService.setVolume(this.volume + 1);
    }

    volumeDown() {
        this.socketService.setVolume(this.volume - 1);
    }

    volumeMute() {
        this.socketService.setVolume(0);
    }
}
