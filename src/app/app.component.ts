import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map, take } from 'rxjs';

const GET_ACTORS = gql`
  subscription Actors{
    actors {
      id
      exampleField
    }
  }
`;
const DELETE_ACTOR = gql`
mutation RemoveActor($id: String!){
  removeActor(id: $id){
    exampleField
  }
}
`;


const CREATE_ACTOR = gql`
mutation CreateActor($actor: CreateActorInput!){
  createActor(createActorInput: $actor){
    exampleField
  }
}
`;


interface Actor {
  id?: string, exampleField: number
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'apollo-angular';
  dogs!: Observable<any>;
  actors: Actor[] = [];
  exampleField: number = 0; 


  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.dogs = this.apollo
      .watchQuery({
        query: GET_ACTORS,
      })
      .valueChanges

    this.findAll()
  }


  findAll() {
    this.dogs.subscribe((res) => {
      this.actors = res.data.actors
    });

  }




  create(){
    this.apollo.mutate({
      mutation: CREATE_ACTOR,
      variables: {
        actor: {
          exampleField: this.exampleField
        }
      },
    }).subscribe();
  }


  delete(id: string) {
    this.apollo.mutate({
      mutation: DELETE_ACTOR,
      variables: {
        id
      },
    }).subscribe();

  }
}


// function sendData(query : gql){


// }

