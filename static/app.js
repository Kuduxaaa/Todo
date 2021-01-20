'use strict';
var AddButton = document.querySelector('.add_button');
var RemoveButton = document.querySelector('.rm_button');
var ClearButton = document.querySelector('.cl_button');
var TODOList = document.querySelector('.list');
var TemporaryArray = [];
var checkedCount = 0;
var toRemove = []
var fullTodo;
var indexing;

if (localStorage.getItem("fullTodo") !== null){
  fullTodo = localStorage.getItem("fullTodo");
} else {
  fullTodo = 0;
}

for (indexing = 0; indexing < fullTodo+1; indexing++){
  if (localStorage.getItem(indexing) !== null){
    renderTodos(localStorage.getItem(indexing).toString(), indexing);
  }
}

function renderTodos(item, id) {
  TODOList.innerHTML += `<div class="boxes" id="box_${id}">
  <input type="checkbox" id="item-${id}">
  <label for="item-${id}">${item}</label>
  </div>`;
}

function addTodo(todoName){
  if (typeof(Storage) !== "undefined"){
    fullTodo++
    localStorage.setItem("fullTodo", fullTodo);
    localStorage.setItem(fullTodo, todoName);
    renderTodos(todoName, fullTodo);
  }
}

function ready(){
  var todo_items = document.querySelectorAll('input[type=checkbox]');
  todo_items.forEach(function(i){
    i.onclick = function(){
      var id = i.getAttribute("id");
      if (i.checked){
        checkedCount++;
        toRemove.push(id);
        RemoveButton.innerText = `Remove Selected (${checkedCount})`;
      } else {
        if (checkedCount > 0){
          checkedCount--;
        }
        toRemove.pop(id);
        RemoveButton.innerText = `Remove Selected (${checkedCount})`;
      }
    }
  });
}

RemoveButton.addEventListener('click', function () {
  if (toRemove.length > 0) {  
    toRemove.forEach(function(id){
      checkedCount = 0;
      RemoveButton.innerText = `Remove Selected (${checkedCount})`;
      var i_id = id.split("-")[1];
      if (localStorage.getItem(i_id) !== null){
        localStorage.removeItem(i_id);
      }
      
      var box = document.querySelector(`#box_${i_id}`);
      if (box !== null){
        box.remove();
      }
    });
    location.reload();
  } else {
    Swal.fire({
      icon: 'error',
      text: `0 Element are selected. Please yet select one or more element`,
      confirmButtonColor: '#ff0505'
    });
  }
});

ClearButton.addEventListener('click', function () {
  if (typeof (Storage) !== 'undefined') {
    localStorage.clear();
    location.reload();
  }
});

AddButton.addEventListener('click', function () {
  Swal.mixin({
    input: 'text',
    iconColor: '#ff0505',
    confirmButtonColor: '#ff0505',
    confirmButtonText: 'Add',
    showCancelButton: false
  }).queue([{
    title: 'Enter TODO Text',
    text: 'Enter text and press Add to add todo'
  }]).then((result) => {
    if (result.value) {
      Swal.fire({
        icon: 'success',
        title: 'Successfully Added',
        confirmButtonColor: '#ff0505'
      });
      var saveData = result.value.toString();
      if (saveData && saveData !== '') {
        try {
          TemporaryArray.push(result.value.toString());
          addTodo(saveData);
          ready();
        } catch (err) {
          console.log(err);
        }
      } else {
        Swal.fire({
          icon: 'error',
          text: 'Please check that the entered text is not blank or has not already been added',
          confirmButtonColor: '#ff0505'
        });
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', function (event) {
  ready();
});