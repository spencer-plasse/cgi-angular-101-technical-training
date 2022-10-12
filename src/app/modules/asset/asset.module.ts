import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAssetComponent } from './add-asset/add-asset.component';
import { AssetDetailsComponent } from './asset-details/asset-details.component';
import { UpdateAssetComponent } from './update-asset/update-asset.component';
import { RetireAssetComponent } from './retire-asset/retire-asset.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ AddAssetComponent, AssetDetailsComponent, UpdateAssetComponent, RetireAssetComponent ],
  imports: [ CommonModule, RouterModule, FormsModule ],
  exports: [ AddAssetComponent, AssetDetailsComponent, UpdateAssetComponent, RetireAssetComponent ]
})
export class AssetModule { }
