import { ErrorHandler, Inject, NgZone } from "@angular/core";
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

export class AppErrorHandler implements ErrorHandler {
    
    constructor(@Inject(NgZone) private ngZone: NgZone, @Inject(ToastyService) private toastyService: ToastyService, @Inject(ToastyConfig) private toastyConfig: ToastyConfig)
    {
      // Assign the selected theme name to the `theme` property of the instance of ToastyConfig. 
      // Possible values: default, bootstrap, material
      this.toastyConfig.theme = 'material';
    }

    handleError(error: any): void {
        console.log("ERROR: " + error);
        this.ngZone.run(() => this.addToast("error", "Error", "An unexpected error occurred."));
    }

    addToast(toastType, toastTitle, toastMessage) {
        let toastOptions:ToastOptions = {
          title: toastTitle,
          msg: toastMessage,
          showClose: true,
          timeout: 5000,
          theme: 'default',
          onAdd: (toast:ToastData) => {
              console.log('Toast ' + toast.id + ' has been added!');
          },
          onRemove: function(toast:ToastData) {
              console.log('Toast ' + toast.id + ' has been removed!');
          }
        };
    
        switch (toastType) {
          case 'default': this.toastyService.default(toastOptions); break;
          case 'info': this.toastyService.info(toastOptions); break;
          case 'success': this.toastyService.success(toastOptions); break;
          case 'wait': this.toastyService.wait(toastOptions); break;
          case 'error': this.toastyService.error(toastOptions); break;
          case 'warning': this.toastyService.warning(toastOptions); break;
        }
      }
}