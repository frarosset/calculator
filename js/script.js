
/* Calculator operations */
function add(x1,x2){
    return Number(x1)+Number(x2);
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


let x1,x2,operation; 

function operate(operation,x1,x2){
    let result;
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
        default:
            console.log('Invalid operation!');
    }
    return result;
}