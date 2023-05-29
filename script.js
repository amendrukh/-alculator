const calculate = {
    operand1: "",
    sign: "",
    operand2: "",
    rez: "",
    mem: 0,
    lastEvent: "",
    tempHistory: []
}

let displayIconHistory = document.querySelector(".display__description-icon");
displayIconHistory.addEventListener("click", () => {
    let calculatorBoxElLast = document.querySelector(".calculator__box-el:last-child");
    if (calculatorBoxElLast.classList.contains("active")) {
        calculatorBoxElLast.classList.add("do")
        setTimeout(() => calculatorBoxElLast.classList.toggle("active"), 2000);
    } else {
        calculatorBoxElLast.classList.toggle("active");
        calculatorBoxElLast.classList.remove("do");
    }
})

function operands(targetValue) {
    if (calculate.sign === "") {
        let calculateEls = String(calculate.operand1).split("");
        if (targetValue === ".") {
            let isDot = calculateEls.find((el) => el === targetValue);
            if (isDot) {
                return;
            }
        }

        if (targetValue === calculate.rez) {
            if (calculate.lastEvent === "±") {
                if (Math.sign(calculate.rez) === 1) {
                    calculate.rez = -calculate.rez;
                } else {
                    calculate.rez = calculate.rez * -1;
                }
            } else if (calculate.lastEvent === "π") {
                calculate.rez = Math.PI;
            } else if (calculate.lastEvent === "%") {
                calculate.rez = calculate.operand1 / 100;
            } else if (calculate.lastEvent === "√") {
                calculate.rez = Math.sqrt(calculate.operand1);
            }

            calculate.operand1 = calculate.rez;
            return show(calculate.operand1);
        }

        if (calculateEls[0] === "0" && calculateEls[1] !== ".") {
            calculateEls.splice(0, 1);
            calculate.operand1 = calculateEls.join("");
            show(calculate.operand1);
        }
        calculate.operand1 += targetValue;
        show(calculate.operand1);
        calculate.rez = calculate.operand1;

    } else {
        if (targetValue === "." && calculate.operand2.includes(".")) {
            return;
        }
        if (calculate.lastEvent === "±") {
            if (Math.sign(calculate.operand2) === 0) {
                calculate.operand2 = -calculate.operand2;
            } else if (Math.sign(calculate.operand2) === 1) {
                calculate.operand2 = calculate.operand2 * -1;
            }
            return show(calculate.operand2);
        } else if (calculate.lastEvent === "π") {
            calculate.operand2 = Math.PI;
            return show(calculate.operand2);
        } else if (calculate.lastEvent === "%") {
            calculate.operand2 = calculate.operand2 / 100;
            return show(calculate.operand2);
        } else if (calculate.lastEvent === "√") {
            calculate.operand2 = Math.sqrt(calculate.operand2);
            return show(calculate.operand2);
        }
        if (calculate.operand2[0] === "0" && calculate.operand2[1] !== ".") {
            calculate.operand2 = calculate.operand2.replace("0", "");
            show(calculate.operand2);
        }
        calculate.operand2 += targetValue;
        show(calculate.operand2);
    }

    if (calculate.operand1 === ".") {
        calculate.operand1 = 0 + ".";
        show(calculate.operand1);
    } else if (calculate.operand2 === ".") {
        calculate.operand2 = 0 + ".";
        show(calculate.operand2);
    }

    if (calculate.operand1 !== "" && calculate.operand2 !== "" && calculate.sign !== "") {
    }
}

function sign(targetValue) {
    if (calculate.operand1 === "" && calculate.operand2 === "" && calculate.sign === "") {
        return;
    }

    if (calculate.operand1 !== "" && calculate.operand2 !== "" && calculate.sign !== "") {
        calc();
        calculate.operand1 = calculate.rez;
        calculate.sign = targetValue;
        calculate.operand2 = "";

    } else {
        calculate.sign = targetValue;
    }

    const equals = document.getElementById("equals");
    equals.removeAttribute("disabled");
}

function calc() {
    let number1 = Number(calculate.operand1);
    let number2 = Number(calculate.operand2);
    console.log(number1)
    console.log(number2)

    if (calculate.sign === "+") {
        calculate.rez = Number(number1 + number2);
    } else if (calculate.sign === "-") {
        calculate.rez = Number(number1 - number2);
    } else if (calculate.sign === "*") {
        calculate.rez = Number(number1 * number2);
    } else if (calculate.sign === "/") {
        if (number2 === 0) {
            calculate.rez = `Error`
        } else {
            calculate.rez = Number(number1 / number2);
        }
    }

    if (calculate.rez < 1 && calculate.rez > 0 || calculate.rez > -1 && calculate.rez < 0 || calculate.rez.toString().includes(".")) {
        calculate.rez = calculate.rez.toFixed(2);
    }

    calculate.tempHistory.push(createObjectHistory(calculate.operand1, calculate.sign, calculate.operand2, calculate.rez));
    generateHistoryList(calculate.tempHistory)
    show(calculate.rez);
}

