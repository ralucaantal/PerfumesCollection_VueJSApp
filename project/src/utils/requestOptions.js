let base_url = "http://localhost:3000/";
let token = localStorage.getItem("token");

let requestOptions = {
  method: "GET",
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
    "authorization": token,
  },
  redirect: "follow",
  referrerPolicy: "no-referrer",
};

export { base_url, requestOptions };
