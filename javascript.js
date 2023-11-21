
const MENSAGEM_IMC = "Seu IMC é ";
const MENSAGEM_PRECO = "R$  ";

const ID_PRECO_PLANO_BASICO_A = "precoPlanoBasicoA";
const ID_PRECO_PLANO_STANDARD_A = "precoPlanoStandardA";
const ID_PRECO_PLANO_PREMIUM_A = "precoPlanoPremiumA";
const ID_PRECO_PLANO_BASICO_B = "precoPlanoBasicoB";
const ID_PRECO_PLANO_STANDARD_B = "precoPlanoStandardB";
const ID_PRECO_PLANO_PREMIUM_B = "precoPlanoPremiumB";

let imc = 0;
let listaPrecosOperadoraA = [];
let listaPrecosOperadoraB = [];

function calcularIMC(){
    const ID_DIV_IMC = "divIMC";
    const ID_RESULTADO = "idCardResultado";

    let nome = document.getElementById("nome");
    nome = nome.value;

    let peso = document.getElementById("peso"); 
    peso = parseFloat(new String(peso.value).replace(",", "."));

    let idade = document.getElementById("idade");
    idade = parseInt(idade.value);

    let altura = document.getElementById("altura");
    altura = parseFloat(new String(altura.value).replace(",", "."));

    if(verificarParametros(nome, peso, idade, altura)){
        imc = 0;
        popularInnerHTML(ID_DIV_IMC, (MENSAGEM_IMC + imc));
        zerarPrecoPlanos();
        mostrarElemento(ID_RESULTADO, false);
        return;
    }

    imc = (peso / (altura * altura)).toFixed(2);
    popularInnerHTML(ID_DIV_IMC, (MENSAGEM_IMC + imc));

    calcularEFormatarValoresPlanosOperadoraA(idade);
    calcularEFormatarValoresPlanosOperadoraB(verificarFatorComorbidade());

    mostrarResultado(nome);
    mostrarElemento(ID_RESULTADO, true);
}

function mostrarResultado(nome) {
    let numeroPlanoMaisBarato = 0;
    let nomeOperadora = "A";
    let precoPlanoMaisBarato = listaPrecosOperadoraA[0].toFixed(2);

    for(let indiceA = 0; indiceA < listaPrecosOperadoraA.length; indiceA++ ) {
        if(precoPlanoMaisBarato > listaPrecosOperadoraA[indiceA]) {
            nomeOperadora = "A";
            precoPlanoMaisBarato = listaPrecosOperadoraA[indiceA].toFixed(2);
            numeroPlanoMaisBarato = indiceA;
        }
    }

    for(let indiceB = 0; indiceB < listaPrecosOperadoraB.length; indiceB++ ) {
        if(precoPlanoMaisBarato > listaPrecosOperadoraB[indiceB]) {
            nomeOperadora = "B";
            precoPlanoMaisBarato = listaPrecosOperadoraB[indiceB].toFixed(2);
            numeroPlanoMaisBarato = indiceB;
        }
    }   
    
    let nomePlano = retonarNomePlano(numeroPlanoMaisBarato);
    popularInnerHTML("idResultado", `<strong>Caro(a) ${nome}, o plano ideal para você é o plano ${nomePlano} da Operadora ${nomeOperadora} de R$ ${precoPlanoMaisBarato}.</strong>`);
}

function retonarNomePlano(numeroPlano) {
    if(numeroPlano == 0){
        return "Básico";

    } else if(numeroPlano == 1) {
        return "Standard";

    } else if(numeroPlano == 2) {
        return "Premium";
    } else {
        return "X";
    }
}

function calcularEFormatarValoresPlanosOperadoraA(idade){
    listaPrecosOperadoraA = [];

    listaPrecosOperadoraA.push(parseFloat(100 + (idade * 10 * (imc / 10))));
    listaPrecosOperadoraA.push(parseFloat((150 + (idade * 15)) * (imc / 10)));
    listaPrecosOperadoraA.push(parseFloat((200 - (imc * 10) + (idade * 20)) * (imc / 10)));
    
    popularInnerHTML(ID_PRECO_PLANO_BASICO_A, (MENSAGEM_PRECO + listaPrecosOperadoraA[0].toFixed(2)));
    popularInnerHTML(ID_PRECO_PLANO_STANDARD_A, (MENSAGEM_PRECO + listaPrecosOperadoraA[1].toFixed(2)));
    popularInnerHTML(ID_PRECO_PLANO_PREMIUM_A, (MENSAGEM_PRECO + listaPrecosOperadoraA[2].toFixed(2)));
}

