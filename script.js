"use strict";
class Transactions {
  constructor(description, amount, type) {
    this.description = description;
    this.amount = amount;
    this.type = type;
    this.id = Date.now();
  }
}

class BudgetApp {
  constructor() {
    this.transactions = this.loadFromLocalStorage();
  }

  AddTransaction(transaction) {
    this.transactions.push(transaction);
    this.saveToLocalStorage();
  }

  getBalance() {
    return this.transactions.reduce((acc, t) => {
      return t.type === "Income" ? acc + t.amount : acc - t.amount;
    }, 0);
  }

  delete(id) {
    this.transactions = this.transactions.filter((t) => t.id !== id);
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  loadFromLocalStorage() {
    const data = localStorage.getItem("transactions");
    return data ? JSON.parse(data) : [];
  }
}

class UI {
  constructor() {
    this.budgetApp = new BudgetApp();
    this.type = document.querySelector(".select");
    this.btn = document.querySelector(".btn-expense");
    this.amount = document.querySelector("#expense-amount");
    this.description = document.querySelector("#expense-description");
  }

  submit() {
    this.btn.addEventListener("click", (e) => {
      e.preventDefault();
      const type = this.type.value;
      const amount = Number(this.amount.value);
      const description = this.description.value;
      const transaction = new Transactions(description, amount, type);
      this.budgetApp.AddTransaction(transaction);
      this.renderTransaction(transaction);
      this.updateBalance();
      this.amount.value = "";
      this.description.value = "";
    });
  }

  renderTransaction(transaction) {
    const list = document.querySelector("#expense-list");
    const li = document.createElement("li");
    li.classList.add("list-item");
    li.textContent = `${transaction.type}: ${transaction.description} - ₹${transaction.amount}`;
    list.appendChild(li);

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "X";
    btnDelete.classList.add("btn-delete");
    li.appendChild(btnDelete);

    btnDelete.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-delete")) {
        this.budgetApp.delete(transaction.id);
        li.remove();
        this.updateBalance();
      }
    });
  }

  updateBalance() {
    const balanceElement = document.querySelector("#total-amount");
    balanceElement.textContent = this.budgetApp.getBalance();
  }

  renderAllTransactions() {
    this.budgetApp.transactions.forEach((transaction) => {
      return this.renderTransaction(transaction);
    });
    this.updateBalance();
  }
}

const ui = new UI();
ui.renderAllTransactions();
ui.submit();
