//Global Names:
var PAYEE_NAME;
var PAYEE_ID;
var PAYEE_AMOUNT;

getVPA()
.then(() => getAmount())
.then(() => confirmAmount())
.then(() => getUPIpin())
.then(() => processTransaction())
.then(() => success())

function changeTheme(color){
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    metaThemeColor.setAttribute("content", color);
}

function getVPA(){
    const payeeContext = document.querySelector(".select-payee-backdrop");
    const getPayees = document.querySelector(".get-payees");
    const addVpaBtn = document.querySelector(".select-payee .add-btn");
    const getVpaInfo = document.querySelectorAll(".select-payee input[type='text']");
    const showHistory = document.querySelector(".view-history");
    const expandLabel = document.querySelector(".vpa-details .label");

    if(localStorage.getItem("payee.details") == null) {
        localStorage.setItem("payee.details", JSON.stringify([]));
    }
    let payeeList = JSON.parse(localStorage.getItem("payee.details"));
    for (let i = payeeList.length - 1; i >= 0; i--) {
        let newPayee = document.createElement("div");
        newPayee.innerHTML = 
        `<div class="payee-info-name">${payeeList[i][0]}</div>
        <div class="payee-info-id">${payeeList[i][1]}</div>`
        getPayees.appendChild(newPayee);
    }
    return new Promise((resolve) => {
        addVpaBtn.addEventListener('click', () => {
            if(getVpaInfo[0].value != "") {
                let newPayee = document.createElement("div");
                newPayee.innerHTML = 
                `<div class="payee-info-name">${getVpaInfo[0].value}</div>
                <div class="payee-info-id">${getVpaInfo[1].value}</div>`
                getPayees.appendChild(newPayee);
                PAYEE_NAME = getVpaInfo[0].value;
                PAYEE_ID = getVpaInfo[1].value;
                payeeList.push([PAYEE_NAME, PAYEE_ID]);
                localStorage.setItem("payee.details", JSON.stringify(payeeList));
                payeeContext.style.display = "none";
                showHistory.style.display = "none";
                expandLabel.classList.add("no-history");
                resolve();
            }
        });
        Array.prototype.slice.call(getPayees.children).forEach((payee) => {
            payee.addEventListener("click", () => {
                PAYEE_NAME = payee.children[0].innerHTML;
                PAYEE_ID = payee.children[1].innerHTML;
                payeeContext.style.display = "none";
                resolve();
            });
        });
    });
}

function getAmount(){
    document.querySelector(".vpa-details .label-name").innerHTML = PAYEE_NAME;
    document.querySelector(".vpa-details .label-id").innerHTML = PAYEE_ID;
    let splitName = PAYEE_NAME.trim().split(" ");
    let firstName = 0;
    let lastName = splitName.length - 1;
    document.querySelector(".vpa-details .initials").innerHTML = (splitName[firstName][0].concat(splitName[lastName][0])).toUpperCase();
    const inputAmount = document.querySelector(".amount-pay");
    const proceedbtn = document.querySelector(".amount-proceed");

    inputAmount.addEventListener("input", (e) => {
        let amount = e.target.value;
        if(amount == "" || amount < "1") {
            proceedbtn.classList.remove("amount-proceed-valid");
        }else{
            proceedbtn.classList.add("amount-proceed-valid");
        }
        if(amount[amount.length - 1] != ".") {
            let formatted = Intl.NumberFormat("en-IN", {maximumFractionDigits : 2}).format(Number((amount.split(",").join(""))));
            e.target.value = formatted;
        }
    });
    return new Promise((resolve) => {
        proceedbtn.addEventListener("click", () => {
            if(!(inputAmount.value == "" || inputAmount.value < "1")) {
                PAYEE_AMOUNT = inputAmount.value;
                resolve();
            }
        })
    });
}

