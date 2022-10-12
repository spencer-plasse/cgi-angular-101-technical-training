import { Asset } from '@/models/asset';
import { AssetService } from '@/services/asset.service';
import { LogService } from '@/services/log.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.css']
})
export class AssetDetailsComponent implements OnInit {
  @Input() user: string;
  asset: Asset;

  constructor(private assetService: AssetService, private logService: LogService, private route: ActivatedRoute){}

  ngOnInit(){
    this.route.params.subscribe(params => this.user = params["user"]);
    this.logService.info("Loading asset details.", {
      user: this.user
    });

    this.assetService.getAssetDetails(this.user).subscribe(asset => this.asset = asset);
    this.logService.info("Loaded asset details.", {
      asset: this.asset
    });
  }

  getRetiredString(){
    return this.asset.retired ? "True" : "False";
  }
}