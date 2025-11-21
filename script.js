const manageSpinner =(status)=>{
 if(status==true){
   document.getElementById('spinner').classList.remove('hidden')
  document.getElementById('dataContainer').classList.add('hidden')
 }
 else{
  document.getElementById('dataContainer').classList.remove('hidden')
   document.getElementById('spinner').classList.add('hidden')
  
 }

}
const loadAllPlants = () => {
  manageSpinner(true)
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => displayPlants(data.plants));
};

const displayPlants = (plants) => {
  const treeContainer = document.getElementById("tree-container");
  treeContainer.innerHTML = "";
  // console.log(plants);

  if (plants === 0) {
    treeContainer.innerHTML = `<p class="col-span-3 text-center text-gray-500">No trees found.</p>`;

    return;
  }

  plants.forEach((plant) => {
    const card = document.createElement("div");
    card.className =
      "card bg-base-100 shadow-sm border border-gray-200 rounded-lg p-2";
    card.innerHTML = `
        <figure class="bg-gray-100 "><img src="${plant.image || ""}" alt="${
      plant.name
    }" class="h-40 object-cover w-full" /></figure>
        <div class="card-body ">
          <h2 onclick=loadSingleDetailForModal(${plant.id}) class="card-title cursor-pointer text-green-700" data-tree-id="${plant.id  }">
            ${plant.name}
          </h2>
          <p class="text-sm text-gray-600">${plant.description.slice(
            0,
            80
          )}...</p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline">${plant.category}</span>
            <span class="font-semibold text-green-600">৳${plant.price}</span>
          </div>
          <button onclick="addToCart('${plant.id}', '${plant.name}', ${plant.price})" class="btn btn-sm bg-green-600 rounded-md p-2 cursor-pointer text-white mt-2 add-to-cart hover:bg-green-700"
            data-id="${plant.id}" data-name="${plant.name}" data-price="${
      plant.price
    }">
            Add to Cart
          </button>
        </div>
      `;
    treeContainer.appendChild(card);
   
  });
   manageSpinner(false)
};

const loadCategories = () => {
  manageSpinner(true)
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
};

const displayCategories = (allCategories) => {
  const categoryList = document.getElementById("categories");
  categoryList.innerHTML = "";
  allCategories.forEach((singleCategory) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <button id="category-${singleCategory.id}" onclick=loadBySingleCategory(${singleCategory.id}) class="btn btn-sm w-full text-left cursor-pointer hover:bg-[#15803D] hover:text-white rounded-md px-4 py-2 activeCategory" > ${singleCategory.category_name}
        </button>
      `;
    categoryList.appendChild(li);
   
  });
   manageSpinner(false)
};

const removeActiveClass = () => {
  const removeActive = document.querySelectorAll(".activeCategory");
  removeActive.forEach((btn) => btn.classList.remove("active"));
  console.log(removeActive);
};

const loadBySingleCategory = (id) => {
  manageSpinner(true)
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      const categorybtn = document.getElementById(`category-${id}`);
      categorybtn.classList.add("active");
      console.log(categorybtn);
      displayBySingleCategory(data.plants);
    });
};

const displayBySingleCategory = (plants) => {
  const treeContainer = document.getElementById("tree-container");
  treeContainer.innerHTML = "";

  if (plants === 0) {
    treeContainer.innerHTML = `<p class="col-span-3 text-center text-gray-500">No trees found.</p>`;

    return;
  }

  plants.forEach((plant) => {
    const card = document.createElement("div");
    card.className =
      "card bg-base-100 shadow-sm border max-h-96  border-gray-200 rounded-lg p-2";
    card.innerHTML = `
        <figure class="bg-gray-100 "><img src="${plant.image || ""}" alt="${
      plant.name
    }" class="h-40 object-cover w-full" /></figure>
        <div class="card-body ">
          <h2 onclick=loadSingleDetailForModal(${plant.id}) class="card-title cursor-pointer text-green-700" data-tree-id="${
      plant.id
    }">
            ${plant.name}
          </h2>
          <p class="text-sm text-gray-600">${plant.description.slice(
            0,
            80
          )}...</p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline">${plant.category}</span>
            <span class="font-semibold text-green-600">৳${plant.price}</span>
          </div>
          <button onclick="addToCart('${plant.id}', '${plant.name}', ${plant.price})" class="btn w-full bg-green-600 rounded-md p-2 cursor-pointer mt-2 add-to-cart hover:bg-green-700 hover:text-white"
            data-id="${plant.id}" data-name="${plant.name}" data-price="${
      plant.price
    }">
            Add to Cart
          </button>
        </div>
      `;
    treeContainer.appendChild(card);
  
  });
    manageSpinner(false)
};

const loadSingleDetailForModal = (id) => {
  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then((res) => res.json())
    .then((data) => displayModal(data.plants));
};

// const displayModal = (plants) => {
 
//   const modalBox = document.getElementById("modalBody")
//  modalBox.innerHTML = `

