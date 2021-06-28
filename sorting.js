"use strict";
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

class Visualizer {
  constructor(array, delay) {
    this.array = array;
    this.delay = delay;
    this.container = document.querySelector(".data-container");
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.maxHeight = Number(this.container.offsetHeight);
    this.maxWidth = Number(this.container.offsetWidth);
    this.width = 0;
  }

  init() {
    this.container.innerHTML = "";
    this.width = Number(Math.floor(this.maxWidth / this.array.length));
    this.canvas.setAttribute("height", `${this.maxHeight}`);
    this.canvas.setAttribute("width", `${this.array.length * this.width}`);
    this.container.appendChild(this.canvas);
    this.context.fillStyle = "rgb(24, 190, 255)";
    this.context.save();
  }

  x(index) {
    return this.width * index;
  }

  y(index) {
    return (
      this.maxHeight - (this.maxHeight / this.array.length) * this.array[index]
    );
  }

  height(index) {
    return (this.maxHeight / this.array.length) * this.array[index];
  }

  drawOneBar(index) {
    this.context.clearRect(this.x(index), 0, this.width, this.maxHeight);
    this.context.beginPath();
    this.context.rect(
      this.x(index),
      this.y(index),
      this.width,
      this.height(index)
    );
    this.context.fill();
    this.context.restore();
  }

  generateBars(from = 0, to = this.array.length) {
    for (let i = from; i < to; i += 1) {
      this.drawOneBar(i);
    }
  }

  inspected(index) {
    this.context.save();
    this.context.fillStyle = "darkblue";
    this.drawOneBar(index);
  }

  compared(index) {
    this.context.save();
    this.context.fillStyle = "red";
    this.drawOneBar(index);
  }

  finished(index) {
    this.context.save();
    this.context.fillStyle = "green";
    this.drawOneBar(index);
  }

  unmark(index) {
    this.drawOneBar(index);
  }

  pause = (delay = this.delay) => new Promise((res) => setTimeout(res, delay));

  enableButtons() {
    document.getElementById("Button1").disabled = false;
    document.getElementById("Button1").style.backgroundColor = "#6f459e";

    document.getElementById("Button2").disabled = false;
    document.getElementById("Button2").style.backgroundColor = "#6f459e";
  }

  disableButtons() {
    document.getElementById("Button1").disabled = true;
    document.getElementById("Button1").style.backgroundColor = "#d8b6ff";

    document.getElementById("Button2").disabled = true;
    document.getElementById("Button2").style.backgroundColor = "#d8b6ff";
  }
}

class Algorithm {
  constructor(delay = 300) {
    this.array = this.setArraySize();
    this.algorithm = this.selectionSort;
    this.visualizer = new Visualizer(this.array, delay);
  }

  setArraySize() {
    const arraySize = parseInt(document.getElementById("arraySize").value, 10);
    const array = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * arraySize)
    );
    if (this.visualizer) {
      this.visualizer.array = array;
      this.visualizer.init();
      this.visualizer.generateBars();
    }

    if (!this.array) {
      return array;
    }
    this.array = array;
  }

  setAlgorithm() {
    const algorithm = document.getElementById("algorithm").value;
    this.setArraySize();
    if (algorithm === "selection") {
      console.log(1);
      this.algorithm = this.selectionSort;
    } else if (algorithm === "bubble") {
      console.log(2);
      this.algorithm = this.bubbleSort;
    } else if (algorithm === "insertion") {
      this.algorithm = this.insertionSort;
    } else if (algorithm === "merge") {
      this.algorithm = this.mergeSort;
    } else if (algorithm === "quick") {
      this.algorithm = this.quickSort;
    }
  }

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
    this.visualizer.generateBars();
  }

  async selectionSort() {
    let minIndex = 0;
    for (let i = 0; i < this.array.length; i++) {
      minIndex = i;
      this.visualizer.inspected(i);
      for (let j = i + 1; j < this.array.length; j++) {
        this.visualizer.compared(j);
        await this.visualizer.pause();

        if (this.compare(minIndex, j)) {
          if (minIndex !== i) {
            this.visualizer.unmark(minIndex);
          }
          minIndex = j;
        } else {
          this.visualizer.unmark(j);
        }
      }
      this.swap(i, minIndex);
      await this.visualizer.pause(300);
      this.visualizer.unmark(minIndex);
      this.visualizer.finished(i);
    }
  }

  async bubbleSort() {
    let swapping = true;
    let passes = 0;

    while (swapping) {
      swapping = false;
      for (let i = 0; i < this.array.length - passes - 1; i++) {
        this.visualizer.compared(i);
        this.visualizer.inspected(i + 1);

        await this.visualizer.pause();

        if (this.compare(i, i + 1)) {
          this.swap(i, i + 1);
          swapping = true;
          await this.visualizer.pause();
        }
        this.visualizer.unmark(i);
        this.visualizer.inspected(i + 1);
        await this.visualizer.pause();
      }
      this.visualizer.finished(this.array.length - passes - 1);
      passes += 1;
    }
  }

  async insertionSort() {
    for (let i = 1; i < this.array.length; i++) {
      for (let j = i; j > 0 && this.array[j] < this.array[j - 1]; j--) {
        this.visualizer.unmark(j);
        this.visualizer.inspected(i);
        this.visualizer.compared(j - 1);
        await this.visualizer.pause();
        [this.array[j], this.array[j - 1]] = [this.array[j - 1], this.array[j]];
      }
      this.visualizer.generateBars();
      this.visualizer.unmark(i);
    }

    for (let i = 0; i < this.array.length; i++) {
      this.visualizer.finished(i);
      await this.visualizer.pause(1);
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
        this.visualizer.inspected(k);
        if (i + 1 < endIndex - startIndex && j * 2 < endIndex - startIndex) {
          this.visualizer.compared(middleIndex + j);
          await this.visualizer.pause();
          if (this.array[startIndex + i] < this.array[middleIndex + j]) {
            i++;
          } else {
            this.array.insert(k, this.array[middleIndex + j]);
            i++;
            j++;
            this.array.splice(middleIndex + j, 1);
            this.visualizer.generateBars(k, middleIndex + j);
          }
        }
        this.visualizer.unmark(k);
      }
    }
  }

  async quickSort(startIndex = null, endIndex = null) {
    if (startIndex === null) {
      [startIndex, endIndex] = [0, this.array.length - 1];
    }
    if (endIndex - startIndex > 0) {
      let pivot = this.array[endIndex];

      this.visualizer.inspected(endIndex);
      let i = startIndex;

      for (let j = startIndex; j < endIndex; j++) {
        this.visualizer.compared(j);
        this.visualizer.compared(i);
        await this.visualizer.pause();
        if (this.array[j] < pivot) {
          i++;

          [this.array[i - 1], this.array[j]] = [
            this.array[j],
            this.array[i - 1],
          ];
          this.visualizer.generateBars();
        }
        this.visualizer.unmark(i);
        this.visualizer.unmark(j);
        await this.visualizer.pause();
      }
      [this.array[i], this.array[endIndex]] = [
        this.array[endIndex],
        this.array[i],
      ];
      this.visualizer.generateBars();
      await this.quickSort(startIndex, i - 1);
      await this.quickSort(i + 1, endIndex);
    }
  }
}

const arraySize = document.getElementById("arraySize");
let algo = new Algorithm(0);
algo.setArraySize();

function generate() {
  window.location.reload();
}
