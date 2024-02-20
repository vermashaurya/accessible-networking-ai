let order = [];

function addToOrder(item) {
order.push(item);
displayOrder();
}

function displayOrder() {
const orderList = document.getElementById("orderList");
orderList.innerHTML = "";
order.forEach(item => {
const li = document.createElement("li");
li.textContent = item;
orderList.appendChild(li);
});
}
