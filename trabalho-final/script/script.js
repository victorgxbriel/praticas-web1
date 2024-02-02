"use strict"

var passageiros = new Array();
var tempPass = new Array();
/*
    FUNÇÕES COMPARTILHADAS ENTRE LOGIN E CADASTRO
*/

function limparAvisos() {
    var avisos = document.querySelectorAll(".aviso");
    avisos.forEach(aviso => {
        aviso.parentNode.removeChild(aviso);
    });
}

function limpar() {
    limparAvisos();
    var campos = document.querySelectorAll(".campos input");
    campos.forEach(campo => {
        campo.value = null;
    });
}

function verificaCampos() {
    var campos = document.querySelectorAll(".campos");
    var flag = false;

    campos.forEach(campo => {
        var input = campo.querySelector("input");
        var aviso = campo.querySelector(".aviso");

        if (input.value === "") {
            if (!aviso) {
                aviso = document.createElement("p");
                aviso.textContent = "Campo vazio!";
                aviso.classList.add("aviso");
                campo.appendChild(aviso);
            }
            flag = true;
        }
    });
    if (flag) {
        var erro2 = new Error("Campo vazio");
        erro2.title = "Erro de Preenchimento";
        erro2.customMessage = "Algum campo ficou vazio. Preencha todos!";
        throw erro2;
    }
}

/*
    FUNÇÕES EXLCUSIVAS DO HTML LOGIN
*/

function login() {
    var user = document.querySelector("#userLogin").value;
    var pass = document.querySelector("#senhaLogin").value;

    if (user === "admin" && pass === "admin") {
        window.location.href = "./cadastro.html";
    } else {
        var form = document.getElementById("form");
        var aviso = form.querySelector(".aviso");

        if (!aviso) {
            aviso = document.createElement("p");
            aviso.textContent = "Senha e/ou usuario inválido(s)";
            aviso.classList.add("aviso");
            form.appendChild(aviso);
        }

        var erro = new Error("Credenciais inválidas");
        erro.title = "Erro de Login";
        erro.customMessage = "Senha e/ou usuário incorreto(s).";
        throw erro;
    }
}

document.getElementById("botaoLogin").addEventListener("click", function () {
    try {
        limparAvisos();
        verificaCampos();
        login();
    } catch (erro) {
        alert(erro.title + ": " + erro.customMessage);
    }
});

/*
    FUNÇÕES EXCLUSIVAS DO HTML CADASTRO
*/
function addPass(n, cp, end, cl){
    // verifico se já existe o cpf cadastrado
    if(passageiros.findIndex(function (c) { return c.cpf === cp;}) === -1){
        var passageiro = new Object();
        passageiro.nome = n;
        passageiro.cpf = cp,
        passageiro.endereco = end;
        passageiro.classe = cl;
        passageiros.push(passageiro);
        tempPass.push(passageiro);
        console.log(passageiro, passageiros);
    } else {
        var campo = document.querySelector("#cpfCadastro").parentNode;
        var aviso = campo.querySelector(".aviso");
        
        if(!aviso){
            aviso = document.createElement("p");
            aviso.textContent = "CPF já cadastrado!";
            aviso.classList.add("aviso");
            campo.appendChild(aviso);
        }
        var erro = new Error("Passageiro cadastrado");
        erro.title = "CPF cadastrado";
        erro.customMessage = "Passageiro já cadastado com esse cpf: " + cp;
        throw erro;
    }
}

function addPassageiro() {
    try {
        limparAvisos();
        verificaCampos();
        var nome = document.getElementById("nameCadastro").value;
        var cpf = document.getElementById("cpfCadastro").value;
        var end = document.getElementById("endCadastro").value;
        var classe = $("input[name='classeCadastro']:checked").val();
        addPass(nome, cpf, end, classe );
        alert("Passageiro cadastrado com sucesso. Informações:\nNome: " + nome + ".\nCPF: " + cpf + "\nEndereço: " + end + "\nClasse: " + classe)
    } catch (erro) {
        alert(erro.title + ": " + erro.customMessage);
    }
}

function toString() {
    var string = "\n";
    tempPass.forEach(function(pass, index, tempPass) {
        string += "Passageiro " + index + ":\n";
        string += "Nome: " + pass.nome + "\n";
        string += "CPF: " + pass.cpf + "\n";
        string += "Endereço: " + pass.endereco + "\n";
        string += "Classe: " + pass.classe + "\n";
    });

    return string;
}

function enviarDados() {
    try {
        sessionStorage.setItem('pass', JSON.stringify(passageiros));
        alert("Passageiros adicionados: " + toString());
        tempPass = [];
        window.location.href = "./index.html";
    } catch (error) {
        alert(error.title + ": " + error.message);
    }
}

/*
    FUNÇÕES EXLCUSIVAS DO HTML INDEX
*/

function limparResultado () {
    var resultadoPass = document.querySelectorAll(".pass");
    resultadoPass.forEach(pass => {
        pass.parentNode.removeChild(pass);
    });
}

function divPassageiro(pass, index) {
    var div = document.createElement("div");
    div.classList.add("pass");
    var h1 = document.createElement("h1");
    h1.textContent = "Passageiro " + index;
    var p1 = document.createElement("p");
    var p2 = document.createElement("p");
    var p3 = document.createElement("p");
    var p4 = document.createElement("p");
    p1.textContent = "Nome: " + pass.nome;
    p2.textContent = "CPF: " + pass.cpf;
    p3.textContent = "Endereço: " + pass.endereco;
    p4.textContent = "Classe: " + pass.classe;
    div.append(h1,p1,p2,p3,p4);
    document.getElementById("resultado").appendChild(div);
}

function filtroPassageiros() {
    try {
        passageiros = JSON.parse(sessionStorage.getItem('pass'));
        var filtro = document.querySelector("#filtroSelect");
        var opcaoSelecionada = filtro.value;

        return passageiros.filter(pass => {
            if(opcaoSelecionada === 'todos'){
                return true;
            } else {
                return pass.classe === opcaoSelecionada;
            }
        });
    } catch(error) {
        alert(error.title + ": " + error.message);
    }
}

function buscarCPF() {
    try {
        limparResultado();
        passageiros = JSON.parse(sessionStorage.getItem('pass'));
        var passageirosFiltrados = filtroPassageiros();
        var cpfTarget = document.querySelector("#busca").value;
        var index = passageirosFiltrados.findIndex(function (c) { return c.cpf === cpfTarget;});
        /*
        var index = passageirosFiltrados.indexOf((pass) => {
            return pass.cpf === cpfTarget;
        });
        */
        if(index === -1){
            var erro = new Error("Passageiro não encontrado");
            erro.title = "Passageiro não encontrado";
            erro.customMessage = "Nenhum passageiro foi encontrado com o cpf: " + cpfTarget + "\nNa classe: " + document.querySelector("#filtroSelect").value;
            throw erro;
        } else {
            divPassageiro(passageirosFiltrados[index], 1);
        }
    } catch (error) {
        alert(error.title + ": " + error.customMessage);
    }
}

function filtragem(){
    try {
        limparResultado();
        var passageirosFiltrados = filtroPassageiros();
        passageirosFiltrados.forEach(function(pass, index, passageirosFiltrados) {
            divPassageiro(pass, index+1);
        });
    } catch (error) {
        alert(error.title + ": " + error.message);
    }
}