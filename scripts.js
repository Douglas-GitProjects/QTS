document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formulario-cadastro");



    document.getElementById("CPF").addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
        if (value.length > 11) value = value.slice(0, 11); // Limita a 11 números
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        e.target.value = value;
    });

    // Máscara de Celular: (00) 00000-0000
    document.getElementById("celular").addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        value = value.replace(/(\d)(\d{4})$/, "$1-$2");
        e.target.value = value;
    });

    // Máscara de CEP: 00000-000
    document.getElementById("cep").addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 8) value = value.slice(0, 8);
        value = value.replace(/^(\d{5})(\d)/, "$1-$2");
        e.target.value = value;
    });

    


    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Impede o recarregamento da página
        limparErros(); // Limpa as mensagens antigas antes de validar novamente

        let formValido = true;

        
        const cpfInput = document.getElementById("CPF");
        if (!validarCPF(cpfInput.value)) {
            mostrarErro(cpfInput, "CPF inválido.");
            formValido = false;
        }

       
        const dataInput = document.getElementById("data-nascimento");
        if (!validarData(dataInput.value)) {
            mostrarErro(dataInput, "Data inválida ou no futuro.");
            formValido = false;
        }


        const emailInput = document.getElementById("email");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            mostrarErro(emailInput, "Formato de e-mail inválido.");
            formValido = false;
        }


        const celularInput = document.getElementById("celular");
        const celularLimpo = celularInput.value.replace(/\D/g, "");
        if (celularLimpo.length < 10 || celularLimpo.length > 11) {
            mostrarErro(celularInput, "O celular deve conter DDD e número válidos.");
            formValido = false;
        }

        
        const cepInput = document.getElementById("cep");
        const cepLimpo = cepInput.value.replace(/\D/g, "");
        if (cepLimpo.length !== 8) {
            mostrarErro(cepInput, "O CEP deve conter 8 dígitos.");
            formValido = false;
        }

       
        if (formValido) {
            alert("Cadastro validado e realizado com sucesso!");
            form.reset(); // Limpa o formulário após o sucesso
        }
    });

    // Limpar mensagens de erro quando o botão "Limpar" for clicado
    form.addEventListener("reset", limparErros);

    

    // Exibe a mensagem de erro logo abaixo do campo inválido
    function mostrarErro(input, mensagem) {
        const erro = document.createElement("span");
        erro.className = "mensagem-erro";
        erro.style.color = "#d9534f"; // Vermelho
        erro.style.fontSize = "0.85rem";
        erro.style.display = "block";
        erro.style.marginTop = "5px";
        erro.innerText = mensagem;
        
        // Insere o span logo após o input
        input.parentNode.insertBefore(erro, input.nextSibling);
        input.style.border = "2px solid #d9534f"; // Borda vermelha
    }

    // Remove as marcações de erro da tela
    function limparErros() {
        const erros = document.querySelectorAll(".mensagem-erro");
        erros.forEach(erro => erro.remove());
        
        const inputs = document.querySelectorAll("input, select");
        inputs.forEach(input => input.style.border = ""); // Reseta a borda
    }

    // Algoritmo matemático de Validação do CPF
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ""); // Remove pontos e traços
        
        // Rejeita CPFs com tamanho errado ou com dígitos repetidos (ex: 111.111.111-11)
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        // Cálculo do primeiro dígito verificador
        let soma = 0;
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        // Cálculo do segundo dígito verificador
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    }

    // Validação da Data (não permite datas futuras)
    function validarData(dataString) {
        if (!dataString) return false;
        
        const partes = dataString.split('-'); // Quebra em Ano, Mês, Dia
        const dataInformada = new Date(partes[0], partes[1] - 1, partes[2]); // Mês começa no 0 em JS
        const dataAtual = new Date();
        dataAtual.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas os dias
        
        return dataInformada <= dataAtual;
    }
});