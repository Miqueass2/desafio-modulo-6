import { state } from "../../state";
import { Route } from "@vaadin/router";
class WaitingPlayerStart extends HTMLElement {
   shadow: ShadowRoot = this.attachShadow({ mode: 'open' });

   connectedCallback() {
      const cs = state.getState();
      /* state.listenRoom(cs.infoPlayers.rtdbRoomId); */
      state.listenRoom();
      /* state.subscribe(() => {
         this.render();
      }); */
         this.render();
   }
   render() { 
      const style = document.createElement("style");
      style.textContent =`

      .header{
         display: flex;
         flex-direction: row;
         justify-content: space-between;
         margin: 0 20px;
         }
      
      .header__names-title,
      .title_sala{
         color:white;
         font-size:25px;
         margin:10px 0px;
      }
      .title-container{
         display: flex;
         flex-direction: column;
         align-items: center;
         height: 275px;
         justify-content: center;
         margin-top: 96px;
      }
      .title-container__title{
         font-size: 47px;
         width: 324px;
         color: white;
         text-align: center;
      }
      `
      const cs = state.getState();
      const salaRoomId = cs.infoPlayers.roomId;
      
      const nameLocal = cs.infoPlayers.userName
      const namePlayerOnline = cs.infoPlayers.userNamePlayerOnline

      const localScore = cs.score.localPlayer;
      const onlinePlayerScore = cs.score.onlinePlayer;
      this.shadow.innerHTML = `
      <header class="header">
         <div class="header__names">
            <h3 class="header__names-title">${nameLocal}: ${localScore}</h3>
            <h3 class="header__names-title">${namePlayerOnline}: ${onlinePlayerScore}</h3>
         </div>
         <div class="room">
            <h3 class="title_sala">Sala</h3>
            <p class="title_sala"> ${salaRoomId}</p>
         </div>
      </header>
      <div class="title-container">
         <h1 class="title-container__title">Esperando a que
         ${
            namePlayerOnline ? namePlayerOnline : nameLocal
         } presione ¡Jugar!...</h1>
      </div>

      <hands-component class="hands"></hands-component>


      `;

      this.shadow.appendChild(style);
   }
}
customElements.define("waiting-player", WaitingPlayerStart);