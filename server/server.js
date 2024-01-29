import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  doc,
  deleteDoc,
  getFirestore,
  collection,
  getDocs,
  addDoc,
  getDoc,
} from "firebase/firestore";
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

app.post("/login", async (req, res) => {
  console.log("Vrei să faci POST cu ", req.body);

  const userToLogin = req.body;
  const usersCollection = collection(db, "users");

  try {
    const snap = await getDocs(usersCollection);
    let userFound = false;
    let userPassword = "";
    let username = ""; // Variabilă pentru a stoca numele utilizatorului

    snap.forEach((element) => {
      //console.log("user email: ", element.data().userToAdd);
      const user = element.data().userToAdd;

      if (user !== null && user !== undefined) {
        if (user.email === userToLogin.email) {
          console.log("exists");
          userFound = true;
          userPassword = user.password;
          username = user.name; // Salvează numele utilizatorului
        }
      } else {
        console.log("Object is null or undefined");
      }
    });

    if (!userFound) {
      res.send({ message: "The email does not exist." });
      return;
    }

    bcrypt.compare(userToLogin.password, userPassword, function (err, result) {
      if (result) {
        console.log("ai reușit");
        const token = jwt.sign({ name: username }, serverSecret, {
          expiresIn: "1h",
        });
        console.log("username: ", username);
        console.log("Tokenul tău este: ", token);
        res.send({ message: token, isOk: "true" });
      } else {
        console.log("Parolă greșită");
        res.send({ message: "The password is not correct." });
      }
    });
  } catch (error) {
    console.error("Error getting documents: ", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.get("/viewBrands", async (req, res) => {
  try {
    const brandsCollection = collection(db, "brands");
    const brandsSnapshot = await getDocs(brandsCollection);

    const brands = [];
    for (const brandDoc of brandsSnapshot.docs) {
      const brandData = brandDoc.data();
      const perfumesCollection = collection(
        db,
        "brands",
        brandDoc.id,
        "perfumes"
      );
      const perfumesSnapshot = await getDocs(perfumesCollection);
      const perfumes = perfumesSnapshot.docs.map((perfumeDoc) =>
        perfumeDoc.data()
      );
      brandData.perfumes = perfumes;
      brands.push(brandData);
    }

    res.status(200).send(brands);
  } catch (error) {
    console.error("Error fetching brands: ", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/deleteBrand", async (req, res) => {
  console.log(req.body);
  console.log("sunt aici");
  const brandId = "3WzzynVac1WbTEyu5EAH"; // Schimbarea aici
  console.log("brand id: " + brandId + "\n\n\n\n");
  if (!brandId) {
    // Răspunde cu un cod 400 și un mesaj de eroare dacă nu există brandId
    return res.status(400).json({ message: "Parametrul brandId lipsește." });
  }

  // Crează o referință la colecția "brands"
  const brandsCollection = collection(db, "brands");

  try {
    // Get the document using the brandId
    const brandDoc = await getDoc(doc(brandsCollection, brandId));
    console.log("continnutul este: \n" + brandDoc.id);
    if (brandDoc.id !== brandId) {
      // Documentul nu există, nu îl puteți șterge
      return res
        .status(404)
        .json({ message: "Brandul cu ID-ul specificat nu există." });
    }
    // Obțineți documentul pentru a-l șterge
    const brandRef = doc(brandsCollection, brandId);
    const deleteResult = await deleteDoc(brandRef);

    // Obține lista actualizată de branduri după ștergere
    const updatedBrandsSnapshot = await getDocs(brandsCollection);
    const updatedBrands = updatedBrandsSnapshot.docs.map((doc) => doc.data());

    // Răspunde cu lista actualizată de branduri și un cod 200
    res.status(200).json(updatedBrands);
  } catch (error) {
    console.error("Eroare în timpul ștergerii brandului:", error);
    // Răspunde cu un cod 500 și un mesaj de eroare
    res
      .status(500)
      .json({ message: "A apărut o eroare în timpul ștergerii brandului." });
  }
});

app.listen(port, () => {
  logger.info(`Serverul rulează la adresa http://localhost:${port}`);
});
