import { state } from "../../state";
import { Router } from "@vaadin/router";

class WaitPlayerPage extends HTMLElement{
   shadow: ShadowRoot = this.attachShadow({ mode: 'open' });
   
   connectedCallback() {
      this.render();
      state.listenRoom();
      state.subscribe(() => {
         const currentState = state.getState();

         const dataLocal:any = localStorage.getItem("state");
         const localData = JSON.parse(dataLocal); 
         console.log("Storage from wait-player",localData);

         console.log("cs from wait-player",currentState);
         
      })
   }
   render() {
      const style = document.createElement("style");
      style.textContent = `
      .header-container{
         display: flex;
         justify-content: center;
         align-items: center;
      }
      
      .header-container__div-p{
         display: flex;
         justify-content: space-between;
         gap: 160px;
         margin: 27px 0;
      }

      .parrafo{
         font-size:23px;
         margin:5px 0;
         color:white;
      }

      .info-container{
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         margin-top: 100px;
      }

      .title-info{
         color:white;
         font-size:35px;
         margin: 20px 0;
      }
      `;
         
      const currentState = state.getState();
      const userNameLocal = currentState.infoPlayers.userName;

      const localScore = currentState.score.localPlayer;

      
      const salaRoomId = currentState.infoPlayers.roomId;
      this.shadow.innerHTML = `
      <header class="header-container">
         <div class="header-container__div-p">
            <div class="div-p__p">
               <p class="parrafo">${userNameLocal}: ${localScore} </p>
            </div>
            <div class="div-p__p2">
               <p class="parrafo">Sala</p>
               <p class="parrafo">${salaRoomId}</p>
            </div>
         </div>
      </header>

      <div class="info-container">
         <h2 class="title-info">Compartí el código:</h2>
         <h1 class="title-info">${salaRoomId}</h1>
         <h2 class="title-info">Con tu contricante</h2>
      </div>
      <hands-component></hands-component>
      `;

      setTimeout(() => {
         
         const dataLocal: any = localStorage.getItem("state");
         
         const localData = JSON.parse(dataLocal); 

         console.log("LocalStorageData after add player from wait-player", localData);
         
         console.log("state storage from wait player; ",state.getState().infoPlayers);
         console.log("playerOnline; ",state.getState().infoPlayers.userNamePlayerOnline);
      },40000)
      

      this.shadow.appendChild(style);
   }
}
customElements.define("waiting-room",WaitPlayerPage)