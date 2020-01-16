const {Canvas, Image, loadImage} = require('canvas');
const path = require('path');
const fs = require('fs');

class Cosmollage {

    /**
    * @param {number} width
    * @param {number} height
    */
    constructor(width, height) {
        var canvas = new Canvas(width, height, "jpg");
        var ctx = canvas.getContext('2d', {alpha: false});
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.canvas = canvas;
        this.ctx = ctx;
        this.images = [];
        this.width = width;
        this.height = height;
        this.canvasPaddings = {
            right: 0,
            top: 0,
            left: 0,
            bottom: 0
        };
        this.cellPaddings = {
            right: 0,
            top: 0,
            left: 0,
            bottom: 0
        };

    }

    /**
    * @param {number} size
    */
    set row(size) {
        this._row = size;
    }

    /**
    * @param {number} size
    */
    set column(size) {
        this._column = size;
    }

    /**
    * @param {string} pathx
    */
    addImage(pathx) {
        if(typeof pathx === "string") {
            if(this._readDir) {
                this.images.push(path.join(this._readDir, pathx));
            } else {
                this.images.push(pathx);
            }
        } else {
            throw new Error("Parameter is not a string type");
        }
    }

    /**
    * @param {Array} paths
    */
    setImages(paths) {
        if(Array.isArray(paths)) {
            paths.forEach((v, i) => {
                if(typeof v !== "string") {
                    throw new Error(i + ". element is not a string type");
                } else {
                    if(this.readDir) {
                        this.images.push(path.join(this._readDir, v));
                    } else {
                        this.images.push(v);
                    }
                }
            });
        } else {
            throw new Error("Type of parameter is not array");
        }
    }

    imagesNotExists() {
        var notExistFiles = [];
        this.images.forEach((image) => {
            if(fs.existsSync(image) === false) {
                notExistFiles.push(image);
            }
        });
        return notExistFiles;
    }

    render() {
        return new Promise((resolve, reject) => {
            Promise.all(this.images.map((element) => {
                return loadImage(element);
            })).then((images) => {
                var coordinates = determineCoordinates(this.width, this.height, 
                    this._row, this._column, this.canvasPaddings, this.cellPaddings);
                
                if(coordinates === null) {
                    reject("Invalid sizes");
                    return;
                }

                var i = 0;
                images.forEach((image) => {
                    var ratioImage = image.width / image.height;
                    var ratioCell = coordinates[i].imageW / coordinates[i].imageH;
                    if(this._fixed) {
                        if(ratioImage > ratioCell) { // like portraid
                            var scale = coordinates[i].imageW / image.width;
                        } else { // like vertical
                            var scale = coordinates[i].imageH / image.height;
                        }
                        
                        var scaledW = (scale * image.width);
                        var scaledH = (scale * image.height);
                        var extraX = (coordinates[i].imageW - scaledW) / 2;
                        var extraY = (coordinates[i].imageH - scaledH) / 2;
                    } else {
                        var scaledW = coordinates[i].imageW;
                        var scaledH = coordinates[i].imageH;
                        var extraX = 0;
                        var extraY = 0;
                    }
                    
                    if(this._borders !== undefined && this._borders === true) {
                        this.ctx.rect(
                            coordinates[i].cellX, 
                            coordinates[i].cellY, 
                            coordinates[i].cellW, 
                            coordinates[i].cellH
                            );
                        this.ctx.stroke();
                        
                        this.ctx.rect(
                            coordinates[i].imageX, 
                            coordinates[i].imageY, 
                            coordinates[i].imageW, 
                            coordinates[i].imageH
                            );
                        this.ctx.stroke();

                        this.ctx.rect(
                            coordinates[i].imageX + extraX, 
                            coordinates[i].imageY + extraY, 
                            scaledW, 
                            scaledH
                            );
                        this.ctx.stroke();
                    }

                    this.ctx.drawImage(
                        image, 
                        coordinates[i].imageX + extraX, 
                        coordinates[i].imageY + extraY, 
                        scaledW, 
                        scaledH
                        );
                    i++;
                });
                return this.canvas.toBuffer('image/jpeg');
            }).then((buffer) => {
                resolve(buffer);
            }).catch((err) => {
                /*
                  it might produce some error,
                  because there are a lot of promise
                */
               reject(err);
            });
        });
    }

