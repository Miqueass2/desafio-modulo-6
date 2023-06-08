export function counterComponent() {
   class Count extends HTMLElement{
      shadow: ShadowRoot = this.attachShadow({ mode: 'open' });
      constructor() {
         super();
         this.render();
      }
      render() {
         const style = document.createElement('style');
         style.textContent = `
         .container-contador{
            display:flex;
            justify-content:center;
            align-items:center;
            height: 419px;
         }
         .contador{
            font-size:100px;
            margin-top: 175px;
            color:#43dc8f;
            animation:numberAnimation 1s linear 5 alternate;
         }
         @keyframes numberAnimation{
            0%{transform: scale(1)}

            50%{transform: scale(1.5)}

            100%{transform: scale(1)}
         }
         `;
         
         const div = document.createElement('div');
         div.classList.add('container-contador')
         div.innerHTML = `
         <h4 class="contador"></h4>
         `;
         let counterNumber = 10;
         const intervalId = setInterval(() => {
            const counterDiv = div.querySelector('.contador')!;
            counterDiv.innerHTML = `${counterNumber}`
            counterNumber--
            if (counterNumber < 0) {
               clearInterval(intervalId);
            }
         }, 1000);
         
         


         
         this.shadow.appendChild(div);
         this.shadow.appendChild(style);
         
      }
   }
   customElements.define('count-component', Count);
}