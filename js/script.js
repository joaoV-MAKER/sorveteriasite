const botoes = document.querySelectorAll("nav button");
const telas = document.querySelectorAll(".tela");
const formPedido = document.getElementById("formPedido");
const listaPedidos = document.getElementById("listaPedidos");
const totalPedidos = document.getElementById("totalPedidos");
const mensagem = document.getElementById("mensagem");

let pedidos = [];

botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        botoes.forEach(b => b.classList.remove("active"));
        botao.classList.add("active");
        telas.forEach(tela => tela.classList.remove("active"));
        document.getElementById(botao.dataset.section).classList.add("active");
    });
});

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

    pedidos.push({ formato, sabor, complemento, observacao, quantidade });

    formPedido.reset();
    mensagem.textContent = "Pedido adicionado com sucesso!";
    mensagem.style.color = "green";

    atualizarLista();
    atualizarResumo();
});

function atualizarLista() {
    listaPedidos.innerHTML = "";
    pedidos.forEach((pedido, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${pedido.formato} - ${pedido.sabor}` +
                         (pedido.complemento ? ` com ${pedido.complemento}` : "") +
                         (pedido.observacao ? ` (Obs: ${pedido.observacao})` : "") +
                         ` — Quantidade: ${pedido.quantidade}`;
        listaPedidos.appendChild(li);
    });
}

function atualizarResumo() {
    totalPedidos.textContent = pedidos.length;

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

    const agora = new Date().toLocaleTimeString();
    aviso.textContent = `Resumo atualizado às ${agora}`;
}

setInterval(atualizarResumo, 10000);
