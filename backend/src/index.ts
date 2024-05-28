import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data: any) {
    const message = JSON.parse(data);
    // Identify Sender
    if (message.type == "sender") {
      senderSocket = ws;
      console.log("Sender Set");
    }
    // Identify Receiver
    else if (message.type == "receiver") {
      receiverSocket = ws;
      console.log("Reseiver Set");
    }
    //create offer
    else if (message.type == "createOffer") {
      receiverSocket?.send(
        JSON.stringify({ type: "createOffer", sdp: message.sdp })
      );
      console.log("offer created");
    }
    // Create answer
    else if (message.type == "createAnswer") {
      console.log("Answer created ");
      senderSocket?.send(
        JSON.stringify({ type: "createAnswer", sdp: message.sdp })
      );
    }

    // add ice candidates
    else if (message.type === "iceCandidate") {
      if (ws === senderSocket) {
        receiverSocket?.send(
          JSON.stringify({ type: "iceCandidate", candidate: message.candidate })
        );
      } else if (ws === receiverSocket) {
        senderSocket?.send(
          JSON.stringify({ type: "iceCandidate", candidate: message.candidate })
        );
      }
    }
  });
});
