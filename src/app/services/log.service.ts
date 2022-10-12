import { Injectable } from '@angular/core';
import { LogProviderService, LogProvider } from './log-provider.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private logProviders: LogProvider[] = [];

  constructor(private logProviderService: LogProviderService) {
    this.logProviders = logProviderService.providers;
  }

  success(message: string, ...params: any){
    this.logMessage(message, LogLevel.SUCCESS, params);
  }

  error(message: string, ...params: any){
    this.logMessage(message, LogLevel.ERROR, params);
  }

  warn(message: string, ...params: any){
    this.logMessage(message, LogLevel.WARN, params);
  }

  info(message: string, ...params: any){
    this.logMessage(message, LogLevel.INFO, params);
  }

  private logMessage(message: string, level: LogLevel, params: any){
    for(let provider of this.logProviders){
      let logEntry: LogEntry = new LogEntry(message, level, params);
      provider.log(logEntry).subscribe(response => response);
    }
  }
}

enum LogLevel{
  SUCCESS = 1,
  ERROR = 2,
  WARN = 3,
  INFO = 4
}

export class LogEntry{
  private date: Date;
  private message: string;
  private level: LogLevel;
  private params: any[];

  constructor(message: string, level: LogLevel = LogLevel.INFO, params: any[]){
    this.date = new Date();
    this.message = message;
    this.level = level;
    this.params = params || [];
  }

  public buildMessage(): string{
    let logMessage = "";

    logMessage += `${this.date.toString()}`;
    logMessage += ` - ${LogLevel[this.level]}`;
    logMessage += ` - ${this.message}`;

    if(this.params.length){
      logMessage += ` - Parameters: ${this.params.map(param => JSON.stringify(param)).join(", ")}`;
    }

    return logMessage;
  }
}