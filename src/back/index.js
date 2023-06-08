"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const express = require("express");
const nanoid_1 = require("nanoid");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 2200;
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const usersColecction = db_1.dataBase.collection("users");
const roomsColecction = db_1.dataBase.collection("rooms");
const gameStateCollection = db_1.dataBase.collection("gamesState");
/* SIGN UP */
//ACA ME LOGEO CON EL NOMBRE Y LO GUARDO EN LA BASE DE DATOS.
app.post("/signup", (req, res) => {
    const name = req.body.name;
    /* con .where le digo que se fije si hay un nombre igual al que me pasaron por params */
    /* y le hago un get para obtener la respuesta que nos devuelve una promesa */
    usersColecction.where("name", "==", name)
        .get()
        .then((response) => {
        /* con el response.empy chequeo , si esta vacio(true).. si esta vacio crea uno agregando metodo add */
        /* sino le envio un mensaje status code que ya existe */
        if (response.empty) {
            usersColecction.add({
                name: name
            }).then((newUser) => {
                //envio respuesta en el json del id del usuario creado.
                res.json({
                    id: newUser.id,
                    new: true,
                });
                /* newUser.id tiene el id del usuario que se creo en usersCollection firestore.
                console.log("newuserId ",newUser.id); */
            });
        }
        else {
            res.status(400).json({
                message: "Error , ya existe éste usuario con éste nombre.",
            });
        }
        ;
    });
});
/* AUTH */
//Autentifico si fue creado con el nombre, si no se autentifica lanzamos un mensaje de error 
//Este endpoint lo usamos cuando el usuario quiera ingresar con su nombre ya registrado
//Para eso usamos este auth.
app.post("/auth", (req, res) => {
    /* poniendo name como objeto dentro de una constante..lo que hacemos es extraer
    de req.body el name. haciendo asi const {name} */
    const { name } = req.body;
    usersColecction.where("name", "==", name)
        .get()
        .then((responseSearch) => {
        if (responseSearch.empty) {
            usersColecction.add({
                name: name,
            })
                .then((authUser) => {
                res.json({
                    //esto devulve el id de usersCollection
                    id: authUser.id,
                    new: true
                });
            });
        }
        else {
            res.status(200).json({
                message: "El nombre ingresado ya existe",
            });
            /* console.log("soy responseSearch",responseSearch.docs[0].id); */
        }
        ;
    });
});
/* ROOMS */
//Creo una room y le devuelvo un id para conectarse.
app.post("/rooms", (req, res) => {
    //Este userId es el id del user que se creo en la collection firestore de user
    //El id es asignado por firestore .. ej : asiFJHSDidoD65DD..
    //Ahi dentro de ese id se encuentra el name
    //ej asiFJHSDidoD65DD: { name : "juan" };
    const { userId } = req.body;
    const { name } = req.body;
    usersColecction.doc(userId.toString())
        .get()
        .then((snapshot) => {
        //se fija si existe el id en users,
        //si es asi crea una Room en Rooms de la rtdb con ese id de users
        //aca en el log me muestra un obj con los datos ´++*[{{{´´00}}}]
        /* ej:{ name: 'meke' } */
        console.log("im snapshot", snapshot.data());
        if (snapshot.exists) {
            const roomRef = db_1.rtdb.ref("rooms/" + (0, nanoid_1.nanoid)());
            roomRef.set({
                [userId]: {
                    userId: userId,
                    name: name.name,
                    choice: "",
                    online: true,
                    start: false,
                },
            }).then(() => {
                const roomLongNanoId = roomRef.key;
                /* console.log("soy roomlong nanoId",roomLongNanoId); */
                const roomId = 1000 + Math.floor(Math.random() * 999);
                //ACA CREAMOS UN NUEVO ROOM ID EN DB ROOMS COLLECTION
                //CON EL VERDADERO ROOM LARGO ADENTRO
                roomsColecction.doc(roomId.toString()).set({
                    rtdbRoomId: roomLongNanoId,
                }).then(() => {
                    res.json({
                        //ID CORTO NUMBERS
                        id: roomId.toString(),
                        //Id del rtdb , la sala donde estaran conectados los jugadores
                        rtdbRoomId: roomLongNanoId
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "no existe el ID ingresado"
            });
        }
    });
});
//CONTINUAR LOS DEMAS ENDPOINTS
/* ENDPOINT que agrega al jugador a la room creada */
app.post("/addplayer", (req, res) => {
    const { name } = req.body;
    //Esta rtdbRoomId es en donde se va a agregar al jugador a la misma sala
    //por eso el endpoint rooms/rtdbroomid enfoca al rtdbroomid que va a ingresar el player
    const { rtdbRoomId } = req.body;
    const { userId } = req.body;
    usersColecction.doc(userId.toString())
        .get()
        .then((snapshot) => {
        //si el userid existe,lo agrego a la rtdbroom
        if (snapshot.exists) {
            const rtdbRoomRef = db_1.rtdb.ref(`rooms/${rtdbRoomId}`);
            rtdbRoomRef.update({
                [userId]: {
                    userId: userId,
                    name: name,
                    choiceOnline: "",
                    online: true,
                    start: false,
                }
            }).then(() => {
                res.json({ message: "Player agregado correctamente" });
            });
        }
        else {
            res.json({
                messageError: "La room no se encontró y no pudo ser agregado"
            });
        }
    });
});
/* app.patch */
//Endpoint para acceder a la room
app.get("/rooms/:roomId", (req, res) => {
    //recibe por params el roomid corto, ej:
    // /rooms/1506?userId=....
    const { roomId } = req.params;
    const { userId } = req.query;
    usersColecction.doc(userId.toString())
        .get()
        .then((snapshot) => {
        if (snapshot.exists) {
            roomsColecction.doc(roomId).get().then(snap => {
                if (snap.exists) {
                    const data = snap.data();
                    //ACA EN DATA ESTA EL NANO ID QUE LO VI POR LOG
                    console.log("soy data room/:roomId ", data);
                    res.json(data);
                }
                else {
                    res.status(401).json({
                        message: "La Room ID que ingresaste no existe",
                    });
                }
            });
        }
    });
});
/* PLAYER START ENDPOINT */
//Aca hago un endpoint donde le envio el userid local y el id del rtdbroomid 
//Con esas dos datas, digo que en el rtdb cambie a true con la siguiente ruta:
// rtdb.ref("rooms/" + rtdbRoomId + "/" + userId), Aca me dirijo a la room que me pasaron
//y actualizo su estado start a true del userisd pasado por body.
app.post("/playerstart", (req, res) => {
    const { rtdbRoomId } = req.body;
    const { userId } = req.body;
    usersColecction.doc(userId.toString())
        .get()
        .then((idExists) => {
        if (idExists.exists) {
            const roomRtdbRef = db_1.rtdb.ref(`rooms/${rtdbRoomId}/${userId}`);
            //le seteo truen en la rtdb
            roomRtdbRef.update({ start: true })
                .then(() => {
                res.json({ messageOk: "El jugador está online, true en rtdb", true: true });
            });
        }
        else {
            res.status(401).json({ messageError: "No se encontró el usuario o no existe" });
        }
    });
});
/* ADD GAME */
/* CREO LA GAME ROOM CON EL ESTADO DEL GAME */
app.post("/creategame", (req, res) => {
    const { userIdOne } = req.body;
    const { userIdTwo } = req.body;
    gameStateCollection.where("userIdOne", "==", userIdOne)
        .where("userIdTwo", "==", userIdTwo)
        .get()
        .then((responseColl) => {
        if (responseColl.empty) {
            gameStateCollection.add({
                playerOne: userIdOne,
                playerTwo: userIdTwo,
                [userIdOne]: 0,
                [userIdTwo]: 0,
            }).then(() => {
                res.json({ gameCreated: "Se creó una nueva sala" });
            });
        }
        else {
            res.status(400).json({ message: "Ya hay uno creado" });
        }
        ;
    });
});
/* CHOICES */
/* PLAYERS CHOICES */
//Acá mando a la rtdbRoom lo que cada uno eligio , si piedra papel o tijera..
app.post("/choices", (req, res) => {
    const { userId } = req.body;
    const { rtdbRoomId } = req.body;
    const { choice } = req.body;
    /*    chequeo si existe el id para ir permitir modificar la rtdbroomid
    y setearle lo que eligió*/
    usersColecction.doc(userId.toString())
        .get()
        .then((idExists) => {
        if (idExists.exists) {
            const rtdbRoomRef = db_1.rtdb.ref(`rooms/${rtdbRoomId}/${userId}`);
            rtdbRoomRef.update({
                //le pasa por params lo que eligio el jugador
                choice: choice,
            })
                .then(() => {
                res.json({ message: "El jugador eligio " + choice, choice: choice });
            });
        }
        else {
            res.status(401).json({ message: "El jugador no se encuentra" });
        }
    });
});
app.post("/choicecontricante", (req, res) => {
    const { userIdOnline } = req.body;
    const { rtdbRoomId } = req.body;
    const { choiceOnline } = req.body;
    /*    chequeo si existe el id para ir permitir modificar la rtdbroomid
    y setearle lo que eligió*/
    usersColecction.doc(userIdOnline.toString())
        .get()
        .then((idExists) => {
        if (idExists.exists) {
            const rtdbRoomRef = db_1.rtdb.ref(`rooms/${rtdbRoomId}/${userIdOnline}`);
            rtdbRoomRef.update({
                //le pasa por params lo que eligio el jugador
                choiceOnline: choiceOnline,
            })
                .then(() => {
                res.json({ message: "El jugador eligio " + choiceOnline, choiceOnline: choiceOnline });
            });
        }
        else {
            res.status(401).json({ message: "El jugador no se encuentra" });
        }
    });
});
/* SAVESCORES */
//Con este endpoint envio un post para guardar el historial de la partida en la gamesState 
//de la DB firestore.
//REVISAR BIEN Y HACERLE SUMAR LOS PUNTOS CORRECTAMENTE, ENDPOINT PARA WIN Y LOSE.
app.post("/savescores", (req, res) => {
    const { playerOne } = req.body;
    const { playerTwo } = req.body;
    /* const { userId } = req.body;
    const { userIdOnline } = req.body; */
    /* ACA PUEDO PASARLE UN SCORE QUE ME LLEGUE DEL STATE
    POR PARAMS REQ.BODY Y SUMARLE UNO AUTOMATICAMENTE
    EJ: const { score } = req.body
    docRef.update(({
       [playerOne]: score + 1 ,
       [playerTwo]:0,
    })) */
    gameStateCollection
        .where("playerOne", "==", playerOne)
        .where("playerTwo", "==", playerTwo)
        .get()
        .then((snap) => {
        if (!snap.empty) {
            const docRef = snap.docs[0].ref;
            docRef.update(({
                [playerOne]: 0,
                [playerTwo]: 0,
            }))
                .then(() => {
                res.json({ message: "Se agrego el puntaje al jugador correspondiente" });
            });
        }
        else {
            res.status(401).json({ message: "No se encontro el jugador por id" });
        }
    });
});
/* ENDPOINT GETDATA */
//Con este endpoint traeré toda la data del gamesCollection .
/* app.get("/getdatagames", (req, res) => {
   
}); */
app.post("/rooms/:id", (req, res) => {
    const chatRoomRef = db_1.rtdb.ref("/rooms/" + req.params.id + "/messages");
    chatRoomRef.on("value", (snap) => {
        /* aqui value me  devuelve un obj de el rooms id rtdb y dentro de ese obj..
        otro objt donde esta {from: "name", message:"hola"} */
        let value = snap.val();
        console.log("soy value snap", value);
    });
    chatRoomRef.push(req.body, () => {
        res.json("todo ok");
    });
});
app.use(express.static("dist"));
app.get("*", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
});
app.listen(port, () => {
    console.log(process.env.PORT_OK);
    console.log(`port ok http://localhost:${port}`);
});
