# Utiliza una imagen base de Apache2
FROM httpd:2.4

# Copia solo el contenido de la carpeta "Trabajo-practico-integrador-JS-Codo-a-Codo" al directorio de documentos de Apache2 en el contenedor
COPY ./ /usr/local/apache2/htdocs

# Expone el puerto 80 en el que Apache2 escuchará
EXPOSE 80