//  <p>name: ${plants.name} </p>
//  <img src= alt="">
//   <p>Description: ${plants.description} </p>
//    <p>category: ${plants.category} </p>
 
//  `
//  document.getElementById('my_modal_5').showModal()
// };
const displayModal = (plants) => {
  const modalBox = document.getElementById("modalBody");
  modalBox.innerHTML = `
    <div class="space-y-4 p-2">
      <h4 class="text-xl font-bold text-gray-800">Name: ${plants.name}</h4>

      <img 
        src="${plants.image}" 
        alt="${plants.name}"
        class="md:w-[300px] md:h-[200px] rounded-lg object-cover border border-gray-300"
      />

      <p class="text-gray-700 md:w-[300px]">
        <span class="font-semibold">Description:</span> ${plants.description}
      </p>

      <p class="text-gray-700">
        <span class="font-semibold">Category:</span> ${plants.category}
      </p>
    </div>
  `;

  document.getElementById('my_modal_5').showModal();
};


// ========================option1=========================================================
// Cart array to store items
// let cart = [];

// Add to cart functionality
// document.addEventListener('click', (e) => {
//   if (e.target.classList.contains('add-to-cart')) {
//     const id = e.target.getAttribute('data-id');
//     const name = e.target.getAttribute('data-name');
//     const price = parseFloat(e.target.getAttribute('data-price'));

//     // Check if item already exists in cart
//     const existingItem = cart.find(item => item.id === id);
    
//     if (!existingItem) {
//       cart.push({ id, name, price });
//       updateCart();
//     }
//   }
// });

// Remove from cart
// function removeFromCart(id) {
//   cart = cart.filter(item => item.id !== id);
//   updateCart();
// }

// Update cart display
// function updateCart() {
//   const cartItems = document.getElementById('cart-items');
//   const cartTotal = document.getElementById('cart-total');

//   if (cart.length === 0) {
//     cartItems.innerHTML = '<p class="text-gray-400 text-center">Cart is empty</p>';
//     cartTotal.textContent = '৳0';
//     return;
//   }

//   cartItems.innerHTML = cart.map(item => `
//     <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
//       <div class="flex-1">
//         <p class="font-medium text-sm">${item.name}</p>
//         <p class="text-green-600 text-xs">৳${item.price}</p>
//       </div>
//       <button onclick="removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700">
//         <i class="fas fa-times"></i>
//       </button>
//     </div>
//   `).join('');

//   const total = cart.reduce((sum, item) => sum + item.price, 0);
//   cartTotal.textContent = `৳${total}`;
// }


// ====================option 2=============================================================
// Cart array
let cart = [];

// Add to cart function
function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  if(existingItem){
    alert(`${name}  already  added,kindy add another`);
  }
  if (!existingItem) {
     alert(`${name} added to cart! `);
    cart.push({ id, name, price });
    updateCart();
  }
}

// Remove from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// Update cart display
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-gray-400 text-center">Cart is empty</p>';
    cartTotal.textContent = '৳0';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
      <div class="flex-1">
        <p class="font-medium text-sm">${item.name}</p>
        <p class="text-green-600 text-xs">৳${item.price}</p>
      </div>
      <button onclick="removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700 w-full">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = `৳${total}`;
}


loadCategories();
loadAllPlants();
