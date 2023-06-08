import { rtdb } from "./rtdb";
import map from "lodash/map";
import { Router } from "@vaadin/router";
const API_BASE_URL = process.env.PORT || "http://localhost:2200";
type Jugada = "piedra" | "papel" | "tijera";
type Results = "ganaste" | "perdiste" | "empate";
const state = {
   data: {
      infoPlayers: {
        userName: "",
        userId: "",
        roomId: "",
        rtdbRoomId: "",
        userNamePlayerOnline:"",
        userIdPlayerOnline: "",
        startPlayerLocal: "",
        startPlayerOnline: "",
        play: "",
        opponentPlay:"",
        dataFromServerDb:[]
      },
      currentGameChoices: {
        myPlay: "",//enum JUGADAS,
        onlinePlayerPlay:"",//enum JUGADAS,
      },
      score: {
        localPlayer: 0,
        onlinePlayer:0   
      }
  },
  listeners: [],
   //CON EL INIT() OBTENEMOS LOS DATOS DE LA RTDB Y LO PASAMOS AL STATE, 
   //Y DESDE LOS COMPONENTES O PAGES PODEMOS MANIPULAR LOS DATOS GRACIAS AL STATE
    init() {
      //QUITAR ESTO MAS ADELANTE
      /* const cs = this.getState();
      cs.infoPlayers.startPlayerLocal = ""
      cs.infoPlayers.startPlayerOnline = "" */
      /* this.setState(cs); */
      //      
      console.log("data",this.data)
      
      const dataLocal:any = localStorage.getItem("state");
      if (!dataLocal) {
        console.log("localstorage null",dataLocal);
        return;
      }
      const localData = JSON.parse(dataLocal); 
      console.log("dataStorage antes de set",localData);
      this.setState(localData);
      /* this.listenRoom(); */

      console.log("soy localdatainit setted", localData);
      
  },
   //Escucho la sala de la room conectada, y traigo la data de esa room rtdb 
   //Ahi dentro estan los usuarios, con los datos de jugadas, si esta online,etc..
    listenRoom(rtdbRoomId?) {
      const cs = this.getState();
      const roomsRef = rtdb.ref(`/rooms/${rtdbRoomId}`);
      roomsRef.on("value", (snapshot) => {
          const snapshotData = snapshot.val();
         /* console.log("messages",messagesFromServer); */
          const snapshotFromServer = map(snapshotData)
        
          cs.infoPlayers.dataFromServerDb = snapshotFromServer;
        
          console.log("Data from rtdb", cs.infoPlayers.dataFromServerDb);
        
          console.log("lenght",cs.infoPlayers.dataFromServerDb.length)
          if (location.pathname == "/waitroom") {
            this.connectedTwoPlayers();
            this.setNameOnlinePlayer();
            this.setName();
        }
          if (location.pathname == "/waitingplayer") {
            this.statusStartOk();
        }
        this.setState(cs);
        
      }); 
      const dataLocal:any = localStorage.getItem("state");
      const localData = JSON.parse(dataLocal); 
      this.setState(cs);
      console.log("dataStorage desde listenroom",localData);
      
  },
    getState() {
      return this.data;
  },
    setState(newState:any) {
      this.data = newState;
      for (const cb of this.listeners) {
        cb();
      }
      
      localStorage.setItem("state", JSON.stringify(newState));
      console.log("Im the State, I change", this.data);
  },
   
    createUser(newUser?) {
      const cs = this.getState();      
      return fetch(API_BASE_URL + "/signup", {
          method: "post",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(newUser)
      })
      .then(res => res.json())
        .then(data => {
          console.log("soy data id local", data.id);
          if (data.id) {
            cs.infoPlayers.userId = data.id;
            this.setState(cs);
          }
          this.setState(cs);
          return data;
      })
      
  },
    nameAuth(name) {
      const cs = this.getState();
      return fetch(API_BASE_URL + "/auth", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(name)
      }).then((res) => {
          return res.json()
      }).then(data => {
        console.log("soy id online",data.id);
        if (data.id) {
            cs.infoPlayers.userIdPlayerOnline = data.id
            this.setState(cs)
          }
          this.setState(cs)
        return data;
      });
  },
  setName(name:string) {
    const cs = this.getState();
    const dataFromFb = cs.infoPlayers.dataFromServerDb;
    cs.infoPlayers.userName = name;
    console.log("datafromdb::",dataFromFb);
      dataFromFb.forEach((data) => {
        if (data.name != cs.infoPlayers.userNamePlayerOnline) {
          cs.infoPlayers.userName = data.name;
          console.log("soy dataname local::",data.name,cs.infoPlayers.userNamePlayerOnline);
        }
    });
    this.setState(cs);
  },
  setUserId(userId:string) {
    const cs = this.getState();
    cs.infoPlayers.userId = userId;
    this.setState(cs);
},
  setNameOnlinePlayer(nameOnline:string) {
    const cs = this.getState();
    const dataFromFb = cs.infoPlayers.dataFromServerDb;
    cs.infoPlayers.userNamePlayerOnline = nameOnline;
    console.log("datafromdb::",dataFromFb);
    dataFromFb.forEach((data) => {
      if (data.name != cs.infoPlayers.userName) {
        cs.infoPlayers.userNamePlayerOnline = data.name;
        console.log("soy dataname online::", data.name,cs.infoPlayers.userName);
        
      }
    });
    this.setState(cs);

},
  setUserIdOnlinePlayer(userIdOnline:string) {
    const cs = this.getState();
    cs.infoPlayers.userIdPlayerOnline = userIdOnline;
    this.setState(cs);
},
    createRoom(dataUser) {
      const cs = this.getState();
    return fetch(API_BASE_URL + "/rooms", {
          method: "post",
          headers: {
            "content-type": "application/json",
        },
          body: JSON.stringify(dataUser),
      })
        .then((res) => {
            return res.json();
        })
        .then((finalres) => {
          console.log("roomID::",finalres.id);
          
          cs.infoPlayers.roomId = finalres.id;
          this.setState(cs);
         //LE MANDAMOS EL ID CORTO A /ROOMS Y
         //ACA RESPONDE EL ID CORTO DESDE EL BACKEND
          return finalres;
      });
  },
      /* SIN DECIRLE EL METHOD, POR DEFECTO EL METHOD ES GET
    NO NECESITAMOS EL HEADER YA QUE NO ENVIAMOS NINGUN BODY
    */
    accessToRoom(roomId, userId) {
      /* console.log("soy roomid",roomId);
      console.log("soy userid",userId); */
      const cs = this.getState();
      return fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
      .then((res) => {
            return res.json();
        })
          .then((data) => {
            //NOS DEVUELVE EN DATA DEL RTDB ID nanoid
            console.log("soy data accesroom.rtd", data);
            console.log("soy data accesroom.rtd", data.rtdbRoomId);
            cs.infoPlayers.rtdbRoomId = data.rtdbRoomId;
            /* cs.infoPlayers.roomId = roomId; */
            this.setState(cs);
            return data;
        });
      }, 
    setRoomId(roomId:string) {
      const currentState = this.getState();
      currentState.infoPlayers.roomId = roomId;
      this.setState(currentState);
  },
    setRoomLongId(rtdbRoomId: string) {
      const currentState = this.getState();
      currentState.infoPlayers.rtdbRoomId = rtdbRoomId;
      this.setState(currentState);
  },

    addPlayerToRoom(dataPlayer) {
      if (dataPlayer) {
        return fetch(API_BASE_URL + "/addplayer", {
            method: "post",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(dataPlayer),
          })
          .then((res) => {
            return res.json();
          })
          .then((finalres) => {
            return finalres;
        });
      }
    },
    connectedTwoPlayers() {
      const currenState = this.getState();
      if (currenState.infoPlayers.dataFromServerDb.length == 2) {
          Router.go("/instructions")
      }
    },
    async setRtdbPlayerStartOnline() {
      const cs = this.getState();
      const rtdbRoom = cs.infoPlayers.rtdbRoomId;
      const userIdOlnine = cs.infoPlayers.userIdPlayerOnline;
      const data = cs.infoPlayers.dataFromServerDb;
      const dataUpdate = {
          rtdbRoomId: rtdbRoom,
          userId: userIdOlnine,
      }
      console.log("daata:",data);
      data.map((findStatus) => {
          console.log("OnlineStart::::",findStatus.name,findStatus.start);
          if (findStatus.name != cs.infoPlayers.userNamePlayerOnline) {
            if (findStatus.start === true) {
                cs.infoPlayers.startPlayerLocal = findStatus.start;
            }
            console.log("datainside::1",data);
          }
          if (findStatus.name != cs.infoPlayers.userName) {
              if (findStatus.start === true) {
                cs.infoPlayers.startPlayerOnline = findStatus.start;
            }
            console.log("datainside::2",data);
            
        }
        this.setState(cs);
      })
      /* this.setState(cs); */
      return fetch(API_BASE_URL + "/playerstart", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(dataUpdate)
      })
        /* .then((res) => res.json())
        .then((data) => {
          console.log("dataPlayerStart data.true::",data.true);
          if (data.true) {
            cs.infoPlayers.startPlayerOnline = data.true;
            this.setState(cs);
          }
        }) */
    },
    async setRtdbPlayerStart() {
      const cs = this.getState();
      const rtdbRoom = cs.infoPlayers.rtdbRoomId;
      const usersId = cs.infoPlayers.userId
      const dataFROMDB = cs.infoPlayers.dataFromServerDb;
      const dataUpdate = {
          rtdbRoomId: rtdbRoom,
          userId: usersId,
      }

      return fetch(API_BASE_URL + "/playerstart", {
          method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(dataUpdate)
        })
      },
    statusStartOk() {
      const cs = this.getState();
      if (cs.infoPlayers.dataFromServerDb[0].start === true && cs.infoPlayers.dataFromServerDb[1].start === true) {
          Router.go("/play")
      }
  },
