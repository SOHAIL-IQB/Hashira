const fs = require('fs');

// Function to convert a number from any base to decimal
function baseToDecimal(value, base) {
    let result = 0n; // Using BigInt for large numbers
    const baseBigInt = BigInt(base);
    
    for (let i = 0; i < value.length; i++) {
        const digit = value[i];
        let digitValue;
        
        if (digit >= '0' && digit <= '9') {
            digitValue = BigInt(digit.charCodeAt(0) - '0'.charCodeAt(0));
        } else {
            digitValue = BigInt(digit.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 10);
        }
        
        result = result * baseBigInt + digitValue;
    }
    
    return result;
}

// Lagrange interpolation to find the polynomial value at x = 0 (constant term)
function lagrangeInterpolation(points) {
    const k = points.length;
    let result = 0n;
    
    for (let i = 0; i < k; i++) {
        let xi = BigInt(points[i].x);
        let yi = points[i].y;
        
        // Calculate the Lagrange basis polynomial Li(0)
        let numerator = 1n;
        let denominator = 1n;
        
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = BigInt(points[j].x);
                numerator *= (0n - xj);
                denominator *= (xi - xj);
            }
        }
        
        result += yi * numerator / denominator;
    }
    
    return result;
}

// Function to read and solve a test case from JSON file
function solveTestCaseFromFile(filename) {
    try {
        // Read the JSON file
        const data = fs.readFileSync(filename, 'utf8');
        const testCase = JSON.parse(data);
        
        const n = testCase.keys.n;
        const k = testCase.keys.k;
        
        console.log(`Reading from ${filename}:`);
        console.log(`n = ${n}, k = ${k}`);
        
        // Extract and decode points
        const points = [];
        
        for (let key in testCase) {
            if (key !== 'keys') {
                const x = parseInt(key);
                const base = parseInt(testCase[key].base);
                const encodedValue = testCase[key].value;
                
                // Decode the y value from the given base to decimal
                const y = baseToDecimal(encodedValue, base);
                
                points.push({ x: x, y: y });
                console.log(`Point: x=${x}, encoded_y=${encodedValue} (base ${base}), decoded_y=${y.toString()}`);
            }
        }
        
        // Sort points by x coordinate for consistency
        points.sort((a, b) => a.x - b.x);
        
        // We only need k points to solve for the polynomial
        // Take the first k points
        const selectedPoints = points.slice(0, k);
        
        console.log(`\nUsing first ${k} points for calculation:`);
        selectedPoints.forEach((point, index) => {
            console.log(`Point ${index + 1}: (${point.x}, ${point.y.toString()})`);
        });
        
        // Use Lagrange interpolation to find the constant term (value at x = 0)
        const secret = lagrangeInterpolation(selectedPoints);
        
        return secret.toString();
        
    } catch (error) {
        console.error(`Error reading file ${filename}:`, error.message);
        return null;
    }
}

// Main function to solve both test cases
function main() {
    console.log("Shamir's Secret Sharing - Reading from JSON Files");
    console.log("================================================\n");
    
    // Solve Test Case 1
    console.log("=== TEST CASE 1 ===");
    const secret1 = solveTestCaseFromFile('testcase1.json');
    if (secret1 !== null) {
        console.log(`\nSecret for Test Case 1: ${secret1}`);
    }
    
    console.log("\n" + "=".repeat(50) + "\n");
    
    // Solve Test Case 2
    console.log("=== TEST CASE 2 ===");
    const secret2 = solveTestCaseFromFile('testcase2.json');
    if (secret2 !== null) {
        console.log(`\nSecret for Test Case 2: ${secret2}`);
    }
    
    // Print final results
    console.log("\n" + "=".repeat(50));
    console.log("FINAL RESULTS:");
    console.log("=".repeat(50));
    if (secret1 !== null) {
        console.log(`Test Case 1 Secret: ${secret1}`);
    }
    if (secret2 !== null) {
        console.log(`Test Case 2 Secret: ${secret2}`);
    }
}

// Alternative function to create the JSON files programmatically
function createTestFiles() {
    const testCase1 = {
        "keys": {
            "n": 4,
            "k": 3
        },
        "1": {
            "base": "10",
            "value": "4"
        },
        "2": {
            "base": "2",
            "value": "111"
        },
        "3": {
            "base": "10",
            "value": "12"
        },
        "6": {
            "base": "4",
            "value": "213"
        }
    };
    
    const testCase2 = {
        "keys": {
            "n": 10,
            "k": 7
        },
        "1": {
            "base": "6",
            "value": "13444211440455345511"
        },
        "2": {
            "base": "15",
            "value": "aed7015a346d63"
        },
        "3": {
            "base": "15",
            "value": "6aeeb69631c227c"
        },
        "4": {
            "base": "16",
            "value": "e1b5e05623d881f"
        },
        "5": {
            "base": "8",
            "value": "316034514573652620673"
        },
        "6": {
            "base": "3",
            "value": "2122212201122002221120200210011020220200"
        },
        "7": {
            "base": "3",
            "value": "20120221122211000100210021102001201112121"
        },
        "8": {
            "base": "6",
            "value": "20220554335330240002224253"
        },
        "9": {
            "base": "12",
            "value": "45153788322a1255483"
        },
        "10": {
            "base": "7",
            "value": "1101613130313526312514143"
        }
    };
    
    try {
        fs.writeFileSync('testcase1.json', JSON.stringify(testCase1, null, 2));
        fs.writeFileSync('testcase2.json', JSON.stringify(testCase2, null, 2));
        console.log("Test case files created successfully!");
    } catch (error) {
        console.error("Error creating test files:", error.message);
    }
}

// Uncomment the line below to create the test files first
// createTestFiles();

// Run the main function
main();
