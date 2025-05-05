const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { createGunzip } = require("zlib");
require("dotenv").config();


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let connectedUsers = 0;
let answers = [];


io.on("connection", (socket) => {
    console.log("Usuario conectado");

    socket.on("validar", (paswword) => {
        if (paswword == process.env.PASSWORD) {
            io.to(socket.id).emit("validacion", "ok")
        } else {
            io.to(socket.id).emit("validacion", "no")
        }
    });

    socket.on("join", () => {
        connectedUsers++;
        io.emit("users-count", connectedUsers);
    });

    socket.on("sendAnswer", (answer) => {
        answers.push({
            answer: answer,
            votes: 0
        });
        console.log(answers)
        io.emit("answers-count", answers.length);
    });

    socket.on("start-phase-2", () => {
        io.emit("start-phase-2");
    });

    socket.on("votePhase", () => {
        io.emit("votePhaseUsers", { answers });
    });
    socket.on("endPhase", () => {
        io.emit("endPhaseUsers", { answers });
    });
    socket.on("reset", () => {

        answers = [];
        connectedUsers = 0;
        io.emit("resetEvent");
        console.log("reset")
    });

    socket.on("vote", (index)=>{
        console.log("Voto recibido")
        
        answers[index].votes +=1;
        const count = answers[index].votes;
        console.log("Cantidad de votos", count)
        console.log(answers)
        io.emit("voteUpdate", {index, count});
    })

    socket.on("disconnect", () => {
        connectedUsers--;
        io.emit("users-count", connectedUsers);
    });
});

server.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});