import {
  getDatabase,
  ref,
  child,
  get,
  onValue,
  update,
} from "firebase/database";
import { handleLoadImg } from "../modules/lib";
import Swal from "sweetalert2";
import $ from "jquery";
const nameProduct = document.querySelector(".nameProduct");
const listCategory = document.querySelector(".listCategory");
const priceProduct = document.querySelector(".priceProduct");
const details = document.querySelector(".moTa");
const imgOld = document.querySelector(".imgOld");
const dataOld = [];
const id = window.location.search.split("?")[1];
// console.log(id);
const database = getDatabase();

(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault();
          console.log("ok");
          handleFormUpdate(event);
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

const starCountRef = ref(database, "category");
onValue(starCountRef, (snapshot) => {
  const categories = [];
  snapshot.forEach((item) => {
    let obj = item.val();
    // console.log(obj);
    categories.push({
      id: item.key,
      ...obj,
    });
  });
  if (categories.length === 0) return;
  listCategory.textContent = "";
  categories.forEach((category) => {
    const template = `
      <option value="${category.id}">${category.name}</option>
      `;
    listCategory.insertAdjacentHTML("beforeend", template);
  });
});

let editor = CKEDITOR.replace("mieuTa");
editor.on("change", function (evt) {
  console.log(evt.editor.getData());
});

if (id) {
  const dbRef = ref(getDatabase());
  get(child(dbRef, `products/${id}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const product = snapshot.val();
        dataOld.push(product);
        details.value = product.detail;
        nameProduct.value = product.name;
        priceProduct.value = product.price;
        listCategory.value = product.cate_id;
        imgOld.setAttribute("src", product.image);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Sản phẩm không tồn tại",
          footer: '<a href="../pages/admin">Quay về trang quản lý</a>',
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

const handleFormUpdate = async () => {
  // showToast("Đang cập nhật sản phẩm");
  const productRef = ref(database, `products/${id}`);
  const category = document.querySelector(".listCategory").value;
  const name = document.querySelector(".nameProduct").value;
  const price = document.querySelector(".priceProduct").value;
  const detail = document.querySelector(".moTa").value;
  const productImg = document.querySelector(".imgProduct");
  const data = {
    cate_id: category,
    detail,
    image: "",
    name,
    price,
  };
  if (productImg.files[0]) {
    data.image = await handleLoadImg(productImg.files[0]);
  } else {
    data.image = dataOld[0].image;
  }
  try {
    update(productRef, data);
    Swal.fire("Cập nhật sản phẩm thành công");
  } catch (error) {
    // alert("Có lỗi xảy ra vui lòng kiểm tra lại");
    Swal.fire("Có lỗi xảy ra vui lòng kiểm tra lại");
  }
};

$(function () {
  $(":file").change(function () {
    if (this.files && this.files[0]) {
      var reader = new FileReader();

      reader.onload = imageIsLoaded;
      reader.readAsDataURL(this.files[0]);
    }
  });
});

function imageIsLoaded(e) {
  $("#myImg").attr("src", e.target.result);
  $("#yourImage").attr("src", e.target.result);
}
