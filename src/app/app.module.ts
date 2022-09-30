import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
// used to create fake backend
import { mockBackendProvider } from './helpers/mock-backend';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { AssetService } from './services/asset.service';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule],
  declarations: [ AppComponent, HelloComponent],
  bootstrap:    [ AppComponent ],
  providers: [AssetService, mockBackendProvider]
})
export class AppModule { }
