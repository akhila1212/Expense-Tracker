// Select necessary DOM elements
const newUserBtn = document.getElementById('new-user-btn');
const existingUserBtn = document.getElementById('existing-user-btn');
const usernameForm = document.getElementById('username-form');
const startAppBtn = document.getElementById('start-app-btn');
const usernameInput = document.getElementById('username');
const expenseApp = document.getElementById('expense-app');
const expenseForm = document.getElementById('expense-form');
const expenseInput = document.getElementById('expense-name');
const amountInput = document.getElementById('amount');
const currencyInput = document.getElementById('currency');
const categoryInput = document.getElementById('category');
const monthInput = document.getElementById('month'); // Added month input
const expenseList = document.getElementById('expense-list');
const totalAmountDisplay = document.getElementById('total-amount');
const backBtn = document.getElementById('back-btn');

// Store username and expenses
let userName = '';
let expenses = [];
let editIndex = -1;

// Function to handle showing the username input form
function showUsernameForm() {
    usernameForm.style.display = 'flex'; // Display the form to enter username
}

// Event listeners for New User and Existing User buttons
newUserBtn.addEventListener('click', () => {
    // New user selected, no need to check storage
    showUsernameForm();
    startAppBtn.dataset.userType = 'new'; // Mark it as a new user
});

existingUserBtn.addEventListener('click', () => {
    // Existing user selected, need to check for the user in storage
    showUsernameForm();
    startAppBtn.dataset.userType = 'existing'; // Mark it as an existing user
});

// Function to calculate the total amount of expenses
function calculateTotalAmount() {
    const total = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
    totalAmountDisplay.textContent = `Total: INR ${total.toFixed(2)}`;
}

// Function to render the expense list grouped by month
function renderExpenseList() {
    expenseList.innerHTML = ''; // Clear existing list

    // Group expenses by month
    const expensesByMonth = expenses.reduce((acc, expense) => {
        acc[expense.month] = acc[expense.month] || [];
        acc[expense.month].push(expense);
        return acc;
    }, {});

    // Create month sections
    for (const month in expensesByMonth) {
        const monthSection = document.createElement('div');
        const monthHeading = document.createElement('h3');
        monthHeading.textContent = month;
        monthSection.appendChild(monthHeading);

        const monthList = document.createElement('ul');

        expensesByMonth[month].forEach((expense, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${expense.name} - ${expense.currency} ${expense.amount} (${expense.category})</span>
                <div>
                    <button class="edit-btn" onclick="editExpense(${index})">Edit</button>
                    <button onclick="deleteExpense(${index})">Delete</button>
                </div>
            `;
            monthList.appendChild(li);
        });

        monthSection.appendChild(monthList);
        expenseList.appendChild(monthSection);
    }
}

// Event listener for starting the app after entering the username
startAppBtn.addEventListener('click', function () {
    userName = usernameInput.value.trim(); // Get the entered username
    const userType = startAppBtn.dataset.userType;

    if (userName) {
        // Check if it's a new or existing user
        if (userType === 'new') {
            // New user: store the username in localStorage and start the app
            localStorage.setItem(userName, JSON.stringify([])); // Store empty expenses list for the user
            startApp(); // Start the app for the new user
        } else if (userType === 'existing') {
            // Existing user: Check if the user exists in localStorage
            const existingUserExpenses = localStorage.getItem(userName);
            if (existingUserExpenses) {
                // User exists: Load their expenses and start the app
                expenses = JSON.parse(existingUserExpenses);
                startApp();
            } else {
                // User doesn't exist: Show error message
                alert("User doesn't exist. Please check the name or create a new user.");
            }
        }
    } else {
        alert('Please enter your name.');
    }
});

// Function to start the app and show the expense tracker
function startApp() {
    document.getElementById('welcome-screen').style.display = 'none'; // Hide welcome screen
    expenseApp.style.display = 'block'; // Show the expense tracker app
    usernameInput.value = ''; // Clear the username input field
    document.getElementById('user-name-display').textContent = userName; // Display username in the app

    renderExpenseList(); // Render the list of expenses (if any)
    calculateTotalAmount(); // Display the total amount
}

// Function to handle adding a new expense
expenseForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    const expenseName = expenseInput.value.trim();
    const amount = amountInput.value.trim();
    const currency = currencyInput.value.trim() || 'INR'; // Default to INR if empty
    const category = categoryInput.value;
    const month = monthInput.value; // Get selected month

    if (expenseName === '' || amount === '' || month === '') {
        alert('Please fill in all the fields.');
        return;
    }

    const expenseData = {
        name: expenseName,
        amount: parseFloat(amount),
        currency: currency,
        category: category,
        month: month // Include the month in the expense data
    };

    if (editIndex === -1) {
        expenses.push(expenseData); // Add new expense
    } else {
        expenses[editIndex] = expenseData; // Update existing expense
        editIndex = -1; // Reset edit index
    }

    localStorage.setItem(userName, JSON.stringify(expenses)); // Save expenses to localStorage
    renderExpenseList(); // Render updated expense list
    calculateTotalAmount(); // Update total amount

    expenseInput.value = ''; // Clear input fields
    amountInput.value = ''; // Clear input fields
});

// Function to handle deleting an expense
function deleteExpense(index) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses.splice(index, 1); // Remove the expense
        localStorage.setItem(userName, JSON.stringify(expenses)); // Save updated expenses
        renderExpenseList(); // Render updated expense list
        calculateTotalAmount(); // Update total amount
    }
}

// Function to handle editing an expense
function editExpense(index) {
    const expenseToEdit = expenses[index]; // Get the expense data
    expenseInput.value = expenseToEdit.name; // Set name input
    amountInput.value = expenseToEdit.amount; // Set amount input
    currencyInput.value = expenseToEdit.currency; // Set currency input
    categoryInput.value = expenseToEdit.category; // Set category input
    monthInput.value = expenseToEdit.month; // Set month input
    editIndex = index; // Set edit index
}

// Event listener for the back button
backBtn.addEventListener('click', () => {
    document.getElementById('welcome-screen').style.display = 'block'; // Show welcome screen
    expenseApp.style.display = 'none'; // Hide expense tracker app
});
