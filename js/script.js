const botoes = document.querySelectorAll("nav button");
const telas = document.querySelectorAll(".tela");
const formPedido = document.getElementById("formPedido");
const listaPedidos = document.getElementById("listaPedidos");
const totalPedidos = document.getElementById("totalPedidos");
const mensagem = document.getElementById("mensagem");

// Alternar telas
botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        botoes.forEach(b => b.classList.remove("active"));
        botao.classList.add("active");
        telas.forEach(tela => tela.classList.remove("active"));
        document.getElementById(botao.dataset.section).classList.add("active");
        
        if (botao.dataset.section === "pedidos" || botao.dataset.section === "resumo") {
            carregarPedidos();
        }
    });
});

// Enviar pedido para API
formPedido.addEventListener("submit", (e) => {
    e.preventDefault();

    const formato = document.getElementById("formato").value;
    const sabor = document.getElementById("sabor").value;
    const complemento = document.getElementById("complemento").value;
    const observacao = document.getElementById("observacao").value.trim();
    const quantidade = parseInt(document.getElementById("quantidade").value);

    if (!formato || !sabor || quantidade <= 0) {
        mensagem.textContent = "Preencha os campos obrigatórios.";
        mensagem.style.color = "red";
        return;
    }

    // 🔵 Envia para o backend Flask
    fetch("http://127.0.0.1:5000/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formato, sabor, complemento, observacao, quantidade })
    })
    .then(res => res.json())
    .then(data => {
        mensagem.textContent = data.message;
        mensagem.style.color = "green";
        formPedido.reset();
        carregarPedidos();
    })
    .catch(err => {
        mensagem.textContent = "Erro ao enviar pedido.";
        mensagem.style.color = "red";
    });
});

// Carregar pedidos do banco de dados
function carregarPedidos() {
    fetch("http://127.0.0.1:5000/pedidos")
        .then(res => res.json())
        .then(pedidos => {
            listaPedidos.innerHTML = "";

            pedidos.forEach((pedido, index) => {
                const li = document.createElement("li");
                li.textContent =
                    `${index + 1}. ${pedido.formato} - ${pedido.sabor}` +
                    (pedido.complemento ? ` com ${pedido.complemento}` : "") +
                    (pedido.observacao ? ` (Obs: ${pedido.observacao})` : "") +
                    ` — Quantidade: ${pedido.quantidade}`;
                listaPedidos.appendChild(li);
            });

            totalPedidos.textContent = pedidos.length;
            atualizarResumo();
        });
}

// Atualiza horário da última atualização
function atualizarResumo() {
    let aviso = document.getElementById("avisoAtualizacao");
    if (!aviso) {
        aviso = document.createElement("p");
        aviso.id = "avisoAtualizacao";
        aviso.style.fontSize = "12px";
        aviso.style.color = "white";
        aviso.style.fontWeight = "bold";
        aviso.style.marginTop = "5px";
        totalPedidos.parentNode.appendChild(aviso);
    }
    aviso.textContent = `Resumo atualizado às ${new Date().toLocaleTimeString()}`;
}

setInterval(carregarPedidos, 10000);
