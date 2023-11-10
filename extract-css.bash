#!/bin/bash

# Diretório onde estão os arquivos HTML e CSS
DIRECTORY="."

# Arquivo de entrada para a lista de elementos
INPUT_FILE=$1

# Arquivo de saída para a lista de elementos
OUTPUT_FILE=$2

# Arquivo temporário de saída para a lista de elementos
TEMP_FILE="temp_elementos.txt"

# Limpar o arquivo de saída
> $OUTPUT_FILE
> $TEMP_FILE

# Função para extrair elementos com classes e ids do HTML
extract_elements() {
    grep -oE 'class="[A-Za-z0-9\-_ ]+"' $INPUT_FILE >> $TEMP_FILE
    grep -oE 'id="[A-Za-z0-9\-_ ]+"' $INPUT_FILE >> $TEMP_FILE
}

# Exportar as classes e IDs de cada arquivo HTML
for html_file in $DIRECTORY/*.html; do
    echo "Processando $html_file..."
    extract_elements $html_file
done

# Remover duplicatas e salvar no arquivo de saída
sort $TEMP_FILE | uniq > $OUTPUT_FILE

# Limpar arquivo temporário
rm -f $TEMP_FILE

echo -e "Extração concluída. Resultados salvos em\n $OUTPUT_FILE."
