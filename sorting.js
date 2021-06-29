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
    for (let i = from; i < to; i += 1) {
      this.drawOneBar(i);
    }
  }

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
  constructor() {
    this.delay = 100;
    this.array = this.setArray();
    this.algorithm = this.selectionSort;
    this.visualizer = new Visualizer(this.array, this.delay);
  }

  setArray() {
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
  }

  sort() {
    const visualizer = this.visualizer;
    const sort = this.algorithm();
    const animate = () => {
      setTimeout(() => {
        requestAnimationFrame(animate);
        visualizer.generateBars();
        sort.next();
      }, this.delay);
    };
    animate();
  }

  *selectionSort() {
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
        yield i;
      }
    }
  }

  *bubbleSort() {
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
      yield swapping;
      passes += 1;
    }
  }

  *insertionSort() {
    for (let i = 1; i < this.array.length; i++) {
      for (let j = i; j > 0 && this.array[j] < this.array[j - 1]; j--) {
        [this.array[j], this.array[j - 1]] = [this.array[j - 1], this.array[j]];
      }
      yield i;
    }
  }

  *mergeSort() {
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
        yield step;
      }
      step *= 2;
    }
  }

  *quickSort(startIndex = null, endIndex = null) {
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
      }
      [this.array[i], this.array[endIndex]] = [
        this.array[endIndex],
        this.array[i],
      ];
      yield 1;
      yield* this.quickSort(startIndex, i - 1);
      yield* this.quickSort(i + 1, endIndex);
    }
  }
}

let algo = new Algorithm(1);
algo.setArray();

function generate() {
  window.location.reload();
}
