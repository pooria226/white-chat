// ************************
// Define Variable
// ************************

const socket = io();
const form = document.querySelector("form[name=form-chat]"),
  chatBox = document.querySelector(".chat-messages"),
  onlines = document.querySelector(".onlines"),
  modalLogin = document.querySelector(".modal-login"),
  inputLogin = document.querySelector("input[name=login-input]"),
  feedBack = document.querySelector(".text-muted"),
  buttonLogin = document.querySelector(".handle-login"),
  input = document.querySelector("input[name=text-message]");

// ************************
// Define Socket Logic
// ************************

socket.on("send message", (data) => {
  chatBox.innerHTML += `
            <div class="chat-message-right pb-4">
                    <div>
                            <img
                                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                class="rounded-circle mr-1"
                                alt="Chris Wood"
                                width="40"
                                height="40"
                            />
                            <div class="text-muted small text-nowrap mt-2">
                                2:33 am
                            </div>
                            </div>
                            <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                            <div class="font-weight-bold mb-1">
                            ${data.name}
                            </div>
                            ${data.value}
                    </div>
            </div>
  `;
});

socket.on("typing", (data) => {
  if (data.typing) {
    feedBack.innerHTML = `${data.value} is typing...`;
  } else {
    feedBack.innerHTML = ``;
  }
});

socket.on("login", ({ users }) => {
  onlines.innerHTML = ``;
  Object.keys(users).forEach(function (key, index) {
    onlines.innerHTML += `
    <a
    href="#"
    class="list-group-item list-group-item-action border-0"
    >
        <div class="badge text-white bg-danger float-right ml-4 mt-2"></div>
            <div class="d-flex align-items-start">
            <img
                src="https://bootdey.com/img/Content/avatar/avatar2.png"
                class="rounded-circle mr-1"
                alt=${users[key].userName}
                width="40"
                height="40"
            />
            <div class="flex-grow-1 ml-3">
                <div class="d-flex justify-content-between align-items-center">
                <div>
                ${users[key].userName}
                <div class="small">
                  <span class="fa  fa-circle ${
                    users[key].online ? "chat-online" : "chat-offline"
                  }"></span> ${users[key].online ? "online" : "offline"}
                </div>
                </div>
                <div>
                <button class="btn-sm btn-primary">
                <i class="fa fa-weixin" aria-hidden="true"></i>
                </button>
                </div>
              </div>
            </div>
        </div>
</a>
`;
  });
});

// ************************
// Define Fucntion
// ************************

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("send message", {
      value: input.value,
      name: localStorage.getItem("user"),
    });

    socket.emit("typing", {
      value: localStorage.getItem("user"),
      typing: false,
    });
    input.value = "";
    feedBack.innerHTML = "";
  }
});

input.addEventListener("keyup", (e) => {
  if (e.target.value) {
    socket.emit("typing", {
      value: localStorage.getItem("user"),
      typing: true,
    });
  } else {
    socket.emit("typing", {
      value: localStorage.getItem("user"),
      typing: false,
    });
  }
});

buttonLogin.addEventListener("click", () => {
  const value = inputLogin.value;
  if (value) {
    localStorage.setItem("user", value);
    $(modalLogin).modal("hide");
    socket.emit("login", {
      value,
    });
  }
});

if (!localStorage.getItem("user")) {
  $(modalLogin).modal("show");
} else {
  localStorage.removeItem("user");
  $(modalLogin).modal("show");
}
