export function buttonComponent() {
   class ButtonComp extends HTMLElement {
      shadow: ShadowRoot = this.attachShadow({ mode: "open" });
      constructor() {
         super();
         this.render();
      };
      render() {
         const style = document.createElement("style");
         const button = document.createElement("button");
         button.classList.add("button")
         style.textContent = `
         .container-button{

         }
         .button{
            width: 320px;
            height: 70px;
            font-size: 50px;
            border-radius: 7px;
            background-color: #dfd6b0;
            border: 7px solid;
            border-color: darkgray;
            margin:10px;
            font-family: Odibee Sans, cursive;
         }
         `;
         button.textContent = this.textContent;
         this.shadow.appendChild(button);
         this.shadow.appendChild(style);
      };
   };
   customElements.define("button-comp", ButtonComp);
};