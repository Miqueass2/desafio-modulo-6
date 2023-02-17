export function titleComponent() {
   class TitleComp extends HTMLElement{
      shadow: ShadowRoot = this.attachShadow({ mode: "open" });
      title:string;
      constructor() {
         super();
         this.render()
      }
      render() {
         const style = document.createElement("style");
         style.textContent = `
         .title-container{
            width: 220px;

         }
         .title{
            color:white;
            font-size:92px;
            margin-top:26px;
         }
         `;

         this.shadow.innerHTML = `
         <div class="title-container">
            <h1 class="title">Piedra Papel ó Tijera</h1>
         </div>
         `;

         this.shadow.appendChild(style);
      }
   }
   customElements.define("title-el", TitleComp);
}