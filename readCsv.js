const fs = require("fs");
const csv = require("csv-parser");
const OpenAI = require("openai");

async function readCsvAndCreateEmbeddingsForEachCell(filePath) {
    const rows = [];
    
    // Read the CSV file
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', async () => {
          console.log('CSV file successfully processed');
          // Generate embeddings for each column in each row
          try {
            const embeddings = await Promise.all(
              rows.map(async (row) => {
                const rowEmbeddings = {};
                await Promise.all(Object.keys(row).map(async (column) => {
                  const embedding = await generateEmbedding(row[column]);
                  rowEmbeddings[column] = embedding;
                }));
                return { row, rowEmbeddings };
              })
            );
            resolve(embeddings);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
  
  // Function to generate embedding using OpenAI API
  async function generateEmbedding(textData) {
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: textData,  // Provide the input data for embedding (a single cell here)
      });
      console.table(response.data)
      return response.data[0].embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
    }
  }

module.exports = { readCsvAndCreateEmbeddingsForEachCell };
