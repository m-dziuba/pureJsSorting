"use strict";
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

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

  compare(index1, index2) {
    let value1 = this.array[index1];
    let value2 = this.array[index2];
    if (value1 > value2) {
      return true;
    } else if (value1 >= value2) {
      return "largerOrEqual";
    }
    return value1 > value2;
  }

  swap(index1, index2) {
    [this.array[index1], this.array[index2]] = [
      this.array[index2],
      this.array[index1],
    ];
    this.generateBars();
  }

  enableButtons() {
    document.getElementById("Button1").disabled = false;
    document.getElementById("Button1").style.backgroundColor = "#6f459e";

    document.getElementById("Button2").disabled = false;
    document.getElementById("Button2").style.backgroundColor = "#6f459e";
  }

  async selectionSort() {
    let minIndex = 0;
    for (let i = 0; i < this.array.length; i++) {
      minIndex = i;
      this.inspected(i);
      for (let j = i + 1; j < this.array.length; j++) {
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
      for (let i = 0; i < this.array.length - passes - 1; i++) {
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
      this.finished(this.array.length - passes - 1);
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

    for (let i = 0; i < this.array.length; i++) {
      this.finished(i);
      await this.pause(1);
    }
  }

  async mergeSort(startIndex = null, endIndex = null) {
    if (startIndex === null) {
      [startIndex, endIndex] = [0, this.array.length];
    }
    if (endIndex - startIndex > 1) {
      let middleIndex = Math.floor((endIndex + startIndex) / 2);
      await this.mergeSort(startIndex, middleIndex);
      await this.mergeSort(middleIndex, endIndex);
      let i = 0;
      let j = 0;
      for (let k = startIndex; k < endIndex; k++) {
        this.inspected(k);
        if (i + 1 < endIndex - startIndex && j * 2 < endIndex - startIndex) {
          this.compared(middleIndex + j);
          await this.pause();
          if (this.array[startIndex + i] < this.array[middleIndex + j]) {
            i++;
          } else {
            this.array.insert(k, this.array[middleIndex + j]);
            i++;
            j++;
            this.array.splice(middleIndex + j, 1);
            this.generateBars();
          }
        }
        this.unmark(k);
      }
    }
  }

  async quickSort(startIndex = null, endIndex = null) {
    if (startIndex === null) {
      [startIndex, endIndex] = [0, this.array.length - 1];
    }
    if (endIndex - startIndex > 0) {
      let pivot = this.array[endIndex];

      this.inspected(endIndex);
      let i = startIndex;

      for (let j = startIndex; j < endIndex; j++) {
        this.compared(j);
        this.compared(i);
        await this.pause();
        if (this.array[j] < pivot) {
          i++;

          [this.array[i - 1], this.array[j]] = [
            this.array[j],
            this.array[i - 1],
          ];
          this.generateBars();
        }
        this.unmark(i);
        this.unmark(j);
        await this.pause();
      }
      [this.array[i], this.array[endIndex]] = [
        this.array[endIndex],
        this.array[i],
      ];
      this.generateBars();
      await this.quickSort(startIndex, i - 1);
      await this.quickSort(i + 1, endIndex);
    }
  }
}

let algo = new Algorithm(300, 1);
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
