import { Component, Input } from '@angular/core';
import { Asset } from './models/asset'
import { AssetService } from './services/asset.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name: string;
  assets: Asset[];

  constructor(private assetService: AssetService){
    this.name = 'CGI Member';
  }

  ngOnInit(){
    this.getAssets();
  }

  // demo function that creates a new asset
  public addAssetDemo() {
    let newAsset = new Asset();
    newAsset.assetType = 'Computer';
    newAsset.description= 'Demo of creating a new asset'
    newAsset.assignedTo= '1234';
    
    this.assetService.createAsset(newAsset)
      .subscribe(asset => { 
          this.getAssets(); // refresh assets list
        }, 
        error => {});
  }

  // retrieves the list of assets from mock backend 
  public getAssets(){
    this.assetService.getAssets().subscribe(data => this.assets = data);
  }

}
