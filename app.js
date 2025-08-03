class PathfindingVisualizer {
  constructor() {
    this.grid = []
    this.gridElement = document.getElementById("grid")
    this.rows = 20
    this.cols = 50
    this.startNode = null
    this.endNode = null
    this.isMouseDown = false
    this.isRunning = false
    this.currentAlgorithm = "bfs"
    this.animationSpeed = 50
    this.animationId = null // For canceling animations

    // Statistics
    this.nodesVisited = 0
    this.pathLength = 0
    this.startTime = 0

    // Cache DOM elements
    this.elements = {
      algorithmSelect: document.getElementById("algorithm-select"),
      speedSlider: document.getElementById("speed-slider"),
      speedValue: document.getElementById("speed-value"),
      startBtn: document.getElementById("start-btn"),
      clearBtn: document.getElementById("clear-btn"),
      resetBtn: document.getElementById("reset-btn"),
      stats: document.getElementById("stats"),
      nodesVisited: document.getElementById("nodes-visited"),
      pathLength: document.getElementById("path-length"),
      timeTaken: document.getElementById("time-taken"),
    }

    this.initializeGrid()
    this.setupEventListeners()
    this.adjustGridSize()
  }

  adjustGridSize() {
    // Calculate optimal grid size based on screen width
    if (window.innerWidth < 480) {
      this.rows = 15
      this.cols = 25
    } else if (window.innerWidth < 768) {
      this.rows = 18
      this.cols = 35
    } else if (window.innerWidth < 1200) {
      this.rows = 20
      this.cols = 40
    } else {
      this.rows = 20
      this.cols = 50
    }

    // Only reinitialize if size actually changed
    const currentCols = this.gridElement.style.gridTemplateColumns
    const expectedCols = `repeat(${this.cols}, 1fr)`

    if (currentCols !== expectedCols) {
      this.initializeGrid()
    }
  }

  initializeGrid() {
    // Store current start/end positions if they exist
    let startPos = null
    let endPos = null

    if (this.startNode) {
      startPos = { row: this.startNode.row, col: this.startNode.col }
    }
    if (this.endNode) {
      endPos = { row: this.endNode.row, col: this.endNode.col }
    }

    // Clear existing grid and event listeners
    this.clearEventListeners()
    this.gridElement.innerHTML = ""
    this.grid = []
    this.startNode = null
    this.endNode = null

    // Set grid template
    this.gridElement.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`
    this.gridElement.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`

    // Create grid nodes with cached elements
    this.cellElements = new Map() // Cache cell elements

    for (let row = 0; row < this.rows; row++) {
      const currentRow = []
      for (let col = 0; col < this.cols; col++) {
        const node = this.createNode(row, col)
        currentRow.push(node)

        const cellElement = document.createElement("div")
        cellElement.className = "cell"
        cellElement.id = `cell-${row}-${col}`

        // Cache the element
        this.cellElements.set(`${row}-${col}`, cellElement)

        // Add event listeners
        this.addCellEventListeners(cellElement, row, col)
        this.gridElement.appendChild(cellElement)
      }
      this.grid.push(currentRow)
    }

    // Restore start/end nodes if they were within bounds
    if (startPos && startPos.row < this.rows && startPos.col < this.cols) {
      this.setStartNode(startPos.row, startPos.col)
    }
    if (endPos && endPos.row < this.rows && endPos.col < this.cols) {
      this.setEndNode(endPos.row, endPos.col)
    }
  }

  addCellEventListeners(cellElement, row, col) {
    const mouseDownHandler = (e) => this.handleMouseDown(e, row, col)
    const mouseEnterHandler = (e) => this.handleMouseEnter(e, row, col)
    const mouseUpHandler = () => this.handleMouseUp()

    cellElement.addEventListener("mousedown", mouseDownHandler)
    cellElement.addEventListener("mouseenter", mouseEnterHandler)
    cellElement.addEventListener("mouseup", mouseUpHandler)

    // Store handlers for cleanup
    cellElement._handlers = {
      mousedown: mouseDownHandler,
      mouseenter: mouseEnterHandler,
      mouseup: mouseUpHandler,
    }
  }

  clearEventListeners() {
    // Clean up existing event listeners to prevent memory leaks
    if (this.cellElements) {
      this.cellElements.forEach((element) => {
        if (element._handlers) {
          element.removeEventListener("mousedown", element._handlers.mousedown)
          element.removeEventListener("mouseenter", element._handlers.mouseenter)
          element.removeEventListener("mouseup", element._handlers.mouseup)
        }
      })
    }
  }

  createNode(row, col) {
    return {
      row,
      col,
      isStart: false,
      isEnd: false,
      isWall: false,
      isVisited: false,
      isPath: false,
      distance: Number.POSITIVE_INFINITY,
      heuristic: 0,
      fCost: Number.POSITIVE_INFINITY,
      gCost: Number.POSITIVE_INFINITY,
      parent: null,
    }
  }

  setupEventListeners() {
    // Algorithm selection
    this.elements.algorithmSelect.addEventListener("change", (e) => {
      this.currentAlgorithm = e.target.value
    })

    // Speed control
    this.elements.speedSlider.addEventListener("input", (e) => {
      this.animationSpeed = 101 - Number.parseInt(e.target.value)
      this.elements.speedValue.textContent = `${this.animationSpeed}ms`
    })

    // Control buttons
    this.elements.startBtn.addEventListener("click", () => this.startPathfinding())
    this.elements.clearBtn.addEventListener("click", () => this.clearPath())
    this.elements.resetBtn.addEventListener("click", () => this.resetGrid())

    // Prevent context menu on right click
    this.gridElement.addEventListener("contextmenu", (e) => e.preventDefault())

    // Handle mouse up globally
    document.addEventListener("mouseup", () => this.handleMouseUp())

    // Handle window resize with debouncing
    let resizeTimeout
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        this.adjustGridSize()
      }, 250)
    })

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (this.isRunning) return

      switch (e.key) {
        case " ":
          e.preventDefault()
          this.startPathfinding()
          break
        case "c":
        case "C":
          this.clearPath()
          break
        case "r":
        case "R":
          this.resetGrid()
          break
        case "Escape":
          this.stopVisualization()
          break
      }
    })
  }

  stopVisualization() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.isRunning = false
    this.toggleControls(true)
  }

  handleMouseDown(e, row, col) {
    if (this.isRunning) return

    e.preventDefault()
    this.isMouseDown = true

    const node = this.grid[row][col]

    // Place start node (first click)
    if (!this.startNode && !node.isEnd && !node.isWall) {
      this.setStartNode(row, col)
    }
    // Place end node (second click)
    else if (!this.endNode && !node.isStart && !node.isWall) {
      this.setEndNode(row, col)
    }
    // Toggle walls
    else if (!node.isStart && !node.isEnd) {
      this.toggleWall(row, col)
    }
  }

  handleMouseEnter(e, row, col) {
    if (!this.isMouseDown || this.isRunning) return

    const node = this.grid[row][col]
    if (!node.isStart && !node.isEnd) {
      this.toggleWall(row, col)
    }
  }

  handleMouseUp() {
    this.isMouseDown = false
  }

  setStartNode(row, col) {
    if (this.startNode) {
      this.startNode.isStart = false
      this.updateCellVisual(this.startNode.row, this.startNode.col)
    }

    this.startNode = this.grid[row][col]
    this.startNode.isStart = true
    this.updateCellVisual(row, col)
  }

  setEndNode(row, col) {
    if (this.endNode) {
      this.endNode.isEnd = false
      this.updateCellVisual(this.endNode.row, this.endNode.col)
    }

    this.endNode = this.grid[row][col]
    this.endNode.isEnd = true
    this.updateCellVisual(row, col)
  }

  toggleWall(row, col) {
    const node = this.grid[row][col]
    node.isWall = !node.isWall
    this.updateCellVisual(row, col)
  }

  updateCellVisual(row, col) {
    const cellElement = this.cellElements.get(`${row}-${col}`)
    if (!cellElement) return

    const node = this.grid[row][col]
    cellElement.className = "cell"

    if (node.isStart) cellElement.classList.add("start")
    else if (node.isEnd) cellElement.classList.add("end")
    else if (node.isWall) cellElement.classList.add("wall")
    else if (node.isPath) cellElement.classList.add("path")
    else if (node.isVisited) cellElement.classList.add("visited")
  }

  async startPathfinding() {
    if (!this.startNode || !this.endNode || this.isRunning) {
      if (!this.startNode || !this.endNode) {
        this.showMessage("Please place both start and end nodes before starting!", "error")
      }
      return
    }

    this.isRunning = true
    this.startTime = Date.now()
    this.nodesVisited = 0
    this.pathLength = 0

    // Disable controls
    this.toggleControls(false)

    // Clear previous path
    this.clearPath()

    let pathFound = false

    try {
      switch (this.currentAlgorithm) {
        case "bfs":
          pathFound = await this.breadthFirstSearch()
          break
        case "dfs":
          pathFound = await this.depthFirstSearch()
          break
        case "dijkstra":
          pathFound = await this.dijkstraAlgorithm()
          break
        case "astar":
          pathFound = await this.aStarAlgorithm()
          break
      }

      if (pathFound) {
        await this.animatePath()
        this.showMessage(`Path found using ${this.currentAlgorithm.toUpperCase()}!`, "success")
      } else {
        this.showMessage(`No path found using ${this.currentAlgorithm.toUpperCase()}`, "error")
      }
    } catch (error) {
      console.error("Pathfinding error:", error)
      this.showMessage("An error occurred during pathfinding", "error")
    }

    this.showStatistics()
    this.isRunning = false
    this.toggleControls(true)
  }

  showMessage(message, type) {
    // Create temporary message element
    const messageEl = document.createElement("div")
    messageEl.className = `message message-${type}`
    messageEl.textContent = message
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      background: ${type === "success" ? "#28a745" : "#dc3545"};
    `

    document.body.appendChild(messageEl)

    // Remove after 3 seconds
    setTimeout(() => {
      messageEl.style.animation = "slideOut 0.3s ease-in"
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.parentNode.removeChild(messageEl)
        }
      }, 300)
    }, 3000)
  }

  toggleControls(enabled) {
    this.elements.startBtn.disabled = !enabled
    this.elements.algorithmSelect.disabled = !enabled

    if (enabled) {
      this.elements.startBtn.textContent = "Start Pathfinding"
      this.elements.startBtn.classList.remove("loading")
    } else {
      this.elements.startBtn.textContent = "Running..."
      this.elements.startBtn.classList.add("loading")
    }
  }

  // ... (rest of the algorithm methods remain the same but with improved error handling)

  async breadthFirstSearch() {
    const queue = [this.startNode]
    const visited = new Set()

    while (queue.length > 0 && this.isRunning) {
      const currentNode = queue.shift()

      if (visited.has(`${currentNode.row}-${currentNode.col}`)) continue
      visited.add(`${currentNode.row}-${currentNode.col}`)

      if (currentNode === this.endNode) {
        return true
      }

      if (currentNode !== this.startNode) {
        currentNode.isVisited = true
        this.updateCellVisual(currentNode.row, currentNode.col)
        this.nodesVisited++
        await this.sleep(this.animationSpeed)
      }

      const neighbors = this.getNeighbors(currentNode)
      for (const neighbor of neighbors) {
        if (!visited.has(`${neighbor.row}-${neighbor.col}`) && !neighbor.isWall) {
          neighbor.parent = currentNode
          queue.push(neighbor)
        }
      }
    }

    return false
  }

  async depthFirstSearch() {
    const stack = [this.startNode]
    const visited = new Set()

    while (stack.length > 0 && this.isRunning) {
      const currentNode = stack.pop()

      if (visited.has(`${currentNode.row}-${currentNode.col}`)) continue
      visited.add(`${currentNode.row}-${currentNode.col}`)

      if (currentNode === this.endNode) {
        return true
      }

      if (currentNode !== this.startNode) {
        currentNode.isVisited = true
        this.updateCellVisual(currentNode.row, currentNode.col)
        this.nodesVisited++
        await this.sleep(this.animationSpeed)
      }

      const neighbors = this.getNeighbors(currentNode)
      for (const neighbor of neighbors.reverse()) {
        if (!visited.has(`${neighbor.row}-${neighbor.col}`) && !neighbor.isWall) {
          neighbor.parent = currentNode
          stack.push(neighbor)
        }
      }
    }

    return false
  }

  async dijkstraAlgorithm() {
    const unvisited = []

    // Initialize distances
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const node = this.grid[row][col]
        node.distance = node === this.startNode ? 0 : Number.POSITIVE_INFINITY
        unvisited.push(node)
      }
    }

    while (unvisited.length > 0 && this.isRunning) {
      // Sort by distance and get closest node
      unvisited.sort((a, b) => a.distance - b.distance)
      const currentNode = unvisited.shift()

      if (currentNode.distance === Number.POSITIVE_INFINITY) break

      if (currentNode === this.endNode) {
        return true
      }

      if (currentNode !== this.startNode) {
        currentNode.isVisited = true
        this.updateCellVisual(currentNode.row, currentNode.col)
        this.nodesVisited++
        await this.sleep(this.animationSpeed)
      }

      const neighbors = this.getNeighbors(currentNode)
      for (const neighbor of neighbors) {
        if (!neighbor.isWall) {
          const tentativeDistance = currentNode.distance + 1
          if (tentativeDistance < neighbor.distance) {
            neighbor.distance = tentativeDistance
            neighbor.parent = currentNode
          }
        }
      }
    }

    return false
  }

  async aStarAlgorithm() {
    const openSet = [this.startNode]
    const closedSet = new Set()

    this.startNode.gCost = 0
    this.startNode.heuristic = this.calculateHeuristic(this.startNode, this.endNode)
    this.startNode.fCost = this.startNode.heuristic

    while (openSet.length > 0 && this.isRunning) {
      // Get node with lowest fCost
      openSet.sort((a, b) => a.fCost - b.fCost)
      const currentNode = openSet.shift()

      closedSet.add(`${currentNode.row}-${currentNode.col}`)

      if (currentNode === this.endNode) {
        return true
      }

      if (currentNode !== this.startNode) {
        currentNode.isVisited = true
        this.updateCellVisual(currentNode.row, currentNode.col)
        this.nodesVisited++
        await this.sleep(this.animationSpeed)
      }

      const neighbors = this.getNeighbors(currentNode)
      for (const neighbor of neighbors) {
        if (neighbor.isWall || closedSet.has(`${neighbor.row}-${neighbor.col}`)) {
          continue
        }

        const tentativeGCost = currentNode.gCost + 1

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor)
        } else if (tentativeGCost >= neighbor.gCost) {
          continue
        }

        neighbor.parent = currentNode
        neighbor.gCost = tentativeGCost
        neighbor.heuristic = this.calculateHeuristic(neighbor, this.endNode)
        neighbor.fCost = neighbor.gCost + neighbor.heuristic
      }
    }

    return false
  }

  calculateHeuristic(nodeA, nodeB) {
    // Manhattan distance
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col)
  }

  getNeighbors(node) {
    const neighbors = []
    const { row, col } = node

    // Up, Right, Down, Left
    const directions = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]

    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow
      const newCol = col + dCol

      if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
        neighbors.push(this.grid[newRow][newCol])
      }
    }

    return neighbors
  }

  async animatePath() {
    const path = []
    let currentNode = this.endNode

    while (currentNode !== null) {
      path.unshift(currentNode)
      currentNode = currentNode.parent
    }

    this.pathLength = path.length - 1

    for (let i = 1; i < path.length - 1; i++) {
      if (!this.isRunning) break
      path[i].isPath = true
      this.updateCellVisual(path[i].row, path[i].col)
      await this.sleep(50)
    }
  }

  clearPath() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const node = this.grid[row][col]
        if (!node.isStart && !node.isEnd && !node.isWall) {
          node.isVisited = false
          node.isPath = false
          node.distance = Number.POSITIVE_INFINITY
          node.gCost = Number.POSITIVE_INFINITY
          node.fCost = Number.POSITIVE_INFINITY
          node.heuristic = 0
          node.parent = null
          this.updateCellVisual(row, col)
        }
      }
    }
    this.hideStatistics()
  }

  resetGrid() {
    this.stopVisualization()
    this.startNode = null
    this.endNode = null

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const node = this.grid[row][col]
        node.isStart = false
        node.isEnd = false
        node.isWall = false
        node.isVisited = false
        node.isPath = false
        node.distance = Number.POSITIVE_INFINITY
        node.gCost = Number.POSITIVE_INFINITY
        node.fCost = Number.POSITIVE_INFINITY
        node.heuristic = 0
        node.parent = null
        this.updateCellVisual(row, col)
      }
    }
    this.hideStatistics()
  }

  showStatistics() {
    const timeTaken = Date.now() - this.startTime
    this.elements.nodesVisited.textContent = this.nodesVisited
    this.elements.pathLength.textContent = this.pathLength
    this.elements.timeTaken.textContent = `${timeTaken}ms`
    this.elements.stats.style.display = "flex"
  }

  hideStatistics() {
    this.elements.stats.style.display = "none"
  }

  sleep(ms) {
    return new Promise((resolve) => {
      this.animationId = requestAnimationFrame(() => {
        setTimeout(resolve, ms)
      })
    })
  }

  // Cleanup method for proper disposal
  destroy() {
    this.stopVisualization()
    this.clearEventListeners()
  }
}

// Fixed initialization - only one instance
let visualizerInstance = null

document.addEventListener("DOMContentLoaded", () => {
  if (!visualizerInstance) {
    visualizerInstance = new PathfindingVisualizer()
  }
})

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (visualizerInstance) {
    visualizerInstance.destroy()
  }
})
