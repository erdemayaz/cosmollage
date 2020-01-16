## Cosmollage

Cosmollage is a collage maker. Package uses canvas package.

For using:

    const Cosmollage = require('cosmollage');

Create a new instance with your collage width and heigth,

    var cosmollage = new Cosmollage(1920, 1080);

You must give row and column count as parameter,

    cosmollage.row = 6;
    cosmollage.column = 5;

And you can set read directory. If you don't enter, you must give image path with name,

    cosmollage.readDir = './assets';

If you want to fix images in each cell, you can set isFixed is true (false as default),

    cosmollage.isFixed = true;

You can set image one by one,

    for (let i = 0; i < 15; i++) {
    	cosmollage.addImage('landscape_' + i + '.jpg');
    	cosmollage.addImage('portraid' + i + '.jpeg');
    }
or set as array

    cosmollage.setImages(myImagesArray);
If you want to check existing files, this returns not existing files array,

    var notExists = cosmollage.imagesNotExists();

For development, if you want to show borders on collage,

    cosmollage.drawBorders = true;

You can set canvas paddings,

    cosmollage.canvasPaddingRight = 3;
    cosmollage.canvasPaddingTop = 5;
    cosmollage.canvasPaddingLeft = 7;
    cosmollage.canvasPaddingBottom = 11;
    cosmollage.canvasPaddingAll = 13;

You can set cells paddings,

    cosmollage.cellPaddingRight = 3;
    cosmollage.cellPaddingTop = 5;
    cosmollage.cellPaddingLeft = 7;
    cosmollage.cellPaddingBottom = 11;
    cosmollage.cellPaddingAll = 13;

and finally render it!

    cosmollage.render().then((buffer) => {
    	// make magic things with buffer...
    	fs.writeFileSync('./collage.jpg', buffer);
    });