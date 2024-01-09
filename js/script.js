
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

    if (x1=="" || x2=="" || operation=="" || x1==signMinusSymbol || x2==signMinusSymbol)
        return "";

    x1=Number(x1);
    x2=Number(x2);

    switch(operation){
        case addOperator:
            result = add(x1,x2);
            break;
        case subtractOperator:
            result = subtract(x1,x2);
            break;
        case multiplyOperator:
            result = multiply(x1,x2);
            break;        
        case divideOperator:
            result = divide(x1,x2);
            break;    
        case percentOperator:
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
    if (str.length>0){
        if (str[0]==signMinusSymbol && str.length==1){
            return str;
        }
        if (str==signMinusSymbol+'0'+decimalPoint){
            return str;
        }
        if (str.slice(-1)==decimalPoint){
            // Fix the punctuation representation
            return limitDecimals(Number(str.slice(0,-1)))+decimalPoint;
        } else {
            return limitDecimals(Number(str));  
        }
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
    resultsDisplay.textContent = partial_result.length>0?`${partial_result}`:'';
}

function updateDisplayWithResults(){
    let result = limitDecimals(operate(operator[0],x1[0],x2[0]));

    if (result.length>0){
        //digitsDisplay.textContent = x1[0].length>0?`${clipStringNumber(x1[0])} ${operator[0]} ${clipStringNumber(x2[0])} =`:'';
        //resultsDisplay.textContent = result.length>0?`${result}`:'';
        resultsDisplay.textContent = '';
        digitsDisplay.textContent = `${result}`;
    } else {
        digitsDisplay.textContent = x1[0].length>0?`${clipStringNumber(x1[0])} ${operator[0]} ${clipStringNumber(x2[0])}`:'';
        resultsDisplay.textContent = '';
    }
}

function fixDecimalPoint(str,char){
    if (str.length==0){
        char = '0' + char;
    } else if (str.length==1 && str[0]==signMinusSymbol) {
        char = '0' + char;
    } else if (str.includes(char)) {
        char = '';
    }
    return char;
}

let signMinusSymbol = '-';
function fixSign(str){
    if (str.length==0){
        str = signMinusSymbol;
    } else if (str[0]==signMinusSymbol) {
        str = str.slice(1);
    } else {
        str = signMinusSymbol+str;
    }
    return str;
}

function numberBtnCallback(e){     
    let btn = e.target;
    let char = btn.textContent;

    console.log("Click on "+char+"!");

    if (char==signSymbol){
        if(digitStatus==0){
            x1[0] = fixSign(x1[0]);
        } else if (digitStatus%2==1){
            // Start adding digits to x2
            digitStatus++;
            x2[0] = fixSign(x2[0]);;
        } else {
            // Add digits to x2
            x2[0] = fixSign(x2[0]);;
        }
        display_txt += char;
    } else if (char==decimalPoint){
        if(digitStatus==0){
            // Add . to x1
            char=fixDecimalPoint(x1[0],char);
            x1[0] += char;
        } else if (digitStatus%2==1){
            // Start adding digits to x2
            digitStatus++;
            char=fixDecimalPoint(x2[0],char);
            x2[0] = char;
        } else {
            // Add digits to x2
            char=fixDecimalPoint(x2[0],char);
            x2[0] += char;
        }
        display_txt += char;
    } else {
        if(digitStatus==0){
            // Add digits to x1
            x1[0] += char;
        } else if (digitStatus%2==1){
            // Start adding digits to x2
            digitStatus++;
            x2[0] = char;
        } else {
            // Add digits to x2
            x2[0] += char;
        }

        display_txt += char;
    }

    updateDisplay();
}

function operatorBtnCallback(e){     
    let btn = e.target;

    console.log("Click on "+btn.textContent+"!");

    if(digitStatus==0){
        if (x1[0].length==0 || (x1[0].length==1 && x1[0]==signMinusSymbol))
            return;
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

/* Capture keyboard press*/
function keyDownCallback(e){
    let key = e.key;
    let buttonClass;

    switch(key){
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            buttonClass = '.num'+key;
            break;
        case '+':
            buttonClass = '.addOperator';
            break;
        case '-':
            buttonClass = '.subtractOperator';
            break;
        case '*':
        case '×':
        case '⋅':
            buttonClass = '.multiplyOperator';
            break;
        case '/':
        case '÷':
            buttonClass = '.divideOperator';
            break;
        case '%':
            buttonClass = '.percentOperator';
            break;
        case '.':
        case ',':
            buttonClass = '.decimalPoint';
            break;
        case 'Enter':
        case '=':
            buttonClass = '.equal';
            break;
        case 'Backspace':
            buttonClass = '.delete';
            break;
        case 'Delete':
            buttonClass = '.cancel';
            break;
        case 's':
        case 'S':
        case '_':
            buttonClass = '.signSymbol';
            break;
        default:
            return;
    }
    document.querySelector(buttonClass).click(); 
}



function init(){
    let numberBtn = document.querySelectorAll('.button.number');
    let operatorBtn = document.querySelectorAll('.button.operator');
    let cancelBtn = document.querySelector('.button.cancel');
    let deleteBtn = document.querySelector('.button.delete');
    let equalBtn = document.querySelector('.button.equal');

    let decimalPointBtn = document.querySelector('.button.decimalPoint');
    decimalPoint = decimalPointBtn.textContent;
    let signSymbolBtn = document.querySelector('.button.signSymbol');
    signSymbol = signSymbolBtn.textContent;
    let addOperatorBtn = document.querySelector('.button.addOperator');
    addOperator = addOperatorBtn.textContent;
    let subtractOperatorBtn = document.querySelector('.button.subtractOperator');
    subtractOperator = subtractOperatorBtn.textContent;
    let multiplyOperatorBtn = document.querySelector('.button.multiplyOperator');
    multiplyOperator = multiplyOperatorBtn.textContent;
    let divideOperatorBtn = document.querySelector('.button.divideOperator');
    divideOperator = divideOperatorBtn.textContent;
    let percentOperatorBtn = document.querySelector('.button.percentOperator');
    percentOperator = percentOperatorBtn.textContent;

    initVariables();
    updateDisplay();

    operatorBtn.forEach(itm=> {itm.addEventListener('click',operatorBtnCallback)});
    numberBtn.forEach(itm=> {itm.addEventListener('click',numberBtnCallback)});
    cancelBtn.addEventListener('click',cancelBtnCallback);
    deleteBtn.addEventListener('click',deleteBtnCallback);
    equalBtn.addEventListener('click',equalBtnCallback);

    window.addEventListener('keydown', keyDownCallback);
}



let x1,x2,operation,digitStatus;
let display_txt;
let digitsDisplay = document.querySelector('.display .digits');
let resultsDisplay = document.querySelector('.display .results');
let decimalPoint,signSymbol,addOperator,subtractOperator,multiplyOperator,divideOperator,percentOperator;

init();