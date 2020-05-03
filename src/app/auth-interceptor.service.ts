import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';

export class AuthInterceptorService implements HttpInterceptor{
   intercept(req: HttpRequest<any>, next: HttpHandler){
            // console.log(        //implemented everytime a request is sent
            //     req.url 
            // );

            const modifiedReq = req.clone(
                {
                    headers: req.headers.append('auth','xyz')  //added everytime a request is sent
                }
            )
       
            return next.handle(modifiedReq);
   }
}