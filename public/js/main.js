import { initGraph, generateGraph, resetGraph, deactiveGraphClick, highlightLinks, getGraphData } from "./graph.js";
import { getRandomString } from "./helper.js";

// svg attributes
let easyLevel = 0;
let mediumLevel = 2;
let hardLevel = 5;
let ultraLevel = 8;
let selectedlevel;

// init buttons
let easyButton = document.getElementById("graph-easy-button");
let mediumButton = document.getElementById("graph-medium-button");
let hardButton = document.getElementById("graph-hard-button");
let ultraButton = document.getElementById("graph-ultra-button");
let startAlgoButton = document.getElementById("graph-start-algo");
let replayAlgoButton = document.getElementById("graph-replay-algo");

easyButton.addEventListener("click", () => {selectedlevel = easyLevel; createLevelGraph(); });
mediumButton.addEventListener("click", () => {selectedlevel = mediumLevel; createLevelGraph(); });
hardButton.addEventListener("click", () => {selectedlevel = hardLevel; createLevelGraph(); });
ultraButton.addEventListener("click", () => {selectedlevel = ultraLevel; createLevelGraph(); });
startAlgoButton.addEventListener("click", startAlgo);
replayAlgoButton.addEventListener("click", replayAlgo);

// add graph
initGraph();
generateGraph();
let graphData = getGraphData();
let matching = solveBipartiteMatching(graphData);


function startAlgo() {
    graphData = getGraphData();
    switchStartButton();
    resetGraph();

    matching = solveBipartiteMatching(graphData);
    highlightLinks(matching);
}

function replayAlgo() {
    switchStartButton();
    resetGraph();
}

function createLevelGraph() {
    // reset start button
    startAlgoButton.classList.remove("hide-button");
    startAlgoButton.classList.add("controls__start-button");
    replayAlgoButton.classList.add("hide-button");
    replayAlgoButton.classList.remove("controls__start-button");

    //generate new graph
    generateGraph(selectedlevel);
    graphData = getGraphData();
    matching = solveBipartiteMatching(graphData);
}

function switchStartButton() {
    startAlgoButton.classList.toggle("hide-button");
    startAlgoButton.classList.toggle("controls__start-button");
    replayAlgoButton.classList.toggle("hide-button");
    replayAlgoButton.classList.toggle("controls__start-button");
}

function solveBipartiteMatching(data) {
    let graphData = JSON.parse(JSON.stringify(data));
    let startNodeId = "startNode";
    let endNodeId = "endNode";

    addStartAndEndNode(graphData, startNodeId, endNodeId);
    addResidualEdges(graphData);
    initLinksCapacity(graphData);

    let path = findPathFromStartToEnd(graphData, startNodeId, endNodeId);
    while (path != null) {
        updateCapacity(graphData, path);
        resetVisitedNodes(graphData);
        path = findPathFromStartToEnd(graphData, startNodeId, endNodeId);
    }

    let maxFlow = getMaxFlow(graphData, endNodeId);
    document.getElementById("maximum-matches-display").innerHTML = maxFlow;
    let edges = getMatchingEdges(graphData, startNodeId, endNodeId);

    return edges;
}

function getMatchingEdges(graphData, startId, endId) {
    let links = graphData.links;
    let result = [];

    for (let i = 0; i < links.length; i++) {
        if (links[i].source == startId || links[i].target == endId) {
            continue;
        }
        if (links[i].type == "default" && links[i].capacity == 0) {
            result.push(links[i]);
        }
    }

    return result;
}

function getMaxFlow(graphData, endId) {
    let links = graphData.links;
    let maxFlow = 0;

    for (let i = 0; i < links.length; i++) {
        if (links[i].target == endId && links[i].capacity == 0) {
            maxFlow++;
        }
    }

    return maxFlow;
}

function updateCapacity(graphData, path) {
    let minCapacity = Infinity;

    // get min capacity
    for (let i = 0; i < path.length; i++) {
        minCapacity = Math.min(minCapacity, path[i].capacity);
    }

    // update capacity
    for (let i = 0; i < path.length; i++) {
        let link = findLink(graphData, path[i].source, path[i].target);
        let residualLink = getResidualLink(graphData, path[i].source, path[i].target);

        link.capacity = link.capacity - minCapacity;
        residualLink.capacity = residualLink.capacity + minCapacity;
    }
}

