import { rtdb } from "./rtdb";
import map from "lodash/map";
import { Router } from "@vaadin/router";
const API_BASE_URL = process.env.PORT || "http://localhost:2200";

/* enum JUGADAS {
   PIEDRA ="piedra",
   PAPEL ="papel",
   TIJERA ="tijera",
} */

const state = {
   data: {
      infoPlayers: {
         userName: "",
         userId: "",
         roomId: "",
         rtdbRoomId: "",
         playersReady:false,
         userNamePlayerOnline:"",
         userIdPlayerOnline: "",
         startPlayerLocal: "",
         startPlayerOnline:"",
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
         
         cs.infoPlayers.dataFromServerDb = snapshotFromServer
         this.setState(cs);

         console.log("Data from rtdb", cs.infoPlayers.dataFromServerDb);
         
         console.log("lenght",cs.infoPlayers.dataFromServerDb.length)
         if (location.pathname == "/waitroom") {
            this.connectedTwoPlayers();
         }
         console.log("hi");
         
      }); 
      const dataLocal:any = localStorage.getItem("state");
      const localData = JSON.parse(dataLocal); 
      this.setState(cs);
      console.log("dataStorage desde listenroom",localData);
      
   },
   getState() {
      return this.data;
   },
   setState(newState) {
      this.data = newState;
      for (const cb of this.listeners) {
         cb();
         
      }
      
      localStorage.setItem("state", JSON.stringify(newState));
      console.log("Im the State, I change", this.data);
   },
   setName(name:string) {
      const cs = this.getState();
      cs.infoPlayers.userName = name;
      this.setState(cs);
   },
   setUserId(userId:string) {
      const cs = this.getState();
      cs.infoPlayers.userId = userId;
      this.setState(cs);
   },
   setNameOnlinePlayer(nameOnline:string) {
      const cs = this.getState();
      cs.infoPlayers.userNamePlayerOnline = nameOnline;
      this.setState(cs);
   },
   setUserIdOnlinePlayer(userIdOnline:string) {
      const cs = this.getState();
      cs.infoPlayers.userIdPlayerOnline = userIdOnline;
      this.setState(cs);
   },
   createUser(newUser?) {
      console.log("API_BASE_URL:::",API_BASE_URL + "/signup");
      
      return fetch(API_BASE_URL + "/signup", {
         method: "post",
         headers: { "content-type": "application/json" },
         body: JSON.stringify(newUser)
      })
      .then(res => res.json())
      .then(data => {
         /* console.log("soy data",data); */
         return data
      })
      
   },
   nameAuth(name) {
      console.log("API_BASE_URL:::",API_BASE_URL);
      
      return fetch(API_BASE_URL + "/auth", {
         method: "post",
         headers: {
            "content-type": "application/json",
         },
         body: JSON.stringify(name)
      }).then((res) => {
         return res.json()
      }).then((data) => {

         return data;
      });
      
   },
   createRoom(dataUser) {
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
      return fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
      .then((res) => {
            return res.json();
         })
         .then((data) => {
            
            //NOS DEVUELVE EN DATA DEL RTDB ID nanoid
            console.log("soy data accesroom.rtd", data.rtdbRoomId);
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
   /* async checkTwoPlayers() {
      const cs = this.getState(); 
      const rtdbIdRoom = cs.infoPlayers.rtdbRoomId;
      
      const dataServer = cs.infoPlayers.dataFromServerDb;
      console.log("soy data server",dataServer);
      


      if (dataServer[0].start === true && dataServer[1].start == false) {
         return "hi";
      }
      if (dataServer[0].start == false && dataServer[1].start == true) {
         return this.waitingForOpponent(dataServer[0].name, false);
      }
      if (dataServer[0].start == true && dataServer[1].start == false) {
         return this.waitingForOpponent(dataServer[1].name, false);
      }
      if (dataServer[0].start == true && dataServer[1].start == true) {
         return this.waitingForOpponent("start", true);
      }
   },
   async waitingForOpponent(name: string, bothReady: boolean) {
      const cs = this.getState();
      if (bothReady === true) {
         cs.infoPlayers.playersReady = bothReady;
      }
      
   }
   , */
   async setRtdbPlayerStartOnline() {
      const cs = this.getState();
      const rtdbRoom = cs.infoPlayers.rtdbRoomId;
      const userIdOlnine = cs.infoPlayers.userIdPlayerOnline;

      const dataUpdate = {
         rtdbRoomId: rtdbRoom,
         userId: userIdOlnine,
      }
         return fetch(API_BASE_URL + "/playerstart", {
            method: "post",
            headers: {
               "content-type": "application/json",
            },
            body: JSON.stringify(dataUpdate)
         })
   },
   async setRtdbPlayerStart() {
      const cs = this.getState();
      const rtdbRoom = cs.infoPlayers.rtdbRoomId;
      const usersId = cs.infoPlayers.userId
      
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
   // CON EL SUBSCRIBE ES COMO UN EVENTO, ESCUCHAMOS LOS CAMBIOS Y LO GUARDAMOS EN EL LISTENER
   subscribe(callback: (any) => any) {
      //callback si o si debe pasar una funcion como parámetro
      this.listeners.push(callback);
      
   }
}

export { state };