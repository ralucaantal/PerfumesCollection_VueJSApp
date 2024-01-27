import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase/firebase.js";
import expressPinoLogger from "express-pino-logger";
import pino from "pino";

const app = express();
const port = 3000;

const saltRounds = 10;
const serverSecret = "secret";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const logger = pino(); // eliminarea prettyPrint aici
app.use(expressPinoLogger({ logger }));

app.get("/", (req, res) => {
  res.send("Bun venit pe serverul Express!");
});

app.post("/register", async (req, res) => {
  console.log("vrei sa faci POST cu ", req.body);

  let userToAdd = req.body;

  const usersCollection = collection(db, "users");

  try {
    const snap = await getDocs(usersCollection);

    snap.forEach((element) => {
      console.log("user email: ", element.data().userToAdd);
      var user = element.data().userToAdd;
      if (user !== null && user !== undefined) {
        if (user.email === userToAdd.email) {
          console.log("exists");
          res.send({ message: "User already exists." });
        }
      } else {
        console.log("Object is null or undefined");
      }
    });

    bcrypt.genSalt(saltRounds, async function (err, salt) {
      bcrypt.hash(userToAdd.password, salt, async function (err, hash) {
        userToAdd.password = hash;
        console.log(hash);
        const email = userToAdd.email;
        const res2 = await addDoc(usersCollection, { userToAdd });
        res.status(201);
        res.send({ message: "User added" });
      });
    });
  } catch (error) {
    console.error("Error getting documents: ", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  logger.info(`Serverul rulează la adresa http://localhost:${port}`);
});
