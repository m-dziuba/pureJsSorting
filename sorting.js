class Visualizer {
  constructor(array, delay) {
    this.array = array;
    this.delay = delay;
    this.container = document.querySelector(".data-container");
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.maxHeight = Number(this.container.offsetHeight);
    this.maxWidth = Number(this.container.offsetWidth);
    this.width = Number(Math.floor(this.maxWidth / this.array.length));
  }

  init() {
    const selectArraySize = document.getElementById("array-size");
    if (!selectArraySize.length) {
      const breakpoints = [0.1, 0.25, 0.5, 0.75, 1];
      for (let i = 0; i < breakpoints.length; i++) {
        let option = document.createElement("option");
        option.text = `${breakpoints[i] * 100}%`;
        option.value = `${Math.floor(breakpoints[i] * this.maxWidth)}`;
        if (breakpoints[i] === 1) {
          option.selected = true;
        }
        selectArraySize.add(option);
      }
    }

    this.container.innerHTML = "";
    this.width = Number(Math.floor(this.maxWidth / this.array.length));
    this.canvas.setAttribute("height", `${this.maxHeight}`);
    this.canvas.setAttribute("width", `${this.array.length * this.width}`);
    this.container.appendChild(this.canvas);
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

  rainbow(index) {
    const h = Math.floor((360 / this.maxHeight) * this.height(index));
    return "hsl(" + h + ",100%,50%)";
  }

  drawOneBar(index) {
    this.context.clearRect(this.x(index), 0, this.width, this.maxHeight);
    this.context.fillStyle = this.rainbow(index);
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
    const that = this;
    return new Promise((resolve) => {
      setTimeout(function () {
        for (let i = from; i < to; i += 1) {
          that.drawOneBar(i);
        }
        resolve();
      }, this.delay);
    });
  }

  toggleSettings() {
    const arraySize = document.getElementById("array-size");
    const algorithm = document.getElementById("algorithm");
    const delay = document.getElementById("delay");
    const newArrayButton = document.getElementById("array-btn");
    const sortButton = document.getElementById("algorithm-btn");
    const restartButton = document.getElementById("reset-btn");

    newArrayButton.hidden = !newArrayButton.hidden;
    restartButton.hidden = !restartButton.hidden;
    sortButton.disabled = !sortButton.disabled;
    arraySize.disabled = !arraySize.disabled;
    algorithm.disabled = !algorithm.disabled;
    delay.disabled = !delay.disabled;
  }
}

class Algorithm {
  constructor() {
    this.delay = 0;
    this.array = this.setArray();
    this.visualizer = new Visualizer(this.array, this.delay);
    this.algorithm = this.selectionSort;
  }

  setArray() {
    const arraySize = parseInt(document.getElementById("array-size").value, 10);
    const array = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * arraySize)
    );
    if (this.visualizer) {
      this.visualizer.array = array;
      this.visualizer.init();
      this.visualizer.generateBars().then();
    }

    if (!this.array) {
      return array;
    }
    this.array = array;
  }

  setAlgorithm() {
    const selectedAlgorithm = document.getElementById("algorithm").value;
    this.setArray();
    if (selectedAlgorithm === "selection") {
      this.algorithm = this.selectionSort;
    } else if (selectedAlgorithm === "bubble") {
      this.algorithm = this.bubbleSort;
    } else if (selectedAlgorithm === "insertion") {
      this.algorithm = this.insertionSort;
    } else if (selectedAlgorithm === "merge") {
      this.algorithm = this.mergeSort;
    } else if (selectedAlgorithm === "quick") {
      this.algorithm = this.quickSort;
    }
  }

  setDelay() {
    this.delay = parseInt(document.getElementById("delay").value);
    this.visualizer.delay = this.delay;
  }

  reset() {
    location.reload();
  }

  async handleClickOnSort() {
    this.visualizer.toggleSettings();
    await this.algorithm();
    this.visualizer.toggleSettings();
  }

  async selectionSort() {
    let minIndex = 0;
    for (let i = 0; i < this.array.length; i++) {
      minIndex = i;
      for (let j = i + 1; j < this.array.length; j++) {
        if (this.array[minIndex] > this.array[j]) {
          if (minIndex !== i) {
          }
          minIndex = j;
        } else {
        }
      }
      if (i !== minIndex) {
        [this.array[i], this.array[minIndex]] = [
          this.array[minIndex],
          this.array[i],
        ];
        await this.visualizer.generateBars();
      }
    }
  }

  async bubbleSort() {
    let swapping = true;
    let passes = 0;

    while (swapping) {
      swapping = false;
      for (let i = 0; i < this.array.length - passes - 1; i++) {
        if (this.array[i] > this.array[i + 1]) {
          [this.array[i], this.array[i + 1]] = [
            this.array[i + 1],
            this.array[i],
          ];
          swapping = true;
        }
      }
      await this.visualizer.generateBars();
      passes += 1;
    }
  }

  async insertionSort() {
    for (let i = 1; i < this.array.length; i++) {
      for (let j = i; j > 0 && this.array[j] < this.array[j - 1]; j--) {
        [this.array[j], this.array[j - 1]] = [this.array[j - 1], this.array[j]];
      }
      await this.visualizer.generateBars();
    }
  }

  async mergeSort() {
    const merge = (array, left, step) => {
      let right = left + step;
      let end = Math.min(left + step * 2 - 1, array.length - 1);
      let leftIndex = left;
      let rightIndex = right;
      let temp = [];

      for (let i = left; i <= end; i++) {
        if (
          (array[leftIndex] <= array[rightIndex] || rightIndex > end) &&
          leftIndex < right
        ) {
          temp[i] = array[leftIndex];
          leftIndex++;
        } else {
          temp[i] = array[rightIndex];
          rightIndex++;
        }
      }
      for (let j = left; j <= end; j++) {
        array[j] = temp[j];
      }
    };

    let step = 1;
    while (step < this.array.length) {
      let left = 0;
      while (left + step < this.array.length) {
        merge(this.array, left, step);
        left += step * 2;
        await this.visualizer.generateBars();
      }
      step *= 2;
    }
  }

  async quickSort(startIndex = null, endIndex = null) {
    if (startIndex === null) {
      [startIndex, endIndex] = [0, this.array.length - 1];
    }
    if (endIndex - startIndex > 0) {
      let pivot = this.array[endIndex];

      let i = startIndex;

      for (let j = startIndex; j < endIndex; j++) {
        if (this.array[j] < pivot) {
          i++;
          [this.array[i - 1], this.array[j]] = [
            this.array[j],
            this.array[i - 1],
          ];
        }
        await this.visualizer.generateBars();
      }
      [this.array[i], this.array[endIndex]] = [
        this.array[endIndex],
        this.array[i],
      ];
      await this.visualizer.generateBars();
      await this.quickSort(startIndex, i - 1);
      await this.quickSort(i + 1, endIndex);
    }
  }
}

let algo = new Algorithm();
algo.visualizer.init();
algo.setArray();
