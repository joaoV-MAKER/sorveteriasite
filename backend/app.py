from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="1234",  # SUA SENHA DO MYSQL
        database="sorveteria"
    )

@app.route("/pedidos", methods=["POST"])
def adicionar_pedido():
    dados = request.json

    conexao = conectar()
    cursor = conexao.cursor()

    sql = """
        INSERT INTO pedidos (formato, sabor, complemento, observacao, quantidade)
        VALUES (%s, %s, %s, %s, %s)
    """

    valores = (
        dados.get("formato"),
        dados.get("sabor"),
        dados.get("complemento"),
        dados.get("observacao"),
        dados.get("quantidade")
    )

    cursor.execute(sql, valores)
    conexao.commit()

    cursor.close()
    conexao.close()

    return jsonify({"message": "Pedido salvo com sucesso!"})

@app.route("/pedidos", methods=["GET"])
def listar_pedidos():
    conexao = conectar()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT * FROM pedidos ORDER BY id DESC")
    pedidos = cursor.fetchall()

    cursor.close()
    conexao.close()

    return jsonify(pedidos)

if __name__ == "__main__":
    app.run(debug=True)
