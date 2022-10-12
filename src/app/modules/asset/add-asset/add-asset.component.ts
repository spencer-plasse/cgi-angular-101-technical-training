import { Asset } from '@/models/asset';
import { AssetService } from '@/services/asset.service';
import { LogService } from '@/services/log.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.css']
})
export class AddAssetComponent{
  asset: Asset = new Asset();

  constructor(private assetService: AssetService, private logService: LogService, private router: Router){
    assetService.getNextAssetId().subscribe(id => this.asset.assetTagId = id);
  }

  addAsset(){
    this.assetService.createAsset(this.asset).subscribe(asset => this.asset = asset);
    this.logService.success("Successfully created a new asset!", this.asset);
    this.router.navigate(["/asset", "details", this.asset.assetTagId]);
  }

  cancel(){
    this.router.navigate(["/assets", "all"]);
  }
}