import { Asset } from '@/models/asset';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-asset-filter',
  templateUrl: './asset-filter.component.html',
  styleUrls: ['./asset-filter.component.css']
})
export class AssetFilterComponent {
  @Input() assets: Asset[];
  @Input() filteredUser: boolean;

  attribute: string;
  value: string;
  userList;

  @Output() filterEvent = new EventEmitter<{attribute: string, value: string}>();

  constructor(){}

  loadUsers(){
    if(!this.userList){
      this.userList = Array.from(new Set(this.assets.map(asset => asset.assignedTo)));
    }
  }

  filterAssets(){
    this.filterEvent.emit({
      attribute: this.attribute,
      value: this.value
    });
  }

  clearFilter(){
    this.attribute = null;
    this.value = null;

    this.filterEvent.emit(null);
  }
}