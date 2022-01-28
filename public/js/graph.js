import { getRandomString, generateGraphData, generateGrannyImage, getHeight } from "./graph-data-generator.js";
// ------------------ GLOBAL VARIABLES ------------------

let studentColor = "#1976d2"; // default student color
let grannyColor = "#c51162"; // default granny color
let svg = d3.select("#gilbinator-graph");
let width;
let height;

let graphData;
let simulation;


// ------------------ SETTER FUNCTIONS ------------------

function setStudentColor(color) {
    studentColor = color;
}

function setGrannyColor(color) {
    grannyColor = color;
}


// ------------------ GETTER FUNCTIONS ------------------

function getGraphData() {
    return graphData;
}

// ------------------ BUILDING GRAPH ------------------

function initGraph() {
    width = svg.attr("width");

    simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));
}

function setSvgHeight(){
    svg.attr("height", getHeight());
}

function generateGraph(selectedlevel) {
    // generate new data
    graphData = generateGraphData(selectedlevel);

    // set svg height depending on how many nodes
    setSvgHeight();

    // delete old graph
    deleteGraph();

    // create new graph
    buildGraph();
}

function deleteGraph() {
    let oldLinks = document.getElementsByClassName("gilb-graph__links")[0];
    let oldNodes = document.getElementsByClassName("gilb-graph__nodes")[0];

    if (oldLinks != null) {
        oldLinks.parentNode.removeChild(oldLinks);
    }

    if (oldNodes != null) {
        oldNodes.parentNode.removeChild(oldNodes);
    }
}

function buildGraph() {
    svg.append("g")
        .attr("class", "gilb-graph__links")
        .selectAll("line")
        .data(graphData.links)
        .enter().append("line")
        .attr("class", "gilb-graph__link")
        .attr("id", (d) => { return d.id })
        .attr("stroke-width", 4)
        .attr('x1', function (d) { return findNode(d.source).cx })
        .attr('y1', function (d) { return findNode(d.source).cy })
        .attr('x2', function (d) { return findNode(d.target).cx })
        .attr('y2', function (d) { return findNode(d.target).cy })
        .on("click", toggleLineColor);

    let node = svg.append("g")
        .attr("class", "gilb-graph__nodes")
        .selectAll("g")
        .data(graphData.nodes)
        .enter().append("g")

    node.append("circle")
        .attr("r", 30)
        .attr("cx", function (d) { return d.cx; })
        .attr("cy", function (d) { return d.cy; })
        .attr("class", "gilb-graph__node")
        .attr("id", (d) => { return d.id })
        .attr("fill", function (d) {
            if (d.group == "student") {
                return studentColor;
            }
            return grannyColor;
        });

    // node.append("text")
    // .attr('x', (d) => { return d.cx - 4 })
    // .attr('y', (d) => { return d.cy + 50 })
    //     .text(function (d, i) { return i });

    node.append("image")
        .attr("class", "gilb-graph__node-image")
        .attr("href", (d) => {
            if (d.group == "student") {
                return "https://avatars.dicebear.com/api/avataaars/" + getRandomString(10) + ".svg?radius=50"
            }
            return generateGrannyImage();
        })
        .attr('x', (d) => { return d.cx - 24 })
        .attr('y', (d) => { return d.cy - 23 });

    // simulation
    //     .nodes(graphData.nodes)
    //     .on("tick", () => { });

    // simulation.force("link")
    //     .links(graphData.links);
}



function resetGraph() {
    // reset nodes
    for (let i = 0; i < graphData.nodes.length; i++) {
        if (graphData.nodes[i].activeNeighbors != 0) {
            let node = document.getElementById(graphData.nodes[i].id);
            node.classList.remove("gilb-graph__node--active");
            node.classList.remove("gilb-graph__node--fault");
            graphData.nodes[i].activeNeighbors = 0;
        }
    }

    // reset links
    for (let i = 0; i < graphData.links.length; i++) {
        if (graphData.links[i].active == 1) {
            let link = document.getElementById(graphData.links[i].id);
            link.classList.remove("gilb-graph__link--active");
            link.classList.remove("gilb-graph__link--fault");
            graphData.links[i].active = -1;
            graphData.links[i].fault = 0;
        }
    }
}

function deactiveGraphClick() {
    for (let i = 0; i < graphData.links.length; i++) {
        let link = d3.select("#" + graphData.links[i].id);
        link.on("click", null);
    }
}

// ------------------ Helper Functions ------------------

