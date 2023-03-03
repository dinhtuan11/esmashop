import { getDatabase, ref, onValue, remove } from "firebase/database";
import { formatPrice } from "../modules/lib";
import Swal from "sweetalert2";
const database = getDatabase();
const listProduct = document.querySelector(".listProduct");
const handleTemplate = (product) => {
  console.log(product);
  if (!product) return;
  const template = `<tr>
    <th scope="row">${product.cate_id}</th>
    <td>${product.name}</td>
    <td><img src="${product.image}" alt="" width="80px">
    </td>
    <td>${product.detail}</td>
    <td>${formatPrice(product.price)}đ</td>
    <td>
    <a href="#" class="delete" data-id=${
      product.id
    }><i class="fa-solid fa-trash btn-delete" ></i></a>
    <a href="../admin/updateProduct.html?${
      product.id
    }" class="update"><i class="fa-solid fa-pen"></i></a>
    </td>
  </tr>`;
  listProduct.insertAdjacentHTML("beforeend", template);
};
// console.log("abc");

const starCountRef = ref(database, "products");

const handleDeleteProduct = (id) => {
  if (!id) return;
  const databaseRef = ref(database, `products/${id}`);
  try {
    remove(databaseRef);
    Swal.fire("Deleted!", "Your file has been deleted.", "success");
  } catch (error) {
    Swal.fire("Deleted!", "Server not response.", "error");
  }
};

onValue(starCountRef, (snapshot) => {
  listProduct.textContent = "";
  snapshot.forEach((item) => {
    let obj = {
      id: item.key,
      ...item.val(),
    };

    handleTemplate(obj);
  });
  const listDeleteBtn = document.querySelectorAll(".delete");
  console.log(listDeleteBtn);
  listDeleteBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      console.log(btn);
      if (!this.dataset.id) return;
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          handleDeleteProduct(this.dataset.id);
        }
      });
    });
  });
});
