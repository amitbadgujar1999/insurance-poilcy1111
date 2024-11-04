function generateFibonacci(n) {
    let fibonacciSeries = new Array(n); // Create an array of size n
    
    // Initialize the first two Fibonacci numbers
    let a = 0, b = 1;

    for (let i = 0; i < n; i++) {
        fibonacciSeries[i] = a; // Store the current Fibonacci number at index i
        let next = a + b; // Calculate the next Fibonacci number
        a = b; // Update a to the next number
        b = next; // Update b to the next number
    }

    return fibonacciSeries;
}

// Example: Generate the first 10 Fibonacci numbers
console.log(generateFibonacci(10));
