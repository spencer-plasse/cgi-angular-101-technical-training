import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize, catchError } from 'rxjs/operators';
import { Asset } from '../models/asset'

// reviver function for JSON parse so dates are parsed correctly
function dateTimeReviver(key: string, value: any) {
  // if value matches a ISO date format
  if(typeof value === 'string' && value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/)) {
    return new Date(value);
  }
  else return value;
}

// array in local storage for assets
let assets = JSON.parse(localStorage.getItem('assets'), dateTimeReviver) || [];
let errors = JSON.parse(localStorage.getItem('errors')) || [];

// This is a http intercepter that fakes an Assets RESTful API. It intercepts http requests 
// and responds with http responses with asset data.
// It fakes a data store by storing assets as a JSON string in browser local storage.
// If you run into any issues with this interceptor, please contact e.baker@cgi.com.
@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body, params } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize())
            .pipe(catchError(handleError)); // add error handler

        function handleRoute() {
            try {
              switch (true) {
                case url.endsWith('/assets') && method === 'GET':
                    return getAssetsList();
                case url.endsWith('/assets') && method === 'POST':
                    return addAsset();
                case url.match(/\/assets\/\d+$/) && method === 'GET':
                    return getAssetById();
                case url.match(/\/assets\/\d+$/) && method === 'PUT':
                    return updateAsset(parseBody());
                case url.match(/\/assets\/\d+\/retire$/) && method === 'DELETE':
                    return retireAsset(true);
                case url.match(/\/assets\/\d+\/retire$/) && method === 'PUT':
                    return retireAsset(false);
                case url.endsWith('/errors') && method === 'GET':
                    return getErrors();
                case url.endsWith('/errors/log') && method === 'POST':
                    return logError(body);
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
              }    
            }
            catch(e) {
              return error(e)
            }          
        }

        // route functions
        function getAssetsList() {
          if (params.keys().length > 0) {
            let filteredAssets = assets;
            params.keys().forEach(key => {
              // filter for key/value
              let asset = filteredAssets.filter(
                x =>
                  (x[key] != undefined ? x[key] : {})
                    .toString()
                    .toUpperCase()
                    .indexOf(params.get(key).toUpperCase()) >= 0
              );
    
              // add each item from filtered list if we got anything
              if (asset != undefined) {
                filteredAssets = [];
                asset.forEach(i => {
                  filteredAssets.push(i);
                });
              }
            });
            return ok(filteredAssets);
          }
          return ok(assets);
        }

        function getAssetById() {
          const asset = assets.find(x => x.assetTagId == idFromUrl());
          if(asset != undefined)
            return ok(asset);
          else
            return notFound("Asset does not exist!");
        }

        function addAsset() {
            let assetIdentity = localStorage.getItem('assetIdentity') || '1';
            let assetDto = createAssetFromObject(parseBody());

            let newAsset = new Asset();
            newAsset.assetTagId = parseInt(assetIdentity); // set tag id, overwrite any already set value
            newAsset.dateAdded = new Date();
            newAsset.assetType = assetDto.assetType || null;
            newAsset.description = assetDto.description || null;
            newAsset.assignedTo = assetDto.assignedTo || null;
            newAsset.retired = false;
            newAsset.dateRetired = null;
            // stringify and parse for consistant JSON date format
            newAsset = JSON.parse(JSON.stringify(newAsset), dateTimeReviver); 
            assets.push(newAsset);

            localStorage.setItem('assets', JSON.stringify(assets));
            localStorage.setItem('assetIdentity', (parseInt(assetIdentity) + 1).toString());
            
            return ok(newAsset);
        }

        function updateAsset(assetDto : any) {
           let asset = assets.find(x => x.assetTagId == idFromUrl());
           if(asset == undefined){
             return addAsset();
           }
           //asset.assetType = newAsset.assetType || null; // training project specifies this cannot be changed once set
           asset.description = assetDto.description || null;
           asset.assignedTo = assetDto.assignedTo || null;

           updateAssetInLocalStorage(asset);
           return ok(asset);
        }

        function retireAsset(retire : boolean) {
          let asset = assets.find(x => x.assetTagId == idFromUrl());
          if(asset == undefined){
            return notFound(`Asset does not exist!`);
          }
          asset.retired = retire;
          asset.dateRetired = new Date();
          updateAssetInLocalStorage(asset);
          return noContent();
        }

        function updateAssetInLocalStorage(asset: Asset) {
          let index = assets.findIndex(x => x.assetTagId == idFromUrl());
          assets[index] = JSON.parse(JSON.stringify(asset), dateTimeReviver); // stringify and parse for consistant JSON date format
          localStorage.setItem('assets', JSON.stringify(assets));
        }

        function getErrors() {
          return ok(errors);
        }

        function logError(error: string) {
          errors.push(error);
          localStorage.setItem('errors', JSON.stringify(errors));
          return ok();
        }

        // helper functions
        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function noContent() {
          return of(new HttpResponse({ status: 204 }));
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorized' } });
        }

        function notFound(message) {
            return throwError({ status:404, error: { message } });
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function idFromUrl() {
            return parseInt(url.match(/\d+/)[0]);
        }

        // helper function that parses body in case it came over as a JSON string
        // assuming it is a proper JSON string for now, could add error handling later
        function parseBody()
        { 
          return typeof(body) == "string" ? JSON.parse(body, dateTimeReviver) : body; 
        }
    }
}

function createAssetFromObject(obj : any) : Asset
{
  let asset = new Asset();
  return Object.assign(asset, obj);
}

function handleError(error: HttpErrorResponse) {
  let errorMsg = '';
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    errorMsg = `An error occurred: ${error.error.message}`;
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    errorMsg = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
  }

  // return an observable with a user-facing error message
  return throwError(errorMsg);
};

export const mockBackendProvider = {
    // use Mock backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockBackendInterceptor,
    multi: true
};