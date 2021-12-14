function add(num1, num2){
    return num1 + num2;
}

function subtract(num1, num2){
    return num1 - num2;
}

function multiply(num1, num2){
    return num1*num2;
}

function divide(num1, num2){
    return num1 / num2;
}

function operate(operator, num1, num2){
    return operator(num1, num2);
}

const operations = {
    add, subtract, divide, multiply
}

const calcButtons = document.querySelectorAll('.calculator-btn')
const display = document.querySelector('#display');

calcButtons.forEach( button => {
    const buttonIsANumber = ( Number(button.textContent) === Number(button.textContent) ) // note, NaN === NaN returns false
    if (buttonIsANumber) {
        button.addEventListener('click', numberHandler);
        return;
    }
    const buttonIsClr = button.textContent === 'Clr';
    if (buttonIsClr){
        button.addEventListener('click', clearHandler);
        return;
    }
    const buttonIsEqls = button.textContent === '=';
    if (buttonIsEqls){
        button.addEventListener('click', eqlsHandler)
        return;
    }
    button.addEventListener('click', operatorHandler)
    return;

})


/* state is separate from the display */
const state = {
    previousNumber:null,
    currentNumber:null,
    operator:"",
}


/* We define some simple functions to handle state management. */
function resetState(){
    state.previousNumber=null;
    state.currentNumber=null;
    state.operator="";
}

function executeState(){
    let {operator, previousNumber, currentNumber} = state;
    previousNumber = Number(previousNumber);
    currentNumber = Number(currentNumber)

    if (operator ==="divide" && currentNumber === 0){
        
        resetState();
        state.currentNumber = "Do not try me.";

        return;
    }

    const result = operate(operations[operator], previousNumber, currentNumber);

    state.previousNumber = result;
    state.currentNumber = null;
    state.operator = "";
}

function updateCurrent(value){
    if (state.currentNumber){
        state.currentNumber += value;
    } else {
        state.currentNumber = value;
    }
}

function shiftState(){
    state.previousNumber = state.currentNumber;
    state.currentNumber = null;
}


/* the handlers use the state management functions*/
function numberHandler(e){
    const number = e.target.textContent;

    updateCurrent(number);
    updateDisplay();
}

function operatorHandler(e){
    
    // if operator is already defined, we will execute state, otherwise we will shift state

    if (state.operator){
        executeState();
    } 

    if (state.currentNumber){
        shiftState();
    }

    const operator = e.target.dataset.id;
    state.operator = operator;
    

    updateDisplay();

}

function eqlsHandler(e){
    if (state.operator){
        executeState();
        updateDisplay();
    }
}

function clearHandler(e){
    resetState();
    updateDisplay();
}

function updateDisplay(){
    /* this function reads the state and updates the div#display element accordingly*/
    function calculateStrLength(number){
        return String(number).length;
    }

    // the max number of characters we want to show is 14
    function truncate(number){
        const bound = 10;

        if (calculateStrLength(number)<=bound){
            return number;
        }


        if ( calculateStrLength( Math.round(number) ) > bound ){
            return (number).toExponential(8);
        } else {
            const decimalLength = calculateStrLength(Math.round(number) - number);
            const totalLength = calculateStrLength(number);

            return (number).toFixed( bound - (totalLength - decimalLength));
        }
    }
    const isCurrentASnarkyMessage = typeof(state.currentNumber) === "string";
    if (isCurrentASnarkyMessage){
        display.textContent = state.currentNumber;
    } else {       
        const displayValue = state.currentNumber === null ? truncate(state.previousNumber) : truncate(state.currentNumber);
        display.textContent = displayValue
    }
}
