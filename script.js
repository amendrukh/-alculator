const calculate = {
    operand1: "",
    sign: "",
    operand2: "",
    rez: "",
    mem: 0,
    lastEvent: ""
}

function operands(targetValue) {
    if (calculate.sign === "") {
        if (targetValue === "." && calculate.operand1.includes(".")) {
            return;
        }

        calculate.operand1 += targetValue;
        show(calculate.operand1);
        calculate.rez = calculate.operand1;
    } else {
        if (targetValue === "." && calculate.operand2.includes(".")) {
            return;
        }
        calculate.operand2 += targetValue;
        show(calculate.operand2);
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

    if (calculate.sign === "+") {
        console.log(number1);
        console.log(number2);
        calculate.rez = Number(number1 + number2);
        show(calculate.rez);
    } else if (calculate.sign === "-") {
        calculate.rez = Number(number1 - number2);
        show(calculate.rez);
    } else if (calculate.sign === "*") {
        calculate.rez = Number(number1 * number2);
        show(calculate.rez);
    } else if (calculate.sign === "/") {
        if (number2 === 0) {
            calculate.rez = `Error`
            show(calculate.rez);
        } else {
            calculate.rez = Number(number1 / number2);
            show(calculate.rez);
        }
    }
}

function del() {
    const rez = document.querySelector(".display input");
    rez.value = "0";
    calculate.operand1 = "";
}

document.querySelector(".keys").addEventListener("click", (e) => {
    const input = document.querySelector(".display__entryField");
    const entryField = document.querySelector(".display__description span");

    calculate.lastEvent = e.target.value;

    if (validate(/[\d\.]/, e.target.value)) {
        operands(e.target.value);

    } else if (validate(/^[+-/*]$/, e.target.value)) {
        sign(e.target.value);
    } else if (validate(/^=$/, e.target.value)) {
        calc();
        calculate.operand1 = calculate.rez;
        calculate.operand2 = "";
        calculate.sign = "";

    } else if (validate(/^C$/, e.target.value)) {
        del();

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

    } else if (validate(/^mrc$/, e.target.value)) {
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
