const container = document.querySelector(".data-container");
const containerWidth = container.offsetWidth
const containerHeight = container.offsetHeight


class Algorithm {
  constructor (num = 30) {
    this.array = Array.from({length: num}, () => Math.floor(Math.random() * num));
  }
}


function generateBars(num = 30) {
  const array = Array.from({length: num}, () => Math.floor(Math.random() * num));
  for (let i = 0; i < num; i += 1) {
    const barWidth = containerWidth / num
    const value = array[i]
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.width = `${barWidth}px`
    bar.style.height = `${containerHeight / num * value}px`;
    bar.style.transform = `translateX(${i * barWidth}px)`;
    const barLabel = document.createElement("label");
    barLabel.classList.add("bar_id");
    barLabel.innerHTML = value.toString();
    bar.appendChild(barLabel);
    container.appendChild(bar);
  }
}

async function SelectionSort(delay = 300) {
  let bars = document.querySelectorAll(".bar");
  let minIndex = 0;
  for (let i = 0; i < bars.length; i++) {
    minIndex = i;
    bars[i].style.backgroundColor = "darkblue";
    for (let j = i + 1; j < bars.length; j += 1) {
      bars[j].style.backgroundColor = "red";

      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, delay)
      );
      console.log(bars[j].firstChild.innerHTML)

      let val1 = parseInt(bars[j].firstChild.innerHTML, 10);
      let val2 = parseInt(bars[minIndex].firstChild.innerHTML, 10);

      if (val1 < val2) {
        if (minIndex !== i) {
          bars[minIndex].style.backgroundColor = "  rgb(24, 190, 255)";
        }
        minIndex = j;
      } else {
        bars[j].style.backgroundColor = "  rgb(24, 190, 255)";
      }
    }

    let temp1 = bars[minIndex].style.height;
    let temp2 = bars[minIndex].firstChild.innerHTML;
    bars[minIndex].style.height = bars[i].style.height;
    bars[i].style.height = temp1;
    bars[minIndex].firstChild.innerText = bars[i].firstChild.innerHTML;
    bars[i].firstChild.innerText = temp2;

    await new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, delay)
    );

    // Provide skyblue color to the (min-idx)th bar
    bars[minIndex].style.backgroundColor = "  rgb(24, 190, 255)";

    // Provide lightgreen color to the ith bar
    bars[i].style.backgroundColor = " rgb(49, 226, 13)";
  }
  document.getElementById("Button1").disabled = false;
  document.getElementById("Button1").style.backgroundColor = "#6f459e";

  // To enable the button "Selection Sort" after final(sorted)
  document.getElementById("Button2").disabled = false;
  document.getElementById("Button2").style.backgroundColor = "#6f459e";
}

generateBars();

function generate() {
  window.location.reload();
}
function disable() {
  document.getElementById("Button1").disabled = true;
  document.getElementById("Button1").style.backgroundColor = "#d8b6ff";

  document.getElementById("Button2").disabled = true;
  document.getElementById("Button2").style.backgroundColor = "#d8b6ff";
}