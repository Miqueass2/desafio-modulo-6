import { state } from "../../state";
import { Router } from "@vaadin/router";
class WaitingPlayerStart extends HTMLElement {
   shadow: ShadowRoot = this.attachShadow({ mode: 'open' });
   localPlayer: string;
   onlinePlayer: string
   roomId: number;
   statusPlayerLocal: boolean;
   connectedCallback() {
      const cs = state.getState();
      state.listenRoom(cs.infoPlayers.rtdbRoomId);
      
      localStorage.removeItem('firebase:previous_websocket_failure');
      
      state.subscribe(() => {
         const cs = state.getState();
         this.localPlayer = cs.infoPlayers.userName;
         this.onlinePlayer = cs.infoPlayers.userNamePlayerOnline;
         this.roomId = cs.infoPlayers.roomId;
         this.statusPlayerLocal = cs.infoPlayers.startPlayerLocal;
         this.render();
         
      });
      this.localPlayer = cs.infoPlayers.userName;
      this.onlinePlayer = cs.infoPlayers.userNamePlayerOnline
      this.roomId = cs.infoPlayers.roomId;
      this.statusPlayerLocal = cs.infoPlayers.startPlayerLocal;
      this.render();
   }

   render() { 
      console.log("RENDER DESDE WAITING PLAYER::::");
      
      console.log("localPl",this.localPlayer);
      console.log("OnlinePl",this.onlinePlayer);
      console.log("RoomID",this.roomId);
      console.log("statusPlayerLocal",this.statusPlayerLocal);
      
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
      /* const salaRoomId = cs.infoPlayers.roomId;
      
      const nameLocal = cs.infoPlayers.userName
      const namePlayerOnline = cs.infoPlayers.userNamePlayerOnline*/
      const localScore = cs.score.localPlayer;
      const onlinePlayerScore = cs.score.onlinePlayer;
      
      this.shadow.innerHTML = `
      <header class="header">
         <div class="header__names">
            <h3 class="header__names-title">${this.localPlayer}: ${localScore}</h3>
            <h3 class="header__names-title">${this.onlinePlayer}: ${onlinePlayerScore}</h3>
         </div>
         <div class="room">
            <h3 class="title_sala">Sala</h3>
            <p class="title_sala"> ${this.roomId}</p>
         </div>
      </header>
      <div class="title-container">
         <h1 class="title-container__title">Esperando a que
         ${
            this.statusPlayerLocal == true ? this.onlinePlayer : this.localPlayer
         } presione ¡Jugar!...</h1>
      </div>

      <hands-component class="hands"></hands-component>


      `;
      
      

      this.shadow.appendChild(style);
   }
}
customElements.define("waiting-player", WaitingPlayerStart);