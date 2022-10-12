import { Asset } from '../../../models/asset';
import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../services/asset.service';
import { LogService } from '@/services/log.service';

@Component({
  selector: 'list-assets-all',
  templateUrl: './list-assets-all.component.html',
  styleUrls: ['./list-assets-all.component.css']
})
export class ListAssetsAllComponent implements OnInit {
  assets: Asset[];

  constructor(private assetService: AssetService, private logService: LogService){}

  ngOnInit(){
    this.logService.info("Loading list of all assets...");
    this.getAssets();
  }

  public getAssets(params?: object, callback?: Function){
    this.assetService.getAssets(params).subscribe(data => {
      //this.assets = data.filter(asset => !asset.retired); - Uncomment this line to filter all assets to only active (non-retired) ones
      this.assets = data;
      this.logService.success("Successfully loaded assets.");
      callback();
    });
  }

  public filterAssets(event){
    if(event){
      this.logService.info("Filtering assets with the following parameters: ", {
        attribute: event.attribute,
        value: event.value
      });

      if(event.attribute === "dateAdded" || event.attribute === "dateRetired"){
        this.getAssets(null, () => {
          this.assets = this.assets.filter(asset => asset[event.attribute].toISOString().split('T')[0] === event.value)
        });

        return;
      }

      this.getAssets({
        [event.attribute]: event.value
      });

      return;
    }

    this.getAssets();
  }
}