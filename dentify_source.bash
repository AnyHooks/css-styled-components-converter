#!/bin/bash

# Verifica se o número correto de argumentos foi fornecido
if [ "$#" -lt 2 ]; then
    echo "Uso: bash identificar_origem <elementos_referenciam_css.txt> <origem1.css> <origem2.css> ..."
    exit 1
fi

# Primeiro argumento é a lista de elementos
lista_elementos=$1
shift  # Remove o primeiro argumento da lista

# Resto dos argumentos são os arquivos CSS
arquivos_css=$@

# Função para buscar estilos nos arquivos CSS e imprimir com prefixo do arquivo
buscar_estilo() {
    elemento=$1
    encontrado=0

    # Converter formato de seletor de HTML para CSS
    if [[ $elemento == class* ]]; then
        seletor_css=".${elemento#class=\"}"
        seletor_css=${seletor_css%\"}
    elif [[ $elemento == id* ]]; then
        seletor_css="#${elemento#id=\"}"
        seletor_css=${seletor_css%\"}
    else
        seletor_css=$elemento
    fi

    for arquivo_css in $arquivos_css; do
        if grep -q "$seletor_css" "$arquivo_css"; then
            grep -H "$seletor_css" "$arquivo_css" | sed "s/:.*//"
            encontrado=1
            break
        fi
    done
    if [ "$encontrado" -eq 0 ]; then
        echo "Não encontrado: $seletor_css"
    fi
}

# Ler a lista de elementos e buscar nos arquivos CSS
while IFS= read -r elemento; do
    buscar_estilo "$elemento"
done < "$lista_elementos"
