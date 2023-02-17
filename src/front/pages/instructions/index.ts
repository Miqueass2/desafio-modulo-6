import { state } from "../../state";
import { Router } from "@vaadin/router";
class InstructionsPage extends HTMLElement{
   shadow: ShadowRoot = this.attachShadow({ mode: 'open' });
   
   connectedCallback() {
      this.render()
      
   }
   render() {
      this.shadow.innerHTML = `
      <h1>instrucciones</h1>
      `;
   }

}
customElements.define("instructions-page", InstructionsPage);