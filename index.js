const onLogin = async (app) => {
  const { value: id } = document.querySelector("#id");
  const { value: password } = document.querySelector("#password");

  if (id.trim() === "" || password.trim() === "") {
    return;
  }

  const res = await fetch("https://tightee.com/api/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, password }),
  });
  const data = await res.json();

  if (res.status === 200) {
    createAdminPage(app, data.key);
  } else {
    alert(data.message);
  }
};

const onCreateQuestion = async (key) => {
  if (!key) {
    main();
    return;
  }

  const { value: title } = document.querySelector("#title");
  const { value: createdAt } = document.querySelector("#createdAt");
  const { value: author } = document.querySelector("#author");
  const options = [];
  document.querySelector("#options").childNodes.forEach((node) => {
    if (node.nodeName === "LI") {
      const { value } = node.firstChild;
      if (value.trim() !== "") {
        options.push(value);
      }
    }
  });

  const body = JSON.stringify({ title, createdAt, author, options });
  const res = await fetch("https://tightee.com/api/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + key,
    },
    body,
  });
  const data = await res.json();

  if (res.status === 200) {
    alert("질문 등록이 완료되었습니다.", data.id);
    createAdminPage(document.querySelector("#app"), key);
  } else {
    alert(data.message);
    if (res.status === 403) {
      main();
    }
  }
};

const createInput = (id) => {
  const input = document.createElement("input");
  input.setAttribute("type", "input");
  input.setAttribute("id", id);
  return input;
};

const createLabel = (forId, value, required) => {
  const label = document.createElement("label");
  label.setAttribute("for", forId);
  label.innerText = value;
  if (required) {
    label.classList.add("required");
  }
  return label;
};

const createButton = (value, onClick, className) => {
  const button = document.createElement("button");
  button.addEventListener("click", onClick);
  button.innerText = value;
  if (className) {
    button.classList.add(className);
  }
  return button;
};

const createOption = (id) => {
  const li = document.createElement("li");
  const input = createInput(id);
  const button = createButton("X", () => li.parentElement.removeChild(li), "delete");
  li.appendChild(input);
  li.appendChild(button);
  return li;
};

const createOptionList = (options) => {
  const option1 = createOption("option1");
  const option2 = createOption("option2");

  const onAddOption = () => {
    const newId = options.childNodes.length;
    const option = createOption(newId);
    options.removeChild(button);
    options.appendChild(option);
    options.appendChild(button);
  };
  const button = createButton("+", onAddOption, "add");

  options.appendChild(option1);
  options.appendChild(option2);
  options.appendChild(button);
};

const createAdminPage = (app, key) => {
  app.removeChild(document.querySelector(".form"));

  const form = document.createElement("div");
  form.classList.add("form");

  const title = createInput("title");
  title.setAttribute("placeholder", "질문 내용을 입력해 주세요.");
  const titleLabel = createLabel("title", "질문", true);

  const createdAt = createInput("createdAt");
  createdAt.setAttribute("placeholder", "질문이 보여질 날짜를 입력해 주세요. (YYYYMMDD)");
  const createdAtLabel = createLabel("createdAt", "날짜", true);

  const author = createInput("author");
  author.setAttribute("placeholder", "질문 신청자의 닉네임을 입력해 주세요. (OOO님)");
  const authorLabel = createLabel("author", "신청자", false);
  const authorDesc = document.createElement("span");
  authorDesc.innerText = "입력하지 않을 경우 Tightee로 표시되며,\n익명일 경우 닉네임 비공개 등으로 입력해 주세요.";

  const options = document.createElement("ul");
  options.setAttribute("id", "options");
  createOptionList(options);
  const optionsLabel = createLabel("option1", "선택지", true);

  const button = createButton("Create", () => onCreateQuestion(key));

  form.appendChild(titleLabel);
  form.appendChild(title);
  form.appendChild(createdAtLabel);
  form.appendChild(createdAt);
  form.appendChild(authorLabel);
  form.appendChild(authorDesc);
  form.appendChild(author);
  form.appendChild(optionsLabel);
  form.appendChild(options);
  form.appendChild(button);

  app.appendChild(form);
};

const createLoginPage = (app) => {
  const form = document.createElement("div");
  form.classList.add("form");

  const id = createInput("id");
  const idLabel = createLabel("id", "ID", true);

  const password = document.createElement("input");
  password.setAttribute("type", "password");
  password.setAttribute("id", "password");
  const passwordLabel = createLabel("password", "PASSWORD", true);

  const button = createButton("Login", () => onLogin(app));

  form.appendChild(idLabel);
  form.appendChild(id);
  form.appendChild(passwordLabel);
  form.appendChild(password);
  form.appendChild(button);

  app.appendChild(form);
};

const clearApp = (app) => {
  while (app.lastElementChild) {
    app.removeChild(app.lastElementChild);
  }
};
const main = () => {
  const app = document.querySelector("#app");
  clearApp(app);
  createLoginPage(app);
};

main();
