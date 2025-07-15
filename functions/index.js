/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");

initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.getPlayers = onRequest(
  {
    cors: [
      "https://cricket-team-creator.web.app",
      /firebase\.com$/,
      /localhost:[0-9]{4}/,
    ],
  },
  async (request, response) => {
    try {
      const playersQSnapshot = await getFirestore().collection("players").get();
      if (playersQSnapshot.empty) {
        response.status(404).send("No Data");
        return;
      }

      const players = playersQSnapshot.docs.map((d) => {
        return d.data();
      });

      response.status(200).json({ players });
    } catch (err) {
      response.status(500).send(err.message || "Something went wrong.");
    }
  },
);
