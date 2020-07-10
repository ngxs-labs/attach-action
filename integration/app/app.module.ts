import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';

import { AppComponent } from './app.component';
import { RootState } from './state';

export interface RootStateModel {
  title: string;
  subTitle: string;
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'universal-package' }),
    HttpClientModule,
    NgxsModule.forRoot([RootState])
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
