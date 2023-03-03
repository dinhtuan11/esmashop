import {
  onValue,
  ref,
  getDatabase,
  set,
  push,
  remove,
} from "firebase/database";
import $ from "jquery";
import Swal from "sweetalert2";
const addCategory = document.querySelector(".addCategory");
const nameCategory = document.querySelector(".nameCategory");
const listCategory = document.querySelector(".listCategory");

const database = getDatabase();
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
  listCategory.textContent = "";
  if (categories.length === 0) return;
  categories.forEach((category) => {
    const template = `<tr>
    <th scope="row">${category.id}</th>
    <td>${category.name}</td>
    <td>
    <a href="#" class="delete"><i class="fa-solid fa-trash btn-delete" data-id=${category.id}></i></a>
    <a href="#" class="update"><i class="fa-solid fa-pen"></i></a>
    </td>
  </tr>`;

    listCategory.insertAdjacentHTML("beforeend", template);
  });
});

$(document).on("click", ".btn-delete", function () {
  const id = $(this).data("id");
  if (!id) return;
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
      const databaseRef = ref(database, `category/${id}`);
      try {
        remove(databaseRef);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } catch (error) {
        Swal.fire("Deleted!", "Server not response.", "error");
      }
    }
  });
});
addCategory.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameCategory.value;
  if (!name) {
    Swal.fire("Vui lòng nhập danh mục");
    return;
  }
  const newCategory = push(starCountRef);
  try {
    set(newCategory, {
      name,
    });
    // alert("Thêm thành công");
    Swal.fire("Thêm Thành công");
  } catch (error) {
    Swal.fire("Lỗi", "error");
  }
});
