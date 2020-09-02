let cols = 50;
let rows = 50;
let grid;// = new Array(cols);

let openSet = [];
let closedSet = [];
let start;
let end;
let w,h;
let path = [];
let startX, startY, colsIn, rowsIn, endX, endY;

let is_running = false;

class Spot {
    constructor(i, j) {
        this.x = i;
        this.y = j;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.neighbors = [];
        this.previous = undefined;
        this.is_obstacle = false;
        if(random(1)<0.3){
            this.is_obstacle = true;
        }
    }

    

    show = function(color){
        fill(color);
        if(this.is_obstacle){
            fill(0);
        }
        noStroke();
        rect(this.x * w,this.y * h, w-1, h-1);
    }

    showCircle = (color) => {
        fill(0);
        noStroke();
        ellipse(this.x * w + w/2 - 1,this.y * h + h/2 -1, w/2, h/2);
        fill(color);
        ellipse(this.x * w + w/2 - 1,this.y * h + h/2 -1, w/2-1, h/2-1);
    } 

    addNeighbors = function(){
        if(this.x < cols-1) this.neighbors.push(grid[this.x+1][this.y])
        if(this.x > 0) this.neighbors.push(grid[this.x-1][this.y])
        if(this.y < rows-1) this.neighbors.push(grid[this.x][this.y+1])
        if(this.y > 0) this.neighbors.push(grid[this.x][this.y-1])
    }
}

function removeFromArray(arr, ele){
    for(let i = arr.length-1; i>=0; i--){
        if(arr[i] == ele){
            arr.splice(i,1);
        }
    }
}

function heuristic(p1, p2){
    let d = dist(p1.x, p1.y, p2.x, p2.y);
    return d;
}

function setup(){

    createElement("span","Columns: ")

    colsIn = createInput(cols);

    createElement("span","Rows: ")

    rowsIn = createInput(rows);

    createElement("span","Start X: ")

    startX = createInput(0);

    createElement("span","Y: ")

    startY = createInput(0);

    createElement("span","End X: ")

    endX = createInput(cols-1);

    createElement("span","Y: ")

    endY = createInput(rows-1);

    let but = createButton("reset");
    but.mousePressed(restart);

    restart();

}

function restart(){
    createCanvas(800,800);

    cols = colsIn.value();
    rows = rowsIn.value();

    grid = new Array(cols);
    w = width/cols;
    h = height/rows;
    
    openSet = [];
    closedSet = [];

    for(let i =0; i<cols; i++){
        grid[i] = new Array(rows);
    }

    for(let i =0; i<cols; i++){
        for(let j =0; j<rows; j++){
            grid[i][j] = new Spot(i,j);
        }
    }

    for(let i =0; i<cols; i++){
        for(let j =0; j<rows; j++){
            grid[i][j].addNeighbors();
        }
    }

    start = grid[startX.value()][startY.value()];
    end = grid[endX.value()][endY.value()];

    start.is_obstacle = false;
    end.is_obstacle = false;

    openSet.push(start);

    is_running = true;

    background(0);

    for(let i =0; i<cols; i++){
        for(let j =0; j<rows; j++){
            grid[i][j].show(color(255));
        }
    }

}

function draw(){
   
    if(is_running){
        background(0);

        if (openSet.length > 0){
            let low = 0;
            for(let i = 0; i<openSet.length; i++){
                if(openSet[i].f<openSet[low].f){
                    low = i;
                }
            }

            let current = openSet[low];

            if(current == end){
                console.log("FINISHED");

                is_running = false;
            }
            path = [];
            let temp = current;
            path.push(temp);
            while(temp.previous){
                path.push(temp.previous);
                temp = temp.previous;
            }

            removeFromArray(openSet, current);
            closedSet.push(current);

            let nbs = current.neighbors;
            for(let i = 0; i<nbs.length; i++){
                let nb = nbs[i];
                
                if(!closedSet.includes(nb) && !nb.is_obstacle){
                    let tmp = current.g+1;
                    let foundNew = false
                    if(openSet.includes(nb)){
                        if(tmp < nb.g){
                            foundNew = true;
                            nb.g = tmp;
                        }
                    }else{
                        nb.g = tmp;
                        foundNew = true;
                        openSet.push(nb);
                    }
                    if(foundNew){
                        nb.h = heuristic(nb, end);
                        nb.f = nb.g + nb.h;
                        nb.previous = current;
                    }
                }
            }

        }else{
            console.log("There is no possible solution!")
            is_running = false;
        }


        for(let i =0; i<cols; i++){
            for(let j =0; j<rows; j++){
                grid[i][j].show(color(255));
            }
        }

        for (let i = 0; i < closedSet.length; i++){
            closedSet[i].show(color(255, 0, 0));
        }

        for (let i = 0; i < openSet.length; i++){
            openSet[i].show(color(0, 255, 0));
        }

        for (let i = 0; i < path.length; i++){
            path[i].show(color(0, 0, 255));
        }

        end.showCircle(color(255,255,0));
        start.showCircle(color(0,255,255));
    }
}