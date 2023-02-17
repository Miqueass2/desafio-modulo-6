import { Router } from "@vaadin/router";

class Home extends HTMLElement{
   shadow: ShadowRoot = this.attachShadow({ mode: "open" });
   connectedCallback() {
      this.render();
      
   }
   render() {
      
      const style = document.createElement("style");
      style.textContent = `
      .title-el{
         justify-content: center;
         align-items: center;
         display: flex;
         color:black;
      }
      .buttons-content{
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
      }
      `;
      
      this.shadow.innerHTML = `
      <title-el class="title-el"></title-el>
      <div class="buttons-content">
         <button-comp class="title-ng"></button-comp>
         <button-comp class="title-ing-sala"></button-comp>
      </div>
      `;
      const getNg = this.shadow.querySelector(".title-ng")!;
      const shadowng = getNg.shadowRoot?.children[0]!;
      shadowng.textContent = "Nuevo Juego";

      const getIngSala = this.shadow.querySelector(".title-ing-sala");
      const shadowIngSala = getIngSala?.shadowRoot?.children[0]!;
      shadowIngSala.textContent = "Ingresar a una sala";

      shadowng?.addEventListener("click", (e)=>{
         e.preventDefault();
         Router.go("/signup")
      })
      shadowIngSala?.addEventListener("click", (e) => {
         e.preventDefault();
         Router.go("/auth")
      });
      this.shadow.appendChild(style);
   }
}
customElements.define("home-page", Home);