function findNode(id) {
    for (let i = 0; i < graphData.nodes.length; i++) {
        if (graphData.nodes[i].id == id) {
            return graphData.nodes[i];
        }
    }
    return null;
}

function findLink(sourceId, targetId) {
    let links = graphData.links;

    for (let i = 0; i < links.length; i++) {
        if (links[i].source == sourceId && links[i].target == targetId) {
            return links[i];
        }
    }
}

// input: Edge l
// output: Array of corresponding nodes to that edge 
function getConnectedNodes(l) {
    let connectedNodes = graphData.nodes.filter(function (e) {
        return e.id == l.source || e.id == l.target; //connected nodes
    })

    return connectedNodes;
}

function toggleLineColor(event, d) {
    let connectedNodes = getConnectedNodes(d);
    let sourceData = connectedNodes[0];
    let targetData = connectedNodes[1];
    let sourceNode = document.getElementById(sourceData.id);
    let targetNode = document.getElementById(targetData.id);


    d.active = d.active * -1;

    if (d.active == 1) {
        sourceData.activeNeighbors++;
        targetData.activeNeighbors++;
    }
    else {
        sourceData.activeNeighbors--;
        targetData.activeNeighbors--;
    }

    // set source node color
    if (sourceData.activeNeighbors == 0) {
        sourceNode.classList.remove("gilb-graph__node--active");
    }
    else if (sourceData.activeNeighbors == 1) {
        sourceNode.classList.remove("gilb-graph__node--fault");
        sourceNode.classList.add("gilb-graph__node--active");
    }
    else if (sourceData.activeNeighbors > 1) {
        sourceNode.classList.remove("gilb-graph__node--active");
        sourceNode.classList.add("gilb-graph__node--fault");
    }

    // set target node color
    if (targetData.activeNeighbors == 0) {
        targetNode.classList.remove("gilb-graph__node--active");
    }
    else if (targetData.activeNeighbors == 1) {
        targetNode.classList.remove("gilb-graph__node--fault");
        targetNode.classList.add("gilb-graph__node--active");
    }
    else if (targetData.activeNeighbors > 1) {
        targetNode.classList.remove("gilb-graph__node--active");
        targetNode.classList.add("gilb-graph__node--fault");
    }

    // set link color
    if (this.classList.contains("gilb-graph__link--fault")) {
        this.classList.remove("gilb-graph__link--active");
        this.classList.remove("gilb-graph__link--fault");
        d.fault = 0;
    }
    else if (this.classList.contains("gilb-graph__link--active")) {
        this.classList.remove("gilb-graph__link--active");
        this.classList.remove("gilb-graph__link--fault");
        d.fault = 0;
    }
    else {
        if (sourceData.activeNeighbors == 0 && targetData.activeNeighbors == 0) {
            this.classList.add("gilb-graph__link--active");
        }
        else {
            this.classList.add("gilb-graph__link--fault");
            d.fault = 1;
        }
    }

    checkLinks();
}

function checkLinks() {
    let faultLinks = graphData.links.filter((d) => {
        return d.fault == 1;
    });

    for (let i = 0; i < faultLinks.length; i++) {
        let connectedNodes = getConnectedNodes(faultLinks[i]);
        let sourceData = connectedNodes[0];
        let targetData = connectedNodes[1];
        let link = document.getElementById(faultLinks[i].id);

        if (sourceData.activeNeighbors == 1 && targetData.activeNeighbors == 1) {
            link.classList.remove("gilb-graph__link--fault");
            link.classList.add("gilb-graph__link--active");
        }
    }
}

function highlightLinks(edges) {

    for(let i = 0; i < edges.length; i++){
        let edgeId = edges[i].id;
        let edge = document.getElementById(edgeId);
        let sourceNodeId = edges[i].source;
        let targetNodeId = edges[i].target;
        let sourceNode = document.getElementById(sourceNodeId);
        let targetNode = document.getElementById(targetNodeId);

        let source = findNode(sourceNodeId);
        let target = findNode(targetNodeId);
        let link = findLink(sourceNodeId, targetNodeId);

        source.activeNeighbors = 1;
        target.activeNeighbors = 1;
        link.active = 1;

        sourceNode.classList.add("gilb-graph__node--active");
        targetNode.classList.add("gilb-graph__node--active");
        edge.classList.add("gilb-graph__link--active");
    }
}

export { initGraph, generateGraph, resetGraph, deactiveGraphClick, highlightLinks, getGraphData, setStudentColor, setGrannyColor };