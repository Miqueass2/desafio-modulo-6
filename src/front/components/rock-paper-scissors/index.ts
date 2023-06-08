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
         .hands-instructions{
            display: flex;
               flex-direction: row;
               justify-content: center;
               gap:20px;
               margin-top:50px;
         }

         .container-hands{
            position: relative;
            top: 58px;
            display: flex;
            justify-content: center;
            gap: 46px;
         }
         .hand-rock{
            width: 70px;
            height: 120px;
            position: relative;
            right: -107px;
            cursor:pointer;
         }

         .hand-elegido-piedra{
            transform: translateY(-50px);
            transition:.2s;
            
         }
         .no-selected{
            opacity: 0.5;
            transform: translateY(8vh);
         }
         .selected{
            opacity: 1;
            transform: translateY(0vh);
         }
         .hands-descartados-piedra{
            opacity: 31%;
            transform: scale(0.5);
            transition: 1s;
         }
         .hands-descartados-papel{
            opacity: 31%;
            transform: scale(0.5);
            transition: 1s;
         }
         .hands-descartados-tijera{
            opacity: 31%;
            transform: scale(0.5);
            transition: 1s;
         }
         .hands-none{
            display:none;
         }
         
         .hands-relocation-rock{
            position: relative;
            top: 170px;
            right: 0px;
            height: 154px;
            transition:0s;
            width:90px
         }
         
         .hand-paper{
            width: 70px;
            height: 120px;
            position: relative;
            right: -100px;
            cursor:pointer;
         }
         .hands-relocation-paper{
            position: relative;
            top: 170px;
            right: 0px;
            width:90px;
            height: 154px;
            transition:none;
         }
         
         .hand-elegido-papel{
            transform: translateY(-50px);
            transition:.2s;
            
         }

         .hand-scissors{
            width: 70px;
            height: 120px;
            position: relative;
            right: 234px;
            cursor:pointer;
         }
         .hand-relocation-scissors{
            position: relative;
            top: 170px;
            right: 0px;
            width:90px;
            height: 154px;
            transition:none;
         }

         .hand-elegido-tijera{
            transform: translateY(-50px);
            transition:.2s;
            
         }
         `

         this.shadow.innerHTML = `
         <div class="container-hands">
            <img id="piedra" class="hand-rock hand" src="${imgRock}" alt="" />
            <img id="papel" class="hand-paper hand" src="${imgPaper}" alt="" />
            <img id="tijera" class="hand-scissors hand" src="${imgScissors}" alt="" />
         </div>
         `;
         this.shadow.appendChild(style);
      }
   }
   customElements.define('hands-component', HandsComp);
}