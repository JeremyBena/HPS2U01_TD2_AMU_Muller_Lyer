document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('illusion-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 250;

    const leftLineLength = 100; // Fixed length for the left line
    let rightLineLength = 150; // Variable for the right line length
    const lineY = 100;
    const lineStartX = 100;
    let dragging = false;
    let sizes = []; // Array to store the sizes

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Draw left line (outward arrows)
        drawIllusionLine(lineStartX, lineY, leftLineLength, true);

        // Draw right line (inward arrows)
        drawIllusionLine(lineStartX + leftLineLength, lineY, rightLineLength, false);
    }

function drawIllusionLine(x, y, length, inward) {
    // Draw main line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + length, y);
    ctx.stroke();

    // Draw illusion lines
    const illusionLineLength = 30;

    if (x === lineStartX) { // Left line
        drawIllusionLines(x, y, illusionLineLength, inward, false); // Inward at the start of the left line
        // The arrowhead at the end of the left line is not drawn
    } else { // Right line
        let isMiddle = (x !== lineStartX && !inward);

        drawIllusionLines(x, y, illusionLineLength, inward, isMiddle); // at the start of the line
        drawIllusionLines(x + length, y, illusionLineLength, !inward, false); // at the end of the line
    }
}

    function drawIllusionLines(x, y, length, inward, isMiddle) {
    const angles = inward ? [Math.PI / 4, -Math.PI / 4] : [-Math.PI / 4, Math.PI / 4];

    angles.forEach(angle => {
        ctx.beginPath();
        ctx.moveTo(x, y);

        // Conditional logic for the direction of the arrowhead
        if (isMiddle) {
            ctx.lineTo(x - Math.cos(angle) * length, y - Math.sin(angle) * length);
        } else {
            ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        }
        
        ctx.stroke();
    });
}

    function displaySizes() {
        let responseDiv = document.getElementById('responses');
        responseDiv.innerHTML = '<h3>Estimations enregistrées :</h3>';
        responseDiv.innerHTML += sizes.join(', ') + ' units';
    }

document.getElementById('store-size').addEventListener('click', function() {
    const relativeLength = rightLineLength - leftLineLength; // Calculate relative length
    sizes.push(relativeLength); // Store the relative length
    displaySizes();
    rightLineLength = Math.floor(Math.random() * 150) + 50; // Randomize right line length
    draw();
});


    canvas.addEventListener('mousedown', function(e) {
        const rightLineStartX = lineStartX + leftLineLength;
        if (e.offsetX >= rightLineStartX && e.offsetX <= rightLineStartX + rightLineLength + 10) {
            dragging = true;
        }
    });

    canvas.addEventListener('mousemove', function(e) {
        if (dragging) {
            const rightLineStartX = lineStartX + leftLineLength;
            rightLineLength = Math.max(e.offsetX - rightLineStartX, 10); // Ensure a minimum length
            draw();
        }
    });

    canvas.addEventListener('mouseup', function() {
        dragging = false;
    });

    draw();
});
