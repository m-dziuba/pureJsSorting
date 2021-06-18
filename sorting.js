"use strict";

class Algorithm {
  constructor(num = 30, delay = 300) {
    this.num = num;
    this.delay = delay;
    this.container = document.querySelector(".data-container");
    this.bars = document.querySelectorAll(".bars");
    this.array = Array.from({ length: num }, () =>
      Math.floor(Math.random() * num)
    );
  }
  generateBars() {
    for (let i = 0; i < this.num; i += 1) {
      const barWidth = this.container.offsetWidth / this.num;
      const value = this.array[i];
      const bar = document.createElement("div");
      bar.classList.add("bar");
      bar.style.width = `${barWidth}px`;
      bar.style.height = `${
        (this.container.offsetHeight / this.num) * value
      }px`;
      bar.style.border = "solid 1px";
      bar.style.transform = `translateX(${i * barWidth}px)`;
      const barLabel = document.createElement("label");
      barLabel.classList.add("bar_id");
      barLabel.innerHTML = value.toString();
      bar.appendChild(barLabel);
      this.container.appendChild(bar);
    }
    this.bars = document.querySelectorAll(".bar");
  }

  inspected(index) {
    this.bars[index].setAttribute("class", "bar inspected");
  }

  compared(index) {
    this.bars[index].setAttribute("class", "bar compared");
  }

  finished(index) {
    this.bars[index].setAttribute("class", "bar finished");
  }

  unmark(index) {
    this.bars[index].setAttribute("class", "bar");
  }

  async pause() {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, this.delay)
    );
  }

  compare(index1, index2) {
    let value1 = parseInt(this.bars[index1].firstChild.innerHTML, 10);
    let value2 = parseInt(this.bars[index2].firstChild.innerHTML, 10);
    return value1 > value2;
  }

  swap(index1, index2) {
    let value1 = parseInt(this.bars[index1].firstChild.innerHTML, 10);
    let value2 = parseInt(this.bars[index2].firstChild.innerHTML, 10);
    this.bars[index1].firstChild.innerHTML = value2;
    this.bars[index1].style.height = `${
      (this.container.offsetHeight / this.num) * value2
    }px`;
    this.bars[index2].firstChild.innerHTML = value1;
    this.bars[index2].style.height = `${
      (this.container.offsetHeight / this.num) * value1
    }px`;
  }

  move(whereTo, index) {
    this.bars[index].style.transform = `translateX(${
      whereTo * this.barWidth
    }px)`;
    for (let i = whereTo + 1; i < this.bars.length; i++) {
      this.bars[i].style.transform = `translateX(${i * this.barWidth}px)`;
    }
    console.log("moved");
  }

  enableButtons() {
    document.getElementById("Button1").disabled = false;
    document.getElementById("Button1").style.backgroundColor = "#6f459e";

    // To enable the button "Selection Sort" after final(sorted)
    document.getElementById("Button2").disabled = false;
    document.getElementById("Button2").style.backgroundColor = "#6f459e";
  }

  async selectionSort() {
    let minIndex = 0;
    for (let i = 0; i < this.bars.length; i++) {
      minIndex = i;
      this.compared(i);
      for (let j = i + 1; j < this.bars.length; j++) {
        this.inspected(j);

        await this.pause(300);

        if (this.compare(minIndex, j)) {
          if (minIndex !== i) {
            this.unmark(minIndex);
          }
          minIndex = j;
        } else {
          this.unmark(j);
        }
      }
      this.swap(i, minIndex);
      await this.pause(300);
      this.unmark(minIndex);
      this.finished(i);
    }
    this.enableButtons();
  }

  async bubbleSort() {
    let swapping = true;
    let passes = 0;

    // To enable the button "Selection Sort" after final(sorted)
    document.getElementById("Button2").disabled = false;
    document.getElementById("Button2").style.backgroundColor = "#6f459e";
  }
}

let algo = new Algorithm(30, 300);
algo.generateBars();

function generate() {
  window.location.reload();
}

// function disable() {
// document.getElementById("Button1").disabled = true;
// document.getElementById("Button1").style.backgroundColor = "#d8b6ff";
//
// document.getElementById("Button2").disabled = true;
// document.getElementById("Button2").style.backgroundColor = "#d8b6ff";
// }
