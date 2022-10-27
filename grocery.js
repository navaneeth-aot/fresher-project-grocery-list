const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");


const submitbtn = document.querySelector(".submit-btn");
const clearbtn = document.querySelector(".clear-btn");

let editElement;
let editFlag = false;
let editId = "";


form.addEventListener("submit",readData);

clearbtn.addEventListener('click',clearItems);

window.addEventListener('DOMContentLoaded',setupItem);

function readData(e) {
    e.preventDefault();

    const value = grocery.value;
    const id = new Date().getTime().toString();

    if(value && !editFlag) {
        createListItem(id,value);

        displayAlert("item added to the list","success");

        container.classList.add("show-container");

        addLocalStorage(id,value);
        setBackToDefault()
    }
    else if(value && editFlag) {
        editElement.innerHTML = value;
        displayAlert('value changed','success');
        editLocalStorage(editId,value);
        setBackToDefault();
    }
    else {
        displayAlert("enter the task","danger");
    }
      
}

function displayAlert(text,action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    setTimeout(function() {
        alert.textContent = "";
    alert.classList.remove(`alert-${action}`)
    }, 1000);
}

function clearItems() {
    const items = document.querySelectorAll('.grocery-item');

    if(items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item);
        })
    }
    container.classList.remove("show-container");
    displayAlert("empty list","danger");
    setBackToDefault();
    localStorage.removeItem('list');
}

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
    submitbtn.textContent = "edit";
}

function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length == 0) {
        container.classList.remove("show-container");
    }
    displayAlert("item removed","danger");
    setBackToDefault();
    removeFromLocalStorage(id);
}

function setBackToDefault() {
    grocery.value=""
    editFlag =false;
    editId = "";
    submitbtn.textContent = "submit";
}

function addLocalStorage(id,value) {
    const grocery = {id,value};
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list",JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    
    items = items.filter(function(item) {
        if(item.id !== id) {
            return item;
        }
    })
    localStorage.setItem("list",JSON.stringify(items));
}

function editLocalStorage(id,value) {
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id) {
            item.value = value;
        }
        return item;
    })
    localStorage.setItem("list",JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem("list")? JSON.parse(localStorage.getItem("list")): [];
}

function setupItem() {
    let items = getLocalStorage();
    if(items.length > 0) {
        items.forEach(function(item){
            createListItem(item.id,item.value);
        });
        container.classList.add("show-container");
    }
}

function createListItem(id,value) {
        const element = document.createElement('article');
        element.classList.add('grocery-item');
        const attr =document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = 
        `<p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn px-2 me-3 border-0 bg-white"><i class="bi bi-pencil-square"></i></button>
            <button type="button" class="delete-btn px-2 border-0 bg-white"><i class="bi bi-trash-fill text-danger"></i></button>
        </div>`;

        const editbtn = element.querySelector(".edit-btn");
        const deletebtn = element.querySelector(".delete-btn");

        deletebtn.addEventListener('click',deleteItem)

        editbtn.addEventListener('click',editItem)

        list.appendChild(element);
}