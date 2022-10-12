import { Asset } from '@/models/asset';
import { AssetService } from '@/services/asset.service';
import { LogService } from '@/services/log.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'update-asset',
  templateUrl: './update-asset.component.html',
  styleUrls: ['./update-asset.component.css']
})
export class UpdateAssetComponent implements OnInit {
  assetTagId: number;
  asset: Asset = new Asset();

  constructor(private assetService: AssetService, private logService: LogService, 
              private route: ActivatedRoute, private router: Router){}

  ngOnInit(){
    this.route.params.subscribe(params => this.assetTagId = params["id"]);
    this.assetService.getAssetDetails(this.assetTagId).subscribe(asset => this.asset = asset);
  }

  updateAsset(){
    this.assetService.updateAsset(this.asset).subscribe(asset => this.asset = asset);
    this.logService.success("Successfully updated the asset.", this.asset);
    this.router.navigate(["/asset", "details", this.asset.assetTagId]);
  }

  cancel(){
    this.router.navigate(["/asset", "details", this.asset.assetTagId]);
  }

  getRetiredString(){
    if(this.asset){
      return this.asset.retired ? "True" : "False";
    }

    return "";
  }
}