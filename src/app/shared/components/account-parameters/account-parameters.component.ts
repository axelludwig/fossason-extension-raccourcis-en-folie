import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiKeyService } from '../../services/api-key.service';

@Component({
  selector: 'app-account-parameters',
  templateUrl: './account-parameters.component.html',
  styleUrl: './account-parameters.component.scss'
})
export class AccountParametersComponent {
  apiKey = '';

  constructor(
    private router: Router,
    private apiKeyService: ApiKeyService
  ) { }

  async ngOnInit() {
    this.apiKey = await this.apiKeyService.getApiKey() || ''; // récupère la clé API stockée
  }

  save(): void {
    this.apiKeyService.setApiKey(this.apiKey); // enregistre la clé API
  }
}
