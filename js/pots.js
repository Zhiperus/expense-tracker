import Options from "./lib/options.js";
import Cookies from "./utilities/cookies.js";

let pots = { totalSaved: 0, potList: {} };
pots = pots = Cookies.checkCookie("pots")
  ? JSON.parse(Cookies.getCookie("pots"))
  : pots;
const potList = pots.potList;

const addPot = (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value;
  const goal = Number(form.goal.value);

  if (name.toLowerCase() in potList) {
    alert("Pot name already exists!");
    return;
  }

  const pot = {
    name,
    goal,
    currentBalance: 0,
  };

  potList[name.toLowerCase()] = pot;

  const card = createCard(pot);

  document.getElementsByClassName("pot-list")[0].appendChild(card);

  Cookies.setCookie("pots", JSON.stringify(pots), 1);
};

const deletePot = (potName, potCard) => {
  potCard.parentNode.removeChild(potCard);

  pots.totalSaved -= potList[potName].currentBalance;

  delete potList[potName];

  if (Object.keys(potList).length === 0) {
    Cookies.deleteCookie("pots");
  } else {
    Cookies.setCookie("pots", JSON.stringify(pots), 1);
  }
};

const addMoney = (e, potName, potCard) => {
  e.preventDefault();
  const form = e.target;
  const amountToAdd = Number(form.limit.value);

  const newBalance = potList[potName].currentBalance + amountToAdd;

  pots.totalSaved += amountToAdd;

  console.log(pots);

  potList[potName].currentBalance = newBalance;

  potCard.getElementsByClassName(
    "current-balance"
  )[0].innerHTML = ` ${Options.currency}${newBalance}`;
  potCard.getElementsByClassName("progress-bar")[0].style.width = `${
    (newBalance / potList[potName].goal) * 100
  }%`;

  document.getElementById("change-limit-box").classList.remove("active");

  Cookies.setCookie("pots", JSON.stringify(pots), 1);
};

const takeMoney = (e, potName, potCard) => {
  e.preventDefault();
  const form = e.target;
  const amountToTake = Number(form.limit.value);

  const newBalance = potList[potName].currentBalance - amountToTake;

  pots.totalSaved -= amountToTake;

  potList[potName].currentBalance = newBalance;

  potCard.getElementsByClassName(
    "current-balance"
  )[0].innerHTML = ` ${Options.currency}${newBalance}`;
  potCard.getElementsByClassName("progress-bar")[0].style.width = `${
    (newBalance / potList[potName].goal) * 100
  }%`;

  document.getElementById("change-limit-box").classList.remove("active");

  Cookies.setCookie("pots", JSON.stringify(pots), 1);
};

const editGoal = (e, potName, potCard) => {
  e.preventDefault();
  const form = e.target;
  const newLimit = Number(form.limit.value);

  potList[potName].goal = newLimit;

  potCard.getElementsByClassName(
    "pot-goal"
  )[0].innerHTML = ` ${Options.currency}${newLimit}`;
  potCard.getElementsByClassName("progress-bar")[0].style.width = `${
    (potList[potName].currentBalance / newLimit) * 100
  }%`;

  document.getElementById("change-limit-box").classList.remove("active");

  Cookies.setCookie("pots", JSON.stringify(pots), 1);
};

const potEditControl = (actionName, potName, potCard) => {
  const limitBox = document.getElementById("change-limit-box");
  let action = (limitBox.getElementsByClassName("limit-pot")[0].innerHTML =
    potName + "<br /><br />" + actionName);

  switch (actionName) {
    case "Add Money":
      action = (e) => addMoney(e, potName, potCard);
      break;
    case "Take Money":
      action = (e) => takeMoney(e, potName, potCard);
      break;
    case "Edit Goal":
      action = (e) => editGoal(e, potName, potCard);
      break;
  }

  limitBox.getElementsByClassName("limit-form")[0].onsubmit = action;

  limitBox.classList.add("active");
};

const createCard = (pot) => {
  let card = document.createElement("div");
  card.classList.add("pot-card");
  card.name = pot.name.toLowerCase();
  card.innerHTML = `
    <h2>${pot.name}</h2>
    <div class="pot-info">
        <p><strong> Current Balance:</strong><span class="current-balance"> ${
          Options.currency
        }${pot.currentBalance}</span></p>
        <p><strong> Goal:</strong> <span class="pot-goal">${Options.currency}${
    pot.goal
  }</span></p>
    </div>
    <div class="progress-container">
        <div class="progress-bar" style="width: ${
          (pot.currentBalance / pot.goal) * 100
        }%"></div>
    </div>
    <div class="actions">
        <button class="add-money">Add Money</button>
        <button class="take-money">Take Money</button>
        <button class="edit">Edit Goal</button>
        <button class="delete">Delete Pot</button>
    </div>
  `;

  card
    .getElementsByClassName("delete")[0]
    .addEventListener("click", () => deletePot(pot.name.toLowerCase(), card));

  card
    .getElementsByClassName("edit")[0]
    .addEventListener("click", (e) =>
      potEditControl(e.target.innerHTML, pot.name.toLowerCase(), card)
    );

  card
    .getElementsByClassName("take-money")[0]
    .addEventListener("click", (e) =>
      potEditControl(e.target.innerHTML, pot.name.toLowerCase(), card)
    );

  card
    .getElementsByClassName("add-money")[0]
    .addEventListener("click", (e) =>
      potEditControl(e.target.innerHTML, pot.name.toLowerCase(), card)
    );
  return card;
};

const handlePotSearch = (e) => {
  const searchText = e.target.value;

  const searchFilteredCards = Array.from(potCards).filter((card) => {
    return (
      card.name.includes(searchText) || !searchText.replace(/\s/g, "").length
    );
  });

  document.getElementsByClassName("pot-list")[0].innerHTML = "";

  searchFilteredCards.forEach((card) =>
    document.getElementsByClassName("pot-list")[0].appendChild(card)
  );
};

Object.keys(potList).forEach((potName) => {
  document
    .getElementsByClassName("pot-list")[0]
    .appendChild(createCard(potList[potName]));
});

const potCards = Array.from(
  document.getElementsByClassName("pot-list")[0].children
);

document.getElementsByClassName("pots-form")[0].onsubmit = addPot;

document.getElementById("search-field").onchange = handlePotSearch;
