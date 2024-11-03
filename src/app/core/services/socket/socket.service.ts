import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { SessionService } from '../session/session.service';
import { Sound, Tag } from '../../../../declarations';

@Injectable({
	providedIn: 'root'
})
export class SocketService {
	private _connect = new Subject<boolean>();
	connect$ = this._connect.asObservable();
	private _disconnect = new Subject<boolean>();
	disconnect$ = this._disconnect.asObservable();

	private _botChangeChannel = new Subject<string>();
	botChangeChannel$ = this._botChangeChannel.asObservable();
	private _botDisconnect = new Subject<object>();
	botDisconnect$ = this._botDisconnect.asObservable();

	private _userChangeChannel = new Subject<object>();
	userChangeChannel$ = this._userChangeChannel.asObservable();
	private _userDisconnectsChannel = new Subject<string>();
	userDisconnectsChannel$ = this._userDisconnectsChannel.asObservable();

	private _soundPlaying = new Subject<Sound>();
	soundPlaying$ = this._soundPlaying.asObservable();
	private _botChangeVolume = new Subject<number>();
	botChangeVolume$ = this._botChangeVolume.asObservable();
	private _botChangeMode = new ReplaySubject<string>();
	botChangeMode$ = this._botChangeMode.asObservable();
	private _botChangePauseState = new Subject<boolean>();
	botChangePauseState$ = this._botChangePauseState.asObservable();

	private _sounds = new Subject<Sound[]>();
	sounds$ = this._sounds.asObservable();
	private _deleteSound = new Subject<number>();
	deleteSound$ = this._deleteSound.asObservable();
	private _soundRenamed = new Subject<any>();
	soundRenamed$ = this._soundRenamed.asObservable();
	private _soundUpdated = new Subject<Sound>();
	soundUpdated$ = this._soundUpdated.asObservable();

	private _newSound = new Subject<Sound>();
	newSound$ = this._newSound.asObservable();

	private _queueUpdate = new Subject<any>();
	queueUpdate$ = this._queueUpdate.asObservable();

	private _elapsedTime = new Subject<number>();
	elapsedTime$ = this._elapsedTime.asObservable();

	private _tags = new ReplaySubject<Tag[]>();
	tags$ = this._tags.asObservable();
	private _newTag = new Subject<Tag>();
	newTag$ = this._newTag.asObservable();

	private _startBlindTest = new Subject<any>();
	startBlindTest$ = this._startBlindTest.asObservable();
	private _stopBlindTest = new Subject<any>();
	stopBlindTest$ = this._stopBlindTest.asObservable();

	private _notify = new Subject<any>();
	notify$ = this._notify.asObservable();
	private _notifyEdit = new Subject<any>();
	notifyEdit$ = this._notifyEdit.asObservable();

	private _log = new Subject<any>();
	log$ = this._log.asObservable();

	constructor(private socket: Socket, private sessionService: SessionService) {
		this.socket.on('connect', () => {
			this.onConnect();
		})
		this.socket.on('disconnect', () => {
			this.onDisconnect();
		})

		// bot management
		this.socket.on('botChangeChannel', (id: string) => {
			this._botChangeChannel.next(id);
		})
		this.socket.on('botDisconnect', (res: any) => {
			this._botDisconnect.next(res);
		})


		//sound management
		this.socket.on('soundPlaying', (sound: Sound) => {
			this._soundPlaying.next(sound);
		});
		this.socket.on('botChangeVolume', (data: number) => {
			this._botChangeVolume.next(data);
		})
		this.socket.on('botChangeMode', (value: string) => {
			this._botChangeMode.next(value);
		})
		this.socket.on('botChangePauseState', (state: boolean) => {
			this._botChangePauseState.next(state);
		})



		//time management
		this.socket.on('elapsedTime', (time: number) => {
			this._elapsedTime.next(time);
		});

		//tags management
		this.socket.on('tagsLoaded', (tags: Tag[]) => {
			this._tags.next(tags);
		});
		this.socket.on('tagUpdated', (tag: Tag) => {
			this._newTag.next(tag);
		});

		this.socket.on('log', (message: string) => {
			console.log(message);
		});

		//blind test
		this.socket.on('blindTestStarted', (data: any) => {
			let newData = {
				isMaster: data.isMaster,
				masterUsername: data.masterUserName
			}; this._startBlindTest.next(newData);
		});

		this.socket.on('blindTestStopped', () => {
			this._stopBlindTest.next(null);
		});

		this.socket.on('notification', (data: any) => {
			this._notify.next(data);
		});

		this.socket.on(' ', (data: any) => {
			this._notifyEdit.next(data);
		});
	}

	connectWithToken() {
		this.socket.connect();
	}

	//emmiting
	onConnect(): void {
		this._connect.next(true);
	}
	onDisconnect(): void {
		this._disconnect.next(true);
	}

	// bot management
	joinChannel(id: string) {
		this.socket.emit("joinChannel", id);
	}
	leaveChannel() {
		this.socket.emit("leaveChannel");
	}

	//sound management
	playSound(soundIds: number[]) {
		this.socket.emit("playSound", soundIds);
	}
	skipSound() {
		this.socket.emit('skipSound');
	}

	clearQueue() {
		this.socket.emit('clearQueue');
	}

	removeSoundFromQueue(elementId: string) {
		this.socket.emit('removeSoundFromQueue', elementId);
	}

	botChangePauseState(state: boolean) {
		state = !state;
		let event = state ? 'pauseSound' : 'unpauseSound'
		this.socket.emit(event, state);
	}

	setVolume(value: number) {
		this.socket.emit("setVolume", value);
	}
	setMode(value: string) {
		this.socket.emit("setMode", value);
	}

	deleteSound(soundId: number) {
		this.socket.emit('deleteSound', soundId);
	}

	setAudioTime(time: number) {
		this.socket.emit('seekSound', time);
	}

	updateQueueIndex(data: string) {
		this.socket.emit('updateQueueIndex', data);
	}

	playNext(soundId: number) {
		this.socket.emit('playSoundNext', soundId);
	}

	//blind test
	startBlindTest() {
		let data = {
			isMaster: true,
			userName: this.sessionService.getDisplayName()
		}; this.socket.emit('startBlindTest', data);
	}

	stopBlindTest() {
		this.socket.emit('stopBlindTest');
	}
}