function del() {
    const rez = document.querySelector(".display input");
    rez.value = "0";
    calculate.operand1 = 0;
    calculate.operand2 = "";
    calculate.rez = "";
    calculate.mem = 0;
}

let li = document.createElement("li");
document.querySelector(".keys").addEventListener("click", (e) => {
    console.log(e.target.value)
    const input = document.querySelector(".display__entryField");
    const entryField = document.querySelector(".display__description-icon-mem");

    calculate.lastEvent = e.target.value;

    if (validate(/[\d\.]/, e.target.value)) {
        operands(e.target.value);

    } else if (validate(/^[+-/*]$/, e.target.value)) {
        sign(e.target.value);
    } else if (validate(/^±$/, e.target.value)) {
        if (calculate.operand1 !== "" && calculate.sign === "" && calculate.operand2 === "") {
            operands(calculate.rez);
        } else if (calculate.operand1 !== "" && calculate.sign !== "" && calculate.operand2 !== "") {
            operands(calculate.operand2);
        }

    } else if (validate(/^π$/, e.target.value)) {
        if (calculate.operand1 === calculate.rez) {
            operands(calculate.rez);
        } else {
            operands(calculate.operand2);
        }

    } else if (validate(/^%$/, e.target.value)) {
        if (calculate.operand1 === calculate.rez) {
            operands(calculate.rez);
        } else {
            operands(calculate.operand2);
        }

    } else if (validate(/^√$/, e.target.value)) {
        if (calculate.operand1 !== "" && calculate.sign === "" && calculate.operand2 === "") {
            operands(calculate.operand1);

        } else if (calculate.operand1 !== "" && calculate.sign !== "" && calculate.operand2 !== "") {
            operands(calculate.operand2);
        }
    } else if (validate(/^=$/, e.target.value)) {
        calc();
        //calculate.operand1 = calculate.rez;
        calculate.operand2 = "";
        calculate.sign = "";
        console.log(calculate.rez)
        operands(calculate.rez)

    } else if (validate(/^C$/, e.target.value)) {
        del();
        entryField.innerHTML = "";

    } else if (validate(/^m-$/, e.target.value)) {
        const inputValue = get();
        calculate.mem = Number(calculate.mem) - inputValue;
        calculate.operand1 = "";
        input.value = "";
        entryField.innerHTML = "m-";
        entryField.classList.add("absolute");

    } else if (validate(/^m[+]$/, e.target.value)) {
        const inputValue = get();
        calculate.mem = Number(calculate.mem) + inputValue;
        calculate.operand1 = "";
        input.value = "";
        entryField.innerHTML = "m+";
        entryField.classList.add("absolute");
        console.log(calculate.mem)

    } else if (validate(/^mrc$/, e.target.value)) {
        entryField.classList.remove("absolute");
        entryField.innerHTML = "";
        if (calculate.lastEvent === e.target.value) {
            if (calculate.operand1 === "" && calculate.sign === "" && calculate.operand2 === "") {
                calculate.operand1 = calculate.mem;
                console.log(`O1: ${calculate.operand1}`)
                show(calculate.operand1);
            } else if (calculate.operand1 !== "" && calculate.sign === "" && calculate.operand2 === "") {
                calculate.operand1 = calculate.mem;
                console.log(`Mem: ${calculate.mem}`)
                console.log(`O1: ${calculate.operand1}`)
                console.log(`O2: ${calculate.operand2}`)
                show(calculate.operand1);
            } else if (calculate.operand1 !== "" && calculate.sign !== "" && calculate.operand2 === "") {
                calculate.operand2 = calculate.mem;
                console.log(`Mem: ${calculate.mem}`)
                console.log(`O1: ${calculate.operand1}`)
                console.log(`O2: ${calculate.operand2}`)
                show(calculate.operand2);
                entryField.innerHTML = "";
                entryField.classList.remove("absolute");
                if (calculate.operand2 === calculate.mem) {
                    calculate.mem = 0;
                }
            }
            calculate.mem = 0;
        }
    }
});

function show(v) {
    const d = document.querySelector(".display__entryField");
    d.value = v;
}

function get() {
    const d = document.querySelector(".display__entryField");
    if (d.value === "") {
        return 0;
    } else {
        return Number(d.value);
    }
}

const validate = (r, v) => r.test(v);

function date() {
    let data = new Date();
    let hour = data.getHours();
    let minutes = data.getMinutes();
    let rez = `${hour}:${minutes}`
    hour > 12 ? rez += " PM" : rez += " AM";
    return rez;
}

function createObjectHistory(operand1, sign, operand2, rez) {
    return {
        date: date(),
        calcExpression: [operand1, sign, operand2, "=", rez].join(" ")
    }
}

function generateHistoryList(tempHistory) {
    let historyList = document.querySelector(".display__history-list");
    tempHistory.forEach((el, index) => {
        let li = document.createElement("li");
        li.insertAdjacentHTML("beforeend", `<span class="list__el-date">${el.date}</span><span class="list__el-descr">${el.calcExpression}</span>`);
        tempHistory.splice(index, 1)
        historyList.append(li);
    })
}