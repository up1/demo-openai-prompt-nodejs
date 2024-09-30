const readlineSync = require('readline-sync');
const { getResponse } = require('./openaiClient');
const { readCsvAndCreateEmbeddingsForEachCell } = require('./readCsv');
const { createPrompt } = require('./promptTemplate');

const csvFilePath = './orders.csv'; // Path to your CSV file

async function main() {
  try {
    const vectors = await readCsvAndCreateEmbeddingsForEachCell(csvFilePath);

    // Display some orders to choose from
    console.log("Available Orders:");
    vectors.forEach((vector, index) => {
      console.log(`${index + 1}: ${vector.row.customer_name} - ${vector.row.product_name}`);
    });

    // Get user input for order choice
    const orderIndex = readlineSync.questionInt('Select an order (by number): ') - 1;
    const selectedOrder = vectors[orderIndex].row;

    // Create the prompt based on the selected order
    const prompt = createPrompt(selectedOrder, "Customer {{customer}} ordered {{quantity}} units of {{product}} for a total of {{total}}. How can I assist further?");
    console.log(`Generated Prompt: ${prompt}`);

    // Send the prompt to OpenAI API
    const response = await getResponse(prompt);
    console.log(`AI Response: ${response}`);

  } catch (error) {
    console.error("Error:", error);
  }
}

main();
