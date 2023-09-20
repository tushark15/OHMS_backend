const Koa = require("koa");
const dbSchema = require("koa-mongoose-erd-generator");

// create server
const server = new Koa();

// Serve documentation
// This hosts the database ERD diagram at the "/docs" location.
// modelsPath defines the folder of your mongoose models. 
// nameColor defines the color theme of the diagram.
// TEMPLATE_HTML_FILE is a html file in which the diagramm will be embedded. 
// The diagram will replace the String "fakeDbSchema" in the html document.
server.use(
  dbSchema(
    "./docs",
    { modelsPath:"./models", nameColor: "#007bff" },
    "./erd.html"
  )
);

server.listen(80);