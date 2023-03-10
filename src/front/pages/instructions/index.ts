import { state } from "../../state";
import { Router } from "@vaadin/router";
class InstructionsPage extends HTMLElement{
   shadow: ShadowRoot = this.attachShadow({ mode: 'open' });
   /* _localName: string;
   _playerOnlineName: string; */
   
   /* localScore: number;
   playerOnlineScore: number; */
   /* room: number;  */
   connectedCallback() {
      console.log("desde page instructions");
      
      const cs = state.getState();
      state.listenRoom(cs.infoPlayers.rtdbRoomId)
      console.log("antes de dar a jugar: STATE:::", cs);
      
      this.render();
   }
   render() {
      const style = document.createElement("style");
      style.textContent = `
      .header{
         display: flex;
         align-items: center;
         justify-content: center;
         margin:18px;
      }
      .room{
         font-size: 21px;
         color: white;
         display: flex;
         flex-direction: column;
         gap: 10px;
      }
      .title_names{
         margin:0;
      }

      .container_title{
         display: flex;
         justify-content: center;
      }
      .title_instructions{
         margin-top: 120px;
         color: white;
         font-size: 42px;
         width: 271px;
         font-weight: 600;
      }
      .button{
         background: transparent;
         border: none;
      }
      .container{
         display: flex;
         flex-direction: column;
         justify-content: center;
      }
      
      `;
      const currentState = state.getState();
      
      const salaRoomId = currentState.infoPlayers.roomId;

      this.shadow.innerHTML = `
         <header class="header">
            <div class="room">
               <h3 class="title_names">Sala</h3>
               <p class="title_names"> ${salaRoomId}</p>
            </div>
         </header>

         <section class="container">
            <div class="container_title">
               <h1 class="title_instructions">Presioná jugar
                  y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.</h1>
            </div>

            <button class="button">
               <button-comp class="title-jugar"></button-comp>
            </button>
         </section>

         <hands-component class="hands"></hands-component>

      `;
      const letsStart = this.shadow.querySelector(".title-jugar")!;
      const shadowIngSala = letsStart?.shadowRoot?.children[0]!;
      shadowIngSala.textContent = "¡Jugar!";
      
      const cs = state.getState();

      console.log("antes del eventlsitener STATE:::",cs);
      shadowIngSala.addEventListener("click", async (e) => {
         e.preventDefault();
         await state.setRtdbPlayerStart();
         await state.setRtdbPlayerStartOnline();
         Router.go("/waitingplayer");
         /* location.reload(); */
      });
         const handsStyle = this.shadow.querySelector(".hands");
         const shadowHands = handsStyle?.shadowRoot?.children[0]!;
         shadowHands.classList.remove("container-hands")
         shadowHands.classList.add("hands-instructions")

      this.shadow.appendChild(style);
   }
}
customElements.define("instructions-page", InstructionsPage);