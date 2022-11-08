import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Asset } from '../models/asset'

// Demo asset service class to make HTTP requests. 
// The mock backend will intercept these requests and respond with a HTTP response.
@Injectable()
export class AssetService{
  constructor(private http: HttpClient){}

  public getNextAssetId(): Observable<number>{
    return this.http.get<number>(`${environment.api_url}/assets/nextId`);
  }

  public getAssets(params?: object): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${environment.api_url}/assets`,{
      params: (params as HttpParams)
    });
  }

  public getAssetsByUser(user: string): Observable<Asset[]>{
    const params = new HttpParams().set("assignedTo", user)
    return this.getAssets(params);
  }

  public getAssetDetails(assetTagId: number): Observable<Asset>{
    return this.http.get<Asset>(`${environment.api_url}/assets/${assetTagId}`);
  }

  public createAsset(asset: Asset): Observable<Asset>{
    return this.http.post<Asset>(`${environment.api_url}/assets`, asset);
  }

  public updateAsset(asset: Asset): Observable<Asset>{
    return this.http.put<Asset>(`${environment.api_url}/assets/${asset.assetTagId}`, asset);
  }

  public retireAsset(assetTagId: number, retire: boolean): Observable<Asset>{
    // Retire an asset
    if(retire){
      return this.http.delete<Asset>(`${environment.api_url}/assets/${assetTagId}/retire`);
    }

    // "Unretire" an asset
    else{
      return this.http.put<Asset>(`${environment.api_url}/assets/${assetTagId}/retire`, assetTagId);
    }
  }
}