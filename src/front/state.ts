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
         userNamePlayerOnline:"",
         userIdPlayerOnline: "",
         userLocalOnline:false,
         userPlayerOnline:false,
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
      roomsRef.on("value", async (snapshot) => {
         const snapshotData = snapshot.val();
         /* console.log("messages",messagesFromServer); */
         const snapshotFromServer = map(snapshotData)
         
         cs.infoPlayers.dataFromServerDb = snapshotFromServer
         this.setState(cs);

         console.log("Data from rtdb", cs.infoPlayers.dataFromServerDb);
         
         console.log("lenght",cs.infoPlayers.dataFromServerDb.length)
         /*  if (location.pathname == "/waitplayer" && cs.infoPlayers.dataFromServerDb.length == 2) {
            this.connectedTwoPlayers();
         } */
         
      }); 
      const dataLocal:any = localStorage.getItem("state");
      const localData = JSON.parse(dataLocal); 
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
   setNameOnlinePlayer(name:string) {
      const cs = this.getState();
      cs.infoPlayers.userNamePlayerOnline = name;
      this.setState(cs);
      console.log("name Online setted", cs.infoPlayers.userNamePlayerOnline);
      console.log("state despues de set name",cs);
      
      
   },
   setUserIdOnlinePlayer(userId:string) {
      const cs = this.getState();
      cs.infoPlayers.userIdPlayerOnline = userId;
      this.setState(cs);
      console.log("userIdOnline setted ", cs.infoPlayers.userIdPlayerOnline);
      console.log("state despues del set userIdOnline,",cs);
      
      
   },
   createUser(newUser?) {
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
      const currenState = state.getState();
      const csUserName = currenState.infoPlayers.userName;
      const csUserNameOnline = currenState.infoPlayers.userNamePlayerOnline;
      console.log("Length from connecttwoplayers", currenState.infoPlayers.dataFromServerDb.length)
      console.log("userNameLocal",csUserName);
      console.log("userNameOnline",csUserNameOnline);
   },
   
   // CON EL SUBSCRIBE ES COMO UN EVENTO, ESCUCHAMOS LOS CAMBIOS Y LO GUARDAMOS EN EL LISTENER
   subscribe(callback: (any) => any) {
      //callback si o si debe pasar una funcion como parámetro
      this.listeners.push(callback);
      
   }
}

export { state };