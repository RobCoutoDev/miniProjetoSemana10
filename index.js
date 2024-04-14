const express = require("express");
const app = express();
const PORT = 3333;

let tarefas = [];

app.use(express.json());

const logHoraMiddleware = (req, res, next) => {
  const horaAtual = new Date().toISOString();
  console.log(
    `[${horaAtual}] Nova solicitação recebida para: ${req.method} ${req.originalUrl}`
  );
  next();
};

app.use(logHoraMiddleware);

app.post("/tarefas", (req, res) => {
  const { titulo, descricao, data_conclusao } = req.body;

  if (!titulo || !descricao || !data_conclusao) {
    return res.status(400).json({
      error:
        "Todos os campos (titulo, descricao, data de conclusao) são obrigatórios.",
    });
  }
  const novaTarefa = {
    id: tarefas.length + 1,
    titulo,
    descricao,
    data_conclusao,
  };

  tarefas.push(novaTarefa);

  res.status(201).json(novaTarefa);
});

app.get("/tarefas", (req, res) => {
  res.status(200).json(tarefas);
});

app.put("/tarefas/:id", (req, res) => {
  const tarefaId = parseInt(req.params.id);
  const { titulo, descricao, data_conclusao } = req.body;

  const tarefaAtualizar = tarefas.find((tarefa) => tarefaId === tarefaId);

  if (!tarefaAtualizar) {
    return res.status(404).json({ error: "Tarefa não encontrada." });
  }

  if (titulo) tarefaAtualizar.titulo = titulo;
  if (descricao) tarefaAtualizar.descricao = descricao;
  if (data_conclusao) tarefaAtualizar.data_conclusao = data_conclusao;

  res.status(200).json(tarefaAtualizar);
});

app.delete("/tarefas/:id", (req, res) => {
  const tarefaId = parseInt(req.params.id);

  const tarefaIndex = tarefas.findIndex((tarefa) => tarefa.id === tarefaId);

  if (tarefaIndex === -1) {
    return res.status(404).json({ error: "Tarefa não encontrada/" });
  }

  tarefas.splice(tarefaIndex, 1);

  res.status(200).json({ message: "Tarefa excluída com sucesso." });
});

app.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});