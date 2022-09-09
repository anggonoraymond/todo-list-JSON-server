// * ~~~~~~~~~~~~~~~~~~~ Api ~~~~~~~~~~~~~~~~~~~
const Api = (() => {
  const baseUrl = "http://localhost:3000";
  const todopath = "todos";

  const getTodos = () =>
    fetch([baseUrl, todopath].join("/")).then((response) => response.json());

  const deleteTodo = (id) =>
    fetch([baseUrl, todopath, id].join("/"), {
      method: "DELETE",
    });

  const addTodo = (todo) =>
    fetch([baseUrl, todopath].join("/"), {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((response) => response.json());

  const updateTodo = (todo, id) =>
    fetch([baseUrl, todopath, id].join("/"), {
      method: "PUT",
      body: JSON.stringify({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((response) => response.json());

  return {
    getTodos,
    deleteTodo,
    addTodo,
    updateTodo,
  };
})();

// * ~~~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~~~~
const View = (() => {
  const domstr = {
    container: ".todolist_container",
    completedtask: "#completed_task",
    uncompletetask: "#uncompleted_task",
    inputbox: ".todolist__input",
    submitButton: ".submit",
  };

  const render = (ele0, ele1, tmp) => {
    ele0.innerHTML = tmp[0];
    ele1.innerHTML = tmp[1];
  };
  const createTmp = (arr) => {
    let tmp = ["", ""];
    arr.forEach((todo) => {
      if (todo.completed) {
        tmp[1] += `
            <li>
                <div class="button_collection">
                <button class="btn check-btn"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowBackIcon" aria-label="fontSize small" class="check" id="${todo.id}"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg></button>
                </div>
                <span>${todo.title}</span>
                <div class="button_collection">
                    <button class="btn edit-btn"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small" id="${todo.id}"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></button>
                    <button class="btn delete-btn"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" class="delete" data-testid="DeleteIcon" aria-label="fontSize" small id="${todo.id}"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></button>
                </div>                                  
            </li>
        `;
      } else {
        tmp[0] += `
            <li>
                <div class="button_collection"></div>
                <span>${todo.title}</span>
                <div class="button_collection">
                    <button class="btn edit-btn"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small" class="edit" id="${todo.id}"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></button>
                    <button class="btn delete-btn" ><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small" class="delete" id="${todo.id}"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></button>
                    <button class="btn check-btn"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardIcon" aria-label="fontSize small" class="check" id="${todo.id}"><path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg></button>
                </div>  
            </li>
        `;
      }
    });
    return tmp;
  };

  return {
    render,
    createTmp,
    domstr,
  };
})();

// * ~~~~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~~~~
const Model = ((api, view) => {
  const { getTodos, deleteTodo, addTodo, updateTodo } = api;

  class Todo {
    constructor(title) {
      this.completed = false;
      this.title = title;
    }
  }

  class State {
    #todolist = [];

    get todolist() {
      return this.#todolist;
    }
    set todolist(newtodolist) {
      this.#todolist = newtodolist;

      const completedtask = document.querySelector(view.domstr.completedtask);
      const uncompletetask = document.querySelector(view.domstr.uncompletetask);
      const tmp = view.createTmp(this.#todolist);
      view.render(uncompletetask, completedtask, tmp);
    }
  }

  return {
    getTodos,
    deleteTodo,
    addTodo,
    updateTodo,
    State,
    Todo,
  };
})(Api, View);

// * ~~~~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~~~~
const Controller = ((model, view) => {
  const state = new model.State();

  const deleteTodo = () => {
    const container = document.querySelectorAll(view.domstr.container);
    container.forEach((ele) =>
      ele.addEventListener("click", (event) => {
        if (event.target.className.baseVal === "delete") {
          state.todolist = state.todolist.filter(
            (todo) => +todo.id !== +event.target.id
          );
          model.deleteTodo(event.target.id);
        }
      })
    );
  };

  const addTodo = () => {
    const inputbox = document.querySelector(view.domstr.inputbox);
    const submitButton = document.querySelector(view.domstr.submitButton);
    submitButton.addEventListener("click", (event) => {
      if (inputbox.value.trim() !== "") {
        const todo = new model.Todo(inputbox.value, 1);
        model.addTodo(todo).then((todofromBE) => {
          console.log(todofromBE);
          state.todolist = [todofromBE, ...state.todolist];
        });
        event.target.value = "";
      }
    });
  };

  const completeTodo = () => {
    const container = document.querySelectorAll(view.domstr.container);
    container.forEach((ele) =>
      ele.addEventListener("click", (event) => {
        if (event.target.className.baseVal === "check") {
          state.todolist.forEach((todo) => {
            if (+todo.id === +event.target.id) {
              todo.completed = !todo.completed;
              model.updateTodo(todo, todo.id);
            }
          });
        }
      })
    );
  };

  const editTodo = () => {
    const container = document.querySelectorAll(view.domstr.container);
    container.forEach((ele) =>
      ele.addEventListener("click", (event) => {
        if (event.target.className.baseVal === "edit") {
          // Change title
        }
      })
    );
  };
  const init = () => {
    model.getTodos().then((todos) => {
      state.todolist = todos.reverse();
    });
  };

  const bootstrap = () => {
    init();
    deleteTodo();
    addTodo();
    completeTodo();
    editTodo();
  };

  return { bootstrap };
})(Model, View);

Controller.bootstrap();
