import { Asset } from '@/models/asset';
import { AssetService } from '@/services/asset.service';
import { LogService } from '@/services/log.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.css']
})
export class AssetDetailsComponent implements OnInit {
  assetTagId: number;
  asset: Asset;

  constructor(private assetService: AssetService, private logService: LogService, private router: Router, private route: ActivatedRoute){}

  ngOnInit(){
    this.route.params.subscribe(params => this.assetTagId = params["id"]);
    this.logService.info("Loading asset details.", {
      assetTagId: this.assetTagId
    });

    // Validates that an asset with the input tagId exists. If not, the user is redirected to the home page.
    this.assetService.getAssetDetails(this.assetTagId)
                      .subscribe((asset) => this.asset = asset,
                                 (error) =>
                                      this.handleError(
                                        `Could not find an asset with a tagId of ${this.assetTagId}! Redirecting to list of all assets...`,
                                        `Could not find an asset with a tagId of ${this.assetTagId}.`
                                      ),
                                 () => this.handleSuccess());
  }

  handleError(userMessage: string, logMessage: string, routePath: any[] = ["/assets", "all"]): void{
    alert(userMessage);
    this.logService.error(logMessage);
    this.router.navigate(routePath);
  }

  handleSuccess(): void{
    this.logService.info("Loaded asset details.", {
      asset: this.asset
    });
  }

  // Returns a capitalized version of the asset's retired status (true/false)
  getRetiredString(){
    if(this.asset){
      return this.asset.retired ? "True" : "False";
    }

    return "";
  }
}