import { state } from "../../state";
import { Router } from "@vaadin/router";

class ingresarSalaPage extends HTMLElement {
   shadow: ShadowRoot = this.attachShadow({ mode: 'open' });

   connectedCallback() {
      const cs = state.getState();
      console.log("Soy cs desde connnectedCallback init",cs);
      state.listenRoom(/* cs.infoPlayers.rtdbRoomId */);
      
      /* state.subscribe(() => {
         
         this.render()
         this.addListener();
         
         
      }); */
      this.render();
      this.addListener();
      
      /* const dataLocal:any = localStorage.getItem("state");
      const localData = JSON.parse(dataLocal); 
      console.log("cs from ing-sala", cs);
      console.log("localStorage from ing-sala", localData); */
   }  
   addListener() {
      const letsStart = this.shadow.querySelector(".title-ing-cod")!;
      const shadowIngSala = letsStart?.shadowRoot?.children[0]!;
      shadowIngSala.textContent = "Ingresar a la Sala";

      const formEl = this.shadow.querySelector(".container-input") as HTMLFormElement;
      formEl.addEventListener("submit", (e) => {
         e.preventDefault();
         
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
            //SI EXISTE EL ROOM ID INGRESO SETEANDO
            //Creo el usuario y lo agrego a la db users de firestore collection
            const name = {
               name: valueName
            }
            
            const createUserPromises = state.createUser(name);
            createUserPromises.then((res) => {
               if (res.message) {
                  alert(res.message);
               }
               if (res.id) {
                  const userId = res.id;
                  /* state.setNameOnlinePlayer(valueName);
                  state.setUserIdOnlinePlayer(userId); */
                  //Me fijo si la room existe
                  const accessRoom = state.accessToRoom(valueCode, userId);
                  accessRoom.then((res) => {
                     const theRoomDoesntExists = res.message
                     if (theRoomDoesntExists) {
                        alert(theRoomDoesntExists)
                     }
                     const roomIdExists = res.rtdbRoomId
                     if (roomIdExists) {
                        //Si existe la sala,ahi mismo le seteo el nombre y el userid
                        //agrego el player a la rtdb room 
                        const pushPlayer = {
                           name: valueName,
                           rtdbRoomId:roomIdExists,
                           userId:userId,
                        }
                        const addPlayerToRoom = state.addPlayerToRoom(pushPlayer)!;
                        addPlayerToRoom.then((res) => {
                           if (res.messageError) {
                              alert(res.messageError);
                           }
                           if (res.message) {
                              const cs = state.getState()
                              state.setNameOnlinePlayer(valueName);
                              state.setUserIdOnlinePlayer(userId);
                              console.log(res.message);
                              Router.go("/waitroom")
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
      const cs = state.getState();
      

      const dataLocal:any = localStorage.getItem("state");
      const localData = JSON.parse(dataLocal); 

      console.log("Storage cada vez que renderiza la page",localData);
      console.log("state render page",cs);
      
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
      
      this.shadow.appendChild(style);
   };
};
customElements.define("ing-sala",ingresarSalaPage)