function verificarFatorComorbidade() {
console.log("imc: "+ imc);

    if(imc < 18.5){
        console.log("1");
        return 10;

    } else if(imc >= 18.5 && imc < 25) {
        console.log("2");
        return 1;

    } else if(imc >= 25 && imc < 30) {
        console.log("3");
        return 6;

    } else if(imc >= 30 && imc < 35) {
        console.log("4");
        return 10;

    } else if(imc >= 35 && imc <= 40) {
        console.log("5");
        return 20;

    } else {
        return 30;
    } 
}

function calcularEFormatarValoresPlanosOperadoraB(fatoComorbidade){
    listaPrecosOperadoraB = [];

    console.log(fatoComorbidade);

    listaPrecosOperadoraB.push(parseFloat(100 + (fatoComorbidade * 10 * (imc / 10))));
    listaPrecosOperadoraB.push(parseFloat((150 + (fatoComorbidade * 15)) * (imc / 10)));
    listaPrecosOperadoraB.push(parseFloat((200 - (imc * 10) + (fatoComorbidade * 20)) * (imc / 10)));
    
    popularInnerHTML(ID_PRECO_PLANO_BASICO_B, (MENSAGEM_PRECO + listaPrecosOperadoraB[0].toFixed(2)));
    popularInnerHTML(ID_PRECO_PLANO_STANDARD_B, (MENSAGEM_PRECO + listaPrecosOperadoraB[1].toFixed(2)));
    popularInnerHTML(ID_PRECO_PLANO_PREMIUM_B, (MENSAGEM_PRECO + listaPrecosOperadoraB[2].toFixed(2)));
}

function verificarParametros(nome, peso, idade, altura){
    let isParametrosCorretos = true;
    const ID_FEEDBACK_NOME = "feedback-nome";
    const ID_FEEDBACK_PESO = "feedback-peso";
    const ID_FEEDBACK_IDADE = "feedback-idade";
    const ID_FEEDBACK_ALTURA = "feedback-altura";
    
    if(nome == ''){
        mostrarElemento(ID_FEEDBACK_NOME, true);
        isParametrosCorretos = false;
    } else {
        mostrarElemento(ID_FEEDBACK_NOME, false);
    }

    if(isNaN(peso)){
        mostrarElemento(ID_FEEDBACK_PESO, true);
        isParametrosCorretos = false;

    } else {
        mostrarElemento(ID_FEEDBACK_PESO, false);
    }

    if(isNaN(idade)){
        mostrarElemento(ID_FEEDBACK_IDADE, true);
        isParametrosCorretos = false;
    } else {
        mostrarElemento(ID_FEEDBACK_IDADE, false);
    }

    if(isNaN(altura)){
        mostrarElemento(ID_FEEDBACK_ALTURA, true);
        isParametrosCorretos = false;
    } else {
        mostrarElemento(ID_FEEDBACK_ALTURA, false);
    }

    return !isParametrosCorretos;
}

function zerarPrecoPlanos() {
    popularInnerHTML(ID_PRECO_PLANO_BASICO_A, (MENSAGEM_PRECO +  parseFloat(0).toFixed(2)));
    popularInnerHTML(ID_PRECO_PLANO_STANDARD_A, (MENSAGEM_PRECO + parseFloat(0).toFixed(2)));
    popularInnerHTML(ID_PRECO_PLANO_PREMIUM_A, (MENSAGEM_PRECO + parseFloat(0).toFixed(2)));

    popularInnerHTML(ID_PRECO_PLANO_BASICO_B, (MENSAGEM_PRECO +  parseFloat(0).toFixed(2)));
    popularInnerHTML(ID_PRECO_PLANO_STANDARD_B, (MENSAGEM_PRECO + parseFloat(0).toFixed(2)));
    popularInnerHTML(ID_PRECO_PLANO_PREMIUM_B, (MENSAGEM_PRECO + parseFloat(0).toFixed(2)));
}

function popularInnerHTML(id, valor) {
    document.getElementById(id).innerHTML = valor;
}

function mostrarElemento(idFeedback, isMostrar) {
    if(isMostrar){
        document.getElementById(idFeedback).style.display = "";
    } else {
        document.getElementById(idFeedback).style.display = "none";
    }
}