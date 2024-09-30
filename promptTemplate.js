function createPrompt(order, template) {
  return template
    .replace("{{customer}}", order.customer_name)
    .replace("{{product}}", order.product_name)
    .replace("{{quantity}}", order.quantity)
    .replace("{{total}}", order.total_price);
}

module.exports = { createPrompt };
