
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

function clipStringNumber(str, precision=5){
    if (str.length>0){
        if (   str == signMinusSymbol 
            || str == signMinusSymbol+'0'
            || str == signMinusSymbol+'0'+decimalPoint
            || str == '0'+decimalPoint){
            return str;
        }
        if (str.slice(-1)==decimalPoint){
            // Fix the punctuation representation
            str = limitDecimals(str.slice(0,-1),precision);
            if (!str.includes('e'))
                str += decimalPoint;
            return str;
        } else {
            return limitDecimals(str,precision,false);  
        }
    } else
        return str;
}

let precisionDigits = 10;
let precisionResult = 10;
let truncateSymbol = '…';

function getPrecision(strNum){
    let numArr = strNum.split('e');
    // numArr[0] is the the non-exponent portion of strNum

    return numArr[0].replace(/^[+\-]/,'')  // remove sign
                    .replace(/\./,'')      // remove decimal point (e.g., 001000->001000, 0.012->0012, 01.0-> 010, 12->12)
                    .replace(/^0+/,'')     // remove heading 0     (e.g., 001000->  1000,  0012->  12,  010->  10, 12->12)
                    .length;
}

function getDigits(strNum){
    let numArr = strNum.split('e');
    // numArr[0] is the the non-exponent portion of strNum

    return numArr[0].replace(/[+\-\.]/g,'').length;
}

function getTrailingZeros(strNum){
    return strNum.length - removeTrailingZeros(strNum).length;
}

function removeTrailingZeros(strNum){
    let numArr = strNum.split('e');
    // numArr[0] is the the non-exponent portion of strNum

    if (numArr[0].includes('.'))
        numArr[0] = numArr[0].replace(/0+$/,'')  // trailing zeros

    return numArr.join('e'); 
}

function toPrecisionTruncate(num,precision){
    let precStrNum = num.toPrecision(precision+1);
    precStrNum = precStrNum.split('e');
    precStrNum[0] = precStrNum[0].slice(0,-1);

    //console.log(num.toPrecision(precision),precStrNum.join('e'),getDigits(num.toPrecision(precision)),getDigits(precStrNum.join('e')))
    return precStrNum.join('e'); 
}

function limitDecimals(strNum,precision = 5,removeTrailingDecimalZeros=true){
    if (strNum.length==0)
        return '';

    let num = Number(strNum);
    let numOfDigits  = getDigits(strNum);
    let numPrecision = getPrecision(strNum);
    let trailingZeros = getTrailingZeros(strNum);

    //console.log('STR:'+strNum + ' ND:' + numOfDigits + ' TZ:'+ trailingZeros + ' SD:'+numPrecision)

    if (numOfDigits<=precision){
        return strNum;
    } else if (!removeTrailingDecimalZeros && trailingZeros>0 && num==0){
        return num.toPrecision(precision).concat(truncateSymbol); 
        //return '0.0<sub>x' + trailingZeros + '</sub>'; // Use inner html;
    } 

    // Truncate number (note: not round)
    //let precStrNum = num.toPrecision(precision+1);
    let precStrNum = toPrecisionTruncate(num,precision);
    let precNum = Number(precStrNum);

    if (precNum!=num){ // truncated
        precStrNum = precStrNum.split('e');
        precStrNum[0] = precStrNum[0].concat(truncateSymbol);
        precStrNum = precStrNum.join('e');
    } else if (precStrNum.includes('.')){
        precStrNum = precStrNum.split('e');

        if (removeTrailingDecimalZeros){
            precStrNum[0] = removeTrailingZeros(precStrNum[0]);
        } else {
            let precNumPrecision = getPrecision(precStrNum[0]);
            let zerosToRemove = precNumPrecision-numPrecision;

            //console.log(`(${strNum})SD: ${numPrecision} (${precStrNum[0]})rd: ${precNumPrecision} --> (${zerosToRemove>0?precStrNum[0].slice(0,-zerosToRemove):precStrNum[0]})${zerosToRemove}`)
            if (zerosToRemove>0)
                precStrNum[0] = precStrNum[0].slice(0,-zerosToRemove);
            //else if (zerosToRemove<0){
                //precStrNum[0] += '<sub>x' + (-zerosToRemove+1) + '</sub>'; // Use inner html;
            //}
        }
        precStrNum = precStrNum.join('e');        
    }

    precStrNum=precStrNum.replace('+','');

    return precStrNum;
}

