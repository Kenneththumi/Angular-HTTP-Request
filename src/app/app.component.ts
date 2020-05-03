import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Post } from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts:Post[] = [];

  isFetching:boolean = false;

  error = null;

  errSub: Subscription;

  constructor(private http: HttpClient, private postService:PostService) {}

  ngOnInit() {
      this.errSub = this.postService.error.subscribe( errorMessage =>{ this.error = errorMessage})

      this.fetchPosts();
  }

  onCreatePost(postData: { title: string; content: string }) {
          this.postService.createAndStorePost(postData.title, postData.content);

          //this.fetchPosts();
  }

  onFetchPosts() {
    // Send Http request
      this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
    this.postService.clearPosts().subscribe(
        () => { 
                  this.fetchPosts();
              }
    )
  }

  private fetchPosts(){
      this.isFetching = true;
      this.postService.fetchPost().subscribe(
        posts =>{
          this.isFetching = false;

          this.loadedPosts = posts
        },
        error => {
               this.error = error.message;

               this.isFetching = false;
               //console.log(error)
        }
      ); 
  }
  //On handle error
  onHandleError(){
       this.error = null;
  }
  //destroy errSub
  ngOnDestroy(){
       this.errSub.unsubscribe();
  }
}
