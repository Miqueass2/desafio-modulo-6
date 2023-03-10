import { state } from "./state";
/* COMPONENTSS */
import { titleComponent } from "./components/title-welcome/index";
import { buttonComponent } from "./components/button/index";
import { handsComponent } from "./components/rock-paper-scissors";
/* PAGES */
import "./pages/home-page/index";
import "./pages/ing-nombre/index";
import "./pages/wait-room/index";
import "./pages/ing-sala/index";
import "./pages/instructions/index";
import "./pages/waiting-player/index"
import "./pages/play-page/index";
import "./router";

(function () { 
   localStorage.removeItem('firebase:previous_websocket_failure');

   state.init();
   titleComponent();
   buttonComponent();
   handsComponent();
   /* setTimeout(() => {
      console.log("State desde el index.ts", state.getState())
      console.log("userIdOnline: ", state.getState().infoPlayers.userIdPlayerOnline);
      
   },50000) */
})();