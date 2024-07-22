import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const SortingVisualizer = () => {
  const generateArray = () => {
    const size = 50;
    const values = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    const colors = Array.from({ length: size }, () => getRandomColor());
    return { values, colors };
  };

  const drawArray = (arr, colors) => {
    const svg = d3.select(svgRef.current);
    const width = svg.attr('width');
    const height = svg.attr('height');
    const barWidth = width / arr.length;

    svg.selectAll('*').remove(); 

    svg.selectAll('rect')
      .data(arr)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * barWidth)
      .attr('y', d => height - d * 4)
      .attr('width', barWidth - 1)
      .attr('height', d => d * 4)
      .attr('fill', (d, i) => colors[i]); 
  };

  const [array, setArray] = useState(generateArray().values);
  const [colors, setColors] = useState(generateArray().colors);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [speed, setSpeed] = useState(50);
  const [isSorted, setIsSorted] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      drawArray(array, colors);
    }
  }, [array, colors]);

  const bubbleSort = async () => {
    setIsSorted(false);
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, speed));
        }
      }
    }
    setIsSorted(true);
  };

  const insertionSort = async () => {
    setIsSorted(false);
    const arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
        setArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      arr[j + 1] = key;
      setArray([...arr]);
    }
    setIsSorted(true);
  };

  const selectionSort = async () => {
    setIsSorted(false);
    const arr = [...array];
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        setArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }
    setIsSorted(true);
  };

  const mergeSort = async () => {
    setIsSorted(false);
    const arr = [...array];
    const visualize = async (arr, left, right) => {
      if (left >= right) return;
      const middle = Math.floor((left + right) / 2);

      await visualize(arr, left, middle);
      await visualize(arr, middle + 1, right);

      merge(arr, left, middle, right);
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, speed));
    };

    const merge = (arr, left, middle, right) => {
      let leftArray = arr.slice(left, middle + 1);
      let rightArray = arr.slice(middle + 1, right + 1);

      let i = 0, j = 0, k = left;

      while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
          arr[k++] = leftArray[i++];
        } else {
          arr[k++] = rightArray[j++];
        }
      }

      while (i < leftArray.length) {
        arr[k++] = leftArray[i++];
      }

      while (j < rightArray.length) {
        arr[k++] = rightArray[j++];
      }
    };

    await visualize(arr, 0, arr.length - 1);
    setIsSorted(true);
  };

  const quickSort = async () => {
    setIsSorted(false);
    const arr = [...array];

    const partition = async (low, high) => {
      let pivot = arr[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, speed));
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, speed));
      return i + 1;
    };

    const sort = async (low, high) => {
      if (low < high) {
        let pi = await partition(low, high);
        await sort(low, pi - 1);
        await sort(pi + 1, high);
      }
    };

    await sort(0, arr.length - 1);
    setIsSorted(true);
  };

  const handleSort = async () => {
    setIsSorted(false);
    switch (algorithm) {
      case 'bubble':
        await bubbleSort();
        break;
      case 'insertion':
        await insertionSort();
        break;
      case 'selection':
        await selectionSort();
        break;
      case 'merge':
        await mergeSort();
        break;
      case 'quick':
        await quickSort();
        break;
      default:
        break;
    }
  };

  const shuffleArray = () => {
    const { values, colors } = generateArray();
    setArray(values);
    setColors(colors);
    setIsSorted(false);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <svg ref={svgRef} width="800" height="400"></svg>
      <div className="m-5 flex">
        <div className="relative group">
          <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg filter group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200"></div>
          <button
            className="relative inline-flex items-center justify-center px-5 py-2 text-base font-bold text-white transition-all duration-200 bg-gray-900 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-600 rounded"
            onClick={handleSort}
          >
            Start Sorting ({algorithm})
          </button>
        </div>

        <div className="relative h-12 w-72 min-w-[15rem] ml-10">
          <select
            onChange={(e) => setAlgorithm(e.target.value)}
            value={algorithm}
            className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
          >
            <option value="bubble">Bubble Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
          </select>
          <label className="before:content-[' '] after:content-[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Select Algorithm:
          </label>
        </div>
      </div>
      <div className="m-1 flex items-center">
      <div className="flex-col flex text-center">
        <label className="mb-2 font-sans text-sm font-normal text-blue-gray-700">Speed (ms): {speed}</label>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-64"
        />
        </div>

        <button
          className={` text-white font-semibold rounded-lg px-5 py-3 ml-10 ${isSorted ? 'bg-black' : 'bg-zinc-400'}`}
          onClick={shuffleArray}
        >
          Shuffle
        </button>
      </div>
    </div>
  );
};

export default SortingVisualizer;
