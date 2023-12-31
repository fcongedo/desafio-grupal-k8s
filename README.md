## Paso 0: Instalación de Herramientas/Entorno de trabajo 

 Este `README` proporciona instrucciones básicas para la instalación de herramientas necesarias y la configuración de una máquina virtual con Vagrant con las herramientas necesarias para el desafio (docker, minikube, kubectl, argocd cli, etc)

## Configuración de Vagrant :

En el directorio de tu proyecto, encontrarás una carpeta llamada "Vagrant". Esta carpeta contiene la configuración necesaria para levantar una máquina virtual.

1. **Iniciar la Máquina Virtual**: Ejecuta el siguiente comando dentro del directorio "Vagrant":
   ```bash
   vagrant up
   ```
2. **Conexión SSH**:  Para conectarte a la máquina virtual por SSH, utiliza el siguiente comando:
   ```bash
   vagrant ssh
   ```
3. **Túnel a la Máquina Host**: Puedes crear un túnel desde la máquina virtual a tu máquina host para acceder a servicios que se ejecuten en la VM desde el host. Utiliza el siguiente comando para configurar el túnel:
   ```bash
   vagrant ssh -- -L 8082:localhost:8082
   ```

## Paso 1: Dockerfile

 Para construir la imagen de docker podremos hacerlo de forma manual descargando el codigo y haciendo un docker build o utilizar la github action ya configurada para que en cada cambio que hagamos en algun archivo del directorio Docker, se ejecute y haga el proceso de construir la imagen y subirla a dockerhub, es importante haber activado Github Actions y configurado los secretos para subir la imagen a dockerhub.

## Uso de docker

1. **Primero debemos descargar la imagen manualmente**: Para descargar la imagen alojada en un repositorio de dockerhub, debemos ejecutar el siguiente comando:
   ```bash
   docker pull fcongedo/mi-web-apache2:5
   ```
   
2. **Crear la Imagen de Docker Manualmente**:Para crear una imagen de Docker de manera manual, ejecuta el siguiente comando, que mapea el puerto 8080 de la máquina virtual al puerto 80 del contenedor. Asegúrate de cambiar los nombres y versiones según tu configuración:
   ```bash
   docker run -d -p 8082:80 --name website-apache2 fcongedo/mi-web-apache2:5 
   ```

3. **Crear la Imagen de Docker con Docker Compose**: Dirígete al directorio /desafio-grupal-k8s/Docker-compose en la máquina virtual y ejecuta el siguiente comando para crear la imagen utilizando Docker Compose
   ```bash
   docker compose up -d
   ```
4. **Verificar su funcionamiento**: utilizando un tunel de vagrant o desde curl localhost:8082
   ```bash
   vagrant ssh -- -L 8082:localhost:8082
   ```

## Paso 2: Kubernetes

0. **Iniciar Minikube:** Ejecuta el siguiente comando para iniciar minikube:

   ```bash
   minikube start
   ```
 Para este paso es tan simple como verificar estar conectados a nuestro cluster de kubernetes (poder ejecutar un kubectl get pods -A sin errores) y asi crear nuestros recursos dentro del directorio Kubernetes con el siguiente comando (asegurarse de estar dentro del directorio desafio-grupal-k8s):

1. **Crear Recursos en Kubernetes:** Asegúrate de estar dentro del directorio `desafio-grupal-k8s` y ejecuta:
    ```bash
    kubectl apply -f Kubernetes/ns.yaml
    kubectl apply -f Kubernetes/deployment.yaml
    ```

2. **Exponer la Aplicación:** Utiliza port-forward para exponer la aplicación:
    ```bash
    kubectl port-forward deployment/website-apache2 8080:80 -n prueba-desafiok8s
    ```

3. **Verificar su funcionamiento**: utilizando un tunel de vagrant o desde curl localhost:8080 (el tunel recordar hacerlo desde otra terminal de vagrant)

   ```bash
   vagrant ssh -- -L 80:localhost:8080
   ```

   
## Paso 3: Helm
   Para trabajar con Helm en el directorio `desafio-grupal-k8s/helm-website`, sigue los siguientes pasos:

1. **Creacion del namespace por defecto**: Primero creamos el namespace por defecto (en este caso, `prueba-desafiok8s`)

   ```bash
   kubectl create namespace prueba-desafiok8s
   ```


2. **Instalación del cluster con valores por defecto:** Instala el clúster con valores por defecto utilizando Helm y el chart `prueba-2`:

   ```bash
   helm install prueba-2 ./chart
   ```
   

3. **Para verificar funcionamiento**: Para verificar el estado de la instalación y los recursos del clúster creado, ejecuta:

   ```bash
   helm status prueba-2 --show-resources
   ```

4. **Testear cluster con valores personalizados**: Para realizar pruebas con un nuevo namespace y un nuevo clúster utilizando Helm con valores personalizados, sigue estos pasos:

   Primero creamos el nuevo namespace
   ```bash
   kubectl create namespace prueba-parametros
   ```
   Luego creamos el cluster  utilizando el comando helm install (agregando los parametros)
   - **`--set namespace=prueba-parametros`**: Especifica el namespace (espacio de nombres) donde se desplegará la aplicación.
   - **`--set replicaCount=5`**: Especifica la cantidad de replicas (en este caso 5)
   - **`--set imagen.tag=8`**: Especifica el tag la version de la imagen (en este caso tenemos version 3, 5, 8 para elegir) [Repositorio de imágenes de Docker](https://hub.docker.com/repository/docker/fcongedo/mi-web-apache2/general)


   ```bash
   # Crear la aplicación en con parametros personalizados
   helm install prueba-3 ./chart --set namespace=prueba-parametros --set replicaCount=5 --set image.tag=8
   ```

## Paso 4: ArgoCD

1. Por último, tendremos la parte de ArgoCD. Podremos crear aplicaciones ya sea utilizando la CLI o utilizando la interfaz gráfica de ArgoCD. En este caso, utilizaremos el archivo `deployment.yaml` dentro del directorio `website-kubernetes` en el directorio de ArgoCD. Por ejemplo, si quisiéramos hacerlo con el ArgoCD CLI:

    ```bash
    # Crear la aplicación en ArgoCD
    argocd app create website-kubernetes --repo https://github.com/fcongedo/desafio-grupal-k8s --path ArgoCD/website-kubernetes --dest-server https://kubernetes.default.svc --dest-namespace prueba-desafiok8s
    ```

2. Para crear la aplicación en ArgoCD utilizando la interfaz de línea de comandos (CLI), se utiliza el comando `argocd app create`. Este comando toma varios argumentos:
    - **`website-kubernetes`**: Es el nombre de la aplicación en ArgoCD.
    - **`--repo https://github.com/fcongedo/desafio-grupal-k8s`**: Especifica la URL del repositorio de donde se obtendrá el código.
    - **`--path ArgoCD/website-kubernetes`**: Indica la ruta dentro del repositorio donde se encuentra la configuración de la aplicación.
    - **`--dest-server https://kubernetes.default.svc`**: Define el servidor al que se enviarán las configuraciones de despliegue. En este caso, apunta al servidor Kubernetes.
    - **`--dest-namespace prueba-desafiok8s`**: Especifica el namespace (espacio de nombres) donde se desplegará la aplicación.

3. Es importante asegurarse de que el namespace `prueba-desafiok8s` ya exista. Si no existe, puedes crearlo con el siguiente comando:

    ```bash
    kubectl create ns prueba-desafiok8s
    ```

    Este comando asegurará la existencia del namespace necesario para el despliegue de la aplicación en el entorno de Kubernetes.