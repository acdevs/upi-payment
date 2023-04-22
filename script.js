//Global Names:
var PAYEE_NAME;
var PAYEE_ID;
var PAYEE_AMOUNT;

getVPA()
.then(() => {
    getAmount();
});

function getVPA(){
    const payeeContext = document.querySelector(".select-payee-backdrop");
    const getPayees = document.querySelector(".get-payees");
    const addVpaBtn = document.querySelector(".select-payee .add-btn");
    const getVpaInfo = document.querySelectorAll(".select-payee input[type='text']");

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
    let payeeNameIntitals = "";
    let payeeNameSplit = PAYEE_NAME.split(" ");
    for(let i = 0; i < payeeNameSplit.length; i++) {
        if(i > 1) break;
        payeeNameIntitals += payeeNameSplit[i][0].toUpperCase();
    }
    document.querySelector(".vpa-details .initials").innerHTML = payeeNameIntitals;
    const amountContext = document.querySelector(".vpa-info-amount-pay");
    const inputAmount = document.querySelector(".amount-pay");
    const proceedbtn = document.querySelector(".amount-proceed");

    inputAmount.addEventListener("input", (e) => {
        if(e.target.value == "" || e.target.value < "1") {
            proceedbtn.classList.remove("amount-proceed-valid");
        }else{
            proceedbtn.classList.add("amount-proceed-valid");
        }
    });
    return new Promise((resolve) => {
        proceedbtn.addEventListener("click", () => {
            if(!(inputAmount.value == "" || inputAmount.value < "1")) {
                PAYEE_AMOUNT = inputAmount.value;
                amountContext.style.display = "none";
                resolve();
            }
        })
    });
}

function confirmPay(){

}

