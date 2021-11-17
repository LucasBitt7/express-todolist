const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get('/', (request, response) => {
     return response.send("maconha")
})

app.get('/todos', (request, response) => {
    const showPendingTodos = request.query.showPendingTodos;

     fs.readFile('./store/todos.json', 'utf-8', (err, data) => {
       if(err) {
         return response.status(500).send("this is not good for you bro")
       }
        const todos = JSON.parse(data);
         if (showPendingTodos !== "1") {
                return response.json({todos: todos});
         } else {
           return response.json({todos: todos.filter(t => {
             return t.complete === false;
           })})
         }
   
     })
})

app.post('/todo', (req, res) => {
  if(!req.body.name) {
    return res.status(404).send("missing name motherfoca")
  }
  fs.readFile('./store/todos.json', 'utf-8', (err, data) => {
    if(err) {
      return response.status(500).send("this is not good for you bro")
    }
  const todos = JSON.parse(data)
  const maxId = Math.max.apply(Math, todos.map(t => {return t.id}))

  todos.push({
    id: maxId +1,
    complete: false,
    name: req.body.name
  })
  fs.writeFile('./store/todos.json', JSON.stringify(todos), () => {

    return response.json({'status':'ok'})
    });
})

app.put('/todos/:id/complete', (req, res) => {
    const id = req.params.id
    const findTodoById = (todos, id) => {
      for(let i = 0; i < todos.length; i++) {
        if(parseInt(id) === todos[i].id) {
          return i;
        }
      }
      return -1;
    }

    fs.readFile('./store/todos.json', 'utf-8', (err, data) => {
      if(err) {
        return response.status(500).send("this is not good for you bro")
      }
      let todos = JSON.parse(data);
       const todoIndex = findTodoById(todos, id)
       if(todoIndex === -1) {
        return response.status(404).send("not found browser");
      }
      todos[todoIndex].complete = true;
      fs.writeFile('./store/todos.json', JSON.stringify(todos), () => {

      return response.json({'status':'ok'})
      });
      return response.json(todos[todoIndex]);
    })
})

app.listen(3000, () => {
    console.log("listening on localhost:3000")
})