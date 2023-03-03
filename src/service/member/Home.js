import { getAuth, signOut } from "firebase/auth";
import { formatPrice } from "../../modules/lib";
import {
  getDatabase,
  ref,
  onValue,
  query,
  orderByChild,
  limitToFirst,
} from "firebase/database";
const db = getDatabase();
const viewProduct = document.querySelector(".viewProduct");
const btnUser = document.querySelector(".btn-user");
const btnLogOut = document.querySelector(".logOut");
const starCountRef = ref(db, "products");
const refQuery = query(starCountRef, orderByChild("name"), limitToFirst(8));
onValue(refQuery, (snapshot) => {
  const product = [];
  snapshot.forEach((item) => {
    let obj = item.val();
    // console.log(item.key);
    product.push({
      id: item.key,
      ...obj,
    });
  });
  renderData(product);
  // console.log(product);
});

const renderData = (data) => {
  data.forEach((product) => {
    const template = ` <div class="pro">
    <img src="${product.image}" alt="" />
    <div class="des">
      <span>Adidas</span>
      <h5>${product.name}</h5>
      <div class="star">
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
      </div>
      <h4>${formatPrice(product.price)}</h4>
    </div>
    <a href="#" class="cart"><i class="fa-solid fa-cart-shopping "></i></a>
  </div>`;
    viewProduct.insertAdjacentHTML("beforeend", template);
  });
};

const auth = getAuth();
auth.onAuthStateChanged((data) => {
  if (data && data?.uid) {
    btnUser.textContent = data.displayName;
  } else {
    window.location.pathname = "./login.html";
  }
});
if (btnLogOut) {
  btnLogOut.addEventListener("click", () => {
    signOut(auth);
  });
}
