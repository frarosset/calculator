
/* Calculator operations */
function add(x1,x2){
    return x1+x2;
}

function subtract(x1,x2){
    return x1-x2;
}

function multiply(x1,x2){
    return x1*x2;
}

function divide(x1,x2){
    return x1/x2;
}

function percent(x1,x2){
    return x1/100*x2;
}

function operate(operation,x1,x2){
    let result;

    if (x1=="" || x2=="" || operation=="")
        return "";

    x1=Number(x1);
    x2=Number(x2);

    console.log(x1)
    console.log(x2)
    switch(operation){
        case '+':
            result = add(x1,x2);
            break;
        case '-':
            result = subtract(x1,x2);
            break;
        case '*':
            result = multiply(x1,x2);
            break;        
        case '/':
            result = divide(x1,x2);
            break;    
        case '%':
            result = percent(x1,x2);
            break; 
        default:
            console.log('Invalid operation!');
    }
    return result;
}

/* Display functions */

// NOTE: the user can digits multiple operators and numbers, whose operation is executed on the go
// Since the back button is possible, x1, x2, operator are arrays, rather than simple variables
// The current values to be used are in the first position (so that it is easier to reference them)
// The oldest values are stored in the next indeces
// Note that x1, except for the very first number that is digited, is the result of the previous operations
// Variable digitStatus helps distinguish whether we are digiting a number or an operator, and its index
// status 0: you are filling x1 for the first time, odd: you are selecting operation, even: you are filling x2

// Note: display_txt is not really used in this implementation...could be used to show the single operations over time

function clipStringNumber(str){
    console.log(str)
    if (str.length>0){
        return limitDecimals(Number(str));
    } else
        return str;
}

function limitDecimals(num,precision = 5){
    if (String(num).includes('e'))
        return num.toExponential(precision);
    else
        return String(num);
}

function updateDisplay(){
    digitsDisplay.textContent = `${clipStringNumber(x1[0])} ${operator[0]} ${clipStringNumber(x2[0])}`;

    let partial_result = limitDecimals(operate(operator[0],x1[0],x2[0]));
    resultsDisplay.textContent = partial_result.length>0?`(= ${partial_result})`:'';
}

function updateDisplayWithResults(){
    digitsDisplay.textContent = x1[0].length>0?`${clipStringNumber(x1[0])} ${operator[0]} ${clipStringNumber(x2[0])} =`:'';
    resultsDisplay.textContent = limitDecimals(operate(operator[0],x1[0],x2[0]));
}

function numberBtnCallback(e){     
    let btn = e.target;

    console.log("Click on "+btn.textContent+"!");

    if(digitStatus==0){
        // Add digits to x1
        x1[0] += btn.textContent;
    } else if (digitStatus%2==1){
        // Start adding digits to x2
        digitStatus++;
        x2[0] = btn.textContent;
    } else {
        // Add digits to x2
        x2[0] += btn.textContent;
    }

    display_txt += btn.textContent;
    updateDisplay();
}

function operatorBtnCallback(e){     
    let btn = e.target;

    console.log("Click on "+btn.textContent+"!");

    if(digitStatus==0){
        // Select operator for the first time
        digitStatus = 1;
        operator[0] = btn.textContent;
    } else if (digitStatus%2==1){
        // Change the current operator to be used
        display_txt = display_txt.slice(0,-1);
        operator[0] = btn.textContent;
    } else {
        // A new operation is initiated: x1 takes the result of th previous one.
        digitStatus++;
        x1.unshift(String(operate(operator[0],x1[0],x2[0])));
        operator.unshift(btn.textContent);
        x2.unshift("");
    }

    display_txt += btn.textContent;
    updateDisplay();
}

function deleteBtnCallback(e){
    let btn = e.target;

    console.log("Click on delete!");

    if(digitStatus==0){
        // Remove one digit from the initial x1
        x1[0] = x1[0].slice(0,-1);
    } else if (digitStatus%2==1){
        // Remove the current operator and, if possible, return to the previous operation
        // (where you could modify x2)
        operator[0] = "";
        digitStatus--;
        if (digitStatus>0){
            x1.shift();
            x2.shift();
            operator.shift();
        }
    } else {
        // Remove one digit from the current x2
        // If there are no more digits in x2, you can modify the operator next
        // (where you could modify x2)
        x2[0] = x2[0].slice(0,-1);
        if (x2[0].length==0)
            digitStatus--;
    }

    display_txt = display_txt.slice(0,-1);
    updateDisplay();
}

function initVariables(){
    x1=[""];
    x2=[""];
    operator = [""];
    digitStatus = 0;
    display_txt = "";
}

function cancelBtnCallback(e){     
    let btn = e.target;
    console.log("Click on cancel!");
    initVariables()
    updateDisplay();
}

function equalBtnCallback(e){     
    let btn = e.target;
    console.log("Click on =!");
    updateDisplayWithResults();
}



function init(){
    let numberBtn = document.querySelectorAll('.button.number');
    let operatorBtn = document.querySelectorAll('.button.operator');
    let cancelBtn = document.querySelector('.button.cancel');
    let deleteBtn = document.querySelector('.button.delete');
    let equalBtn = document.querySelector('.button.equal');

    initVariables();
    updateDisplay();

    operatorBtn.forEach(itm=> {itm.addEventListener('click',operatorBtnCallback)});
    numberBtn.forEach(itm=> {itm.addEventListener('click',numberBtnCallback)});
    cancelBtn.addEventListener('click',cancelBtnCallback);
    deleteBtn.addEventListener('click',deleteBtnCallback);
    equalBtn.addEventListener('click',equalBtnCallback);
}



let x1,x2,operation,digitStatus;
let display_txt;
let digitsDisplay = document.querySelector('.display .digits');
let resultsDisplay = document.querySelector('.display .results');

init();