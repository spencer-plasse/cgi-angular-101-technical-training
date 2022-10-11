import { Asset } from '@/models/asset';
import { AssetService } from '@/services/asset.service';
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

  constructor(private assetService: AssetService, private route: ActivatedRoute){}

  ngOnInit(){
    this.route.params.subscribe(params => this.user = params["user"]);
    this.getAssets({
      assignedTo: this.user
    });
  }

  public getAssets(params?: object){
    this.assetService.getAssets(params).subscribe(data => this.assets = data);
  }

  public filterAssets(event){
    this.getAssets(
      event ? {
        "assignedTo": this.user,
        [event.attribute]: event.value
      } : {
        "assignedTo": this.user
      }
    );
  }
}