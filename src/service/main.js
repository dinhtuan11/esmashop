import { getAuth } from "firebase/auth";
// const btnInfo = document.querySelector(".btn-info");
// const btnLogOut = document.querySelector(".logOut");

const auth = getAuth();
console.log(auth);
auth.onAuthStateChanged((data) => {
  if (data && data?.uid) {
    btnInfo.textContent = data.displayName;
  } else {
    if (window.location.pathname != "../pages/login.html")
      window.location.href = "../pages/login.html";
  }
});
