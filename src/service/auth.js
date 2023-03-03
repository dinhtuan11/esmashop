import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
const provider = new GoogleAuthProvider();
const btnLogin = document.querySelector(".btn");
const auth = getAuth();
btnLogin.addEventListener("click", async () => {
  await signInWithPopup(auth, provider);
});
auth.onAuthStateChanged((data) => {
  console.log(data);
  if (data && data.uid) {
    window.location.href = "../pages";
  }
});
