import { onValue, ref, getDatabase, push, set } from "firebase/database";
import { handleLoadImg } from "../modules/lib.js";
import $ from "jquery";
import Swal from "sweetalert2";
const database = getDatabase();
const wrapCategory = document.querySelector(".listCategory");
const addForm = document.querySelector(".form-add");
const nameProduct = document.querySelector(".nameProduct");
const priceProduct = document.querySelector(".priceProduct");
const fileProduct = document.querySelector(".fileProduct");
const details = document.querySelector(".moTa");

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
          console.log("k");
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault();
          console.log("ok");
          handleFormSubmit(event);
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

const getAllDataRealTime = () => {
  const dbRef = ref(database, "category");
  onValue(dbRef, (snapshot) => {
    let listCategory = [];
    snapshot.forEach((childSnap) => {
      const key = childSnap.key;
      let obj = childSnap.val();
      listCategory.push({
        key,
        ...obj,
      });
    });
    wrapCategory.textContent = "";
    listCategory.forEach((item) => {
      console.log(item);
      const template = `<option value="${item.key}">${item.name}</option> `;
      wrapCategory.insertAdjacentHTML("beforeend", template);
    });
  });
};
getAllDataRealTime();

let editor = CKEDITOR.replace("mieuTa");
editor.on("change", function (evt) {
  console.log(evt.editor.getData());
});

const handleFormSubmit = async (e) => {
  // console.log("abc");
  const name = nameProduct.value;
  const price = priceProduct.value;
  const detail = details.value;
  const cate = wrapCategory.value;
  // console.log(cate);
  if (!detail) {
    Swal.fire("Vui lòng nhập chi tiết sản phẩm");
    return;
  }

  const urlImg = await handleLoadImg(fileProduct.files[0]);
  const productListRef = ref(database, "products");
  const newProduct = push(productListRef);
  try {
    await set(newProduct, {
      cate_id: cate,
      detail,
      image: urlImg,
      name,
      price,
    });
    Swal.fire("Thêm Thành công");
  } catch (error) {
    Swal.fire("Lỗi");
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
