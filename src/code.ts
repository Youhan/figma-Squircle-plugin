// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(700, 400);


// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  
  if (msg.type === 'create-squircle') {
    //console.log("hi", msg.count)

    let width = msg.w || 100;
    let height = msg.h || 100;
    let radiusX = msg.rx || 4;
    let radiusY = msg.ry || 4;

    const squircleMaker = (radiusX: number, radiusY: number) => (theta: number) => ({
      x: Math.pow(Math.abs(Math.cos(theta)), 2 / radiusX) * 50 * Math.sign(Math.cos(theta)) + 50,
      y: Math.pow(Math.abs(Math.sin(theta)), 2 / radiusY) * 50 * Math.sign(Math.sin(theta)) + 50
    });

    let arr = (new Array(359))
      .fill(0)
      .map((x, i) => i)
      .map((counter)=>counter * Math.PI / 180) // Defined as deg => deg * Math.PI / 180 elsewhere
      .map(squircleMaker(radiusX, radiusY))
      .map(({ x, y }) => ({ x: Math.round(x * 10)/10, y: Math.round(y * 10)/10 })) // Round to the ones place
      .map(({x,y}) => `L ${x} ${y}`)
      .join(' ')


      // create the object
      const squircle = figma.createVector();
      
      squircle.vectorPaths = [{
        windingRule: 'EVENODD',
        data: "M" + arr.substring(1) + " Z"
      }];
      squircle.strokes = [];
      squircle.fills = [{ type: 'SOLID', color: {r:0.2, g:0.2, b:0.5} }];
      squircle.resizeWithoutConstraints(width, height);
      squircle.constraints = {horizontal: 'SCALE', vertical: 'SCALE'}

      // Put the node in the center of the viewport so we can see it
      squircle.x = figma.viewport.center.x - squircle.width / 2;
      squircle.y = figma.viewport.center.y - squircle.height / 2;

  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
