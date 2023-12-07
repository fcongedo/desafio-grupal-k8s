## Paso 0: Instalación de Herramientas/Entorno de trabajo 

 Este README proporciona instrucciones básicas para la instalación de herramientas necesarias y la configuración de una máquina virtual con Vagrant con las herramientas necesarias para el desafio (docker, minikube, kubectl, argocd cli, etc)

## Configuración de Vagrant :

En el directorio de tu proyecto, encontrarás una carpeta llamada "Vagrant". Esta carpeta contiene la configuración necesaria para levantar una máquina virtual.

1. **Iniciar la Máquina Virtual**: Para iniciar la máquina virtual, ejecuta el siguiente comando dentro del directorio "Vagrant":
   ```bash
   vagrant up

2. **Conexión SSH**:  Para conectarte a la máquina virtual por SSH, utiliza el siguiente comando:
   ```bash
   vagrant ssh

3. **Túnel a la Máquina Host**: Puedes crear un túnel desde la máquina virtual a tu máquina host para acceder a servicios que se ejecuten en la VM desde el host. Utiliza el siguiente comando para configurar el túnel:
   ```bash
   vagrant ssh -- -L 8082:localhost:8082


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

3. **Crear la Imagen de Docker con Docker Compose**: Dirígete al directorio /vagrant/Docker-compose en la máquina virtual y ejecuta el siguiente comando para crear la imagen utilizando Docker Compose
   ```bash
   docker compose up -d
   ```

## Paso 2: Kubernetes

 Para este paso es tan simple como verificar estar conectados a nuestro cluster de kubernetes (poder ejecutar un kubectl get pods -A sin errores) y asi crear nuestros recursos dentro del directorio Kubernetes con el siguiente comando:

1. **Primero debemos crear el ns.yaml**

   ```bash
   kubectl apply -f Kubernetes/ns.yaml
   ```

2. **Luego ejecutamos el deployment.yaml**

   ```bash
   kubectl apply -f Kubernetes/deployment.yaml
   ```

3. **Exponer la aplicacion utilizando port-forward**

   ```bash
   kubectl port-forward deployment/website-apache2 8080:80 -n prueba-desafiok8s
   ```

4. **Verificar su funcionamiento**: utilizando un tunel de vagrant o desde curl localhost:8080

   ```bash
   vagrant ssh -- -L 80:localhost:8080
   ```

   
## Paso 3: HELM
   Debemos situarnos en el directorio /vagrant/helm-website

1. **Creacion del namespace**: Primero creamos el namespace por defecto (en mi caso prueba-desafiok8s)

   ```bash
   kubectl create namespace prueba-desafiok8s
   ```


2. **Instalamos el cluster (con valores por defecto)**

   ```bash
   helm install prueba-2 ./chart
   ```
   

3. **Para verificar funcionamiento podemos listar los pods ejecutando**:
   ```bash
   helm status prueba-2 --show-resources
   ```

4. **Testear cluster con valores personalizados**: 
  
   Primero creamos el nuevo namespace
   ```bash
   kubectl create namespace prueba-parametros
   ```
   Luego creamos el cluster
   ```bash
   helm install prueba-3 ./chart --set namespace=prueba-parametros --set replicaCount=5 --set image.tag=8
   ```

## Paso 4: ArgoCD 


1. Por ultimo, tendremos la parte de ArgoCD. Podremos crear aplicaciones ya sea utilizando la CLI o utilizando la interfaz grafica de Argo. En este caso utilizaremos el archivo deployment.yaml dentro del directorio website-kubernetes en el directorio de ArgoCD. Por ejemplo si quisieramos hacerlo con el ArgoCD CLI: 

   ```bash
   argocd app create website-kubernetes --repo https://github.com/fcongedo/desafio-grupal-k8s --path ArgoCD/website-kubernetes --dest-server https://kubernetes.default.svc --dest-namespace prueba-desafiok8s
   ```

   Es importante mencionar que en este caso el namespace "nerdearla" ya debe existir. 

   Podremos crearlo con el siguiente comando:

   ```bash
   kubectl create ns prueba-desafiok8s
   ```