/*   async setMovements(movements: Jugada) {
    console.log("set movements");
    const cs = this.getState();
    const plays = this.getMoves();
    console.log(plays.play);
    cs.infoPlayers.play = plays.play;
    cs.infoPlayers.opponentPlay = plays.opponentPlay;

    this.setState(cs);
    }, */
    setMove(choice:Jugada) {
      console.log("::::::setMove::::::");
      console.log("choice en :::setMove:::",choice);
      
    const currentState = this.getState();
    let move;

    let gamePc;

    //   console.log(currentState, "este es el currentState desde setMove");

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const makeMove = async ()=> {
      console.log("playerName",currentState.infoPlayers.userName);
      console.log("playerOnline",currentState.infoPlayers.userNamePlayerOnline);
      
      if (currentState.infoPlayers.userIdPlayerOnline === "") {
        this.choiceUser(choice);
      }
      if (currentState.infoPlayers.userId === "") {
        this.choiceContrincante(choice);
      }
    };
    const makeGame = async () => {
      const rtdbRoomId = currentState.infoPlayers.rtdbRoomId;
      const roomsRef = rtdb.ref(`/rooms/${rtdbRoomId}`);

      roomsRef.on("value", (snapshot) => {
        const data = snapshot.val();
        console.log(data, "esta es la data");

        const refchoice = map(data);
        currentState.infoPlayers.play = refchoice[0].choice || refchoice[1].choice;
        currentState.infoPlayers.opponentPlay = refchoice[0].choiceOnline || refchoice[1].choiceOnline;
        if (currentState.infoPlayers.opponentPlay && currentState.infoPlayers.play !== "") {
          this.setState(currentState);
        }
      });
      this.setState(currentState);

    };

    makeMove().then(() => {
      /* this.setState(currentState); */
      makeGame().then(() => {
        setTimeout(() => {
          if (currentState.infoPlayers.play !== "" && currentState.infoPlayers.opponentPlay !== "") {
            this.setState(currentState);
            whoWins();
          } else {
            this.setState(currentState);
          }
        }, 1500);
      });
    });

    const whoWins = async ()=>{
      await wait(2000);
      const userchoice = currentState.infoPlayers.play;
      console.log(userchoice, "este es el localPlay");

      const contrincanteChoice = currentState.infoPlayers.opponentPlay;
      console.log(contrincanteChoice, "este es el oppoentPlay");

      this.setState(currentState);

      if (currentState.infoPlayers.userNamePlayerOnline === "") {
        move = userchoice;
        gamePc = contrincanteChoice;

        console.log(move, gamePc, "esta es si no  tiene  name");
        this.whoWin(move, gamePc);
      }
      if (currentState.infoPlayers.userName === "") {
        move = contrincanteChoice;
        gamePc = userchoice;
        console.log(move, gamePc, "esta es si no  tiene  contrincantename");
        this.whoWin(move, gamePc);
      }
    };
  },
  choiceContrincante(choice: Jugada) {
    const cs = this.getState();

     fetch(API_BASE_URL + "/choicecontricante", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userIdOnline: cs.infoPlayers.userIdPlayerOnline,
        rtdbRoomId: cs.infoPlayers.rtdbRoomId,
        choiceOnline: choice,
      }),
    }).then((res) => res.json());

    this.setState(cs);
  },
  choiceUser(choice:Jugada) {
    const cs = this.getState();

    fetch(API_BASE_URL + "/choices", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: cs.infoPlayers.userId,
        rtdbRoomId: cs.infoPlayers.rtdbRoomId,
        choice: choice,
        
      }),
    });
    this.setState(cs);
  },
  
    /* getMoves() {
      const cs = this.getState();
      const currentGame = {
        play: cs.infoPlayers.play,
        opponentPlay: cs.infoPlayers.dataFromServerDb[cs.infoPlayers.userIdPlayerOnline].choice,
      };
      this.setState(cs);
      return currentGame;
    }, */

    /* processDateContrincante() {
      const cs = state.getState();
      cs.infoPlayers.dataFromServerDb.map((data) => {
      console.log("log de los datas", data);
          if (data.userId !== cs.infoPlayers.userId) {
            console.log("ENTRO al if de processDateContrincante");
            cs.infoPlayers.userIdOnline = data.userId;
            cs.infoPlayers.opponentPlay = data.choice;
            this.setState(cs);
          }
      });
    }, */
    /* pushHistory() {
      const currentState = this.getState();
      const currentStateWins:Results = this.whoWins();
      const myPlayScore = currentState.history.player;
      const computerScore = currentState.history.computer;
      
      if (currentStateWins == "ganaste") {
          this.setState({
            ...currentState,
            history: {
                player: myPlayScore + 1,
                computer: computerScore,
                results: "ganaste",
            }
          });
      }
      if (currentStateWins == "perdiste") {
          this.setState({
            ...currentState,
            history: {
                player: myPlayScore,
                computer: computerScore+1,
                results: "perdiste",
            }
          });
      }
      if (currentStateWins == "empate") {
          this.setState({
            ...currentState,
            history: {
                player: myPlayScore,
                computer: computerScore,
                results: "empate",
            }
          });
      }
   }, */
    /* whoWin():Results {
      const currentState = this.getState();
      const cb = currentState.currentGame;
      const win = [
          cb.myPlay == "piedra" && cb.computerPlay == "tijera",
          cb.myPlay == "papel" && cb.computerPlay == "piedra",
          cb.myPlay == "tijera" && cb.computerPlay == "papel"
      ];
      
      const lose = [
          cb.myPlay == "piedra" && cb.computerPlay == "papel",
          cb.myPlay == "papel" && cb.computerPlay == "tijera",
          cb.myPlay == "tijera" && cb.computerPlay == "piedra",
      ];
      
      
      if (win.includes(true)) {
          return "ganaste";
      }
      
      if (lose.includes(true)) {
          return "perdiste";
      } else {
          return "empate";
      }
   }, */

   // CON EL SUBSCRIBE ES COMO UN EVENTO, ESCUCHAMOS LOS CAMBIOS Y LO GUARDAMOS EN EL LISTENER
    subscribe(callback: (any) => any) {
      //callback si o si debe pasar una funcion como parámetro
      this.listeners.push(callback);
      
  }
}

export { state };