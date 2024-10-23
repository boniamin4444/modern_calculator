const calculator = {
  displayValue: '0',
  firstOperand: null,
  secondOperand: null,
  operator: null,
  waitingForSecondOperand: false,
  equation: '', // New property to track the equation
};

function updateDisplay() {
  const display = document.querySelector('.calculator-screen');
  display.value = calculator.equation ? calculator.equation : calculator.displayValue; // Show the equation if present
}

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand, equation } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }

  calculator.equation = equation + digit; // Add the digit to the equation string
}

function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) return;

  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
    calculator.equation += dot; // Add the decimal to the equation string
  }
}

function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator, equation } = calculator;
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    calculator.equation = equation.slice(0, -1) + nextOperator; // Replace the operator in the equation
    updateDisplay();
    return;
  }

  if (firstOperand == null) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = performCalculation[operator](firstOperand, inputValue);
    calculator.displayValue = String(result);
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
  calculator.equation = equation + nextOperator; // Add the operatorss to the equation string
}

function handleEqualSign() {
  const { firstOperand, displayValue, operator } = calculator;
  const secondOperand = parseFloat(displayValue);

  if (operator && firstOperand != null) {
    const result = performCalculation[operator](firstOperand, secondOperand);
    calculator.displayValue = String(result);
    calculator.firstOperand = result;
    calculator.equation += `=${result}`; // Add the equal sign and result to the equation string
    calculator.operator = null;
    calculator.waitingForSecondOperand = true;
  }
}

const performCalculation = {
  '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
  '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
  '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
  '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
};

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
  calculator.equation = ''; // Reset the equation as well
}

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
  const { target } = event;
  if (!target.matches('button')) {
    return;
  }

  if (target.classList.contains('operator')) {
    handleOperator(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains('decimal')) {
    inputDecimal(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains('equal-sign')) {
    handleEqualSign();
    updateDisplay();
    return;
  }

  if (target.classList.contains('all-clear')) {
    resetCalculator();
    updateDisplay();
    return;
  }

  inputDigit(target.value);
  updateDisplay();
});

updateDisplay();
