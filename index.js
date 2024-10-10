const express = require("express");
const cors = require("cors");
const app = express();
const { Sequelize, Model, DataTypes } = require("sequelize");

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

// Define User model
class User extends Model {}
User.init(
  {
    name: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    favourite_beer: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);

// Define Manager model
class Manager extends Model {}
Manager.init(
  {
    name: DataTypes.STRING,
    isManager: DataTypes.BOOLEAN,
    favourite_employee: DataTypes.STRING,
  },
  { sequelize, modelName: "manager" }
);

// Sync models with database
// sequelize.sync();
sequelize.sync({force: true});

const users = [
  { name: "Mama Bear", isAdmin: false, favourite_beer: "Falcon" },
  { name: "Papa Bear", isAdmin: false, favourite_beer: "Carlsberg" },
  { name: "Jimi Hendrix", isAdmin: false, favourite_beer: "Guitar_IPA" },
  { name: "Jim Morrison", isAdmin: false, favourite_beer: "Hottub_APA" },
  { name: "Mathias Eliasson", isAdmin: false, favourite_beer: "Punk_IPA" },
];

const managers = [
    { name: "Steve Jobs", favourite_employee: "Stefan Petersen", isManager: false },
    { name: "Bill Gates", favourite_employee: "Peter Brandin", isManager: false },
    { name: "Tim Cook", favourite_employee: "Steve Dinasour", isManager: false },
    { name: "Ingvar Kamprad", favourite_employee: "Mathias Elisson", isManager: true },
    { name: "Reidar Dahlén", favourite_employee: "JOKER", isManager: false },
  ];

app.use(cors());
app.use(express.json());
app.use(express.static("react-frontend/dist"));

app.get("/", (req, res) => {
  res.json({ data: "Hello Ikea!" });
});

app.get("/api/seeds", async (req, res) => {
  users.forEach((u) => User.create(u));
  res.json(users);
});

app.get("/api/seeds1", async (req, res) => {
    managers.forEach((m) => Manager.create(m));
    res.json(managers);
  });

app.get("/api/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.get("/api/managers", async (req, res) => {
    const managers = await Manager.findAll();
    res.json(managers);
  });

app.get("/api/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user);
});

app.get("/api/managers/:id", async (req, res) => {
    const managers = await Manager.findByPk(req.params.id);
    res.json(managers);
  });

app.post("/api/users", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.post("/api/managers", async (req, res) => {
    const managers = await Manager.create(req.body);
    res.json(managers);
  });

app.put("/api/users/:id", async (req, res) => {
    const { name, isAdmin, favourite_beer } = req.body;

    const user = await User.findByPk(req.params.id);
    await user.update({ name, isAdmin, favourite_beer });
    await user.save();
    res.json(user);
});

app.put("/api/managers/:id", async (req, res) => {
    const { name, favourite_employee, isManager } = req.body;

    const managers = await Manager.findByPk(req.params.id);
    await managers.update({ name, favourite_employee, isManager });
    await managers.save();
    res.json(managers);
});

app.delete('/api/users/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    await user.destroy();
    res.json({data: `The user with id of ${req.params.id} is removed.`});
});

app.delete('/api/managers/:id', async (req, res) => {
    const managers = await Manager.findByPk(req.params.id);
    await managers.destroy();
    res.json({data: `The manager with id of ${req.params.id} is removed.`});
});

//const port = process.env.PORT || 8080;
//app.listen(port, async () => {
  //console.log(`Server started at ${port}`);
//});

const port = process.env.PORT || 8080;
server =  app.listen(port, async () => {
    console.log(`Server started at ${port}`)
});
module.exports = {app, server}

