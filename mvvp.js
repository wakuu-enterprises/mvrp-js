// mvvp.js

const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

function processSegments(segmentsDir = path.join(__dirname, '../uploads'), outputDir = path.join(__dirname, '../structured')) {
  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Create a temporary file for the ffmpeg concat list
  const concatFilePath = path.join(outputDir, 'concat_list.txt');
  const files = fs.readdirSync(segmentsDir)
    .filter(file => file.endsWith('.mp4'))
    .map(file => `file '${path.join(segmentsDir, file)}'`)
    .join('\n');

  fs.writeFileSync(concatFilePath, files);

  // Command to concatenate and structure the segments
  const command = `ffmpeg -f concat -safe 0 -i ${concatFilePath} -c copy ${path.join(outputDir, 'output.mp4')}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error processing segments: ${error.message}`);
      return;
    }
    console.log(`Segments processed: ${stdout}`);
    // Clean up temporary concat list file
    fs.removeSync(concatFilePath);
  });
}

module.exports = { processSegments };
