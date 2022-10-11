import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { mockBackendProvider } from './helpers/mock-backend';
import { AppComponent } from './app.component';
import { AssetService } from './services/asset.service';
import { LogService } from './services/log.service';
import { LogProviderService } from './services/log-provider.service';
import { AssetListModule } from './modules/asset-list/asset-list.module';
import { AssetModule } from './modules/asset/asset.module';
import { UtilsModule } from './modules/utils/utils.module';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule, AppRoutingModule, AssetListModule, AssetModule, UtilsModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ AssetService, LogService, LogProviderService, mockBackendProvider ]
})
export class AppModule { }