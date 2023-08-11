"use strict";
const ghost_variable = {1:[456, 789, 123, 'anh yeu em'],model:[1,2,3,4,5]};
if (typeof localStorage.getItem("number") !== "string") {
    localStorage.setItem("number", 0);

    console.log(
        `This variable is string and the var is: ${localStorage.getItem(
            "number"
        )}`
    );
}
if (typeof localStorage.getItem("thevar") !== "string") {
    localStorage.setItem("thevar", 1000);

    console.log(
        `This variable is string and the var is: ${localStorage.getItem(
            "thevar"
        )}`
    );
}
document.querySelector("#times").innerHTML =
    `Lần: ` + localStorage.getItem("number");
let a = document.getElementById("text");
a.value = localStorage.getItem("thevar");
let thenumber = Number(localStorage.getItem("number"));
let form = document.querySelector("#theform");

form.addEventListener("submit", myFunction);

function myFunction(e) {
    a = document.getElementById("text");
    e.preventDefault();
    console.log(Number(localStorage.getItem("number")));
    thenumber++;
    localStorage.setItem("number", thenumber);

    document.querySelector("#times").innerHTML =
        `Lần: ` + localStorage.getItem("number");
    localStorage.setItem("thevar", a.value);

    if (thenumber >= 10) {
        document.querySelector(".content").innerHTML = `<p>Game over!</p>
        <p>Do you wanna restart: </p>
        <button id="restart_btn">Restart</button>
        `;
        document.querySelector("#restart_btn").addEventListener("click", () => {
            localStorage.setItem("number", 0);
            thenumber = Number(localStorage.getItem("number"));
            console.log("The value of thenumber now is: " + thenumber);
            //document.location.reload();
            document.querySelector(".content").innerHTML = `<form id="theform">
        <label for="text">
            Please put input: 
        </label>
        <input type="text" name="text-input" id="text" placeholder="Query string">
        <input type="submit" value="Gửi" id="btn">
        <i style="margin: 20px">(Click đến 10!)</i>
        <p id="times">Lần: ${localStorage.getItem("number")}</p>
        </form>`;
            form = document.querySelector("#theform");
            form.addEventListener("submit", myFunction);
            document.querySelector("#text").value = localStorage.getItem("thevar");
        });
    }
}
