import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import { enableProdMode } from "@angular/core";
import 'rxjs/add/operator/take';

enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);


