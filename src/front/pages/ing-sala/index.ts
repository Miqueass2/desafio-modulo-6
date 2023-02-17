import { state } from "../../state";
import { Router } from "@vaadin/router";

class ingresarSalaPage extends HTMLElement {
   shadow: ShadowRoot = this.attachShadow({ mode: 'open' });

   connectedCallback() {
      this.render();
      
      
      state.listenRoom();
      const cs = state.getState();
      state.setState(cs)

      state.subscribe(() => {
         console.log("cs from ing-sala", cs);
         
      const dataLocal:any = localStorage.getItem("state");
      const localData = JSON.parse(dataLocal); 

      console.log("Storage from ing-sala",localData);
      
   });
      console.log("Fuera del subscribe",state.getState().infoPlayers);
      
      
   }  
   addListener() {
      const letsStart = this.shadow.querySelector(".title-ing-cod")!;
      const shadowIngSala = letsStart?.shadowRoot?.children[0]!;
      shadowIngSala.textContent = "Ingresar a la Sala";

      const formEl = this.shadow.querySelector(".container-input") as HTMLFormElement;
      formEl.addEventListener("submit", (e) => {
         e.preventDefault();
         const dataLocal:any = localStorage.getItem("state");
      const localData = JSON.parse(dataLocal); 

         console.log("Storage add player",localData);
         
         const inputName = this.shadow.querySelector(".input-name") as HTMLInputElement;
         const inputCode = this.shadow.querySelector(".input-code") as HTMLInputElement;

         const valueName = inputName.value;
         const valueCode = inputCode.value;
         
         if (valueName.trim() === "" && valueCode.trim() === "") {
            alert("Debes llenar los campos")

         } else if (valueName.trim() === "") {
            alert("Debes ingresar un nombre");

         } else if (valueCode.trim() === "") {
            return alert("Debes ingresar un código");

         };

         if (valueName.trim() && valueCode.trim() !== "") {
            const dataLocal:any = localStorage.getItem("state");
                  const localData = JSON.parse(dataLocal); 
            //SI EXISTE EL ROOM ID INGRESO SETEANDO
            //Creo el usuario y lo agrego a la db users de firestore collection
            console.log("LocalStorage apenas entro a rellenar los campos",localData);
            
            const name = {
               name: valueName
            }
            console.log("Antes de set name online",state.getState().infoPlayers.userNamePlayerOnline);
            
            state.setNameOnlinePlayer(valueName);
            console.log("se agrego el player online", valueName);
            console.log("Despues de set name online",state.getState().infoPlayers.userNamePlayerOnline);

            const createUserPromises = state.createUser(name);
            console.log("name online after set user:",state.getState().infoPlayers.userNamePlayerOnline);

            createUserPromises.then((res) => {
            console.log("name online after create user :",state.getState().infoPlayers.userNamePlayerOnline);
               if (res.message) {
                  alert(res.message);
               }
               if (res.id) {
            console.log("name online after id ok:",state.getState().infoPlayers.userNamePlayerOnline);

                  const userId = res.id;
                  console.log("Soy userId que será seteado",userId);
                  
                  state.setUserIdOnlinePlayer(userId);
                  console.log("se agrego el userId online " , userId);
                  console.log("Info del state after add idOnline", state.getState().infoPlayers);
                  
                  //Me fijo si la room existe
                  const accessRoom = state.accessToRoom(valueCode, userId);

                  
                  console.log("LocalStorage outside accesRoom", localData);

                  accessRoom.then((res) => {
                     const theRoomDoesntExists = res.message
                     console.log("LocalStorage inside accesRoom",localData);
                     
                     if (theRoomDoesntExists) {
                        alert(theRoomDoesntExists)
                     //crear endpoint para eliminar el nombre Si la room no se creó
                     //porque sino despues no va a poder ingresar con ese nombre
                     //si la room id la ingresa nuevamente y es correcta
                     }
                     const roomIdExists = res.rtdbRoomId
                     if (roomIdExists) {
                        console.log("localStorage si room id exists",localData);
                        
                        /* state.setRoomId(valueCode); */
                        //Si existe la sala,ahi mismo le seteo el nombre y el userid
                        //agrego el player a la rtdb room 
                        console.log("Info del state", state.getState().infoPlayers);
                        const pushPlayer = {
                           name: valueName,
                           rtdbRoomId:roomIdExists,
                           userId:userId,
                        }
                        const addPlayerToRoom = state.addPlayerToRoom(pushPlayer)!;
                        console.log("player agregado:", pushPlayer);
                        
                        addPlayerToRoom.then((res) => {
                           console.log("LocalStorage add player",localData);
                           
                           if (res.messageError) {
                              alert(res.messageError);
                           }
                           if (res.message) {
                              const dataLocal:any = localStorage.getItem("state");
                              const localData = JSON.parse(dataLocal); 

                           console.log("LocalStorage si see agregaplayer",localData);

                              console.log("Info del state 4", state.getState().infoPlayers);
                              const currentCs = state.getState().infoPlayers;
                              console.log(":: ", currentCs.userNamePlayerOnline, res.message);
                              console.log("idOnlinePlayer :", currentCs.userIdPlayerOnline);
                              
                              
                              
                        
                              console.log("info del state after player added",state.getState().infoPlayers);
                              console.log(":: 2", currentCs.userNamePlayerOnline, res.message);
                              console.log("idOnlinePlayer 2:", currentCs.userIdPlayerOnline);

                                 console.log("LocalStorageData after add player",localData);
                              /* Router.go("/waitplayer") */
                              console.log("info del state ",state.getState().infoPlayers);

                              const cs = state.getState()
                              console.log("ultimoSetState : localStorage",localData);
                              
                        };
                     });
                  };
               });
            };
         })
      };
   });
   }
   render() {
      const dataLocal:any = localStorage.getItem("state");
      const localData = JSON.parse(dataLocal); 

         console.log("Storage apenas inicia render",localData);
      const cs = state.getState();
      console.log("username playeron : ",cs.infoPlayers.userNamePlayerOnline);
      

      const dtfromsv = cs.infoPlayers.dataFromServerDb;
      console.log("dtfromsv: ",dtfromsv);
      
      const style = document.createElement("style");
      style.textContent = `
      title-el{
         justify-content: center;
         align-items: center;
         display: flex;
      }
      .container-input{
         display: flex;
         justify-content: center;
         align-items: center;
         flex-direction:column;
      }
      ::placeholder{
         color:white;
      }
      .input-name,
      .input-code{
         width: 300px;
         height: 65px;
         font-size: 40px;
         text-align: center;
         margin-bottom: 15px;
         color: white;
         background: none;
         border-left-style: none;
         border-top-style: none;
         border-right-style: none;
         border-bottom-color: cadetblue;
         border-radius: 8px;
         border-bottom-width: 4px;
      }
      .input-name:focus{
         outline:none
      }
      .title-name{
         text-align: center;
         color: white;
         font-size: 49px;
         margin: 0;
      }



      .button{
         background: transparent;
         border: none;
      }
      ::placeholder{
         font-family: Odibee Sans, cursive;
      }
      `;

      this.shadow.innerHTML = `
      <title-el></title-el>
      <form class="container-input">
         <input type="text" class="input-name" placeholder="Tu Nombre" name="nombre"/>
         <input type="text" class="input-code" placeholder="código" name="nombre"/>

         <button class="button">
            <button-comp class="title-ing-cod"></button-comp>
         </button>
      </form>
      `;
      
      this.addListener();
   this.shadow.appendChild(style);
   };
};
customElements.define("ing-sala",ingresarSalaPage)