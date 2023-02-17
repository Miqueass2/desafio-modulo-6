import { state } from "./state";
/* COMPONENTSS */
import { titleComponent } from "./components/title-welcome/index";
import { buttonComponent } from "./components/button/index";
import { handsComponent } from "./components/rock-paper-scissors";
/* PAGES */
import "./pages/home-page/index";
import "./pages/ing-nombre/index";
import "./pages/wait-player/index";
import "./pages/ing-sala/index";
import "./pages/instructions/index";
import "./router";

(function () { 
   state.init();
   titleComponent();
   buttonComponent();
   handsComponent();
   /* setTimeout(() => {
      console.log("State desde el index.ts", state.getState())
      console.log("usernameOnline: ", state.getState().infoPlayers.userNamePlayerOnline);
      console.log("userIdOnline: ", state.getState().infoPlayers.userIdPlayerOnline);
      
   },50000) */
})();