import { getRandomString, getRandomNumber } from "./helper.js";
// ------------------ CREATE RANDOM GRAPH DATA ------------------

let minNodes = 2;
let maxNodes = 4;
let padding = 125;

function getWidth() {
    let svg = document.getElementById("gilbinator-graph");

    if (svg == null) {
        return 500;
    }

    let width = svg.clientWidth;

    if (width == null) {
        return 500;
    }

    return width;
}

function generateGrannyImage() {
    let facialHairChance = "facialHairChance=0";
    let top = "top[]=longHair";
    let hairColor = "hairColor[]=gray&hairColor[]=silverGray";
    let skin = "skin[]=tanned&skin[]=pale&skin[]=light&skin[]=brown";
    return "https://avatars.dicebear.com/api/avataaars/" + getRandomString(10) + ".svg?radius=50&" + facialHairChance + "&" + top + "&" + hairColor + "&" + skin;
}

function generateNodeObject(level = 0) {
    let studentNodes = [];
    let grannyNodes = [];
    let students = (getRandomNumber(minNodes, maxNodes) + level);
    let grannies = (getRandomNumber(minNodes, maxNodes) + level);

    for (let i = 0; i < students; i++) {
        studentNodes[i] = { "id": "s-" + getRandomString(6), "group": 'student', 'cx': 0 + padding, 'cy': 50 + 120 * i, activeNeighbors: 0 };
    }

    for (let i = 0; i < grannies; i++) {
        grannyNodes[i] = { "id": "g-" + getRandomString(6), "group": 'granny', 'cx': getWidth() - padding, 'cy': 50 + 120 * i, activeNeighbors: 0 };
    }

    return { studentNodes, grannyNodes };
}

function generateLinkObject(nodes) {
    let studentNodes = nodes.studentNodes;
    let grannyNodes = nodes.grannyNodes;
    let students = studentNodes.length;
    let grannies = grannyNodes.length;
    let links = [];
    let linksNumber = 0;

    for (let i = 0; i < students; i++) {
        let studentId = studentNodes[i].id;

        for (let j = 0; j < grannies; j++) {
            let connected = getRandomNumber(0, 1);
            let grannyId = grannyNodes[j].id;
            if (connected == 1) {
                links[linksNumber] = { "id": "l-" + getRandomString(10), "source": studentId, "target": grannyId, "active": -1, "fault": 0 };
                linksNumber++;
            }
        }
    }

    // search for students without links
    for (let i = 0; i < students; i++) {
        let studentId = studentNodes[i].id;

        let foundConnection = 0;

        for (let j = 0; j < links.length; j++) {
            if (studentId == links[j].source) {
                foundConnection = 1;
            }
        }

        if (foundConnection == 0) {
            let connection = getRandomNumber(0, (grannies - 1));
            links[linksNumber] = { "id": "l-" + getRandomString(10), "source": studentId, "target": grannyNodes[connection].id, "active": -1, "fault": 0 };

            linksNumber++;
        }
    }

    // search for grannies without links
    for (let i = 0; i < grannies; i++) {
        let grannyId = grannyNodes[i].id;
        let foundConnection = 0;

        for (let j = 0; j < links.length; j++) {
            if (grannyId == links[j].target) {
                foundConnection = 1;
            }
        }

        if (foundConnection == 0) {
            let connection = getRandomNumber(0, (students - 1));
            links[linksNumber] = { "id": "l-" + getRandomString(10), "source": studentNodes[connection].id, "target": grannyId, "active": -1, "fault": 0 };
            linksNumber++;
        }
    }

    return links;
}

function generateGraphData(level) {
    let nodes = generateNodeObject(level);
    let links = generateLinkObject(nodes);
    let formattedNodes = nodes.studentNodes.concat(nodes.grannyNodes);
    return { "nodes": formattedNodes, "links": links };
}

export { getRandomString, generateGraphData, generateGrannyImage };