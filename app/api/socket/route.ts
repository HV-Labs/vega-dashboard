// const { WebSocket } = require("ws");

// export function GET(req: Request) {
//   try {
//     const ws = new WebSocket(
//       `https://vega-mainnet-data.commodum.io/api/v2/stream/markets/data`
//     );
//     const messages = [];

//     ws.on("error", (err) => console.error(err));

//     const msg = {
//       text: "Hello, WebSocket!",
//     };

//     ws.on("open", () => ws.send(JSON.stringify(msg)));
//     ws.on("message", (msg) => {
//       // Handle incoming WebSocket messages and store them in the 'messages' array
//       console.log(msg.toString());

//       messages.push(msg.toString());
//     });

//     return new Promise((resolve, reject) => {
//       // After some time, you can resolve the promise with the collected messages
//       setTimeout(() => {
//         resolve(
//           new Response(JSON.stringify(messages), {
//             status: 200,
//             headers: { "Content-Type": "application/json" },
//           })
//         );
//       }, 5000); // Adjust the delay as needed
//     });
//   } catch (e) {
//     const errorMessage = e instanceof Error ? e.message : String(e);
//     return new Response(errorMessage, { status: 500 });
//   }
// }
