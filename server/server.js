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
  setDoc,
  updateDoc,
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

//middleware
function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    jwt.verify(token, serverSecret, (err, decoded) => {
      if (err) {
        if (err.expiredAt) {
          console.log("Tokenul tau a expirat");
          res.status(403);
          res.send("expiredToken");
        } else {
          console.log("Tokenul tau nu este bun");
          res.status(403);
          res.send("brokenToken");
        }
      } else {
        console.log(decoded.data);
        req.email = decoded.data;
        next();
      }
    });
    next();
  } else {
    res.status(401);
  }
  //console.log('ar trebui sa ai un token', req.headers['authorization'])
}

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
      const brandId = brandDoc.id;

      // Obține colecția de parfumuri pentru brand
      const perfumesCollection = collection(db, "brands", brandId, "perfumes");
      const perfumesSnapshot = await getDocs(perfumesCollection);

      // Map-ează documentele parfumurilor pentru a adăuga id-uri
      const perfumes = perfumesSnapshot.docs.map((perfumeDoc) => {
        const perfumeData = perfumeDoc.data();
        return {
          ...perfumeData,
          id: perfumeDoc.id, // Adaugă id-ul unic generat de Firebase pentru parfum
        };
      });

      brandData.perfumes = perfumes;
      brands.push({
        ...brandData,
        id: brandId, // Adaugă id-ul unic generat de Firebase pentru brand
      });
    }

    res.status(200).send(brands);
  } catch (error) {
    console.error("Error fetching brands: ", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/viewPerfumes", async (req, res) => {
  let brandId; // Declară brandId aici

  try {
    brandId = req.body.id;

    if (!brandId) {
      return res.status(400).send({ message: "Invalid brandId" });
    }

    const perfumesCollection = collection(db, "brands", brandId, "perfumes");
    const perfumesSnapshot = await getDocs(perfumesCollection);

    const perfumes = perfumesSnapshot.docs.map((perfumeDoc) => {
      const perfumeData = perfumeDoc.data();
      return {
        ...perfumeData,
        id: perfumeDoc.id,
      };
    });

    res.status(200).send(perfumes);
  } catch (error) {
    console.error(`Error fetching perfumes for brand ${brandId}: `, error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/deletePerfume", async (req, res) => {
  console.log(req.body);
  console.log("sunt aici");
  const brandId = req.body.brandId;
  const perfumeId = req.body.perfumeId;

  if (!brandId || !perfumeId) {
    return res
      .status(400)
      .json({ message: "Parametrii brandId și perfumeId sunt necesari." });
  }

  const brandsCollection = collection(db, "brands");

  try {
    // Get the brand document using the brandId
    const brandDocRef = doc(brandsCollection, brandId);
    const brandDoc = await getDoc(brandDocRef);

    if (!brandDoc.exists()) {
      return res
        .status(404)
        .json({ message: "Brandul cu ID-ul specificat nu există." });
    }

    // Get the perfume document using the perfumeId from the "perfumes" subcollection
    const perfumesCollection = collection(brandDocRef, "perfumes");
    const perfumeDocRef = doc(perfumesCollection, perfumeId);
    const perfumeDoc = await getDoc(perfumeDocRef);

    if (!perfumeDoc.exists()) {
      return res
        .status(404)
        .json({ message: "Parfumul cu ID-ul specificat nu există în brand." });
    }

    await deleteDoc(perfumeDocRef);

    //res.status(200).json({ message: "Parfumul a fost sters cu succes." });

    const updatedPerfumesSnapshot = await getDocs(perfumesCollection);
    const isEmpty = updatedPerfumesSnapshot.empty;

    // Dacă colecția este goală, șterge brandul
    if (isEmpty) {
      await deleteDoc(brandDocRef);
      res.status(200).json({ message: "Parfumul a fost șters cu succes." });
    } else {
      res.status(200).json({ message: "Parfumul a fost șters cu succes." });
    }
  } catch (error) {
    console.error("Eroare în timpul ștergerii parfumului:", error);
    res
      .status(500)
      .json({ message: "A apărut o eroare în timpul ștergerii parfumului." });
  }
});

app.post("/addAPerfume", async (req, res) => {
  console.log(req.body);

  const brandId = req.body.brandId;
  const name = req.body.name;
  const ingredients = req.body.ingredients;
  const gender = req.body.gender;
  const price = parseFloat(req.body.price);
  const rating = parseInt(req.body.rating);
  const brandsCollection = collection(db, "brands");

  try {
    const brandDocRef = doc(brandsCollection, brandId);
    const brandDoc = await getDoc(brandDocRef);

    if (!brandDoc.exists()) {
      return res
        .status(404)
        .json({ message: "Brandul cu ID-ul specificat nu există." });
    }

    const perfumesCollection = collection(brandDocRef, "perfumes");

    const newPerfumeDocRef = await addDoc(perfumesCollection, {
      name,
      ingredients,
      price,
      gender,
      rating,
    });
    console.log("Parfum adăugat cu succes:", newPerfumeDocRef.id);
    res.status(200).json({ message: "Parfum adăugat cu succes." });
  } catch (error) {
    console.error("Eroare în timpul adăugării parfumului:", error);
    res
      .status(500)
      .json({ message: "A apărut o eroare în timpul adăugării parfumului." });
  }
});

app.post("/addABrand", async (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const startDate = req.body.startDate;
  const country = req.body.country;

  try {
    const brandsCollection = collection(db, "brands");

    const brandDocRef = await addDoc(brandsCollection, {
      name: name,
      startDate: startDate,
      country: country,
    });

    console.log("Brand and Perfumes collection added with ID:", brandDocRef.id);
    res.status(200).json({ message: "Brand and Perfumes added successfully." });
  } catch (error) {
    console.error("Error adding brand and perfumes collection:", error);
    res.status(500).json({
      message: "Error adding brand and perfumes collection",
    });
  }
});

app.post("/editBrand", async (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  const name = req.body.name;
  const startDate = req.body.startDate;
  const country = req.body.country;

  try {
    const brandsCollection = collection(db, "brands");
    const brandDocRef = doc(brandsCollection, id);

    await updateDoc(brandDocRef, {
      name: name,
      startDate: startDate,
      country: country,
    });

    console.log("Brand updated with ID:", id);
    res.status(200).json({ message: "Brand updated successfully." });
  } catch (error) {
    console.error("Error editing brand: ", error);
    res.status(500).json({
      message: "Error editing brand",
    });
  }
});

app.post("/rateAPerfume", async (req, res) => {
  console.log(req.body);

  const brandId = req.body.brandId;
  const perfumeId = req.body.perfumeId;
  const rating = req.body.rating;

  const brandsCollection = collection(db, "brands");

  try {
    const brandRef = doc(collection(db, "brands"), brandId);
    const perfumesRef = collection(brandRef, "perfumes");
    const perfumeDocRef = doc(perfumesRef, perfumeId);

    const perfumeDoc = await getDoc(perfumeDocRef);

    if (!perfumeDoc.exists()) {
      return res.status(404).json({ message: "Perfume not found." });
    }

    await updateDoc(perfumeDocRef, {
      rating: rating,
    });

    res.status(200).json({ message: "Perfume updated successfully." });
  } catch (error) {
    console.error("Error editing perfume:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/editAPerfume", async (req, res) => {
  console.log(req.body);

  const brandId = req.body.brandId;
  const name = req.body.name;
  const perfumeId = req.body.perfumeId;
  const ingredients = req.body.ingredients;
  const gender = req.body.gender;
  const price = parseFloat(req.body.price);
  const brandsCollection = collection(db, "brands");

  try {
    const brandRef = doc(collection(db, "brands"), brandId);
    const perfumesRef = collection(brandRef, "perfumes");
    const perfumeDocRef = doc(perfumesRef, perfumeId);

    const perfumeDoc = await getDoc(perfumeDocRef);

    if (!perfumeDoc.exists()) {
      return res.status(404).json({ message: "Perfume not found." });
    }

    await updateDoc(perfumeDocRef, {
      name: name,
      ingredients: ingredients,
      gender: gender,
      price: price,
    });

    res.status(200).json({ message: "Perfume updated successfully." });
  } catch (error) {
    console.error("Error editing perfume:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/deleteBrand", async (req, res) => {
  console.log(req.body);
  console.log("sunt aici");
  const brandId = req.body.brandId;

  if (!brandId) {
    return res
      .status(400)
      .json({ message: "Parametrii brandId și perfumeId sunt necesari." });
  }

  const brandsCollection = collection(db, "brands");

  try {
    // Get the brand document using the brandId
    const brandDocRef = doc(brandsCollection, brandId);
    const brandDoc = await getDoc(brandDocRef);

    if (!brandDoc.exists()) {
      return res
        .status(404)
        .json({ message: "Brandul cu ID-ul specificat nu există." });
    }

    // Get the perfume document using the perfumeId from the "perfumes" subcollection
    const perfumesCollection = collection(brandDocRef, "perfumes");

    const perfumesSnapshot = await getDocs(perfumesCollection);
    const deletePromises = perfumesSnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );
    await Promise.all(deletePromises);

    await deleteDoc(brandDocRef);

    res
      .status(200)
      .json({ message: "Brandul și parfumurile au fost șterse cu succes." });
  } catch (error) {
    console.error("Eroare în timpul ștergerii parfumului:", error);
    res
      .status(500)
      .json({ message: "A apărut o eroare în timpul ștergerii parfumului." });
  }
});

app.listen(port, () => {
  logger.info(`Serverul ruleaza la adresa http://localhost:${port}`);
});
