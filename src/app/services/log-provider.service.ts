import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { LogEntry } from './log.service';

@Injectable({
  providedIn: 'root'
})
export class LogProviderService {
  private _providers: LogProvider[] = [];

  constructor() {
    this._providers.push(new ConsoleLogProvider());
    this._providers.push(new LocalStorageLogProvider("logs"));
  }

  get providers(){
    return this._providers
  }
}

export abstract class LogProvider{
  abstract log(logEntry: LogEntry): Observable<boolean>;
  abstract clear(): Observable<boolean>;
}

class ConsoleLogProvider extends LogProvider{
  log(logEntry: LogEntry): Observable<boolean>{
    console.log(logEntry.buildMessage());
    return of(true);
  }

  clear(): Observable<boolean>{
    console.clear();
    return of(true);
  }
}

class LocalStorageLogProvider extends LogProvider{
  private location: string = "";

  constructor(location: string){
    super();

    this.location = location;
  }

  log(logEntry: LogEntry): Observable<boolean>{
    let success = false;

    try{
      let logs = JSON.parse(localStorage.getItem(this.location)) || [];

      logs.push(logEntry);
      localStorage.setItem(this.location, JSON.stringify(logs));

      success = true;
    }

    catch(ex){
      console.error("Failed to log to localStorage.");
    }

    return of(success);
  }

  clear(): Observable<boolean>{
    localStorage.removeItem(this.location);
    return of(true);
  }
}