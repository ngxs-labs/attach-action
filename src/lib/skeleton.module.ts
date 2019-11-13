import { NgModule, ModuleWithProviders } from '@angular/core';

@NgModule()
export class NgxsSkeletonModule {
  public static forRoot(): ModuleWithProviders<NgxsSkeletonModule> {
    return {
      ngModule: NgxsSkeletonModule
    };
  }
}
