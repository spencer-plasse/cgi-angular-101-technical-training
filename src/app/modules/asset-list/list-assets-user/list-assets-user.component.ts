import { Asset } from '@/models/asset';
import { AssetService } from '@/services/asset.service';
import { LogService } from '@/services/log.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'list-assets-user',
  templateUrl: './list-assets-user.component.html',
  styleUrls: ['./list-assets-user.component.css']
})
export class ListAssetsUserComponent implements OnInit {
  @Input() user: string;
  assets: Asset[];

  constructor(private assetService: AssetService, private logService: LogService, private route: ActivatedRoute){}

  ngOnInit(){
    this.route.params.subscribe(params => this.user = params["user"]);
    this.logService.info("Loading list of assets assigned to user: ", {
      user: this.user
    });

    this.getAssets({
      assignedTo: this.user
    });
  }

  public getAssets(params?: object, callback?: Function){
    this.assetService.getAssets(params).subscribe(data => {
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
        this.getAssets({
          "assignedTo": this.user
        }, () => {
          this.assets = this.assets.filter(asset => asset[event.attribute].toISOString().split('T')[0] === event.value)
        });

        return;
      }

      this.getAssets({
        "assignedTo": this.user,
        [event.attribute]: event.value
      });

      return;
    }

    this.getAssets({
      "assignedTo": this.user
    });
  }
}