const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function list(req, res, next) {
    res.json({data: dishes})
}

function bodyDataHas(property) {
    return function (req, res, next) {
//         console.log(req.body.data.price)
        if(req.body.data.price < 0) {
          return next({
            status: 400,
            message: `price must be 0 or more`
          })
        }
        if(req.body.data && req.body.data[property]) {
            return next()
        }
        next({
            status:400,
            message: `Dish must include a ${property}`
        })
    }
}
function create(req, res, next) {
    const newDish = {
        id: nextId(),
        name: req.body.data.name,
        description: req.body.data.description,
        price: req.body.data.description,
        image_url: req.body.data.image_url,
    }
    dishes.push(newDish)
    res.status(201).json({data: newDish})
}

function dishExists(req, res, next) {
    const {dishId} = req.params;
    const dishFound = dishes.find((dish)=> dish.id === dishId);
    if (dishFound) {
        res.locals.dish = dishFound;
        return next()
    }
    next({
        status: 404,
        message: `Dish does not exist: ${dishId}.`
    })
}

function read(req, res) {
    res.status(200).json({data: res.locals.dish})
}

function matchUnique(req, res, next) {
    const {dishId} = req.params;
    const dish = res.locals.dish;
    const update = req.body.data;
    console.log("***", dish.id, update.id)
    if (dish) {
        return next()
    }
    next({
        status: 400,
    })
}

function idPropertyIsValid(req, res, next) {
  const { dishId } = req.params;
  const { data: { id } = {} } = req.body;

  !id || id === dishId
    ? next()
    : next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
      });
}


function update(req, res, next) {
  let dish = res.locals.dish;
  const {data: {name, description, price, image_url} = {}} = req.body;
  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;
  
  res.json({data: dish})
}

function priceIsValidNumber(req, res, next) {
  const { data: { price } = {} } = req.body;

  price > 0 && Number.isInteger(price)
    ? next()
    : next({
        status: 400,
        message: `Dish must have a price that is an integar greater than 0`
      });
}

module.exports = {
  list,
  create: [
      bodyDataHas("name"),
      bodyDataHas("description"),
      bodyDataHas("price"),
      bodyDataHas("image_url"),
      create
  ],
  read: [
      dishExists,
      read
  ],
  update: [
    dishExists,
    bodyDataHas("name"),
    bodyDataHas("description"),
    bodyDataHas("price"),
    bodyDataHas("image_url"),
    priceIsValidNumber,
    idPropertyIsValid,
    update
  ]
}