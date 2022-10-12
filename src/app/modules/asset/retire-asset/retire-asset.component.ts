import { AssetService } from '@/services/asset.service';
import { LogService } from '@/services/log.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'retire-asset',
  templateUrl: './retire-asset.component.html',
  styleUrls: ['./retire-asset.component.css']
})
export class RetireAssetComponent implements OnInit {
  retired: boolean;
  assetTagId: number;

  constructor(private assetService: AssetService, private logService: LogService, 
              private route: ActivatedRoute, private router: Router){}

  ngOnInit(){
    this.route.params.subscribe(params => this.assetTagId = params["id"]);
    this.route.queryParams.subscribe(queryParams => this.retired = queryParams["retired"] === "true" ? true : false);
  }

  retireAsset(){
    this.assetService.retireAsset(this.assetTagId, !this.retired).subscribe(asset => this.retired = asset.retired);
    this.logService.success(`Successfully ${this.retired ? 'retired' : 'unretired'} asset.`, {
      assetTagId: this.assetTagId
    })
    
    this.router.navigate(["/asset", "details", this.assetTagId]);
  }

  cancel(){
    this.router.navigate(["/asset", "details", this.assetTagId]);
  }
}