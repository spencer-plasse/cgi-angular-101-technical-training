import { Asset } from '@/models/asset';
import { LogService } from '@/services/log.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-asset-filter',
  templateUrl: './asset-filter.component.html',
  styleUrls: ['./asset-filter.component.css']
})
export class AssetFilterComponent{
  @Input() assets: Asset[];
  @Input() filteredUser: boolean;

  attribute: string;
  value: string;
  userList; // Values for the "assignedTo" <select> list

  @Output() filterEvent = new EventEmitter<{attribute: string, value: string}>();

  constructor(private logService: LogService){}

  loadUsers(): void{
    if(!this.userList){
      // Initializes a list of distinct users that assets are assigned to, sorted in ASCII ascending order
      this.userList = Array.from(new Set<string>(this.assets.filter(asset => asset.assignedTo !== null && asset.assignedTo !== "")
                                                      .map(asset => asset.assignedTo)
                                                      .sort()));
    }
  }

  filterAssets(): void{
    // Validate that a filter attribute was selected
    if(this.attribute !== "" && this.attribute !== null && this.attribute !== undefined){
      // Validate that an invalid filter attribute was not injected/provided via API call (ex. Postman)
      if(["assetTagId", "assetType", "description", "dateAdded", "assignedTo", "retired", "dateRetired"].indexOf(this.attribute) >= 0){
        // Validate that a value was selected/provided
        if(this.value !== "" && this.value !== null && this.value !== undefined){
          switch(this.attribute){
            case "assetTagId":
              if(this.assets.map(asset => asset.assetTagId).indexOf(parseInt(this.value)) === -1){
                this.handleError(`Cannot filter due to invalid value for Tag ID: ${this.value}!`);
              }

              break;

            case "assetType":
              if(["Desktop", "Laptop", "Display", "Phone", "External Hard Drive", "Other"].indexOf(this.value) === -1){
                this.handleError(`Cannot filter due to invalid value for Asset Type: ${this.value}!`);
              }

              break;

            case "assignedTo":
              if(this.userList.indexOf(this.value) === -1){
                this.handleError(`Cannot filter due to invalid value for Assigned To: ${this.value}!`);
              }

              break;

            case "retired":
              if(["True", "False"].indexOf(this.value) === -1){
                this.handleError(`Cannot filter due to invalid value for Retired: ${this.value}!`);
              }

              break;
          }

          // Emit a filter event to the caller (list-assets-all or list-assets-user)
          this.filterEvent.emit({
            attribute: this.attribute,
            value: this.value
          });
        }

        else{
          this.handleError(
            `Value must be provided to search by ${this.attribute}.`,
            `Could not filter by ${this.attribute} due to missing filter value.`
          );
        }
      }
      
      else{
        this.handleError(
          "Attribute must be one of the following: assetTagId, assetType, description, dateAdded, assignedTo, retired, or dateRetired.",
          "Could not filter due to invalid filter attribute."
        );
      }
      
    }
    
    else{
      this.handleError(
        "An attribute must be selected to filter assets by.",
        "Could not filter due to missing filter attribute."
      );
    }
  }

  clearFilter(): void{
    this.attribute = null;
    this.value = null;

    // Emit a filter event to the caller with null to clear any existing filter and list all assets
    this.filterEvent.emit(null);
  }

  handleError(userMessage: string, logMessage: string = userMessage): void{
    alert(userMessage);
    this.logService.error(logMessage);
  }
}