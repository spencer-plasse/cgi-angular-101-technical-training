# Angular 101 Mock Backend Demo

  

This is a simple Angular application that demonstrates the mock backend HTTP interceptor and how to make HTTP requests to it. You will need the node package manager and the Angular CLI in order to pull dependencies and run the application.

  

Install dependencies by running _npm install_ from the VS Code terminal. Run _ng serve_ in order to test the application locally.

  

The following section below documents the methods available from the mock backend API. If you run into any issues with the mock backend interceptor, or if this documentation has errors, please contact Eric Baker (e.baker@cgi.com).

  

# API Methods

**Show Assets**

----

Returns json data with list of Assets. Optional query parameters can be provided to filter assets.

  

*  **URL**

  

/assets

  

*  **Method:**

  

`GET`

*  **URL Params**

  

**Optional:**

`assetTagId=[integer] assetType=[string] description=[string] assignedTo=[string] dateAdded=[Date] retired=[boolean] dateRetired=[Date]`

  

*  **Data Params**

  

None

  

*  **Success Response:**

  

*  **Code:** 200 <br  />

**Content:**  `{ assetTagId : 12, assetType : "Computer", description: "Some computer", assignedTo: "1234", dateAdded: "7/28/2019", retired: false, dateRetired: null }`

*  **Error Response:**

  

None

  

*  **Sample Call:**

  

```typescript

let  allAssets = undefined;

let  computerAssets = undefined;

// get all assets

this.http.get(`/assets`).subscribe(data  =>  allAssets = data);

// filter for computer assets

const  params = new  HttpParams().set('assetType ', "Computer");

this.http.get(`/assets`, { params: params }).subscribe(data  =>  computerAssets = data);

```

  

**Show Asset**

----

Returns json data about a single Asset.

  

*  **URL**

  

/assets/:id

  

*  **Method:**

  

`GET`

*  **URL Params**

  

**Required:**

`id=[integer]`

  

*  **Data Params**

  

None

  

*  **Success Response:**

  

*  **Code:** 200 <br  />

**Content:**  `{ assetTagId : 12, assetType : "Computer", description: "Some computer", assignedTo: "1234", dateAdded: "7/28/2019", retired: false, dateRetired: null }`

*  **Error Response:**

  

*  **Code:** 404 NOT FOUND <br  />

**Content:**  `{ error : "Asset does not exist" }`

  

*  **Sample Call:**

  

```typescript

let  tagId = 12;

let  asset = undefined;

this.http.get(`/assets/${tagId}`).subscribe(data  =>  asset = data);

```

**Create Asset**

----

Creates a new asset

  

*  **URL**

  

/assets

  

*  **Method:**

  

`POST`

*  **URL Params**

  

None

  

*  **Data Params**

  

**Required:**

  

`{ assetType : [string], description: [string] }`

  

**Optional:**

`{ assignedTo: [string] }`

  

*  **Success Response:**

  

*  **Code:** 200 <br  />

**Content:**  `{ assetTagId : 12, assetType : "Computer", description: "Some computer", assignedTo: "1234", dateAdded: "7/28/2019", retired: false, dateRetired: null }`

*  **Error Response:**

  

None

  

*  **Sample Call:**

  

```typescript

let  asset = {assetType:  'Computer', description:  "Some computer", assignedTo:  "1234"};

this.http.post(`/assets`, asset).subscribe(data  =>  asset = data);

```

**Update Asset**

----

Updates a single Asset.

  

*  **URL**

  

/assets/:id

  

*  **Method:**

  

`PUT`

*  **URL Params**

  

**Required:**

`id=[integer]`

  

*  **Data Params**

  

**Optional:**

`{ description: [string], assignedTo: [string] }`

  

*  **Success Response:**

  

*  **Code:** 200 <br  />

**Content:**  `{ assetTagId : 12, assetType : "Computer", description: "Some computer", assignedTo: "1234", dateAdded: "7/28/2019", retired: false, dateRetired: null }`

*  **Error Response:**

  

*  **Code:** 404 NOT FOUND <br  />

**Content:**  `{ error : "Asset does not exist" }`

  

*  **Sample Call:**

  

```typescript

let  tagId = 12;

let  asset = undefined;

this.http.put(`/assets/${tagId}`, {assetType:  'Laptop'}).subscribe(data  =>  asset = data);

```

**Retire Asset**

----

Retires a single Asset.

  

*  **URL**

  

/Assets/:id/retire

  

*  **Method:**

  

`DELETE`

*  **URL Params**

  

**Required:**

`id=[integer]`

  

*  **Data Params**

  

None

  

*  **Success Response:**

  

*  **Code:** 204 NO CONTENT<br  />

*  **Error Response:**

  

*  **Code:** 404 NOT FOUND <br  />

**Content:**  `{ error : "Asset does not exist" }`

  

*  **Sample Call:**

  

```typescript

let  tagId = 12;

this.http.delete(`/assets/${tagId}/retire`, { observe:  'response' })

.subscribe(resp  => { console.log(resp); } );

```

  

**Unretire Asset**

----

Unretires a single Asset.

  

*  **URL**

  

/Assets/:id/retire

  

*  **Method:**

  

`PUT`

*  **URL Params**

  

**Required:**

`id=[integer]`

  

*  **Data Params**

  

None

  

*  **Success Response:**

  

*  **Code:** 204 NO CONTENT<br  />

*  **Error Response:**

  

*  **Code:** 404 NOT FOUND <br  />

**Content:**  `{ error : "Asset does not exist" }`

  

*  **Sample Call:**

  

```typescript

let  tagId = 12;

this.http.put(`/assets/${tagId}/retire`, { observe:  'response' })

.subscribe(resp  => { console.log(resp); } );

```
**Show Errors**

----

Returns json data with list of logged errors.

  

*  **URL**

  

/errors

  

*  **Method:**

  

`GET`

*  **URL Params**

  None  

*  **Data Params**

  

None

  

*  **Success Response:**

  

*  **Code:** 200 <br  />

**Content:**  The content will consist of a list of error objects, whose content depends on the user's implementation

*  **Error Response:**

  None

*  **Sample Call:**

```typescript
let  errors = undefined;

// get all assets
this.http.get(`/errors`).subscribe(data  =>  errors = data);
```
**Log Error**

----

Logs an error

  

*  **URL**

  

/errors/log

  

*  **Method:**

  

`POST`

*  **URL Params**

  

None

  

*  **Data Params**
This call will accept any JSON object as its data and log that object as an error
  
*  **Success Response:**

  

*  **Code:** 200 <br  />

*  **Error Response:**
  

None

  

*  **Sample Call:**

  

```typescript
handleError(error: Error) {
	const  err = {
		message:  error.message ? error.message : error.toString(),
		stack:  error.stack ? error.stack : ''
}

this.http.post(`/errors/log`, err).subscribe();

```
