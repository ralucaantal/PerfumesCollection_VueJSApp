const Chance = require("chance");
const { db } = require("../firebase/firebase.js");
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
      name: chance.company(),
      startDate: chance.date({ string: true, american: false }),
    };
    brands.push(brand);
  }
  return brands;
};

const generatePerfumes = (perfumesNo, brands) => {
  const perfumes = [];
  for (let i = 0; i < perfumesNo; i++) {
    const brand = chance.pickone(brands);
    const perfume = {
      name: chance.word({ syllables: 2 }),
      ingrediens: chance.pickset(ingredientsList, 5),
      gender: chance.pickone(genderList),
      price: chance.d100() * 10 + 10,
      rating: chance.floating({ min: 1, max: 5 }),
      brandId: brand.brandId,
      name: brand.name,
      startDate: brand.startDate,
    };
    perfumes.push(perfume);
  }
  return perfumes;
};

const generateUsers = (nrUtilizatori) => {
  const users = [];
  for (let i = 0; i < nrUtilizatori; i++) {
    const user = {
      username: chance.username(),
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
  const perfumes = generatePerfumes(perfumesNo);

  const brandsCollectionRef = db.collection("brands");
  for (const brand of brands) {
    const brandDocRef = brandsCollectionRef.doc(brand.brandId);
    await brandDocRef.set(brand);
  }

  const perfumesCollectionRef = db.collection("perfumes");
  perfumes.forEach(async (perfume) => {
    const perfumeDocRef = perfumesCollectionRef.doc();
    await perfumeDocRef.set(perfume);
  });

  const usersCollectionRef = db.collection("users");
  for (const user of users) {
    const userDocRef = usersCollectionRef.doc();
    await userDocRef.set(user);
  }

  console.log("Data added successfully.");
};

addData();
