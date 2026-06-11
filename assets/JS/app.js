const cl = console.log;

const userForm = document.getElementById("userForm");
const name = document.getElementById("name");
const username = document.getElementById("username");

const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const company = document.getElementById("company");
const stdContainer = document.getElementById("stdContainer");
const updateBtn = document.getElementById("updateBtn");
const editBtn = document.getElementById("editBtn");

let baseURL = "https://jsonplaceholder.typicode.com";

let userArr = [];

function fetchUser(ele) {
  let xhr = new XMLHttpRequest();

  let postURL = `${baseURL}/users`;

  xhr.open("GET", postURL);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      userArr = JSON.parse(xhr.response);
      cl(userArr);

      creatCard(userArr.reverse());
    }
  };
}

fetchUser();

function creatCard(ele) {
  let result = "";
  ele.forEach((element, i) => {
    result += `
    
     <tr id=${element.id}>
              <td>${userArr.length - i}</td>
              <td>${element.name}</td>
              <td>${element.username}</td>
              <td>${element.email}</td>
              <td>${element.address.city}</td>
              <td>${element.phone}</td>
              <td><i class="fa-solid fa-2x  text-primary fa-pen-to-square" onclick = "onedit(this)"></i></td>
              <td><i class="fa-solid fa-2x text-danger fa-trash" onclick = "ondelete(this)"></i></td>

            </tr>
    `;
  });

  stdContainer.innerHTML = result;
}

function onSubmit(ele) {
  ele.preventDefault();

  let newObj = {
    name: name.value,
    username: username.value,
    email: email.value,
    address: address.value,
    phone: phone.value,
  };

  userArr.unshift(newObj);
  let xhr = new XMLHttpRequest();
  let postURL = `${baseURL}/users`;
  xhr.open("POST", postURL);
  xhr.send(JSON.stringify(newObj));
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      this.response = JSON.parse(xhr.response);
      let tr = document.createElement("tr");
      tr.id = this.response.id;

      tr.innerHTML = `
         <td>${userArr.length}</td>
              <td>${newObj.name}</td>
              <td>${newObj.username}</td>
              <td>${newObj.email}</td>
              <td>${newObj.address.city}</td>
              <td>${newObj.phone}</td>
              <td><i class="fa-solid fa-2x  text-primary fa-pen-to-square" onclick = "onedit(this)"></i></td>
              <td><i class="fa-solid fa-2x text-danger fa-trash " onclick = "ondelete(this)"></i></td>
        `;

      stdContainer.prepend(tr);
      userForm.reset();
    }
  };
}

function onedit(ele) {
  let editId = ele.closest("tr").id;
  localStorage.setItem("editId", editId);

  let editURL = `${baseURL}/users/${editId}`;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", editURL);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let editObj = JSON.parse(xhr.response);

      name.value = editObj.name;
      username.value = editObj.username;
      email.value = editObj.email;
      address.value = editObj.address;
      phone.value = editObj.phone;

      editBtn.classList.add("d-none");
      updateBtn.classList.remove("d-none");
    }
  };
}

function updateUser(ele) {
  let updId = localStorage.getItem("editId");

  let updObj = {
    name: name.value,
    username: username.value,
    email: email.value,
    address: address.value,
    phone: phone.value,
  };

  let updURL = `${baseURL}/users/${updId}`;
  let xhr = new XMLHttpRequest();
  xhr.open("PATCH", updURL);
  xhr.send(JSON.stringify(updObj));
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let tr = document.getElementById(updId);

      tr.innerHTML = `
      
       <td>${userArr.length}</td>
              <td>${updObj.name}</td>
              <td>${updObj.username}</td>
              <td>${updObj.email}</td>
              <td>${updObj.address}</td>
              <td>${updObj.phone}</td>
              <td><i class="fa-solid fa-2x  text-primary fa-pen-to-square" onclick = "onedit(this)"></i></td>
              <td><i class="fa-solid fa-2x text-danger fa-trash "onclick = "ondelete(this) "></i></td>
      
      `;
      editBtn.classList.remove("d-none");
      updateBtn.classList.add("d-none");
    }
  };
}

function ondelete(ele) {
  let deletId = ele.closest("tr").id;
  let deletURL = `${baseURL}/users/${deletId}`;

  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", deletURL);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      ele.closest("tr").remove();
    }
  };
}

userForm.addEventListener("submit", onSubmit);
updateBtn.addEventListener("click", updateUser);
