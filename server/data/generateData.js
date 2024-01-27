import Chance from "chance";
import { db } from "../firebase/firebase.js";
import { collection, addDoc } from "firebase/firestore";
const chance = new Chance();

const ingredientsList = [
  "Bergamot",
  "Lavandă",
  "Vanilie",
  "Muscă",
  "Cedru",
  "Ylang-Ylang",
  "Patchouli",
  "Portocală",
  "Iasomie",
  "Lămâie",
  "Ambră",
  "Vetiver",
  "Măr",
  "Bujor",
  "Santal",
  "Iris",
  "Fructul pasiunii",
  "Rozmarin",
  "Mandarină",
  "Fragă",
  "Măghiran",
  "Trandafir",
  "Gardenie",
  "Scorțișoară",
  "Cardamom",
  "Căpșuni",
  "Ananas",
  "Migdale",
  "Mentă",
];

const genderList = ["man", "woman", "uni"];

const generateBrands = (brandsNo) => {
  const brands = [];
  for (let i = 0; i < brandsNo; i++) {
    const brandId = chance.guid();
    const brand = {
      brandId: brandId,
      name: chance.word({ syllables: 3 }),
      startDate: chance.date({ string: true, american: false }),
      perfumes: {}, // Adaugă un obiect pentru a stoca parfumurile
    };
    brands.push(brand);
  }
  return brands;
};

const generatePerfumes = (perfumesNo, brands) => {
  const perfumes = {};
  for (let i = 0; i < perfumesNo; i++) {
    if (brands && brands.length > 0) {
      const brand = chance.pickone(brands);
      const perfumeId = chance.guid();
      const perfume = {
        name: chance.word({ syllables: 2 }),
        ingredients: chance.pickset(ingredientsList, 5),
        gender: chance.pickone(genderList),
        price: chance.d100() * 10 + 10,
        rating: chance.floating({ min: 1, max: 5 }),
      };
      brand.perfumes[perfumeId] = perfume; // Adaugă parfumul în colecția brand-ului
      perfumes[perfumeId] = perfume;
    }
  }
  return perfumes;
};

const generateUsers = (nrUtilizatori) => {
  const users = [];
  for (let i = 0; i < nrUtilizatori; i++) {
    const user = {
      name: chance.name(),
      email: chance.email(),
      password: "parolaSecreta",
    };
    users.push(user);
  }
  return users;
};

const addData = async () => {
  const brandsNo = 5;
  const nrUtilizatori = 5;
  const perfumesNo = 20;

  const brands = generateBrands(brandsNo);
  const users = generateUsers(nrUtilizatori);
  const perfumes = generatePerfumes(perfumesNo, brands);

  const brandsCollectionRef = collection(db, "brands");
  const usersCollectionRef = collection(db, "users");

  const brandsPromises = brands.map(async (brand) => {
    const brandDocRef = await addDoc(brandsCollectionRef, brand);
    // Adaugă parfumurile asociate brand-ului
    await Promise.all(
      Object.values(brand.perfumes).map(async (perfume) => {
        await addDoc(collection(brandDocRef, "perfumes"), perfume);
      })
    );
  });

  const usersPromises = users.map(async (user) => {
    await addDoc(usersCollectionRef, user);
  });

  await Promise.all([...brandsPromises, ...usersPromises]);
  console.log("Data added successfully.");
};

addData();
