import {
  getDatabase,
  ref,
  startAfter,
  query,
  get,
  orderByChild,
  limitToFirst,
  onValue,
  equalTo,
  set,
  push,
  update,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { formatPrice } from "../../modules/lib";
import $, { data } from "jquery";
const listProduct = document.querySelector(".list-product");
const btnLoad = document.querySelector(".btn-load");
const listCategory = document.querySelector(".list-category");
import { User } from "../../model/User";
import { Product } from "../../model/Product";
const database = getDatabase();
const auth = getAuth();
const starCountRef = ref(database, "products");
const currentUser = new User();
const product = new Product();

let lastKeyObj = {
  key: "",
};
const firstPageQuery = query(
  starCountRef,
  orderByChild("name"),
  limitToFirst(8)
);

const handleQueryData = (firstPageQuery, delOld = false) => {
  console.log(firstPageQuery);
  try {
    get(firstPageQuery).then((snapshot) => {
      const products = [];
      snapshot.forEach((childSnapshot) => {
        console.log(childSnapshot);
        const childData = childSnapshot.val();
        // console.log(childData);
        products.push({
          id: childSnapshot.key,
          ...childData,
        });
      });
      const lastKey = products[products.length - 1]?.name;
      if (delOld) {
        btnLoad.style.cssText = "display:none !important";
        listProduct.textContent = "";
        listProduct.setProduct = products;
      } else {
        btnLoad.style.display = "block";
        let oldProduct = product.getProduct;
        product.setProduct = oldProduct
          ? [...oldProduct, ...products]
          : products;
      }
      renderData(products);

      lastKeyObj.key = lastKey;
    });
  } catch (error) {
    console.log("k");
    console.log(error);
  }
};
handleQueryData(firstPageQuery);

btnLoad.addEventListener("click", () => {
  if (!lastKeyObj.key) {
    btnLoad.style.display = "none";
    return;
  }
  const loadMoreQuery = query(
    starCountRef,
    // equalTo("hádhfhas"),
    startAfter(lastKeyObj.key),
    orderByChild("name"),
    limitToFirst(4)
  );
  handleQueryData(loadMoreQuery);
});

const renderData = (data) => {
  // console.log(data);
  if (!data) return;
  data.forEach((product) => {
    const template = `<div class="pro">
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
      <h4>${formatPrice(product.price)}đ</h4>
    </div>
    <a href="#" class="cart add-cart" data-id="${
      product.id
    }"><i class="fa-solid fa-cart-shopping"></i></a>
  </div>`;
    listProduct.insertAdjacentHTML("beforeend", template);
  });
};

onValue(ref(database, "category"), (snapshot) => {
  const categories = [];
  snapshot.forEach((item) => {
    let obj = item.val();
    categories.push({
      id: item.key,
      ...obj,
    });
  });
  if (categories.length === 0) return;
  listCategory.textContent = "";
  listCategory.innerHTML = "<option value=''>Tất cả</option>";
  categories.forEach((category) => {
    const template = `
    <option value="${category.id}">${category.name}</option>
    `;
    listCategory.insertAdjacentHTML("beforeend", template);
  });
});
listCategory.addEventListener("change", (e) => {
  const categoryId = e.target.value;
  // console.log(categoryId);
  if (!categoryId) {
    handleQueryData(firstPageQuery);
    listProduct.textContent = "";
    return;
  }
  const loadMoreQuery = query(
    starCountRef,
    equalTo(categoryId),
    // startAfter(lastKeyObj.key),
    orderByChild("cate_id"),
    limitToFirst(8)
  );
  handleQueryData(loadMoreQuery, true);
});
