let cols = 15;
let rows = 15;
let grid = new Array(cols);

let openSet = [];
let closedSet = [];
let start;
let end;
let w,h;
let path = [];

class Spot {
    constructor(i, j) {
        this.x = i;
        this.y = j;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.neighbors = [];
        this.previous = undefined;
    }

    show = function(color){
        fill(color);
        noStroke();
        rect(this.x * w,this.y * h, w-1, h-1);
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
    createCanvas(400,400);

    w = width/cols;
    h = height/rows;
    

    for(let i =0; i<cols; i++){
        grid[i] = new Array(rows);
    }

    for(let i =0; i<cols; i++){
        for(let j =0; j<cols; j++){
            grid[i][j] = new Spot(i,j);
        }
    }

    for(let i =0; i<cols; i++){
        for(let j =0; j<cols; j++){
            grid[i][j].addNeighbors();
        }
    }

    start = grid[0][0];
    end = grid[cols-1][1];

    openSet.push(start);

}

function draw(){

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
            path = [];
            let temp = current;
            path.push(temp);
            while(temp.previous){
                path.push(temp.previous);
                temp = temp.previous;
            }
            noLoop();
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        let nbs = current.neighbors;
        for(let i = 0; i<nbs.length; i++){
            let nb = nbs[i];
            
            if(!closedSet.includes(nb)){
                let tmp = current.g+1;
                if(openSet.includes(nb)){
                    if(tmp < nb.g){
                        nb.g = tmp;
                    }
                }else{
                    nb.g = tmp;
                    openSet.push(nb);
                }
                nb.h = heuristic(nb, end);
                nb.f = nb.g + nb.h;
                nb.previous = current;
            }
        }

    }else{

    }


    for(let i =0; i<cols; i++){
        for(let j =0; j<cols; j++){
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
}