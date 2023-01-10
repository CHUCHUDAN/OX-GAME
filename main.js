
//狀態機
const GAME_STATE = {
  ReadyStartState: 'ReadyStartState',
  CircleState: 'CircleState',
  ForkState: 'ForkState',
  // GameResetState: 'GameResetState',
  GameFinishState: 'GameFinishState',
  GameDrawState: 'GameDrawState'
}

const view = {
  //將OX顯示在網頁上
  renderpicture(target) {
    if (controller.currentState === 'CircleState') {
      target.innerText = 'O'
      model.symbol = 'O'
      controller.currentState = GAME_STATE.ForkState
    } else if (controller.currentState === 'ForkState') {
      target.innerText = 'X'
      target.classList.add('Xtitle')
      model.symbol = 'X'
      controller.currentState = GAME_STATE.CircleState
    }
    this.renderTitle()
    model.pushArray()
    controller.checkWinner()
  },
  //顯示彈跳視窗
  renderPopUpWindow() {
    const div = document.createElement('div')
    div.classList.add('pop-up-window')
    if (controller.currentState === GAME_STATE.ReadyStartState) {
      div.innerHTML = `
        <p>What do you want to Choose?</p>
        <button class='pop-up-button' id='O-button' type="button">O</button>
        <button class='pop-up-button' id='X-button' type="button">X</button>
    `
    } else if (controller.currentState === GAME_STATE.GameFinishState) {
      div.innerHTML = `
        <p>GAME OVER</p>
        <p>The winner is ${model.symbol}</p>
    `
    } else if (controller.currentState === GAME_STATE.GameDrawState) {
      div.innerHTML = `
        <p>GAME OVER</p>
        <p>No one won the game</p>
    `
    }
    const header = document.querySelector('header')
    header.before(div)
  },
  //顯示標題
  renderTitle() {
    const header = document.querySelector('header')
    if (controller.currentState === GAME_STATE.CircleState) {
      header.innerHTML = `
      <h1 class='title'>It's <span class='Otitle'>O</span> turn</h1>
    `
    } else if (controller.currentState === GAME_STATE.ForkState) {
      header.innerHTML = `
      <h1 class='title'>It's <span class='Xtitle'>X</span> turn</h1>
    `
    }
  },
  //重置標題
  resetTitle() {
    const header = document.querySelector('header')
    header.innerHTML = `
        <h1 class="title">Let's Start The Game</h1>
    `
  },
  //重置遊戲介面
  resetGameRender() {
    const table = document.querySelector('table')
    table.innerHTML = `
      <tr>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    `
    if (controller.currentState === GAME_STATE.GameFinishState || controller.currentState === GAME_STATE.GameDrawState) {
      const popUpWindow = document.querySelector('.pop-up-window')
      popUpWindow.remove()
    }
  },
  //轉換start button狀態
  changeStartButton() {
    const startButton = document.querySelector('#startButton')
    if (startButton.matches('.disabled')) {
      startButton.classList.remove('disabled')
      startButton.removeAttribute("disabled")
    } else {
      startButton.classList.add('disabled')
      startButton.setAttribute("disabled", "")
    }
  }
}

const controller = {
  //遊戲狀態
  currentState: GAME_STATE.ReadyStartState,
  //遊戲啟動函式
  startgame(target) {
    if (target.innerText !== '') return
    view.renderpicture(target)
  },
  //檢查水平線獲勝
  checkVertical(rows, symbol) {
    return rows.some(cells => cells.every(cell => cell === symbol))
  },
  //檢查垂直線獲勝
  checkHorizontal(rows, symbol) {
    const cellLength = rows[0].length
    const rowLength = rows.length
    for (let cellIndex = 0; cellIndex < cellLength; cellIndex++) {
      for (let rowIndex = 0; rowIndex < rowLength; rowIndex++) {
        if (rows[rowIndex][cellIndex] !== symbol) break
        if (rowIndex === rowLength - 1) { return true }
      }
    }
    return false
  },
  //檢查對角線獲勝
  checkDiagonal(rows, symbol) {
    if (rows[0][0] === symbol && rows[1][1] === symbol && rows[2][2] === symbol) return true
    if (rows[2][0] === symbol && rows[1][1] === symbol && rows[0][2] === symbol) return true
  },
  //檢查獲勝者
  checkWinner() {
    if (this.checkVertical(model.outcomeArray, model.symbol) ||
      this.checkHorizontal(model.outcomeArray, model.symbol) ||
      this.checkDiagonal(model.outcomeArray, model.symbol)) {
      this.currentState = GAME_STATE.GameFinishState
      view.renderPopUpWindow()
    } else if (!model.outcomeArray.some(cells => cells.includes(''))) {
      this.currentState = GAME_STATE.GameDrawState
      view.renderPopUpWindow()
    }
  }
}
const model = {
  symbol: '',
  outcomeArray: [],
  //將目前<td>標籤中的元素放入二維陣列
  pushArray() {
    this.outcomeArray = []
    document.querySelectorAll('tr').forEach(event => {
      const array = []
      const childrenArray = Array.from(event.children)
      childrenArray.forEach(element => {
        array.push(element.textContent)
      })
      this.outcomeArray.push(array)
    })
  }
}

//監聽器

//監聽start按鈕點擊事件
startButton.addEventListener('click', event => {
  view.renderPopUpWindow()
  const popUpWindow = document.querySelector('.pop-up-window')
  popUpWindow.addEventListener('click', event => {
    const target = event.target
    if (target.tagName !== 'BUTTON') return
    if (target.matches('#O-button')) {
      controller.currentState = GAME_STATE.CircleState
    } else if (target.matches('#X-button')) {
      controller.currentState = GAME_STATE.ForkState
    }
    event.target.parentElement.remove()
    view.changeStartButton()
  })
})


//監聽圈圈叉叉遊戲框內點擊事件
document.querySelector(".square").addEventListener('click', event => {
  const target = event.target
  if (controller.currentState !== GAME_STATE.CircleState && controller.currentState !== GAME_STATE.ForkState) return
  if (target.tagName === 'TD') {
    controller.startgame(target)
  }
})

//監聽reset按鈕點擊事件
document.querySelector('#resetButton').addEventListener('click', event => {
  if (controller.currentState === GAME_STATE.ReadyStartState) return
  view.resetTitle()
  view.resetGameRender()
  view.changeStartButton()
  controller.currentState = GAME_STATE.ReadyStartState
})