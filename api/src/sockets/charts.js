export const emit = (s, e, d) => s.emit(e, d)

export function fetchBarsChart() {
  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Grupo 1',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100)
        ]
      },
      {
        label: 'Grupo 2',
        backgroundColor: 'rgba(54,162,235,0.4)',
        borderColor: 'rgba(54,162,235,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54,162,235,0.4)',
        hoverBorderColor: 'rgba(54,162,235,1)',
        data: [
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100)
        ]
      },
      {
        label: 'Grupo 3',
        backgroundColor: 'rgba(255,206,85,0.4)',
        borderColor: 'rgba(255,206,85,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,206,85,0.4)',
        hoverBorderColor: 'rgba(255,206,85,1)',
        data: [
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100)
        ]
      }
    ]
  }
}

export function fetchLinesChart() {
  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Grupo 1',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(255, 99, 132,0.4)',
        borderColor: 'rgba(255, 99, 132,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(255, 99, 132,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(255, 99, 132,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        data: [
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100)
        ]
      },
      {
        label: 'Grupo 2',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(54,162,235,0.4)',
        borderColor: 'rgba(54,162,235,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(54,162,235,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(54,162,235,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        data: [
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100)
        ]
      },
      {
        label: 'Grupo 3',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(255,206,85,0.4)',
        borderColor: 'rgba(255,206,85,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(255,206,85,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(255,206,85,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        data: [
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100),
          randomIntIntervalerval(1, 100)
        ]
      }
    ]
  }
}

/**
 *
 *
 * @param {*} socket
 */
function subscribeBarsChart(socket, emit, time = null, fetchBarsChart) {
  let dataSize = 0
  const interval = time ? time : 2000
  if (dataSize !== 0) {
    const data = fetchBarsChart()
    const emitter = emit(socket, 'BARS_CHART', data)
    setInterval(emitter, interval)
  } else {
    // fetch data
    const data = fetchBarsChart()
    emit(socket, 'BARS_CHART', data)
    subscribeBarsChart(socket, interval)
  }
}

function subscribeLinesChart(socket, emit, time = null, fetchLinesChart) {
  let dataSize = 0
  const interval = time ? time : 2000
  if (dataSize !== 0) {
    const emitter = emit(socket, 'LINES_CHART', {})
    setInterval(emitter, interval)
  } else {
    // fetch data
    emit(socket, 'LINES_CHART', {})
    subscribeLinesChart(socket, interval)
  }
}

/**
 *
 *
 * @param {*} min
 * @param {*} max
 * @returns
 */
function randomIntIntervalerval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
