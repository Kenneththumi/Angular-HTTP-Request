import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { Post } from './post.model';
import { map, tap } from 'rxjs/operators'
import { Observable, Subject } from 'rxjs';

@Injectable({providedIn:'root'})
export class PostService {

    error = new Subject<string>();
    
    constructor(private http:HttpClient){}

    createAndStorePost(title: string, content: string ){
         let postData:{ title: string; content: string } = {title,content}
        // Send Http request
            this.http.
            post<{name:string}>(
                'https://ng-complete-guide-796e7.firebaseio.com/post.json', 
                postData,
                {
                    observe:'response'   //response data now comprensive with status data: types - events,response,body
                }
                ).
        subscribe(
                responseData => {
                    console.log(responseData)
                },
                error =>{
                    this.error.next(error.message)
                }

            )
    }

    //Fetch posts
    fetchPost(){
        let setParams = new HttpParams();

        //multiple params
        setParams = setParams.append('print','pretty');
        setParams = setParams.append('custom','param')

       return     this.http.
            get<{[key:string]:Post}>(
                         "https://ng-complete-guide-796e7.firebaseio.com/post.json",
                          { 
                              headers: new HttpHeaders({ Custom_Header:'Hello'}) ,
                              params: setParams,
                              responseType:'json' //can alter the return type but json is the most used
                          }
                         ).
            pipe( map(   //Observable operator
                    (responseData) =>{
                        

                        const postArray:Post[] = [];

                        for(let key in responseData){//for-in loop, loops thru' objects

                            if(responseData.hasOwnProperty(key)){//hasOwnProperty returns a boolean value indicating whether the object on which you are calling it has a property with the name of the argument
                                    postArray.push({...responseData[key],id:key})
                            }//
                                
                        }
                        
                        return postArray;

                    }
            ));
    }

    //clear posts
    clearPosts(): Observable<any>{
        return  this.http.
                          delete<any>(
                                        'https://ng-complete-guide-796e7.firebaseio.com/post.json',
                                            {
                                                observe:'events'
                                            }
                                    ).pipe(
                                        tap( //Tap seems to deal with event type only (HttpEventType)
                                            event=>{
                                            console.log(event.type === HttpEventType.Sent? 'sent' : 'not sent')

                                            console.log(event.type === HttpEventType.Response? event.body : '')
                                        })
                                    );
    }
}