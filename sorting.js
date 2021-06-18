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
    this.container.innerHTML = "";
    const svgNs = "http://www.w3.org/2000/svg";
    const maxHeight = this.container.offsetHeight;
    const maxWidth = this.container.offsetWidth;
    const barWidth = maxWidth / this.num;

    const svgCanvas = document.createElementNS(svgNs, "svg");
    svgCanvas.setAttribute("height", `${maxHeight}`);
    svgCanvas.setAttribute("width", `${maxWidth}`);
    svgCanvas.setAttribute("id", "svgOne");
    this.container.appendChild(svgCanvas);

    for (let i = 0; i < this.num; i += 1) {
      const bar = document.createElementNS(svgNs, "rect");
      const value = this.array[i];

      bar.setAttribute("width", `${barWidth}`);
      bar.setAttribute("height", `${(maxHeight / this.num) * value}`);
      bar.setAttribute("x", `${i * barWidth}`);
      bar.setAttribute("y", `${maxHeight - (maxHeight / this.num) * value}`);
      bar.setAttribute("class", "bar");

      document.getElementById("svgOne").appendChild(bar);
    }
    this.bars = document.querySelectorAll(".bar");
  }

  inspected(index) {
    console.log(this.bars);
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

  pause = (delay = this.delay) => new Promise((res) => setTimeout(res, delay));

  evaluate(index) {
    return parseInt(this.bars[index].firstChild.innerHTML, 10);
  }

  compare(index1, index2) {
    let value1 = this.evaluate(index1);
    let value2 = this.evaluate(index2);
    if (value1 > value2) {
      return true;
    } else if (value1 >= value2) {
      console.log("largerOrEqual");
      return "largerOrEqual";
    }
    return value1 > value2;
  }

  swap(index1, index2) {
    let value1 = this.evaluate(index1);
    let value2 = this.evaluate(index2);
    this.bars[index1].firstChild.innerHTML = value2;
    this.bars[index1].style.height = `${
      (this.container.offsetHeight / this.num) * value2
    }px`;
    this.bars[index2].firstChild.innerHTML = value1;
    this.bars[index2].style.height = `${
      (this.container.offsetHeight / this.num) * value1
    }px`;
  }

  enableButtons() {
    document.getElementById("Button1").disabled = false;
    document.getElementById("Button1").style.backgroundColor = "#6f459e";

    document.getElementById("Button2").disabled = false;
    document.getElementById("Button2").style.backgroundColor = "#6f459e";
  }

  async selectionSort() {
    let minIndex = 0;
    for (let i = 0; i < this.bars.length; i++) {
      minIndex = i;
      this.inspected(i);
      for (let j = i + 1; j < this.bars.length; j++) {
        this.compared(j);

        await this.pause();

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

    while (swapping) {
      swapping = false;
      for (let i = 0; i < this.bars.length - passes - 1; i++) {
        this.compared(i);
        this.inspected(i + 1);

        await this.pause();

        if (this.compare(i, i + 1)) {
          this.swap(i, i + 1);
          swapping = true;
          await this.pause();
        }
        this.unmark(i);
        this.inspected(i + 1);
        await this.pause();
      }
      this.finished(this.bars.length - passes - 1);
      passes += 1;
    }
  }

  async insertionSort() {
    for (let i = 1; i < this.array.length; i++) {
      for (let j = i; j > 0 && this.array[j] < this.array[j - 1]; j--) {
        this.unmark(j);
        this.inspected(i);
        this.compared(j - 1);
        await this.pause();
        [this.array[j], this.array[j - 1]] = [this.array[j - 1], this.array[j]];
      }
      this.generateBars();
      this.unmark(i);
    }

    for (let i = 0; i < this.bars.length; i++) {
      this.finished(i);
      await this.pause(1);
    }
  }

  async mergeSort(startIndex = null, endIndex = null) {
    if (startIndex === null) {
      [startIndex, endIndex] = [0, this.bars.length];
    }
    if (endIndex - startIndex > 1) {
      let middleIndex = Math.round((endIndex + startIndex) / 2);
      await this.mergeSort(startIndex, middleIndex);
      await this.mergeSort(middleIndex, endIndex);
      let i = 0;
      let j = 0;
      for (let k = startIndex; k < endIndex; k++) {
        this.inspected(k);
        if (i + 1 < endIndex - startIndex && j * 2 < endIndex - startIndex) {
          this.compared(middleIndex + j);
          await this.pause();
          if (this.evaluate(startIndex + i) < this.evaluate(middleIndex + j)) {
            i++;
          } else {
            for (let i = k; i > middleIndex + j; i--) {
              this.swap(k - 1, k);
              i++;
              j++;
            }
          }
        }
        this.unmark(k);
      }
    }
  }
}

let algo = new Algorithm(200, 0);
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
