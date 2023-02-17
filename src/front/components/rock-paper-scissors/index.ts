const imgRock = require("url:../../../assets/piedra.png");
const imgPaper = require("url:../../../assets/papel.png");
const imgScissors = require("url:../../../assets/tijera.png");

export function handsComponent() {
class HandsComp extends HTMLElement{
   shadow: ShadowRoot = this.attachShadow({ mode: 'open' });
      constructor() {
         super();
         this.render();
      }
      render() {
         const style = document.createElement('style');
         style.textContent = `
         .container-hands{
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap:20px;

            margin-top: 124px;
         }
         `

         this.shadow.innerHTML = `
         <div class="container-hands">
            <img class="hand-rock" src="${imgRock}" alt="" />
            <img class="hand-paper" src="${imgPaper}" alt="" />
            <img class="hand-scissors" src="${imgScissors}" alt="" />
         </div>
         `;
         this.shadow.appendChild(style);
      }
   }
   customElements.define('hands-component', HandsComp);
}