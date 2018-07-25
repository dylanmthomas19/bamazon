var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    storeFront();
});

function storeFront() {
    console.log("Welcome to Bamazon Dragons! \n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "Which item, by ID, would you like to buy?",
                    name: "item"
                },
                {
                    type: "input",
                    message: "How many would you like?",
                    name: "quantity"
                }
            ])
            .then(answers => {
                res.forEach(product => {
                    if((answers.item == product.id)&&(product.stock_quantity>=answers.quantity)){
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: product.stock_quantity - answers.quantity
                                },
                                {
                                    id: answers.item
                                }
                            ],err=>{
                                if(err) throw err;
                                console.log("You bought "+answers.quantity+" units of "+product.product_name)
                            })
                    } else if((answers.item == product.id)&&(product.stock_quantity<answers.quantity)){
                        console.log("Sorry, We don't have that many "+product.product_name)
                    } else {
                        console.log("Sorry, We don't have that item...")
                    }
                });
                storeFront();
            })
    });
}

