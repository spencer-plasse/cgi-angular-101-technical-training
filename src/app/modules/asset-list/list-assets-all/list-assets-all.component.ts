import { Asset } from '../../../models/asset';
import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../services/asset.service';

@Component({
  selector: 'list-assets-all',
  templateUrl: './list-assets-all.component.html',
  styleUrls: ['./list-assets-all.component.css']
})
export class ListAssetsAllComponent implements OnInit {
  assets: Asset[];

  constructor(private assetService: AssetService){}

  ngOnInit(){
    this.getAssets();
  }

  public getAssets(params?: object, callback?){
    this.assetService.getAssets(params).subscribe(data => {
      this.assets = data.filter(asset => !asset.retired); 
      callback();
    });
  }

  public filterAssets(event){
    if(event){
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