import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Routes } from '@angular/router';
import { Login } from './app/login/login';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
