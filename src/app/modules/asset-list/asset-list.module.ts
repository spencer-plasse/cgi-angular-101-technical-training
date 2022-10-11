import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAssetsAllComponent } from './list-assets-all/list-assets-all.component';
import { ListAssetsUserComponent } from './list-assets-user/list-assets-user.component';
import { AssetListComponent } from './asset-list/asset-list.component';
import { AssetFilterComponent } from './asset-filter/asset-filter.component';
import { UtilsModule } from '../utils/utils.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [ ListAssetsAllComponent, ListAssetsUserComponent, AssetListComponent, AssetFilterComponent ],
  imports: [ CommonModule, UtilsModule, BrowserModule, RouterModule, FormsModule ],
  exports: [ ListAssetsAllComponent, ListAssetsUserComponent ]
})
export class AssetListModule { }