function resetVisitedNodes(graphData) {
    let nodes = graphData.nodes;

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].visited = 0;
    }
}

function findLink(graphData, sourceId, targetId) {
    let links = graphData.links;

    for (let i = 0; i < links.length; i++) {
        if (links[i].source == sourceId && links[i].target == targetId) {
            return links[i];
        }
    }
}

function findNode(graphData, nodeId) {
    let nodes = graphData.nodes;

    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id == nodeId) {
            return nodes[i];
        }
    }

    return null;
}

function getResidualLink(graphData, sourceId, targetId) {
    let links = graphData.links;

    for (let i = 0; i < links.length; i++) {
        if (links[i].source == targetId && links[i].target == sourceId) {
            return links[i];
        }
    }

    return null;
}

function findPathFromStartToEnd(graphData, startId, endId) {
    let currentNodeId = startId;
    let nextNeighbor;
    let path = [];
    let stack = [];
    stack.push(startId);

    while (stack.length > 0) {

        if (currentNodeId == null) {
            currentNodeId = stack.pop();
            stack.push(currentNodeId);
            path.pop();
        }

        while (currentNodeId != null) {

            let currentNode = findNode(graphData, currentNodeId);

            nextNeighbor = getNeighbor(graphData, currentNodeId);
            currentNode.visited = 1;

            if (nextNeighbor != null) {
                currentNodeId = nextNeighbor.target;

                path.push(nextNeighbor);
                stack.push(currentNodeId);
            }
            else {
                currentNodeId = null;
            }

            if (currentNodeId == endId) {
                return path;
            }
        }

        if (currentNodeId == null) {
            stack.pop();
        }
    }

    return null;
}

function getNeighbor(graphData, nodeId) {
    let links = graphData.links;
    findNode(graphData, nodeId);

    for (let i = 0; i < links.length; i++) {
        let targetNode = findNode(graphData, links[i].target);
        if (links[i].source == nodeId && links[i].capacity > 0 && targetNode.visited == 0) {
            return links[i];
        }
    }

    return null;
}

function addStartAndEndNode(graphData, startNodeId, endNodeId) {
    let nodes = graphData.nodes;
    let links = graphData.links;

    let startNode = { "id": startNodeId, "group": "tmp" };
    let endNode = { "id": endNodeId, "group": "tmp" };

    graphData.nodes.push(startNode);
    graphData.nodes.push(endNode);

    for (let i = 0; i < nodes.length; i++) {
        // add connection between start node and students
        if (nodes[i].group == "student") {
            let studentId = nodes[i].id;
            let connectionToStart = { id: "sink-" + getRandomString(10), "source": startNodeId, "target": studentId, "active": -1, "fault": 0 };
            graphData.links.push(connectionToStart);
        }
        // add connection between end node and grannies
        else if (nodes[i].group == "granny") {
            let grannyId = nodes[i].id;
            let connectionToEnd = { id: "target-" + getRandomString(10), "source": grannyId, "target": endNodeId, "active": -1, "fault": 0 };
            graphData.links.push(connectionToEnd);
        }

        nodes[i].visited = 0;
    }

    for (let i = 0; i < links.length; i++) {
        links[i].type = "default";
    }
}

function addResidualEdges(graphData) {
    let links = graphData.links;
    let tmpEdges = [];

    for (let i = 0; i < links.length; i++) {
        let residualEdge = { id: "residual-" + getRandomString(10), "source": links[i].target, "target": links[i].source, "type": "residual", "active": links[i].active, "fault": links[i].fault };
        tmpEdges.push(residualEdge);

    }

    for (let i = 0; i < tmpEdges.length; i++) {
        graphData.links.push(tmpEdges[i]);
    }
}

function initLinksCapacity(graphData) {
    let links = graphData.links;
    let capacity = 1;

    for (let i = 0; i < links.length; i++) {
        links[i].flow = 0;
        links[i].visited = 0;

        if (links[i].type == "default") {
            links[i].capacity = capacity;
        }
        else if (links[i].type == "residual") {
            links[i].capacity = 0;
        }
    }
}