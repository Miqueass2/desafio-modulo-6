import { state } from "../../state";
import { Router } from "@vaadin/router";
type Plays = "rock" | "paper" | "scissors" | "";

class PlayPageRoom extends HTMLElement {
  shadow: ShadowRoot = this.attachShadow({ mode: 'open' });
  onlineOpponentChoice: string;
  choiceLocal: string;
  play: Plays = "";
  connectedCallback() {
    
      const cs = state.getState();
      /* state.listenRoom(cs.infoPlayers.rtdbRoomId); */
   /*    state.subscribe(() => {
        const cs = state.getState();
        console.log("playerLocal:::",this.onlineOpponentChoice);
        console.log("playerPlayOnline:::", this.onlineOpponentChoice);
        this.choiceLocal = cs.infoPlayers.play;
        this.onlineOpponentChoice = cs.infoPlayers.opponentPlay;
        this.render();
      });
      this.choiceLocal = cs.infoPlayers.play;
      this.onlineOpponentChoice = cs.infoPlayers.opponentPlay;

      console.log("playerLocal:::",this.onlineOpponentChoice);
      console.log("playerPlayOnline:::",this.onlineOpponentChoice); */
      
      this.render();
    }
    logicMoves() {
   //Aca creo un contador diferente al contador original
   //cuando pasa los 3 segundos sin elegir nada, se dirige a la seccion instrucciones
    let counterGeneral = 10;
    const stopCounter = setInterval(() => {
      counterGeneral--
      // apenas el contador llega a 0, ya no escuchan los click las manos
      if (counterGeneral == 0) {
         handsRock.removeEventListener('click', listenerHandRock);
         handsPaper.removeEventListener('click',listenerHandPaper);
         handsScissors.removeEventListener('click',listenerHandScissors);
      }
      if (counterGeneral < -1) {
         Router.go("/instructions");
         console.log("seleccionaste?");
         
      }
   }, 1300);
   clearInterval(stopCounter);
   
   
   // acceder a las manos dentro del componente de esta forma..
   //seleccionamos el component hands con la clase que le asignamos.  
      const playerHands:any = this.shadow.querySelector('.hands')?.shadowRoot?.querySelectorAll('.hand');
      const opponentPlayerHands: any = this.shadow.querySelector('.opponent-hands')?.shadowRoot?.querySelectorAll('.hand');
      
      /* const hands = playerHands?.shadowRoot?.children[0];
      const otraManos = hands?.querySelectorAll('img'); */
      /* console.log("hands", hands);
      console.log("allImagesHands", otraManos); */
      console.log("playerHands",playerHands);
      console.log("opponentHands",opponentPlayerHands);

      for (const h of playerHands!) {
        h.classList.add('no-selected');
      }
      for (const hOpponent of opponentPlayerHands!) {
        hOpponent.classList.add('no-selected');
      }
      
      const handsRock:any = this.shadow.querySelector(".hands")?.shadowRoot?.querySelector("#piedra");
      console.log("elementRock", handsRock)
      const handsPaper:any = this.shadow.querySelector(".hands")?.shadowRoot?.querySelector("#papel");
      console.log("elementPaper",handsPaper)
      const handsScissors:any = this.shadow.querySelector(".hands")?.shadowRoot?.querySelector("#tijera");
      console.log("elementScissors",handsScissors)
/*       const handsRock: any = playerHands?.shadowRoot?.children[0].children[0]!
      console.log("elementRock", handsRock);
      const handsPaper: any = playerHands?.shadowRoot?.children[0].children[1]!
      console.log("elementPaper", handsPaper);
      const handsScissors: any = playerHands?.shadowRoot?.children[0].children[2]!
      console.log("elementScissors", handsScissors); */
      
      /* this.querySelector(".playerHands")?.shadowRoot?.querySelector(".container-hands")?.addEventListener("click", e => {
        const target = e.target as any;

        if (target.id === "scissors") {
          handsScissors.classList.remove('hands-descartados-tijera');
          handsRock.classList.add("hands-descartados-piedra")
          handsPaper.classList.add("hands-descartados-papel")
          handsScissors.classList.add('hand-relocation-scissors');
          handsScissors.classList.add('hand-elegido-tijera');
          
        } else if (target.id === "paper") {
          handsPaper.classList.remove('hands-descartados-papel');
          handsRock.classList.add('hands-descartados-piedra');
          handsScissors.classList.add('hands-descartados-tijera');
          handsPaper.classList.add('hand-elegido-papel');
          handsPaper.classList.add('hands-relocation-paper')

        } else if (target.id === "rock") {
          handsPaper.classList.add('hands-descartados-papel');
          handsScissors.classList.add('hands-descartados-tijera');
          
          handsRock.classList.add('hand-elegido-piedra');
        handsRock.classList.add('hands-relocation-rock');

        };

        this.play = target.id;
    }); */




   //Selecciono uno por uno entrando al comp shadowRoot
      const typeRock = handsRock.getAttribute('class');
      console.log("class:",typeRock);
      const typePaper = handsPaper.getAttribute('class');
      console.log("class:",typePaper);
      const typeScissors = handsScissors.getAttribute('class');
      console.log("class:",typeScissors);

      async function listenerHandRock() {
      console.log("listenerHandRock");
      console.log('apretaste piedra');
      
      if (typeRock == "hand-rock hand no-selected") {
        console.log('apretaste piedra');
				
        state.setMove('piedra');
        const cs = state.getState();
        console.log("opponentPlay",cs.infoPlayers.opponentPlay);
        console.log("play",cs.infoPlayers.play);
        handActive("piedra");
      }
   }
   handsRock?.addEventListener('click', listenerHandRock);

		 async function listenerHandPaper() {
			console.log('apretaste papel');
      console.log("listenerHandPaper");
      
      if (typePaper == "hand-paper hand no-selected") {
        const cs = state.getState();
        console.log("opponentPlay",cs.infoPlayers.opponentPlay);
        console.log("play",cs.infoPlayers.play);
        state.setMove("papel");
        handActive("papel")
      }
      
   }

   handsPaper?.addEventListener('click',listenerHandPaper);


		 async function listenerHandScissors() {
			console.log('apretaste tijera');
      if (typeScissors == "hand-scissors hand no-selected") {
        state.setMove('tijera');
        handActive("tijera");
      }
   }

   handsScissors?.addEventListener('click',listenerHandScissors);


   //function para mostrar las manos segun lo que selecciona
      //HACER LOGICA DE QUIIEN LO SELECCIONO
   const handActive = async (params:string) =>{
      if (params == "piedra") {
        handsPaper.classList.add('hands-descartados-papel');
        handsScissors.classList.add('hands-descartados-tijera');
        
        handsRock.classList.remove('hand-elegido-piedra');
        handsRock.classList.add('hand-elegido-piedra');
        setTimeout(() => {
            handsPaper.style.display = "none"
            handsScissors.style.display = "none"

            
          handsRock.classList.add('hands-relocation-rock');
          
            
            alert("piedra");
         }, 3000);
        
        handsRock.removeEventListener('click', listenerHandRock);
        handsPaper.removeEventListener('click',listenerHandPaper);
        handsScissors.removeEventListener('click', listenerHandScissors);
        const cs = state.getState();
        const contadorComponent = this.shadow.querySelector('.contador-component')!;
        const styleComponent:any = contadorComponent.shadowRoot?.children[0]!
        styleComponent.style.display = "none";

          const currentOpponentPlay = cs.infoPlayers.opponentPlay;
          const playerLocal = cs.infoPlayers.play;
        if (currentOpponentPlay !== "" && playerLocal !== "") {
          const handsOpponent = this.shadow.querySelector(".opponentHands")?.shadowRoot?.querySelector("#" + currentOpponentPlay);
          handsOpponent?.classList.add("selected");
      };
        clearInterval(stopCounter);
        
         /* computerMove() */
      }
      if  (params == "papel") {
          //aqui quito la clase descartada de paper
          handsPaper.classList.remove('hands-descartados-papel');
          //aqui agrego la clase a los hands no elegidos
          handsRock.classList.add('hands-descartados-piedra');
          handsScissors.classList.add('hands-descartados-tijera');
          //acaqui agrego la clase a los hands elegidos y relocalizacion
          handsPaper.classList.add('hand-elegido-papel');


        setTimeout(() => {
            handsRock.style.display = "none";
            handsScissors.style.display = "none";

          handsPaper.classList.remove('hand-paper');
          
            handsPaper.classList.add('hands-relocation-paper')

            alert("papel");
         }, 3000);

        handsRock.removeEventListener('click', listenerHandRock);
        handsPaper.removeEventListener('click',listenerHandPaper);
        handsScissors.removeEventListener('click', listenerHandScissors);
        
        const cs = state.getState();
        const currentOpponentPlay = cs.infoPlayers.opponentPlay;
        const playerLocal = cs.infoPlayers.play;
        const contadorComponent = this.shadow.querySelector('.contador-component')!;
        const styleComponent:any = contadorComponent.shadowRoot?.children[0]!
        styleComponent.style.display = "none";
      if (currentOpponentPlay !== "" && playerLocal !== "") {
        const handsOpponent = this.shadow.querySelector(".opponentHands")?.shadowRoot?.querySelector("#" + currentOpponentPlay);
        handsOpponent?.classList.add("selected");
    };
        clearInterval(stopCounter);
         /* computerMove() */

      }
      if (params == "tijera") {
          //aqui quito la clase descartada de paper
          handsScissors.classList.remove('hands-descartados-tijera');
          //aqui agrego la clase a los hands no elegidos
          handsRock.classList.add("hands-descartados-piedra")
          handsPaper.classList.add("hands-descartados-papel")
          //acaqui agrego la clase a los hands elegidos y relocalizacion
          handsRock.classList.remove("hand-elegido-piedra")
          handsScissors.classList.add('hand-elegido-tijera');
        
         setTimeout(() => {
            handsRock.style.display = "none";
            handsPaper.style.display = "none";

           handsScissors.classList.add('hand-relocation-scissors');



            alert("tijera");
         }, 3000);
         handsRock.removeEventListener('click', listenerHandRock);
         handsPaper.removeEventListener('click',listenerHandPaper);
        handsScissors.removeEventListener('click', listenerHandScissors);
        
        const cs = state.getState();
        const contadorComponent = this.shadow.querySelector('.contador-component')!;
        const styleComponent:any = contadorComponent.shadowRoot?.children[0]!
        styleComponent.style.display = "none";

        const currentOpponentPlay = cs.infoPlayers.opponentPlay;
        const playerLocal = cs.infoPlayers.play;
      if (currentOpponentPlay !== "" && playerLocal !== "") {
        const handsOpponent = this.shadow.querySelector(".opponentHands")?.shadowRoot?.querySelector("#" + currentOpponentPlay);
        handsOpponent?.classList.add("selected");
    };
        clearInterval(stopCounter);
      }
   }
   }
   render() { 
      console.log("::::::RENDER DE PLAY PLAGE:::::::");
      const style = document.createElement("style");
      style.textContent =`
      .hands-computer{
         display:none;
         justify-content:center;
         gap: 10px;
         transform: rotate(180deg);
         position: relative;
         bottom: -2px;
      }
      .hand-rock-computer{
         width: 90px;
         height: 154px;
      
      }
      .hand-paper-computer{
         width: 90px;
         height: 154px;
      }
      .hand-scissors-computer{
         width: 90px;
         height: 154px;
      }
      .computer-relocation{
         position:relative;
         top:-50px;
      }
      .opponent-hands{
        display:none;
        justify-content:center;
        gap: 10px;
        transform: rotate(180deg);
        position: relative;
        bottom: -2px;
     }
   
      `;
      
      this.shadow.innerHTML = `
      <hands-component class="opponent-hands"></hands-component>

      <count-component class="contador-component"></count-component>
        
      <hands-component class="hands"></hands-component>
      `;


      this.shadow.appendChild(style);
      this.logicMoves();
   }
}
customElements.define("play-page", PlayPageRoom);
