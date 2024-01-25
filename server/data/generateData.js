const Chance = require("chance");
const { db } = require("../firebase/firebase.js");
const chance = new Chance();

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

  const brands = generateBrands(brands);
  const users = generateUsers(nrUtilizatori);

  const brandsCollectionRef = db.collection("brands");
  brands.forEach(async (brand) => {
    const brandDocRef = brandsCollectionRef.doc(brand.brandId);
    await brandDocRef.set(brand);
  });

  const usersCollectionRef = db.collection("users");
  users.forEach(async (user) => {
    const userDocRef = usersCollectionRef.doc();
    await userDocRef.set(user);
  });

  console.log("Data added successfully.");
};

addData();
