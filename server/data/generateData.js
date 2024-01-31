import Chance from "chance";
import { db } from "../firebase/firebase.js";
import { collection, addDoc } from "firebase/firestore";

const chance = new Chance();

const ingredientsList = [
  "Bergamot",
  "Lavender",
  "Vanilla",
  "Musk",
  "Cedar",
  "Ylang-Ylang",
  "Patchouli",
  "Orange",
  "Jasmine",
  "Lemon",
  "Amber",
  "Vetiver",
  "Apple",
  "Peony",
  "Sandalwood",
  "Iris",
  "Passion Fruit",
  "Rosemary",
  "Mandarin",
  "Strawberry",
  "Blackberry",
  "Marjoram",
  "Rose",
  "Gardenia",
  "Cinnamon",
  "Cardamom",
  "Strawberries",
  "Pineapple",
  "Almond",
  "Mint",
];

const genderList = ["man", "woman", "uni"];

const generateBrands = (brandsNo) => {
  const brands = [];
  for (let i = 0; i < brandsNo; i++) {
    const brand = {
      name: chance.word({ syllables: 3 }),
      startDate: chance.date({ string: true, american: false }),
      country: chance.country({ full: true }),
    };
    brands.push(brand);
  }
  return brands;
};

const generatePerfumes = (brands, perfumesNo) => {
  const perfumes = [];
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
      perfumes.push(perfume);
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
  const perfumes = generatePerfumes(brands, perfumesNo);

  const brandsCollectionRef = collection(db, "brands");
  const usersCollectionRef = collection(db, "users");

  const brandsPromises = brands.map(async (brand) => {
    const brandDocRef = await addDoc(brandsCollectionRef, brand);
    // Adaugă parfumurile asociate brand-ului
    await Promise.all(
      perfumes
        .filter((perfume) => perfume.brandId === brand.brandId)
        .map(async (perfume) => {
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
