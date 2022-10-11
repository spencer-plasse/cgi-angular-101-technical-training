import { Component, Input } from '@angular/core';
import { Asset } from '../../../models/asset';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html'
})
export class AssetListComponent{
  attributeList: string[];
  @Input() assets: Asset[];

  constructor(){
    this.attributeList = ["Tag ID", "Asset Type", "Description", "Date Added", "Assigned To", "Retired", "Date Retired"];
  }
}