(function() {

    let todoArray = [];

    function createAppTitle(title) {
        let appTitle =document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;

        input.addEventListener('input', function(e) {
            e.preventDefault();
            if (input.value.length > 0) {
                button.disabled = false;
            }else if (input.value.length == 0) {
                button.disabled = true;
            }
        })

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        }
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

   
    function createTodoItem(name) {
        let item = document.createElement('li');
    
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        
        
        let maxId = todoArray.reduce((max, item) => item.id > max ? item.id : max, 0);
        item.id = ++maxId ;

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';
        
    
        buttonGroup.append(doneButton, deleteButton);
        item.append(buttonGroup);
    
        return {
            item,
            doneButton,
            deleteButton,
            buttonGroup,
        };
    };

    function deleteTodoItem (item, btn) {
        btn.addEventListener('click' , function() {
            if(confirm('Вы Уверены?')) {
                todoArray = JSON.parse(localStorage.getItem(key));
                let newList = todoArray.filter(obj => obj.id !== item.id)
                localStorage.setItem(key, JSON.stringify(newList));
                item.remove();
            }
        });
    }

    function completeTodoItem (item, btn) {
        btn.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success');
            todoArray = JSON.parse(localStorage.getItem(key));
            todoArray.map (obj => {
                if (obj.id == item.id & obj.done == false) {
                    obj.done = true;
                } else if (obj.id == item.id & obj.done == true) {
                    obj.done = false;
                }
            })

            localStorage.setItem(key, JSON.stringify(todoArray));
        });
    }

    function createTodoApp (container, title, key) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        
        container.append(todoAppTitle,todoItemForm.form, todoList);

        if (localStorage.getItem(key)) {
            todoArray = JSON.parse(localStorage.getItem(key));

            for ( let obj of todoArray) {
                let todoItem = createTodoItem(todoItemForm.input.value);

                todoItem.item.textContent = obj.name;
                todoItem.item.id = obj.id;

                if (obj.done == true) {
                    todoItem.item.classList.add('list-group-item-success');
                } else {
                    todoItem.item.classList.remove('list-group-item-success');
                }

                completeTodoItem(todoItem.item, todoItem.doneButton);
                deleteTodoItem(todoItem.item, todoItem.deleteButton);

                todoList.append(todoItem.item);
                todoItem.item.append(todoItem.buttonGroup);
            }
        }

        todoItemForm.form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const response = await fetch('http://localhost:3000/api/todos', {
                method: 'POST',
                body: JSON.stringify ({
                    name: todoItemForm.input.value.trim() , 
                    owner: 'Тимофей',
                }),
                headers: {
                    'Content-type' : 'aplication/json',
                }
            })

            const todoItem = await response.json();

            let todoItemElement = createTodoItem(todoItem.name);

            completeTodoItem(todoItemElement.item, todoItemElement.doneButton);
            deleteTodoItem(todoItemElement.item, todoItemElement.deleteButton);

            let localStorageData = localStorage.getItem(key);

            if (localStorageData == null) {
                todoArray = [];
            } else {
                todoArray = JSON.parse(localStorageData);
            }

            function createItemObj(arr) {
                let itemObj = {}
                itemObj.id = todoItemElement.item.id;
                itemObj.name = todoItemForm.input.value;
                itemObj.done = false;

                arr.push(itemObj);
            }
            createItemObj(todoArray);
            localStorage.setItem(key, JSON.stringify(todoArray));

            
            todoList.append(todoItemElement.item);

            todoItemForm.input.value = '';
        });
    }

    window.createTodoApp = createTodoApp;
})();

