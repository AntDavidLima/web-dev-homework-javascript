const valorIMC = document.getElementById("valor-IMC");
const cardResultado = document.getElementById("idCardResultado");

const precoPlanos = {
	a: {
		basico: document.getElementById("precoPlanoBasicoA"),
		standard: document.getElementById("precoPlanoStandardA"),
		premium: document.getElementById("precoPlanoPremiumA"),
	},
	b: {
		basico: document.getElementById("precoPlanoBasicoB"),
		standard: document.getElementById("precoPlanoStandardB"),
		premium: document.getElementById("precoPlanoPremiumB"),
	},
};

function calcularIMC() {
	const nomeElement = document.getElementById("nome");
	const pesoElement = document.getElementById("peso");
	const idadeElement = document.getElementById("idade");
	const alturaElement = document.getElementById("altura");

	const nome = nomeElement.value;
	const peso = parseFloat(new String(pesoElement.value).replace(",", "."));
	const idade = parseInt(idadeElement.value);
	const altura = parseInt(new String(alturaElement.value).replace(",", "."));

	console.log(nome, peso, idade, altura);

	if (parametrosContemErros(nome, peso, idade, altura)) {
		limparPagina();
		return;
	}

	const imc = (peso / ((altura / 100) * (altura / 100))).toFixed(2);
	valorIMC.textContent = imc;

	const fatorComorbidade = verificarFatorComorbidade(imc);

	calcularEFormatarValoresPlanosOperadoraA(idade, imc);
	calcularEFormatarValoresPlanosOperadoraB(fatorComorbidade, imc);

	mostrarResultado(nome);
}

function mostrarResultado(nome) {
	const nomePlanoMap = {
		basico: "Básico",
		standard: "Standard",
		premium: "Premium",
	};

	const [nomePlanoMaisBaratoOperadoraA, valorPlanoMaisBaratoOperadoraA] =
		Object.entries(precoPlanos.a).reduce((anterior, atual) => {
			return parseFloat(anterior[1].textContent) <
				parseFloat(atual[1].textContent)
				? anterior
				: atual;
		});

	const [nomePlanoMaisBaratoOperadoraB, valorPlanoMaisBaratoOperadoraB] =
		Object.entries(precoPlanos.b).reduce((anterior, atual) => {
			return parseFloat(anterior[1].textContent) <
				parseFloat(atual[1].textContent)
				? anterior
				: atual;
		});

	const planoMaisBarato =
		parseFloat(valorPlanoMaisBaratoOperadoraA.textContent) <
			parseFloat(valorPlanoMaisBaratoOperadoraB.textContent)
			? {
				plano: nomePlanoMap[nomePlanoMaisBaratoOperadoraA],
				operadora: "A",
				valor: valorPlanoMaisBaratoOperadoraA.textContent,
			}
			: {
				plano: nomePlanoMap[nomePlanoMaisBaratoOperadoraB],
				operadora: "B",
				valor: valorPlanoMaisBaratoOperadoraB.textContent,
			};

	document.getElementById("idResultado").textContent =
		`Caro(a) ${nome}, levando em consideração apenas a informação do valor dos planos, o plano ideal para você é o plano ${planoMaisBarato.plano} da Operadora ${planoMaisBarato.operadora}. Custando ${planoMaisBarato.valor}`;

	cardResultado.classList.remove("visually-hidden");
}

function calcularEFormatarValoresPlanosOperadoraA(idade, imc) {
	precoPlanos.a.basico.textContent = (100 + idade * 10 * (imc / 10)).toFixed(2);

	precoPlanos.a.standard.textContent = (
		(150 + idade * 15) *
		(imc / 10)
	).toFixed(2);

	precoPlanos.a.premium.textContent = (
		(200 - imc * 10 + idade * 20) *
		(imc / 10)
	).toFixed(2);
}

function verificarFatorComorbidade(imc) {
	switch (imc) {
		case imc <= 18.4:
			return 10;
		case imc >= 18.5 && imc <= 24.9:
			return 1;
		case imc >= 25 && imc <= 29.9:
			return 6;
		case imc >= 30 && imc <= 34.9:
			return 10;
		case imc >= 35 && imc <= 40:
			return 20;
		default:
			return 30;
	}
}

function calcularEFormatarValoresPlanosOperadoraB(fatorComorbidade, imc) {
	precoPlanos.b.basico.textContent = (
		100 +
		fatorComorbidade * 10 * (imc / 10)
	).toFixed(2);

	precoPlanos.b.standard.textContent = (
		(150 + fatorComorbidade * 15) *
		(imc / 10)
	).toFixed(2);

	precoPlanos.b.premium.textContent = (
		(200 - imc * 10 + fatorComorbidade * 20) *
		(imc / 10)
	).toFixed(2);
}

function parametrosContemErros(nome, peso, idade, altura) {
	if (typeof nome !== "string" || nome.trim().length === 0) {
		return true;
	}

	if (isNaN(peso) || peso <= 0) {
		return true;
	}

	if (isNaN(idade) || idade <= 0) {
		return true;
	}

	if (isNaN(altura) || altura <= 0) {
		return true;
	}

	return false;
}

function limparPagina() {
	valorIMC.textContent = "0";

	new Array("a", "b").forEach((operadora) => {
		new Array("basico", "standard", "premium").forEach((plano) => {
			precoPlanos[operadora][plano].textContent = "0.00";
		});
	});

	cardResultado.classList.add("visually-hidden");
}
