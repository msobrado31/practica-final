
import { Component, OnInit } from '@angular/core';
import {  NgForm  } from '@angular/forms';

import { UserServiceService } from 'src/app/services/user-service.service';


import { Person } from './../../interfaces/person';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})

export class PersonComponent implements OnInit {

  position : any = 0

  do: String = "insert";
  
  contacts: any;

  public contact: Person = {
        _id : "",
        name: "",
        surnames: "",
        age: "",
        dni: "",
        birthday: "",
        favouriteColour: "",
        sex: "" 
  };

  constructor (
    private userService : UserServiceService
    ) {}  

  ngOnInit(): void {          
    this.get();               //recogemos datos con get
  }

  get(){
    this.userService.getUsers().subscribe((res:Person[]) => {
      this.contacts = res;
    })
  }

  add( form : NgForm ){               //añadir   

    if( this.do === 'insert' ){       //si la acción vale insertar

      let birthDate  = new Date(this.contact.birthday);
      let day = birthDate.getDay();
      let month = birthDate.getMonth();
      let year = birthDate.getFullYear();
      let ageNum = parseInt(this.contact.age)
      
      this.contact.birthday = `${day}/${month}/${year}`

      if(ageNum > 0 && ageNum <= 125){     //validar edad
      //  this.contacts.push(this.contact)
        this.userService.addUser(this.contacts).subscribe(res => {
          this.get();        
        });
        // this.get();
      }
      this.contact={   
        _id :"",                    //reset introducir contacto vacío
        name:"",
        surnames:"",
        age:"",
        dni:"",
        birthday:new Date(),
        favouriteColour:"",
        sex:"",  
      }
   
    }else{ 
        // this.contacts[this.position] = this.contact  //si no vale insertar actualiza
        this.userService.updateUser(this.contact).subscribe(res => {
          this.get();
        })
        this.do = 'insert'                            //inserta el contacto guardado en la lista de contactos
      }
    form.resetForm()
  }

  delete( delPosition : number )    : void {      //borrar
    this.contact = this.contacts[delPosition];
    this.userService.deleteUser(this.contacts).subscribe((res) => {
      this.get();
    });
    // this.contacts.splice( delPosition , 1 )       //indicamos posición y cantidad
  }

  update( upPosition : number ) : void {          //actualizar
    this.contact  = this.contacts[ upPosition ];  //coger contacto que en la lista de contactos tiene posición actualizar
    this.do   = 'update'
    this.position = upPosition
  }
}


