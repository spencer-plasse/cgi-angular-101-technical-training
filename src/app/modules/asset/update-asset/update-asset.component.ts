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

    // Validates that an asset with the input tagId exists. If not, the user is redirected to the home page.
    this.assetService.getAssetDetails(this.assetTagId)
                      .subscribe((asset) => this.asset = asset,
                                 (error) => 
                                      this.handleError(
                                        `Could not find an asset with a tagId of ${this.assetTagId}! Redirecting to list of all assets...`,
                                        `Could not find an asset with a tagId of ${this.assetTagId}.`
                                      ),
                                 () => {
                                   this.logService.info("Loaded asset details.", {
                                     asset: this.asset
                                   });
                                 });
  }

  updateAsset(): void{
    // Update the asset with the new values. 
    // If there is an error, notify the user, log it, and redirect to the asset's detail page.
    // If successful, log success and redirect to the asset's detail page.
    this.assetService.updateAsset(this.asset)
                      .subscribe(
                        (asset) => this.asset = asset,
                        (error) => 
                          this.handleError(
                            `Could not update asset. Redirecting to detail page for asset ${this.assetTagId}...`,
                            `Could not update asset with tagId ${this.assetTagId}.`,
                            ["/asset", "details", this.assetTagId]
                          ),
                        () => {
                          this.logService.success("Successfully updated the asset.", this.asset);
                          this.router.navigate(["/asset", "details", this.asset.assetTagId]);
                        }
                      );
  }

  cancel(): void{
    this.router.navigate(["/asset", "details", this.asset.assetTagId]);
  }

  handleError(userMessage: string, logMessage: string, routePath: any[] = ["/assets", "all"]): void{
    alert(userMessage);
    this.logService.error(logMessage);
    this.router.navigate(routePath);
  }

  // Returns a capitalized version of the asset's retired status (true/false).
  getRetiredString(): string{
    if(this.asset){
      return this.asset.retired ? "True" : "False";
    }

    return "";
  }
}