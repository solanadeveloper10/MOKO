document.addEventListener("DOMContentLoaded", function () {
  const toggleButtons = document.querySelectorAll(".toggle-btn");
  const offCanvas = document.getElementById("off-canvas");

  // Function to open the off-canvas menu
  const openOffCanvas = () => {
    offCanvas.classList.add("active");
    toggleButtons.forEach((btn) => btn.classList.add("active"));
    document.body.classList.add("no-scroll");
  };

  // Function to close the off-canvas menu
  const closeOffCanvas = () => {
    offCanvas.classList.remove("active");
    toggleButtons.forEach((btn) => btn.classList.remove("active"));
    document.body.classList.remove("no-scroll");
  };

  // Toggle off-canvas on button click
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (offCanvas.classList.contains("active")) {
        closeOffCanvas();
      } else {
        openOffCanvas();
      }
    });
  });

  // Select all buttons with the class 'walletLoginFunc'
  document.querySelectorAll(".walletLoginFunc").forEach((button) => {
    // Add a click event listener to each button
    button.addEventListener("click", () => {
      // Select the div with id 'walletNotification'
      const notificationDiv = document.getElementById("walletNotification");

      // Remove the 'd-none' class
      notificationDiv.classList.remove("d-none");

      // Set a timeout to add the 'd-none' class back after 2 seconds
      setTimeout(() => {
        notificationDiv.classList.add("d-none");
      }, 2000); // 2000 milliseconds = 2 seconds
    });
  });
  // Initialize Fabric.js canvas
  const canvas = new fabric.Canvas("imageCanvas", {
    preserveObjectStacking: true,
  });
  let currentScaleFactor = 1;
  // Define maximum canvas dimensions
  const width = window.innerWidth;
  let MAX_WIDTH = 800;
  let MAX_HEIGHT = 600;

  if (width < 320) {
    MAX_WIDTH = 280;
    MAX_HEIGHT = 370;
  } else if (width < 500) {
    MAX_WIDTH = 330;
    MAX_HEIGHT = 440;
  } else if (width < 1024) {
    MAX_WIDTH = 650;
    MAX_HEIGHT = 490;
  } else {
    MAX_WIDTH = 800;
    MAX_HEIGHT = 600;
  }
  // Define a custom 'delete' control for overlays
  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: 16,
    cursorStyle: "pointer",
    mouseUpHandler: function (eventData, transform) {
      const target = transform.target;
      canvas.remove(target);
      canvas.requestRenderAll();
    },
    render: function (ctx, left, top, styleOverride, fabricObject) {
      const size = 20;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#FF0000"; // Red color for the 'X'
      ctx.fillStyle = "#FFFFFF"; // White background for visibility
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-size / 4, -size / 4);
      ctx.lineTo(size / 4, size / 4);
      ctx.moveTo(size / 4, -size / 4);
      ctx.lineTo(-size / 4, size / 4);
      ctx.stroke();
      ctx.restore();
    },
  });

  // Handle Image Upload
  document
    .getElementById("imageUpload")
    .addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        const imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
          // Clear existing canvas
          canvas.clear();

          const img = new fabric.Image(imgObj);

          // Determine scaling based on image dimensions
          const imgWidth = img.width;
          const imgHeight = img.height;

          // Calculate scale factors for both width and height
          const widthScale = MAX_WIDTH / imgWidth;
          const heightScale = MAX_HEIGHT / imgHeight;

          // Choose the smaller scale factor to ensure both dimensions fit
          currentScaleFactor = Math.min(widthScale, heightScale, 1); // Store the scale factor

          // Apply the scaling factor uniformly to maintain aspect ratio
          img.scale(currentScaleFactor);

          // Adjust canvas size to match scaled image
          const canvasWidth = imgWidth * img.scaleX;
          const canvasHeight = imgHeight * img.scaleY;

          canvas.setWidth(canvasWidth);
          canvas.setHeight(canvasHeight);

          // Set the scaled image as the canvas background
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: img.scaleX,
            scaleY: img.scaleY,
          });

          // Toggle container visibility
          document
            .getElementById("uploadImageContainer")
            .classList.add("d-none");
          document
            .getElementById("editImageContainer")
            .classList.remove("d-none");
        };
      };
      reader.readAsDataURL(file);
    });

  // Handle Overlay Selection
  const overlayThumbs = document.querySelectorAll(".overlay-thumb");
  overlayThumbs.forEach((thumb) => {
    thumb.addEventListener("click", function () {
      const src = this.src;
      fabric.Image.fromURL(src, function (img) {
        // Set initial size relative to canvas
        const initialWidth = canvas.getWidth() * 0.3; // 30% of canvas width
        img.scaleToWidth(initialWidth);

        img.set({
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          originX: "center",
          originY: "center",
          cornerStyle: "circle",
          transparentCorners: false,
          hasRotatingPoint: true, // Enable rotation
          isOverlay: true, // Custom property to identify overlays
        });

        // Enable the custom delete control only for overlays
        img.controls = fabric.Object.prototype.controls;

        canvas.add(img).setActiveObject(img);
      });
    });
  });

  // Reset to Initial State on "Again" Button Click
  document.getElementById("again").addEventListener("click", function () {
    // Clear the canvas including background and objects
    canvas.clear();

    // Reset canvas dimensions
    canvas.setWidth(MAX_WIDTH);
    canvas.setHeight(MAX_HEIGHT);

    // Re-render the canvas to remove any lingering elements
    canvas.renderAll();

    // Toggle container visibility
    document.getElementById("editImageContainer").classList.add("d-none");
    document.getElementById("uploadImageContainer").classList.remove("d-none");
  });

  // Existing Save and Copy Functionality...
  document.getElementById("saveImage").addEventListener("click", function () {
    if (!canvas.backgroundImage) {
      alert("Please upload an image first.");
      return;
    }

    createTrimmedCanvas(canvas, function (dataURL) {
      if (!dataURL) {
        console.error("Data URL generation failed.");
        return;
      }
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "MOKO-PFP.png";
      // Append to the body to make it clickable in Firefox
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("Image saved successfully.");
    });
  });

  // Copy to Clipboard (Exclude Blank Space)
  document.getElementById("copyImage").addEventListener("click", function () {
    if (!canvas.backgroundImage) {
      alert("Please upload an image first.");
      return;
    }

    createTrimmedCanvas(canvas, function (dataURL) {
      if (!dataURL) {
        console.error("Data URL generation failed.");
        return;
      }

      fetch(dataURL)
        .then((res) => res.blob())
        .then((blob) => {
          const item = new ClipboardItem({ "image/png": blob });
          navigator.clipboard.write([item]).then(
            () => {
              document.querySelector("#copyImageClip").innerText = "Copied!";
              setTimeout(() => {
                button.querySelector("#copyImageClip").innerText =
                  "Copy to Clipboard";
              }, 2000);
            },
            (error) => {
              document.querySelector("#copyImageClip").innerText =
                "Failed to Copy Image!";
              setTimeout(() => {
                document.querySelector("#copyImageClip").innerText =
                  "Copy to Clipboard";
              }, 2000);
              console.error("Clipboard write failed:", error);
            }
          );
        })
        .catch((err) => {
          console.error("Error fetching dataURL:", err);
          document.querySelector("#copyImageClip").innerText =
            "Failed to Copy Image!";
          setTimeout(() => {
            document.querySelector("#copyImageClip").innerText =
              "Copy to Clipboard";
          }, 2000);
        });
    });
  });

  // Utility: Create a trimmed canvas (exclude blank space)
  function createTrimmedCanvas(originalCanvas, callback) {
    console.log("Cloning the original canvas...");
    originalCanvas.clone(function (clonedCanvas) {
      console.log("Canvas cloned.");

      // Ensure all objects have updated coordinates
      clonedCanvas.renderAll();

      let boundingRect = {
        left: Infinity,
        top: Infinity,
        right: -Infinity,
        bottom: -Infinity,
      };

      // Include background image in boundingRect if it exists
      if (clonedCanvas.backgroundImage) {
        clonedCanvas.backgroundImage.setCoords();
        let bgBounding = clonedCanvas.backgroundImage.getBoundingRect();

        boundingRect.left = Math.min(boundingRect.left, bgBounding.left);
        boundingRect.top = Math.min(boundingRect.top, bgBounding.top);
        boundingRect.right = Math.max(
          boundingRect.right,
          bgBounding.left + bgBounding.width
        );
        boundingRect.bottom = Math.max(
          boundingRect.bottom,
          bgBounding.top + bgBounding.height
        );
      }

      // Include all other objects in boundingRect
      const objects = clonedCanvas.getObjects();
      console.log(`Number of objects on cloned canvas: ${objects.length}`);
      objects.forEach((obj) => {
        obj.setCoords(); // Update object coordinates
        const objBounding = obj.getBoundingRect();
        boundingRect.left = Math.min(boundingRect.left, objBounding.left);
        boundingRect.top = Math.min(boundingRect.top, objBounding.top);
        boundingRect.right = Math.max(
          boundingRect.right,
          objBounding.left + objBounding.width
        );
        boundingRect.bottom = Math.max(
          boundingRect.bottom,
          objBounding.top + objBounding.height
        );
      });

      // Check if any objects exist
      if (boundingRect.left === Infinity || boundingRect.top === Infinity) {
        alert("No objects to save.");
        console.log("No objects found on the canvas.");
        callback(null); // Invoke callback with null to indicate failure
        return;
      }

      const trimmedWidth = Math.ceil(boundingRect.right - boundingRect.left);
      const trimmedHeight = Math.ceil(boundingRect.bottom - boundingRect.top);

      console.log(`Trimmed canvas size: ${trimmedWidth}x${trimmedHeight}`);

      // Create a new trimmed canvas
      const trimmedCanvas = new fabric.Canvas(null, {
        width: trimmedWidth,
        height: trimmedHeight,
        backgroundColor: null,
      });

      // Clone and position background image if it exists
      if (clonedCanvas.backgroundImage) {
        const bgImage = fabric.util.object.clone(clonedCanvas.backgroundImage);
        bgImage.set({
          left: clonedCanvas.backgroundImage.left - boundingRect.left,
          top: clonedCanvas.backgroundImage.top - boundingRect.top,
          selectable: false, // Make background non-selectable
          evented: false,
        });
        trimmedCanvas.setBackgroundImage(
          bgImage,
          trimmedCanvas.renderAll.bind(trimmedCanvas),
          {
            scaleX: bgImage.scaleX,
            scaleY: bgImage.scaleY,
          }
        );
      }

      // Clone and position all other objects
      clonedCanvas.getObjects().forEach((obj) => {
        const clonedObj = fabric.util.object.clone(obj);
        clonedObj.set({
          left: obj.left - boundingRect.left,
          top: obj.top - boundingRect.top,
        });
        trimmedCanvas.add(clonedObj);
      });

      // Render the trimmed canvas
      trimmedCanvas.renderAll();

      // Calculate the multiplier based on the current scale factor
      const EXPORT_MULTIPLIER =
        currentScaleFactor > 0 ? 1 / currentScaleFactor : 1;

      console.log(`Export multiplier set to: ${EXPORT_MULTIPLIER}`);

      // Export the trimmed canvas as a Data URL with dynamic resolution
      try {
        const dataURL = trimmedCanvas.toDataURL({
          format: "png",
          quality: 1,
          multiplier: EXPORT_MULTIPLIER,
        });
        console.log("Data URL generated with multiplier:", EXPORT_MULTIPLIER);
        callback(dataURL);
      } catch (error) {
        console.error("Error generating Data URL:", error);
        alert("Failed to generate image.");
        callback(null);
      }
    });
  }

  // Optional: Bring selected object to front
  canvas.on("object:selected", function (e) {
    const activeObject = e.target;
    activeObject.bringToFront();
  });
});