    /**
    * @param {boolean} param
    */
    set drawBorders(param) {
        if(typeof param === 'boolean') {
            this._borders = param;
        } else {
            throw new Error("Parameter is not a boolean type");
        }
    }

    /**
    * @param {boolean} param
    */
    set isFixed(param) {
        if(typeof param === 'boolean') {
            this._fixed = param;
        } else {
            throw new Error("Parameter is not a boolean type");
        }
    }

    /**
    * @param {string} dir
    */
    set readDir(dir) {
        if(typeof dir === 'string') {
            this._readDir = dir;
        } else {
            throw new Error("Parameter is not a string type");
        }
    }

    /**
    * @param {string} dir
    */
    set writeDir(dir) {
        if(typeof dir === 'string') {
            this._writeDir = dir;
        } else {
            throw new Error("Parameter is not a string type");
        }
    }

    /**
    * @param {number} size
    */
    set canvasPaddingRight(size) {
        this.canvasPaddings.right = size;
    }

    /**
    * @param {number} size
    */
    set canvasPaddingTop(size) {
        this.canvasPaddings.top = size;
    }

    /**
    * @param {number} size
    */
    set canvasPaddingLeft(size) {
        this.canvasPaddings.left = size;
    }

    /**
    * @param {number} size
    */
    set canvasPaddingBottom(size) {
        this.canvasPaddings.bottom = size;
    }

    /**
    * @param {number} size
    */
    set canvasPaddingAll(size) {
        this.canvasPaddings = {
            right: size,
            top: size,
            left: size,
            bottom: size
        };
    }

    /**
    * @param {number} size
    */
    set cellPaddingRight(size) {
        this.cellPaddings.right = size;
    }

    /**
    * @param {number} size
    */
    set cellPaddingTop(size) {
        this.cellPaddings.top = size;
    }

    /**
    * @param {number} size
    */
    set cellPaddingLeft(size) {
        this.cellPaddings.left = size;
    }

    /**
    * @param {number} size
    */
    set cellPaddingBottom(size) {
        this.cellPaddings.bottom = size;
    }

    /**
    * @param {number} size
    */
    set cellPaddingAll(size) {
        this.cellPaddings = {
            right: size,
            top: size,
            left: size,
            bottom: size
        };
    }
    
}

/**
* @param {number} width
* @param {number} height
* @param {number} row
* @param {number} column
* @param {object} canvasPaddings
* @param {object} cellPaddings
*/
function determineCoordinates(width, height, row, column, canvasPaddings, cellPaddings) {
    // calculate cell count
    var count = row * column;

    // calculate grid coordinates
    var gridX = canvasPaddings.left;
    var gridY = canvasPaddings.top;
    var gridWidth = width - (canvasPaddings.right + canvasPaddings.left);
    var gridHeight = height - (canvasPaddings.top + canvasPaddings.bottom);
    if(gridWidth <= 0 || gridHeight <= 0) {
        return null;
    }

    // calculate cell size
    var cellWidth = gridWidth / column;
    var cellHeight = gridHeight / row;

    var imageMaxWidth = cellWidth - (cellPaddings.right + cellPaddings.left);
    var imageMaxHeight = cellHeight - (cellPaddings.top + cellPaddings.bottom);
    if(imageMaxWidth <= 0 || imageMaxHeight <= 0) {
        return null;
    }

    var lastX = gridX;
    var lastY = gridY;
    var cellCoordinates = [];
    for(let i = 0; i < row; i++) {
        lastX = gridX;
        for(let j = 0; j < column; j++) {
            cellCoordinates.push({
                cellX: lastX,
                cellY: lastY,
                cellW: cellWidth,
                cellH: cellHeight,
                imageX: lastX + cellPaddings.right,
                imageY: lastY + cellPaddings.top,
                imageW: imageMaxWidth,
                imageH: imageMaxHeight
            });
            lastX += cellWidth;
        }
        lastY += cellHeight;
    }
    return cellCoordinates;
}

module.exports = Cosmollage;