const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay ]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indictor]");
const generateBtn = document.querySelector(".generatrButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#%^&*()_+-/.:;"<,>?{[}]|\`';

let password ="";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// ste strength cricle color to grey
setIndicator("#ccc");
 
// set passwordlength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// generate random integer
function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

// number
function generateRandomNumber(){
     return getRndInteger(0, 9);
}
// lower case
function generateLowerCase(){
    // ASCII num a to z
    return String.fromCharCode(getRndInteger(97,123));
}
// upper case
function generateUpperCase(){
    // ASCII num A to Z
    return String.fromCharCode(getRndInteger(65,91));
}
// symbols
function generateSymbol(){
       const randNum = getRndInteger(0, symbols.length);
       return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper  = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(symbolsCheck.checked) hasSym = true;
    if(numberCheck.checked) hasNum = true;

    if(hasUpper && hasLower && (hasNum || hasSym ) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) && 
        passwordLength >= 6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}


//copy btn
async function copyContent(){
     try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copy";
     }
     catch(e) {
        copyMsg.innerText = "Failed";
     }
   // to make copy wal span visible
     copyMsg.classList.add("active"); 

     setTimeout( () => {
        copyMsg.classList.remove("active");
     }, 2000);
}


function shufflePassword(array){
    // Fisher yates method
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str ="";
    array.forEach( (el) => (str += el));
    return str;
}


function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
        
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
 
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
} )



inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
})




// main generate password
generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected
    if(checkCount == 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //
    // remove old password
    password = "";
    

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    
    if(numberCheck.checked)
        funcArr.push(generateRandomNumber);
    
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);
    

    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining addition
    for(let i = 0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffile the password
     password = shufflePassword(Array.from(password));

     // show in UI
     passwordDisplay.value = password;

     // calculation strength
     calcStrength();

});