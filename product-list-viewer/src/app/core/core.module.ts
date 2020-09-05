import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceModule } from './services/service.module';

export const CORE_PROVIDERS = [
    ...ServiceModule.forRoot().providers,
];

@NgModule({
    imports: [ CommonModule ],
    exports: [],
    declarations: [],
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: CoreModule,
            providers: [
                ...CORE_PROVIDERS,
            ]
        };
    }
}
