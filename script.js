'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};
const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};


const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

let accounts = [account1, account2, account3, account4];

const UserName = function (arr) {
  let user = arr.forEach(a => {
    a.UserName = a.owner.toLowerCase().split(" ").map(ab => ab[0]).join("");
  });
}
UserName(accounts);
// console.log(accounts);
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Calculate Balance

const calculateBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, aa) => acc += aa, 0);
  labelBalance.textContent = new Intl.NumberFormat(acc.local, { style: "currency", currency: acc.currency }).format(acc.balance);
}

// Income Summary Function 

const calIncomeSummary = curAcc => {

  let deposits = curAcc.movements.filter(mo => mo > 0).reduce((acc, curr) => acc += curr, 0);
  labelSumIn.textContent = FormatNumber(deposits) + "€";
  let widrew = Math.abs(curAcc.movements.filter(mo => mo < 0).reduce((acc, curr) => acc += curr, 0));
  labelSumOut.textContent = FormatNumber(widrew) + "€";
  let interest = curAcc.movements.filter(mo => mo > 0).map(mo => mo * curAcc.interestRate / 100).filter(mov => mov >= 1).reduce((acc, cur) => acc += cur, 0);
  labelSumInterest.textContent = `${FormatNumber(interest)}€`
}

// Displaying the Movements

const DisplayDates = (Dates) => {
  const Display = Math.abs(Math.round((new Date("2020-07-12T10:51:36.790Z") - Dates) / (1000 * 60 * 60 * 24)));
  if (Display === 0) {
    return "Today";
  } else if (Display <= 7) {
    return `${Display} Days ago`
  }
  else return new Intl.DateTimeFormat(navigator.language).format(Dates);
}

const displayMoments = function (curAcc, sort = false) {
  const movs = sort ? curAcc.movements.slice().sort((a, b) => a - b) : curAcc.movements;
  containerMovements.innerHTML = "";
  movs.forEach((curValue, index) => {
    const type = curValue > 0 ? "deposit" : "withdrawal";
    const Dates = new Date(curAcc.movementsDates[index]);
    const html = `<div class="movements__row">
                  <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
                  <div class="movements__date">${DisplayDates(Dates)}</div>
                  <div class="movements__value">${new Intl.NumberFormat(curAcc.local, { style: "currency", currency: curAcc.currency }).format(curValue)}</div>
                  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

// Login Methode



const Login = function (curAcc) {
  labelDate.textContent = `${new Intl.DateTimeFormat(curAcc.local).format(new Date())}`
  labelWelcome.textContent = `Welcome Back, ${curAcc.owner.split(" ").at(0)}`;
  if (timer) clearInterval(timer);
  timer = LoginTimer();
  // Calculating the Balance of the Account
  calculateBalance(curAcc);

  // Calculating the Income Summary of the Current Account 
  calIncomeSummary(curAcc);

  // Displaying all the movements
  displayMoments(curAcc);

  // Clearing the Input Fields
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
  inputLoginPin.blur();
};

// Events 

let curAcc, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  curAcc = (accounts.find((acc) => (acc.UserName == inputLoginUsername.value) && (acc.pin == inputLoginPin.value)));
  if (curAcc) {
    Login(curAcc);
    containerApp.style.opacity = 100;
  } else {
    labelWelcome.textContent = "Wrong User";
    containerApp.style.opacity = 0;
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  clearInterval(timer);
  timer = LoginTimer();
  if (curAcc) {
    const transferAccount = accounts.find(acc => (acc.UserName === inputTransferTo.value && acc !== curAcc));

    if (transferAccount) {
      const amount = Number(inputTransferAmount.value);
      const balance = curAcc.balance;
      inputTransferAmount.value = "";
      inputTransferTo.value = "";
      if (balance >= amount && amount > 0) {
        curAcc.movements.push(0 - amount);
        curAcc.movementsDates.push(new Date());
        transferAccount.movementsDates.push(new Date());
        transferAccount.movements.push(amount);
        Login(curAcc);
      }
    }
  }
});

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  clearInterval(timer);
  timer = LoginTimer();
  const Loan = +(inputLoanAmount.value);
  if (Loan > 0 && curAcc.movements.some(mov => mov > 0) && curAcc.movements.some(mov => mov >= Loan * 10 / 100)) {
    curAcc.movements.push(Loan);
    curAcc.movementsDates.push(new Date());
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
    setTimeout(() => Login(curAcc), 5000);
  }

});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMoments(curAcc, !sorted);
  sorted = !sorted;
});

btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  const Inputted_User = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);
  inputCloseUsername.value = "";
  inputClosePin.value = "";
  if (Inputted_User === curAcc.UserName && closePin === curAcc.pin) {
    accounts.splice(accounts.findIndex(acc => acc.UserName === curAcc.UserName), 1);
    console.log(accounts);
    labelWelcome.textContent = "Log in to get started";
    containerApp.style.opacity = 0;
  }
})

labelBalance.addEventListener('click', function () {
  const arr = Array.from(document.querySelectorAll(".movements__value"), (a => Number(a.textContent.slice(0, -1))));
  console.log(arr);
  const arr2 = [...(document.querySelectorAll('.movements__value'))];
  for (const a of arr2) {
    console.log(a.textContent);
  }
})

const sums = accounts.flatMap(a => a.movements).reduce((acc, cur) => {
  cur > 0 ? acc.deposits += cur : acc.widrewals += cur;
  return acc;
}, { deposits: 0, widrewals: 0 });
console.log(sums);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

function FormatNumber(number) {
  return new Intl.NumberFormat(navigator.language).format(number);
}

labelBalance.addEventListener('click', function () {
  alert(parseInt(labelBalance.textContent));
})

// setInterval(() => {

//   let Dateq = new Date();
//   console.log(`${Dateq.getHours()}:${Dateq.getMinutes()}:${Dateq.getSeconds()}`)
// })

const LoginTimer = function () {
  let num = 120;
  const tick = () => {
    let min = String(Math.trunc(num / 60)).padStart(2, 0);
    let sec = String(num % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (num === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Log in to get started";
    }
    num--;
  }
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};