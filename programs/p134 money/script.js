





const tau = 2 * Math.PI;

function get(selector) {
  return document.getElementById(selector);
}


get("bet_button").onclick = function() {

    total = 0

    for(i = 0; i < 100; i++) {
        if (Math.random() < 0.5) {
            total += 15
        } else {
            total -= 10
        }
    }

    get("bet_result").innerHTML = "$" + total
}

get("funny").onclick = function() {
    get("funny_target").innerHTML = "gotcha"
}