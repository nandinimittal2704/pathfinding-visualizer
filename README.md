# 🎯 Pathfinding Algorithm Visualizer

A fast, responsive web-based visualization tool for popular pathfinding algorithms. Watch algorithms like BFS, DFS, Dijkstra, and A* find paths through obstacles in real-time!

![Pathfinding Visualizer Demo](/placeholder.svg?height=400&width=800&query=web%20pathfinding%20visualizer%20interface%20with%20grid%20and%20controls)

## 🚀 **Live Demo**

**🔗 [View Live Demo](https://yourusername.github.io/pathfinding-visualizer/)**

## ✨ **Features**

### 🎮 **Interactive Grid System**
- **Click to place** start node (green) and end node (red)
- **Click and drag** to draw walls and obstacles
- **Responsive grid** that adapts to different screen sizes
- **Smooth animations** with customizable speed control

### 🧠 **Algorithm Implementations**
- **BFS (Breadth-First Search)** - Guarantees shortest path, explores level by level
- **DFS (Depth-First Search)** - Explores deeply, may not find shortest path
- **Dijkstra's Algorithm** - Optimal pathfinding for weighted graphs
- **A\* Algorithm** - Optimal and efficient using Manhattan distance heuristic

### 🎨 **Visual Elements**
- **Green**: Start node with pulsing animation
- **Red**: End node with pulsing animation
- **Black**: Walls and obstacles
- **Light Blue**: Visited nodes during search
- **Yellow**: Final shortest path
- **Smooth animations** for better visualization

### 📊 **Real-time Statistics**
- **Nodes Visited**: Count of explored nodes
- **Path Length**: Length of the shortest path found
- **Time Taken**: Algorithm execution time

### 🎛️ **Controls**
- **Algorithm Selection**: Choose between BFS, DFS, Dijkstra, A*
- **Speed Control**: Adjust visualization speed (1-100ms)
- **Start**: Begin pathfinding visualization
- **Clear Path**: Remove visited nodes and path (keep walls)
- **Reset Grid**: Clear everything and start fresh

### ⌨️ **Keyboard Shortcuts**
- **Spacebar**: Start pathfinding
- **C**: Clear path
- **R**: Reset grid

## 🛠️ **Technologies Used**

- **HTML5** - Semantic structure and grid layout
- **CSS3** - Modern styling, animations, and responsive design
- **Vanilla JavaScript** - Algorithm implementations and DOM manipulation
- **No frameworks** - Pure web technologies for maximum performance

## 📱 **Responsive Design**

- **Desktop**: Full 50x20 grid with large cells
- **Tablet**: 35x18 grid with medium cells  
- **Mobile**: 25x15 grid with smaller cells
- **Adaptive controls** that stack vertically on smaller screens

## 🚀 **Quick Start**

### Option 1: GitHub Pages (Recommended)
1. **Fork this repository**
2. **Enable GitHub Pages** in repository settings
3. **Visit your live site** at `https://yourusername.github.io/pathfinding-visualizer/`

### Option 2: Local Development
1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/pathfinding-visualizer.git
   cd pathfinding-visualizer
   \`\`\`

2. **Open in browser**
   \`\`\`bash
   # Simply open index.html in your browser
   open index.html
   # OR use a local server
   python -m http.server 8000
   # Then visit http://localhost:8000
   \`\`\`

## 📖 **How to Use**

### 1. **Set Up Your Maze**
   - **First click**: Places the green start node
   - **Second click**: Places the red end node
   - **Click and drag**: Draw black walls/obstacles
   - **Click walls again**: Remove them

### 2. **Choose Algorithm**
   - Select from dropdown: **BFS**, **DFS**, **Dijkstra**, or **A***
   - Each algorithm has different characteristics and performance

### 3. **Adjust Settings**
   - **Speed slider**: Control visualization speed (slower = more detailed)
   - **Real-time feedback** shows current speed setting

### 4. **Run Visualization**
   - Click **Start Pathfinding** or press **Spacebar**
   - Watch the algorithm explore the grid in real-time
   - **Light blue** shows visited nodes
   - **Yellow** shows the final shortest path

### 5. **Experiment**
   - Use **Clear Path** to try different algorithms on same maze
   - Use **Reset Grid** to create completely new maze
   - Try different obstacle patterns and compare algorithms

## 🔬 **Algorithm Comparison**

| Algorithm | Guarantees Shortest | Time Complexity | Space Complexity | Best For |
|-----------|-------------------|-----------------|------------------|----------|
| **BFS** | ✅ Yes | O(V + E) | O(V) | Unweighted shortest path |
| **DFS** | ❌ No | O(V + E) | O(V) | Maze solving, memory efficient |
| **Dijkstra** | ✅ Yes | O((V + E) log V) | O(V) | Weighted graphs |
| **A*** | ✅ Yes* | O(b^d) | O(b^d) | Optimal with good heuristic |

*\*A\* is optimal when using an admissible heuristic (like Manhattan distance)*

## 📁 **Project Structure**

\`\`\`
pathfinding-visualizer/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── app.js              # Algorithm implementations
├── README.md           # This documentation
└── screenshots/        # Demo images
    ├── bfs-demo.png
    ├── astar-demo.png
    └── mobile-view.png
\`\`\`

## 🎯 **Performance Optimizations**

- **Efficient DOM updates** using direct element manipulation
- **Optimized grid rendering** with CSS Grid
- **Smooth animations** using CSS transitions
- **Responsive design** with adaptive grid sizes
- **Memory efficient** algorithm implementations

## 📸 **Screenshots**

### Desktop Interface
![Desktop View](/placeholder.svg?height=300&width=600&query=desktop%20pathfinding%20visualizer%20interface)

### Algorithm Comparison
![Algorithm Comparison](/placeholder.svg?height=300&width=600&query=pathfinding%20algorithms%20BFS%20vs%20A%20star%20comparison)

### Mobile Responsive
![Mobile View](/placeholder.svg?height=400&width=300&query=mobile%20responsive%20pathfinding%20visualizer)

## 🚀 **Deployment Guide**

### Deploy to GitHub Pages

1. **Create new repository** on GitHub
   \`\`\`bash
   # Create repo named 'pathfinding-visualizer'
   \`\`\`

2. **Push your code**
   \`\`\`bash
   git init
   git add .
   git commit -m "Add pathfinding visualizer"
   git branch -M main
   git remote add origin https://github.com/yourusername/pathfinding-visualizer.git
   git push -u origin main
   \`\`\`

3. **Enable GitHub Pages**
   - Go to repository **Settings**
   - Scroll to **Pages** section
   - Select **Source**: Deploy from branch
   - Select **Branch**: main
   - Select **Folder**: / (root)
   - Click **Save**

4. **Access your live site**
   - Visit: `https://yourusername.github.io/pathfinding-visualizer/`
   - Share this link in your portfolio!

### Alternative Deployment Options

- **Netlify**: Drag and drop the folder
- **Vercel**: Connect GitHub repository
- **GitHub Codespaces**: Instant development environment

## 🎨 **Customization**

### Change Grid Size
\`\`\`javascript
// In app.js, modify these values:
this.rows = 25;    // Increase for more rows
this.cols = 60;    // Increase for more columns
\`\`\`

### Modify Colors
\`\`\`css
/* In style.css, update color variables: */
.cell.start { background-color: #your-color; }
.cell.end { background-color: #your-color; }
.cell.visited { background-color: #your-color; }
\`\`\`

### Add New Algorithms
\`\`\`javascript
// In app.js, add new algorithm method:
async yourNewAlgorithm() {
    // Implementation here
}
\`\`\`

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** feature branch (\`git checkout -b feature/amazing-feature\`)
3. **Commit** changes (\`git commit -m 'Add amazing feature'\`)
4. **Push** to branch (\`git push origin feature/amazing-feature\`)
5. **Open** Pull Request

## 📝 **Future Enhancements**

- [ ] **Weighted terrain** types (grass, water, mountains)
- [ ] **Diagonal movement** option
- [ ] **Maze generation** algorithms
- [ ] **Bidirectional search** algorithms
- [ ] **Jump Point Search** optimization
- [ ] **Algorithm race mode** (side-by-side comparison)
- [ ] **Save/load** maze patterns
- [ ] **Touch gestures** for mobile drawing

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Algorithm implementations** inspired by computer science research
- **Visual design** influenced by modern web applications
- **Performance optimizations** based on web development best practices

## 📞 **Contact**

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Portfolio**: [yourportfolio.com](https://yourportfolio.com)
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

**⭐ Star this repository if you found it helpful!**

**🔗 [Live Demo](https://yourusername.github.io/pathfinding-visualizer/) | [Report Bug](https://github.com/yourusername/pathfinding-visualizer/issues) | [Request Feature](https://github.com/yourusername/pathfinding-visualizer/issues)**
