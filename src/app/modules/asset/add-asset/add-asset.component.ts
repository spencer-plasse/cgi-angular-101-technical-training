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

  addAsset(): void{
    // Create a new asset with the user input. 
    // If there is an error, notify the user, log it, and redirect to the list of all assets.
    // If successful, log success and redirect to the asset's detail page.
    this.assetService.createAsset(this.asset)
                     .subscribe((asset) => this.asset = asset,
                                (error) => this.handleError(
                                  `Could not create an asset! Redirecting to list of all assets...`,
                                  `Could not create an asset.`
                                ),
                                () => this.handleSuccess());
    
  }

  cancel(): void{
    this.router.navigate(["/assets", "all"]);
  }

  handleError(userMessage: string, logMessage: string, routePath: any[] = ["/assets", "all"]): void{
    alert(userMessage);
    this.logService.error(logMessage);
    this.router.navigate(routePath);
  }

  handleSuccess(): void{
    this.logService.success("Successfully created a new asset!", this.asset);
    this.router.navigate(["/asset", "details", this.asset.assetTagId]);
  }
}