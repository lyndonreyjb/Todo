const addItem = document.querySelectorAll(".add-btn:not(.solid)");
const saveItem = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const itemLists = document.querySelectorAll(".items-list");
const todoList = document.getElementById("todo-list");
const doingList = document.getElementById("doing-list");
const reviewList = document.getElementById("review-list");
const testingList = document.getElementById("testing-list");
const doneList = document.getElementById("done-list");

let updateOnLoad = false;

// Initialize Arrays
let todoArray = [];
let doingArray = [];
let reviewArray = [];
let testingArray = [];
let doneArray = [];

let allArrays = [];

let draggedItem;
let dragging = false;
let currentCol;

function getSavedColumns() {
  if (localStorage.getItem("todoItems")) {
    todoArray = JSON.parse(localStorage.todoItems);
    doingArray = JSON.parse(localStorage.doingItems);
    reviewArray = JSON.parse(localStorage.reviewItems);
    testingArray = JSON.parse(localStorage.testingItems);
    doneArray = JSON.parse(localStorage.doneItems);
  }
}

getSavedColumns();
updateSavedColumns();

function updateSavedColumns() {
  allArrays = [todoArray, doingArray, reviewArray, testingArray, doneArray];
  const arrayNames = ["todo", "doing", "review", "testing", "done"];
  for (let i = 0; i < arrayNames.length; i++) {
    localStorage.setItem(`${arrayNames[i]}Items`, JSON.stringify(allArrays[i]));
  }
}

function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement("li");
  listEl.classList.add("item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  if (!updateOnLoad) {
    getSavedColumns();
  }
  todoList.textContent = "";
  todoArray.forEach((todoItems, index) => {
    createItemEl(todoList, 0, todoItems, index);
  });
  todoArray = filterArray(todoArray);
  //
  doingList.textContent = "";
  doingArray.forEach((doingItems, index) => {
    createItemEl(doingList, 1, doingItems, index);
  });
  doingArray = filterArray(doingArray);
  //
  reviewList.textContent = "";
  reviewArray.forEach((reviewItems, index) => {
    createItemEl(reviewList, 2, reviewItems, index);
  });
  reviewArray = filterArray(reviewArray);
  //
  testingList.textContent = "";
  testingArray.forEach((testingItems, index) => {
    createItemEl(testingList, 3, testingItems, index);
  });
  testingArray = filterArray(testingArray);
  //
  doneList.textContent = "";
  doneArray.forEach((doneItems, index) => {
    createItemEl(doneList, 4, doneItems, index);
  });
  doneArray = filterArray(doneArray);
  updateOnLoad = true;
  updateSavedColumns();
}
//Update Item
function updateItem(id, column) {
  const selectedArray = allArrays[column];
  const selectedColumnEl = itemLists[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}
//Add Item
function addToColumn(column) {
  const itemContent = addItems[column].textContent;
  const selectedArray = allArrays[column];
  selectedArray.push(itemContent);
  addItems[column].textContent = "";
  updateDOM();
}

function showInput(column) {
  addItem[column].style.visibility = "hidden";
  saveItem[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

function hideInput(column) {
  addItem[column].style.visibility = "visible";
  saveItem[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

function rebuildArrays() {
  function getListTextContentArray(listElement) {
    const textContentArray = [];
    for (let i = 0; i < listElement.children.length; i++) {
      textContentArray.push(listElement.children[i].textContent);
    }
    return textContentArray;
  }

  todoArray = getListTextContentArray(todoList);
  doingArray = getListTextContentArray(doingList);
  reviewArray = getListTextContentArray(reviewList);
  testingArray = getListTextContentArray(testingList);
  doneArray = getListTextContentArray(doneList);
  updateDOM();
}

//Item Drag
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

//Item Drop
function dropItem(e) {
  e.preventDefault();
}
function dragEnter(column) {
  itemLists[column].classList.add("over");
  currentCol = column;
}
function drop(e) {
  e.preventDefault();
  itemLists.forEach((column) => {
    column.classList.remove("over");
  });
  const parent = itemLists[currentCol];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

updateDOM();