// https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing
function isOverflownWidth(element) {
    return element.scrollWidth > element.clientWidth;
}

function fixOverflow(element,defaultFontSize){
    element.style.fontSize = defaultFontSize;
    let newFontSize = defaultFontSize.slice(0,-3);
    while (isOverflownWidth(element)){
        newFontSize = newFontSize*0.95;
        element.style.fontSize = newFontSize+'px';
    }
}

function getDigitsString(){
    let str = `${clipStringNumber(x1[0],precisionDigits)} ${operator[0]} ${clipStringNumber(x2[0],precisionDigits)}`
    
    return x1[0].length>0?str:'';
}


function getResultString(){
    return limitDecimals(operate(operator[0],x1[0],x2[0]).toString(),precisionResult);
}

function updateDisplay(){
    digitsDisplay.innerHTML = getDigitsString();
    fixOverflow(digitsDisplay,displayFontSize);

    let partial_result = getResultString();
    resultsDisplay.innerHTML = partial_result.length>0?partial_result:'';
    fixOverflow(resultsDisplay,resultsFontSize);
}

function updateDisplayWithResults(){
    let result = getResultString();

    if (result.length>0){
        resultsDisplay.innerHTML = '';
        digitsDisplay.innerHTML = result;
    } else {
        digitsDisplay.innerHTML = getDigitsString();
        resultsDisplay.innerHTML = '';
    }
    fixOverflow(digitsDisplay,displayFontSize);
    fixOverflow(resultsDisplay,resultsFontSize);
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

function fixHeadingZeros(str){
    if (str=='0')
        return '';
    else if (str== signMinusSymbol+'0')
        return signMinusSymbol;
    else
        return str;
}

function numberBtnCallback(e){     
    let btn = e.target;
    let char = btn.textContent;

    //console.log("Click on "+char+"!");

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
    } else { // Number
        if(digitStatus==0){
            // Add digits to x1
            x1[0] = fixHeadingZeros(x1[0]);
            x1[0] += char;
        } else if (digitStatus%2==1){
            // Start adding digits to x2
            digitStatus++;
            x2[0] = char;
        } else {
            // Add digits to x2
            x2[0] = fixHeadingZeros(x2[0]);
            x2[0] += char;
        }

        display_txt += char;
    }

    updateDisplay();
}

function operatorBtnCallback(e){     
    let btn = e.target;

    //console.log("Click on "+btn.textContent+"!");

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

    //console.log("Click on delete!");

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
    //console.log("Click on cancel!");
    initVariables()
    updateDisplay();
}

function equalBtnCallback(e){     
    let btn = e.target;
    //console.log("Click on =!");
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

    digitsDisplay = document.querySelector('.display .digits');
    resultsDisplay = document.querySelector('.display .results');

    initVariables();

    operatorBtn.forEach(itm=> {itm.addEventListener('click',operatorBtnCallback)});
    numberBtn.forEach(itm=> {itm.addEventListener('click',numberBtnCallback)});
    cancelBtn.addEventListener('click',cancelBtnCallback);
    deleteBtn.addEventListener('click',deleteBtnCallback);
    equalBtn.addEventListener('click',equalBtnCallback);

    window.addEventListener('keydown', keyDownCallback);

    window.addEventListener('load',()=>{
        displayFontSize = getComputedStyle(digitsDisplay).getPropertyValue('font-size');
        resultsFontSize = getComputedStyle(resultsDisplay).getPropertyValue('font-size');
        updateDisplay();
    });
}


let x1,x2,operation,digitStatus;
let display_txt;
let digitsDisplay, resultsDisplay;
let decimalPoint,signSymbol,addOperator,subtractOperator,multiplyOperator,divideOperator,percentOperator;
let displayFontSize,resultsFontSize;

init();