function confirmAmount(){
    const payContext = document.querySelector(".confirm-pay-backdrop");
    payContext.style.display = "block";
    document.querySelector(".payable .amount").innerHTML = `₹${PAYEE_AMOUNT}`;
    document.querySelector(".account .amount").innerHTML = `₹${PAYEE_AMOUNT}`;
    document.querySelector(".pay .amount").innerHTML = `PAY ₹${PAYEE_AMOUNT}`;
    const payButton = document.querySelector(".pay-button");
    const payLoader = document.querySelector(".pay-loader");
    return new Promise((resolve) => {
        payButton.addEventListener("click", () => {
            payButton.style.display = "none";
            payLoader.style.display = "flex";
            setTimeout(() => {
                payLoader.style.display = "none";
                payContext.style.display = "none";
                resolve();
            }, 2500);
        });
    });
}

function getUPIpin(){
    changeTheme("#e9eaea");
    const UPIContext = document.querySelector(".pin-interface");
    UPIContext.style.display = "block";
    document.querySelector(".pin-payee-name").innerHTML = PAYEE_NAME;
    let fPAYEE_AMOUNT = Intl.NumberFormat("en-IN", {maximumFractionDigits : 2, minimumFractionDigits: 2}).format(Number((PAYEE_AMOUNT.split(",").join(""))).toFixed(2));
    document.querySelector(".pin-payee-amount").innerHTML = `₹${fPAYEE_AMOUNT}`;
    document.querySelector(".pin-warning").append(`You are transferring money from your bank account to ${PAYEE_NAME}`);
    const PadKeys = document.querySelectorAll(".pin-input-keypad-item");
    const pinKeys = document.querySelectorAll(".pin-input-bit");
    const checkBtn = document.querySelector(".pin-input-keypad .check-key");
    let pin = [];
    PadKeys.forEach((key) => {
        key.addEventListener("click", (e) => {
            if(pin.length < 6) {
                if(e.target.innerText == "backspace") {
                    pinKeys[pin.length - 1].classList.toggle("bit-set");
                    pinKeys[pin.length].classList.toggle("next-bit");
                    pin.pop();
                }else if(e.target.innerText != "check"){
                    pin.push(e.target.innerHTML);
                    pinKeys[pin.length - 1].classList.toggle("bit-set");
                    pinKeys[pin.length].classList.toggle("next-bit");
                }
            }else{
                if(e.target.innerText == "backspace") {
                    pinKeys[pin.length - 1].classList.toggle("bit-set");
                    pin.pop();
                }
            }
        });
    });
    return new Promise((resolve) => {
        checkBtn.addEventListener("click", () => {
            if(pin.length == 6) {
                UPIContext.style.display = "none";
                resolve();
            }
        });
    });
}

function processTransaction(){
    changeTheme("#a363eb");
    document.querySelector(".connecting-securely").style.display = "flex";
    const connectLoader = document.querySelector(".connecting-securely .load > video");
    connectLoader.play();
    return new Promise((resolve) => {
        setTimeout(() => {
            document.querySelector(".connecting-securely").style.display = "none";
            resolve();
        }, 3250);
    });
}

function success(){
    changeTheme("#27b563");
    const notify = document.querySelector(".finalize > audio");
    notify.play();
    const finalContext = document.querySelector(".finalize");
    finalContext.style.display = "block";
    document.querySelector(".finalize .label").innerHTML = `Payment of <span class="process-label-amount">₹${PAYEE_AMOUNT}</span> to ${PAYEE_NAME} successful.`;
    const loadDivs = document.querySelectorAll(".finalize .load");
    const slideMenu = document.querySelector(".slide-up");
    const slideBar = document.querySelector(".slide-up-bar");
    const btns = document.querySelector(".finalize .items");
    document.querySelector(".finalize .load-view > video").play();
    setTimeout(async () => {
        btns.style.visibility = "visible";
        loadDivs.forEach((loadDiv) => {
            loadDiv.classList.toggle("load-view")
        });
        document.querySelector(".finalize .load-view > video").play();
        finalContext.style.setProperty("--slide-up-height", "62%");
        slideBar.style.marginTop = "-10px";
        document.querySelector(".slide-up-bar .circle-up").classList.add("circle-animate");
        document.querySelector(".slide-up-bar").classList.add("bar-animate");
    }, 2000);
}

const debounce = (fn, delay) => {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}
