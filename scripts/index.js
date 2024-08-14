const state = {
    taskList: [],
  };
  
  // DOM - document object
  const taskContents = document.querySelector(".task__contents");
  const taskModal = document.querySelector(".task__modal__body");
  
  const htmlTaskContent = ({ id, title, description, type, url }) => `
    <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
      <div class='card shadow-sm task__card'>
        <div class='card-header d-flex gap-2 justify-content-end task__card__header'>
          <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick="editTask.apply(this, arguments)">
            <i class='fas fa-pencil-alt' name=${id}></i>
          </button>
          <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick="deleteTask.apply(this, arguments)">
            <i class='fas fa-trash-alt' name=${id}></i>
          </button>
        </div>
        <div class='card-body'>
          ${
            url
              ? `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
              : `
        <img width='100%' height='150px' style="object-fit: cover; object-position: center" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfFyczP09bM0dO8wMPk6ezY3eDd4uXR1tnJzdBvAX/cAAACVElEQVR4nO3b23KDIBRA0ShGU0n0//+2KmO94gWZ8Zxmr7fmwWEHJsJUHw8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwO1MHHdn+L3rIoK6eshsNJ8kTaJI07fERPOO1Nc1vgQm2oiBTWJ+d8+CqV1heplLzMRNonED+4mg7L6p591FC+133/xCRNCtd3nL9BlxWP++MOaXFdEXFjZ7r8D9l45C8y6aG0cWtP/SUGhs2d8dA/ZfGgrzYX+TVqcTNRRO9l+fS5eSYzQs85psUcuzk6igcLoHPz2J8gvzWaH/JLS+95RfOD8o1p5CU5R7l5LkfKEp0mQ1UX7hsVXqDpRrifILD/3S9CfmlUQFhQfuFu0STTyJ8gsP3PH7GVxN1FC4t2sbBy4TNRTu7LyHJbqaqKFw+/Q0ncFloo7CjRPwMnCWqKXQZ75El4nKC9dmcJaou9AXOE5UXbi+RGeJygrz8Uf+GewSn9uXuplnWDZJ7d8f24F/s6iq0LYf9olbS3Q8i5oKrRu4S9ybwaQ/aCkqtP3I28QDgeoK7TBya/aXqL5COx67PTCD2grtdOwH+pQV2r0a7YVBgZoKwwIVFQYG6ikMDVRTGByopjD8ATcKb0UhhRTe77sKs2DV7FKSjId18TUEBYVyLhUThWfILHTDqmI85/2RWWjcE/bhP6OD7maT3h20MHsA47JC3PsW0wcwLhv9t0OOPOIkCn21y2bXXwlyylxiYMPk1SuCSmpfK8bNQvIrpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwNX4BCbAju9/X67UAAAAASUVORK5CYII=" alt='card image cap' class='img-fluid place__holder__image mb-3' />
        `
          }
          <h4 class='task__card__title'>${title}</h4>
          <p class='description trim-3-lines text-muted' data-gram_editor='false'>
            ${description}
          </p>
          <div class='tags text-white d-flex flex-wrap'>
            <span class='badge bg-primary m-1'>${type}</span>
          </div>
        </div>
        <div class='card-footer'>
          <button 
          type='button' 
          class='btn btn-outline-primary float-right' 
          data-bs-toggle='modal'
          data-bs-target='#showTask'
          id=${id}
          onclick='openTask.apply(this, arguments)'
          >
            Open Task
          </button>
        </div>
      </div>
    </div>
  `;
  
  const htmlModalContent = ({ id, title, description, url }) => {
    const date = new Date(parseInt(id));
    return `
      <div id=${id}>
      ${
        url
          ? `
          <img width='100%' src=${url} alt='card image cap' class='img-fluid place__holder__image mb-3' />
        `
          : `
        <img width='100%' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfFyczP09bM0dO8wMPk6ezY3eDd4uXR1tnJzdBvAX/cAAACVElEQVR4nO3b23KDIBRA0ShGU0n0//+2KmO94gWZ8Zxmr7fmwWEHJsJUHw8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwO1MHHdn+L3rIoK6eshsNJ8kTaJI07fERPOO1Nc1vgQm2oiBTWJ+d8+CqV1heplLzMRNonED+4mg7L6p591FC+133/xCRNCtd3nL9BlxWP++MOaXFdEXFjZ7r8D9l45C8y6aG0cWtP/SUGhs2d8dA/ZfGgrzYX+TVqcTNRRO9l+fS5eSYzQs85psUcuzk6igcLoHPz2J8gvzWaH/JLS+95RfOD8o1p5CU5R7l5LkfKEp0mQ1UX7hsVXqDpRrifILD/3S9CfmlUQFhQfuFu0STTyJ8gsP3PH7GVxN1FC4t2sbBy4TNRTu7LyHJbqaqKFw+/Q0ncFloo7CjRPwMnCWqKXQZ75El4nKC9dmcJaou9AXOE5UXbi+RGeJygrz8Uf+GewSn9uXuplnWDZJ7d8f24F/s6iq0LYf9olbS3Q8i5oKrRu4S9ybwaQ/aCkqtP3I28QDgeoK7TBya/aXqL5COx67PTCD2grtdOwH+pQV2r0a7YVBgZoKwwIVFQYG6ikMDVRTGByopjD8ATcKb0UhhRTe77sKs2DV7FKSjId18TUEBYVyLhUThWfILHTDqmI85/2RWWjcE/bhP6OD7maT3h20MHsA47JC3PsW0wcwLhv9t0OOPOIkCn21y2bXXwlyylxiYMPk1SuCSmpfK8bNQvIrpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwNX4BCbAju9/X67UAAAAASUVORK5CYII=" alt='card image cap' class='img-fluid place__holder__image mb-3' />
        `
      }
      <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
      <h2 class='my-3'>${title}</h2>
      <p class='lead'>
        ${description}
      </p>
      </div>
    `;
  };
  
  const updateLocalStorage = () => {
    localStorage.setItem(
      "tasks",
      JSON.stringify({
        tasks: state.taskList,
      })
    );
  };
  
  const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.tasks);
  
    if (localStorageCopy) state.taskList = localStorageCopy.tasks;
  
    state.taskList.map((cardDate) => {
      taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
    });
  };
  
  const handleSubmit = (event) => {
    const id = `${Date.now()}`;
    const input = {
      url: document.getElementById("imageUrl").value,
      title: document.getElementById("taskTitle").value,
      description: document.getElementById("taskDescription").value,
      type: document.getElementById("tags").value,
    };
  
    if (input.title === "" || input.description === "" || input.type === "") {
      return alert("Please fill all the fields");
    }
  
    taskContents.insertAdjacentHTML(
      "beforeend",
      htmlTaskContent({
        ...input,
        id,
      })
    );
  
    state.taskList.push({ ...input, id });
    updateLocalStorage();
  };
  
  const openTask = (e) => {
    if (!e) e = window.event;
  
    const getTask = state.taskList.find(({ id }) => id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);
  };
  
  const deleteTask = (e) => {
    if (!e) e = window.event;
    const targetID = e.target.getAttribute("name");
    const type = e.target.tagName;
    const removeTask = state.taskList.filter(({ id }) => id !== targetID);
    state.taskList = removeTask;
  
    updateLocalStorage();
    if (type === "BUTTON") {
      return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode
      );
    }
  
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode.parentNode
    );
  };
  
  const editTask = (e) => {
    if (!e) e = window.event;
  
    const targetID = e.target.id;
    const type = e.target.tagName;
  
    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;
  
    if (type === "BUTTON") {
      parentNode = e.target.parentNode.parentNode;
    } else {
      parentNode = e.target.parentNode.parentNode.parentNode;
    }
  
    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes[1];
  
    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
  
    submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes";
  };
  
  const saveEdit = (e) => {
    if (!e) e = window.event;
  
    const targetID = e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    // console.log(parentNode.childNodes);
  
    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];
  
    const updateData = {
      taskTitle: taskTitle.innerHTML,
      taskDescription: taskDescription.innerHTML,
      taskType: taskType.innerHTML,
    };
  
    let stateCopy = state.taskList;
  
    stateCopy = stateCopy.map((task) =>
      task.id === targetID
        ? {
            id: task.id,
            title: updateData.taskTitle,
            description: updateData.taskDescription,
            type: updateData.taskType,
            url: task.url,
          }
        : task
    );
  
    state.taskList = stateCopy;
    updateLocalStorage();
  
    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
  
    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task";
  };
  
  const searchTask = (e) => {
    if (!e) e = window.event;
  
    while (taskContents.firstChild) {
      taskContents.removeChild(taskContents.firstChild);
    }
  
    const resultData = state.taskList.filter(({ title }) => {
      return title.toLowerCase().includes(e.target.value.toLowerCase());
    });
  
    console.log(resultData);
  
    resultData.map((cardData) => {
      taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
    });
  };