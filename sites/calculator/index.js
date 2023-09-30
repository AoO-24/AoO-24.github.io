const operation2 = {
    add: (a, b, wl) => {
        const ans = [];
        let carry = false;
        for (let i = 0; i < wl; i++) {
            ans.push(a[i] != b[i] != carry);
            carry = (carry && a[i]) || (carry && b[i]) || (a[i] && b[i]);
        }
        return ans;
    },
    sub: (a, b, wl) => {
        const ans = [];
        let carry = true;
        for (let i = 0; i < wl; i++) {
            ans.push(a[i] != !b[i] != carry);
            carry = (carry && a[i]) || (carry && !b[i]) || (a[i] && !b[i]);
        }
        return ans;
    },
    mulDouble: (a, b, wl) => {
        let ans = [];
        for (let i = 0; i < wl * 2; i++) {
            ans[i] = false;
        }
        let val = a.slice();
        for (let i = 0; i < wl; i++) {
            val.push(false);
        }
        for (let i = 0; i < wl; i++) {
            if (b[i])
                ans = operation2.add(ans, val, wl * 2);
            val.pop();
            val.unshift(false);
        }
        return ans;
    },
    mul: (a, b, wl) => {
        let ans = [];
        for (let i = 0; i < wl * 2; i++) {
            ans[i] = false;
        }
        let val = a.slice();
        for (let i = 0; i < wl; i++) {
            val.push(false);
        }
        for (let i = 0; i < wl; i++) {
            if (b[i])
                ans = operation2.add(ans, val, wl * 2);
            val.pop();
            val.unshift(false);
        }
        return ans.slice(0, wl);
    },
    div: (a, b, wl) => {
        let aExt = a.slice();
        for (let i = a.length; i < 2 * wl; i++) {
            aExt.push(false);
        }
        const ans = [];
        for (let i = 0; i < wl; i++) {
            ans[i] = false;
        }
        let smaller = (a, b, wl) => {
            for (let i = wl - 1; i >= 0; i--) {
                if (!a[i] && b[i])
                    return true;
                if (a[i] && !b[i])
                    return false;
            }
            return false;
        };
        for (let i = wl - 1; i >= 0; i--) {
            ans[i] = true;
            if (smaller(aExt, operation2.mulDouble(ans, b, wl), wl * 2)) {
                ans[i] = false;
            }
        }
        return ans;
    },
    idiv: (a, b, wl) => {
        const aExt = a.slice();
        for (let i = a.length; i < 2 * wl; i++) {
            aExt.push(aExt[wl - 1]);
        }
        if (aExt[2 * wl - 1] && !b[wl - 1]) {
            return operation1.neg(operation2.div(operation1.neg(aExt, 2 * wl), b, wl), wl);
        }
        if (!aExt[2 * wl - 1] && b[wl - 1]) {
            return operation1.neg(operation2.div(aExt, operation1.neg(b, wl), wl), wl);
        }
        if (aExt[2 * wl - 1] && b[wl - 1]) {
            return operation2.div(operation1.neg(aExt, 2 * wl), operation1.neg(b, wl), wl);
        }
        return operation2.div(aExt, b, wl);
    },
    mod: (a, b, wl) => {
        const quotient = operation2.div(a, b, wl);
        const prod = operation2.mulDouble(quotient, b, wl);
        const ans = operation2.sub(a, prod, wl * 2);
        return ans.slice(0, wl);
    },
    imod: (a, b, wl) => {
        const quotient = operation2.idiv(a, b, wl);
        const prod = operation2.mul(quotient, b, wl);
        const ans = operation2.sub(a, prod, wl * 2);
        return ans.slice(0, wl);
    },
    and: (a, b, wl) => {
        const ans = [];
        for (let i = 0; i < wl; i++) {
            ans.push(a[i] && b[i]);
        }
        return ans;
    },
    or: (a, b, wl) => {
        const ans = [];
        for (let i = 0; i < wl; i++) {
            ans.push(a[i] || b[i]);
        }
        return ans;
    },
    xor: (a, b, wl) => {
        const ans = [];
        for (let i = 0; i < wl; i++) {
            ans.push(a[i] != b[i]);
        }
        return ans;
    },
    nand: (a, b, wl) => {
        const ans = [];
        for (let i = 0; i < wl; i++) {
            ans.push(!(a[i] && b[i]));
        }
        return ans;
    },
    nor: (a, b, wl) => {
        const ans = [];
        for (let i = 0; i < wl; i++) {
            ans.push(!(a[i] || b[i]));
        }
        return ans;
    },
    xnor: (a, b, wl) => {
        const ans = [];
        for (let i = 0; i < wl; i++) {
            ans.push(a[i] == b[i]);
        }
        return ans;
    },
    xorMul: (a, b, wl) => {
        let ans = [];
        for (let i = 0; i < wl * 2; i++) {
            ans[i] = false;
        }
        let val = a.slice();
        for (let i = 0; i < wl; i++) {
            val.push(false);
        }
        for (let i = 0; i < wl; i++) {
            if (b[i])
                ans = operation2.xor(ans, val, wl * 2);
            val.pop();
            val.unshift(false);
        }
        return ans;
    },
    xorDiv: (a, b, wl) => {
        let aExt = a.slice();
        for (let i = a.length; i < 2 * wl; i++) {
            aExt.push(false);
        }
        const ans = [];
        for (let i = 0; i < wl; i++) {
            ans[i] = false;
        }
        let bHigh;
        for (bHigh = wl - 1; bHigh >= 0 && b[bHigh] == false; bHigh--) { }
        for (let i = wl - 1; i >= 0; i--) {
            if (aExt[i + bHigh]) {
                ans[i] = true;
                for (let j = 0; j <= bHigh; j++) {
                    aExt[i + j] = aExt[i + j] != b[j];
                }
            }
        }
        return ans;
    },
    xorMod: (a, b, wl) => {
        const aExt = a.slice();
        for (let i = a.length; i < 2 * wl; i++) {
            aExt.push(false);
        }
        let bHigh;
        for (bHigh = wl - 1; bHigh >= 0 && b[bHigh] == false; bHigh--) { }
        for (let i = wl - 1; i >= 0; i--) {
            if (aExt[i + bHigh]) {
                for (let j = 0; j <= bHigh; j++) {
                    aExt[i + j] = (aExt[i + j] != b[j]);
                }
            }
        }
        return aExt.slice(0, wl);
    },
    sla: (a, b, wl) => {
        if (b[wl - 1])
            return operation2.sra(a, operation1.neg(b, wl), wl);
        let amount = toNumber(b);
        const ans = [];
        for (let i = 0; i < amount; i++) {
            ans.push(false);
        }
        for (let i = amount; i < wl; i++) {
            ans.push(a[i - amount]);
        }
        return ans.slice(0, wl);
    },
    sra: (a, b, wl) => {
        if (b[wl - 1])
            return operation2.sla(a, operation1.neg(b, wl), wl);
        let amount = toNumber(b);
        const ans = [];
        for (let i = amount; i < wl; i++) {
            ans.push(a[i]);
        }
        for (let i = 0; i < amount; i++) {
            ans.push(a[wl - 1]);
        }
        return ans.slice(0, wl);
    },
    sll: (a, b, wl) => {
        if (b[wl - 1])
            return operation2.srl(a, operation1.neg(b, wl), wl);
        let amount = toNumber(b);
        const ans = [];
        for (let i = 0; i < amount; i++) {
            ans.push(false);
        }
        for (let i = amount; i < wl; i++) {
            ans.push(a[i - amount]);
        }
        return ans.slice(0, wl);
    },
    srl: (a, b, wl) => {
        if (b[wl - 1])
            return operation2.sll(a, operation1.neg(b, wl), wl);
        let amount = toNumber(b);
        const ans = [];
        for (let i = amount; i < wl; i++) {
            ans.push(a[i]);
        }
        for (let i = 0; i < amount; i++) {
            ans.push(false);
        }
        return ans.slice(0, wl);
    },
    ror: (a, b, wl) => {
        if (b[wl - 1])
            return operation2.rol(a, operation1.neg(b, wl), wl);
        let amount = toNumber(b);
        const ans = [];
        for (let i = 0; i < wl; i++) {
            ans.push(a[(i + amount) % wl]);
        }
        return ans;
    },
    rol: (a, b, wl) => {
        if (b[wl - 1])
            return operation2.ror(a, operation1.neg(b, wl), wl);
        let amount = toNumber(b) % wl;
        const ans = [];
        for (let i = 0; i < wl; i++) {
            ans.push(a[(wl + i - amount) % wl]);
        }
        return ans;
    },
};
const operation1 = {
    not: (a, wl) => {
        const ans = [];
        for (let i = 0; i < wl; i++) {
            ans.push(!a[i]);
        }
        return ans;
    },
    neg: (a, wl) => {
        const ans = [];
        for (let i = 0; i < wl; i++) {
            ans.push(!a[i]);
        }
        let carry = true;
        for (let i = 0; i < wl; i++) {
            let temp = carry;
            carry = carry && ans[i];
            ans[i] = ans[i] !== temp;
            if (!carry)
                break;
        }
        return ans;
    },
    sla: (a, wl) => {
        const ans = [];
        ans.push(false);
        for (let i = 1; i < wl; i++) {
            ans.push(a[i - 1]);
        }
        return ans;
    },
    sra: (a, wl) => {
        const ans = [];
        for (let i = 1; i < wl; i++) {
            ans.push(a[i]);
        }
        ans.push(a[wl - 1]);
        return ans;
    },
    sll: (a, wl) => {
        const ans = [];
        ans.push(false);
        for (let i = 1; i < wl; i++) {
            ans.push(a[i - 1]);
        }
        return ans;
    },
    srl: (a, wl) => {
        const ans = [];
        for (let i = 1; i < wl; i++) {
            ans.push(a[i]);
        }
        ans.push(false);
        return ans;
    },
    ror: (a, wl) => {
        const ans = [];
        for (let i = 0; i < wl; i++) {
            ans.push(a[(i + 1) % wl]);
        }
        return ans;
    },
    rol: (a, wl) => {
        const ans = [];
        for (let i = 0; i < wl; i++) {
            ans.push(a[(wl + i - 1) % wl]);
        }
        return ans;
    },
};
let wordLengths = {
    8: {
        name: "byte",
        next: 16,
    },
    16: {
        name: "word",
        next: 32,
    },
    32: {
        name: "dword",
        next: 64,
    },
    64: {
        name: "qword",
        next: 8,
    },
};
let bases = {
    8: {
        name: "oct",
        next: 10,
    },
    10: {
        name: "dec",
        next: 16,
    },
    16: {
        name: "hex",
        next: 8,
    },
};
let wordLength = 64;
let base = 10;
let sgn = true;
let input = 0;
let showRes = false;
let operand = [[], []];
let operation;
function toHPNumber(a) {
    const ans = [];
    let src;
    if (a < 0) {
        src = -a;
    }
    else {
        src = a;
    }
    for (let i = 0; i < wordLength; i++) {
        ans.push(!!(src & 1));
        src >>= 1;
    }
    if (a < 0) {
        return operation1.neg(ans, wordLength);
    }
    return ans;
}
function toNumber(a) {
    let ans = 0;
    let src;
    if (a[wordLength - 1]) {
        src = operation1.neg(a, wordLength);
    }
    else {
        src = a.slice();
    }
    for (let i = 0; i < wordLength; i++) {
        ans |= (src[i] && (1 << i));
    }
    if (a[wordLength - 1]) {
        return -ans;
    }
    else {
        return ans;
    }
}
function toUnsignedBase(a, base) {
    const order = "0123456789ABCDEF";
    let r = a.slice();
    let ans = "";
    let baseHP = toHPNumber(base);
    while (r.some((val) => val)) {
        const temp = r;
        r = operation2.div(r, baseHP, wordLength);
        const rmn = operation2.mod(temp, baseHP, wordLength);
        ans = order.charAt(toNumber(rmn)) + ans;
    }
    if (ans == "")
        ans = "0";
    if (base == 16)
        ans = "0x" + ans;
    if (base == 8)
        ans = "0" + ans;
    if (base == 2)
        ans = "0b" + ans;
    return ans;
}
function toSignedBase(a, base) {
    const order = "0123456789ABCDEF";
    if (a[wordLength - 1])
        return "-" + toUnsignedBase(operation1.neg(a, wordLength), base);
    return toUnsignedBase(a, base);
}
function toBase(a, base) {
    return sgn ? toSignedBase(a, base) : toUnsignedBase(a, base);
}
function clear() {
    showRes = false;
    operand[input] = toHPNumber(0);
    update();
}
function allClear() {
    operand = [toHPNumber(0), toHPNumber(0)];
    operation = undefined;
    showRes = false;
    input = 0;
    update();
}
function appendNumber(num) {
    if (num >= base)
        return;
    if (showRes) {
        showRes = false;
        operand[1] = toHPNumber(0);
    }
    let baseHP = toHPNumber(base);
    let numHP = toHPNumber(num);
    operand[input] = operation2.add(operation2.mul(operand[input], baseHP, wordLength), numHP, wordLength);
    update();
}
function deleteNumber() {
    if (showRes) {
        showRes = false;
    }
    let baseHP = toHPNumber(base);
    if (sgn)
        operand[input] = operation2.idiv(operand[input], baseHP, wordLength);
    else
        operand[input] = operation2.div(operand[input], baseHP, wordLength);
    update();
}
function getResult() {
    if (!operation)
        return;
    operand[0] = operation2[operation](operand[0], operand[1], wordLength);
    operand[1] = operand[0];
    operation = undefined;
    input = 1;
    showRes = true;
    update();
}
function operand1Handler(func) {
    getResult();
    operand[0] = operation1[func](operand[input], wordLength);
    operand[1] = operand[0];
    input = 1;
    showRes = true;
    update();
}
function operand2Handler(func) {
    getResult();
    operation = func;
    operand[1] = operand[0];
    input = 1;
    showRes = true;
    update();
}
function update() {
    document.getElementById("display").innerHTML = toBase((showRes ? operand[0] : operand[input]), base);
    for (let i = 0; i < wordLength; i++) {
        const button = document.getElementById(`i${i}`);
        button.innerHTML = operand[input][i] ? "1" : "0";
        button.classList.remove("hidden");
    }
    for (let i = wordLength; i < 64; i++) {
        const button = document.getElementById(`i${i}`);
        button.classList.add("hidden");
    }
    for (let i = 0; i < base; i++) {
        document.querySelectorAll(`button[val="${i}"`).forEach((element) => {
            element.classList.remove("disabled");
        });
    }
    for (let i = base; i < 16; i++) {
        document.querySelectorAll(`button[val="${i}"`).forEach((element) => {
            element.classList.add("disabled");
        });
    }
    document.querySelector('button[keyType="switch"][opr="sgn"]').innerHTML = sgn ? "sgn" : "ui";
    document.querySelector('button[keyType="switch"][opr="wordLength"]').innerHTML = wordLengths[wordLength].name;
    document.querySelector('button[keyType="switch"][opr="base"]').innerHTML = bases[base].name;
    document.querySelectorAll('button.current').forEach((element) => {
        element.classList.remove("current");
    });
    if (operation) {
        document.querySelectorAll(`button[opr="${(operation.charAt(0) !== 'i') ? operation : operation.slice(1)}"]`).forEach((element) => {
            if (element.getAttribute("keyType") === "opr1")
                return;
            element.classList.add("current");
        });
    }
}
function changeBit(pos) {
    if (pos <= wordLength) {
        operand[input][pos] = !operand[input][pos];
        update();
    }
}
function switchAttr(opr) {
    if (opr === "sgn") {
        sgn = !sgn;
    }
    if (opr === "wordLength") {
        wordLength = wordLengths[wordLength].next;
        for (let i = 0; i < 2; i++) {
            if (operand[i].length < wordLength) {
                for (let j = operand[i].length; j < wordLength; j++) {
                    operand[i].push(sgn ? operand[i][operand[i].length - 1] : false);
                }
            }
            else {
                operand[i] = operand[i].slice(0, wordLength);
            }
        }
    }
    if (opr === "base") {
        base = bases[base].next;
    }
    update();
}
const keyEvents = {
    "0": () => appendNumber(0),
    "1": () => appendNumber(1),
    "2": () => appendNumber(2),
    "3": () => appendNumber(3),
    "4": () => appendNumber(4),
    "5": () => appendNumber(5),
    "6": () => appendNumber(6),
    "7": () => appendNumber(7),
    "8": () => appendNumber(8),
    "9": () => appendNumber(9),
    "a": () => appendNumber(10),
    "b": () => appendNumber(11),
    "c": () => appendNumber(12),
    "d": () => appendNumber(13),
    "e": () => appendNumber(14),
    "f": () => appendNumber(15),
    "backspace": deleteNumber,
    "+": () => operand2Handler("add"),
    "-": () => operand2Handler("sub"),
    "*": () => operand2Handler("mul"),
    "/": () => operand2Handler((sgn ? "i" : "") + "div"),
    "%": () => operand2Handler((sgn ? "i" : "") + "mod"),
    "&": () => operand2Handler("and"),
    "|": () => operand2Handler("or"),
    "^": () => operand2Handler("xor"),
    "~": () => operand2Handler("not"),
    "enter": getResult,
    "=": getResult
};
window.onload = () => {
    document.querySelectorAll('button[keyType="ac"]').forEach((element) => {
        element.addEventListener("click", allClear);
    });
    document.querySelectorAll('button[keyType="c"]').forEach((element) => {
        element.addEventListener("click", clear);
    });
    document.querySelectorAll('button[keyType="equ"]').forEach((element) => {
        element.addEventListener("click", getResult);
    });
    document.querySelectorAll('button[keyType="opr2"]').forEach((element) => {
        element.addEventListener("click", () => operand2Handler(element.getAttribute("opr")));
    });
    document.querySelectorAll('button[keyType="opr2t"]').forEach((element) => {
        element.addEventListener("click", () => operand2Handler((sgn ? "i" : "") + element.getAttribute("opr")));
    });
    document.querySelectorAll('button[keyType="opr1"]').forEach((element) => {
        element.addEventListener("click", () => operand1Handler(element.getAttribute("opr")));
    });
    document.querySelectorAll('button[keyType="num"]').forEach((element) => {
        element.addEventListener("click", () => appendNumber(parseInt(element.getAttribute("val"))));
    });
    document.querySelectorAll('button[keyType="numd"]').forEach((element) => {
        element.addEventListener("click", () => {
            appendNumber(parseInt(element.getAttribute("val")));
            appendNumber(parseInt(element.getAttribute("val")));
        });
    });
    document.querySelectorAll('button.binary-switch').forEach((element) => {
        element.addEventListener("click", () => changeBit(parseInt(element.id.slice(1))));
    });
    document.querySelectorAll('button[keyType="switch"]').forEach((element) => {
        element.addEventListener("click", () => switchAttr(element.getAttribute("opr")));
    });
    document.addEventListener("keypress", (event) => {
        const { key } = event;
        if (key.toLowerCase() in keyEvents)
            keyEvents[key.toLowerCase()]();
    });
    allClear();
};
//# sourceMappingURL=index.js.map
