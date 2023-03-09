import { state } from "../../state";
import { Route } from "@vaadin/router";
class PlayPageRoom extends HTMLElement {
   shadow: ShadowRoot = this.attachShadow({ mode: 'open' });

   connectedCallback() {
      const cs = state.getState();
      state.listenRoom(cs.infoPlayers.rtdbRoomId);
      /* state.subscribe(() => {
         this.render();
      }); */
         this.render();
   }
   render() { 
      const style = document.createElement("style");
      style.textContent =`
      `
      
      this.shadow.innerHTML = `
      <h1>Play page</h1>
      `;

      this.shadow.appendChild(style);
   }
}
customElements.define("play-page", PlayPageRoom);