/*
* У папці calculator дана верстка макета калькулятора.
Потрібно зробити цей калькулятор робочим.
* При натисканні на клавіші з цифрами - набір введених цифр має бути показаний на табло калькулятора.
* При натисканні на знаки операторів (`*`, `/`, `+`, `-`) на табло нічого не відбувається - програма чекає введення
* другого числа для виконання операції.
* Якщо користувач ввів одне число, вибрав оператор і ввів друге число, то при натисканні як кнопки `=`, так і будь-якого
*  з операторів, в табло повинен з'явитися результат виконання попереднього виразу.
* При натисканні клавіш `M+` або `M-` у лівій частині табло необхідно показати маленьку букву `m` - це означає, що в
* пам'яті зберігається число. Натискання на MRC покаже число з пам'яті на екрані. Повторне натискання `MRC`
* має очищати пам'ять.
*/

/*
1. Зєжнати верстку з джс
Потрібно зробити цей калькулятор робочим.
2. Знайти всі кнопки та спрбувати їх вивести у консоль
3. Записти перші числа в память коду
4. вивести числа на екран
5. додати знаки ар. операцій
6. Знайти другі числа
7. Вивести другі числа
8. Вивести результат операції
*/

const calculate = {
    operand1: "",
    sign: "",
    operand2: "",
    rez: "",
    mem: 0,
    lastEvent: ""
}

// https://regexr.com/

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
        const input = get();
        calculate.mem = Number(calculate.mem) - input;
        document.querySelector(".display div").innerHTML = "m";
        document.querySelector(".display div").classList.add("absolute");

    } else if (validate(/^m[+]$/, e.target.value)) {
        const input = get();
        calculate.mem = Number(calculate.mem) + input;
        document.querySelector(".display div").innerHTML = "m";
        document.querySelector(".display div").classList.add("absolute");

    } else if (validate(/^mrc$/, e.target.value)) {
        if (calculate.lastEvent === e.target.value) {
            calculate.mem = 0;
            document.querySelector(".display div").innerHTML = "";
            document.querySelector(".display div").classList.remove("absolute");
        } else {
            if (calculate.operand1 === "" && calculate.sign === "" && calculate.operand2 === "") {
                calculate.operand1 = calculate.mem;
                show(calculate.operand1);
            } else if (calculate.operand1 !== "" && calculate.sign === "" && calculate.operand2 === "") {
                calculate.operand1 = calculate.mem;
                show(calculate.operand1);
            } else if (calculate.operand1 !== "" && calculate.sign !== "" && calculate.operand2 === "") {
                calculate.operand2 = calculate.mem;
                show(calculate.operand2);
            } else {
                calculate.operand2 = calculate.mem;
                show(calculate.operand2);
            }
        }
    }
    calculate.lastEvent = e.target.value;
});

function show(v) {
    const d = document.querySelector(".display input");
    d.value = v;
}

function get() {
    const d = document.querySelector(".display input");
    if (d.value === "") {
        return 0;
    } else {
        return Number(d.value);
    }
}

const validate = (r, v) => r.test(v);
