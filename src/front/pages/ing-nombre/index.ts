import { state } from "../../state";
import { Router } from "@vaadin/router";
class IngNombrePage extends HTMLElement{
   shadow: ShadowRoot = this.attachShadow({ mode: 'open' });
   
   connectedCallback() {
      const currentState = state.getState();
      this.render()
      
   }
   render() { 
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
      .input-name{
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
      `
      this.shadow.innerHTML = `
      <title-el></title-el>
      <h3 class="title-name">Tu Nombre</h3>
      <form class="container-input">
         <input type="text" class="input-name" name="nombre"/>

         <button class="button">
            <button-comp class="title-ing-sala"></button-comp>
         </button>
      </form>
      `;
      const letsStart = this.shadow.querySelector(".title-ing-sala")!;
      
      const shadowIngSala = letsStart?.shadowRoot?.children[0]!;
      shadowIngSala.textContent = "Empezar";

      //Ingresar nombre al state y creo el usuario en la db firestore
      const formEl = this.shadow.querySelector(".container-input");
      formEl?.addEventListener("submit", (e) => {
         e.preventDefault();
         const inputName = this.shadow.querySelector(".input-name") as any;
         const valueName = inputName.value;
         
         if (valueName.trim() === "") {
            alert("Debes introducir un nombre")
         };

         if (valueName.trim() !== "") {
            //Le seteo el nombre al state
            state.setName(valueName);
            
            const name = {
               name: valueName
            };
            //Creo el usuario en la db 
            const createUserPromise = state.createUser(name);

            createUserPromise.then((res) => {
               //Si encuentra que existe un usuario en la db con ese nombre,
               //Lanza un mensaje con error
               const messageError = res.message;
               if (messageError) {
                  alert(messageError);
               }
               //Si el usuario no existe, lo crea correctamente,
               //y le da el ID de la usercollection DB firestore.
               const idRes = res.id;
               if (idRes) {
                  const userId = idRes;
                  state.setUserId(userId)
                  const setUserIdAndName = {
                     name: name,
                     userId: userId
                  }
                  //Creo la room 
                  const createRoomPromise = state.createRoom(setUserIdAndName);
                  //el res.id me devuelve el roomid corto
                  createRoomPromise.then((res) => {
                     const roomId = res.id
                     if (roomId) {
                        //seteo roomIdCorto
                        state.setRoomId(roomId);
                        const accessRoom = state.accessToRoom(roomId, userId)
                        accessRoom.then((res) => {
                           const rtdbRoomId = res.rtdbRoomId
                           /* set roomlongId en state */
                           state.setRoomLongId(rtdbRoomId);
                           /* state.setPlayersOnline(); */
                           /* escucho ese roomLong.. lo que trae dentro */
                           state.listenRoom(rtdbRoomId);
                           //direcciono a la sala de espera.
                           Router.go("/waitplayer")
                        })
                     };
                  });
               };
            });
         };
      });
      this.shadow.appendChild(style);
   };
};
customElements.define("ing-nombre", IngNombrePage);