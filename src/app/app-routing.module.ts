import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAssetComponent } from './modules/asset/add-asset/add-asset.component';
import { AssetDetailsComponent } from './modules/asset/asset-details/asset-details.component';
import { ListAssetsAllComponent } from './modules/asset-list/list-assets-all/list-assets-all.component';
import { ListAssetsUserComponent } from './modules/asset-list/list-assets-user/list-assets-user.component';
import { RetireAssetComponent } from './modules/asset/retire-asset/retire-asset.component';
import { UpdateAssetComponent } from './modules/asset/update-asset/update-asset.component';

const routes: Routes = [
  { path: "assets/all", component: ListAssetsAllComponent },
  { path: "assets/user/:user", component: ListAssetsUserComponent },
  { path: "asset/add", component: AddAssetComponent },
  { path: "asset/details/:user", component: AssetDetailsComponent },
  { path: "asset/update/:user", component: UpdateAssetComponent },
  { path: "asset/retire/:user", component: RetireAssetComponent},
  { path: "**", component: ListAssetsAllComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
