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

    // Validates that an asset with the input tagId exists. If not, the user is redirected to the home page.
    this.assetService.getAssetDetails(this.assetTagId)
                      .subscribe(_ => true,
                                 (error) => 
                                    this.handleError(
                                      `Could not find an asset with a tagId of ${this.assetTagId}! Redirecting to list of all assets...`,
                                      `Could not find an asset with a tagId of ${this.assetTagId}.`
                                    )
                                 );
  }

  retireAsset(){
    // Either retire or "unretire" the asset based on its current status.
    this.assetService.retireAsset(this.assetTagId, !this.retired)
                     .subscribe((_) => _,
                                (error) => this.handleError(
                                  `Could not ${this.retired ? 'unretire' : 'retire'} asset ${this.assetTagId}! Redirecting to the details page for this asset...`,
                                  `Could not ${this.retired ? 'unretire' : 'retire'} asset ${this.assetTagId}.`,
                                  ["/asset", "details", this.assetTagId]
                                ),
                                () => this.handleSuccess());
    
  }

  cancel(){
    this.router.navigate(["/asset", "details", this.assetTagId]);
  }

  handleSuccess(){
    this.retired = !this.retired;

    this.logService.success(`Successfully ${this.retired ? 'retired' : 'unretired'} asset.`, {
      assetTagId: this.assetTagId
    })
    
    this.router.navigate(["/asset", "details", this.assetTagId]);
  }

  handleError(userMessage: string, logMessage: string, routePath: any[] = ["/assets", "all"]): void{
    alert(userMessage);
    this.logService.error(logMessage);
    this.router.navigate(routePath);
  }
}