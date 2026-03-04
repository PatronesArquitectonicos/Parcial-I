# 1. Introducción

## 1.1 Objetivo del proyecto

El objetivo de este proyecto es diseñar e implementar el **despliegue completo de una aplicación web compuesta por frontend, backend y base de datos** utilizando tecnologías modernas de orquestación y entrega continua.


El proyecto se desarrolló siguiendo los lineamientos establecidos en el enunciado del parcial, cuyo propósito es aplicar patrones arquitectónicos de despliegue en Kubernetes mediante el uso de Helm para el empaquetado de la aplicación y ArgoCD para la gestión de entrega continua basada en GitOps

La implementación busca demostrar cómo una aplicación distribuida puede ser desplegada, configurada y administrada de manera reproducible dentro de un clúster de Kubernetes, permitiendo manejar múltiples entornos de despliegue y automatizar la actualización de los servicios a partir de cambios en el repositorio.

---

## 1.2 Descripción general de la aplicación de gestión de pedidos

La aplicación desarrollada corresponde a un **sistema de gestión de pedidos**, el cual permite registrar y administrar pedidos realizados por clientes.

El sistema ofrece operaciones básicas de **creación, consulta, actualización y eliminación (CRUD)** de pedidos a través de una API REST consumida por una interfaz web. Cada pedido almacena información relevante como:

* cliente
* producto solicitado
* cantidad
* precio total
* estado del pedido
* fecha de creación

El flujo de funcionamiento de la aplicación es el siguiente:

1. El usuario interactúa con la interfaz web.
2. El frontend envía solicitudes HTTP al backend mediante la API REST.
3. El backend procesa las solicitudes y realiza operaciones sobre la base de datos PostgreSQL.
4. Los datos son almacenados de forma persistente y posteriormente recuperados cuando se consultan los pedidos.

Este sistema permite demostrar el funcionamiento **end-to-end** de una aplicación distribuida desplegada en Kubernetes.

---

## 1.3 Tecnologías utilizadas

El sistema fue desarrollado utilizando un conjunto de tecnologías modernas para el desarrollo y despliegue de aplicaciones cloud-native:

**Backend**

* Java 17
* Spring Boot 3.2
* Spring Web
* Spring Data JPA
* Spring Boot Actuator

El backend expone una **API REST** que gestiona las operaciones sobre los pedidos y se conecta a la base de datos PostgreSQL.

**Frontend**

* React 18
* Axios para comunicación HTTP

El frontend proporciona una interfaz web que permite interactuar con la API del sistema.

**Base de datos**

* PostgreSQL

Se utiliza como sistema de persistencia para almacenar los pedidos registrados en la aplicación.

**Infraestructura y despliegue**

* Docker para contenerización de servicios
* Kubernetes como plataforma de orquestación
* Helm para empaquetar y parametrizar el despliegue
* ArgoCD para implementar un flujo de **GitOps**
* NGINX Ingress Controller para exponer la aplicación al exterior
* Clúster de Kubernetes desplegado en **DigitalOcean**

Estas tecnologías permiten implementar una arquitectura moderna orientada a microservicios y despliegues automatizados en entornos cloud.


---

A continuación tienes un **contenido apropiado para la sección del README**. Está escrito como documentación reproducible, que es lo que pide la rúbrica.

---

# 2. Instalación manual con Helm

Esta sección describe cómo desplegar manualmente la aplicación **pedido-app** en un clúster de Kubernetes utilizando Helm, sin depender de ArgoCD.

La aplicación está compuesta por tres componentes:

* **PostgreSQL** → base de datos persistente
* **Backend** → API REST desarrollada en Spring Boot
* **Frontend** → aplicación React servida por Nginx

Todos estos componentes se despliegan a través de un **chart principal (`pedido-app`)** que contiene subcharts para cada servicio.

---

## 2.1 Requisitos

Antes de instalar la aplicación se deben tener instaladas las siguientes herramientas:

* **Docker**
* **Kubernetes** (Digital Ocean)
* **kubectl**
* **Helm v3**

Verificar instalación:

```bash
kubectl version --client
helm version
```

También se debe tener acceso a un clúster Kubernetes:

```bash
kubectl get nodes
```

---

### 2.2 Construcción y publicación de imágenes Docker

Antes de desplegar la aplicación con Helm es necesario construir las imágenes del **backend** y **frontend** y publicarlas en **Docker Hub**, ya que el clúster de Kubernetes descarga las imágenes desde ese registro.

### Backend

Desde la carpeta `backend`:

```bash
docker build -t carlos22709/pedidos-backend:1.0.0 .
docker push carlos22709/pedidos-backend:1.0.0
```

### Frontend

Desde la carpeta `frontend`:

```bash
docker build -t carlos22709/pedidos-frontend:1.0.0 .
docker push carlos22709/pedidos-frontend:1.0.0
```

Las imágenes publicadas en Docker Hub son utilizadas posteriormente por Kubernetes a través del chart de Helm.

Imágenes utilizadas en el despliegue:

```text
carlos22709/pedidos-backend:1.0.0
carlos22709/pedidos-frontend:1.0.0
docker.io/bitnamilegacy/postgresql:16.4.0-debian-12-r9
```

Estas imágenes son referenciadas dentro de los archivos `values.yaml`, `values-dev.yaml` y `values-prod.yaml` del chart `pedido-app`.


---

## 2.3 Instalación del chart

El chart principal se encuentra en:

```
charts/pedido-app
```

Para instalar la aplicación se ejecuta:

```bash
helm install pedido-app charts/pedido-app
```

Helm desplegará automáticamente:

* PostgreSQL (subchart de Bitnami)
* Backend (Deployment + Service)
* Frontend (Deployment + Service)
* ConfigMap del backend
* Secret con credenciales de base de datos
* PersistentVolumeClaim para PostgreSQL
* Ingress para acceso externo

---

## 2.4 Instalación por entorno

El chart incluye archivos de valores específicos para cada ambiente.

### Entorno de desarrollo

```bash
helm install pedido-app-dev charts/pedido-app \
-f charts/pedido-app/values-dev.yaml
```

### Entorno de producción

```bash
helm install pedido-app-prod charts/pedido-app \
-f charts/pedido-app/values-prod.yaml
```

Estos archivos permiten configurar:

* imágenes de contenedores
* número de réplicas
* recursos de CPU y memoria
* credenciales de base de datos
* configuración del Ingress

---

## 2.5 Verificación del despliegue

Una vez instalado el chart se pueden verificar los recursos creados.

Pods:

```bash
kubectl get pods
```

Servicios:

```bash
kubectl get svc
```

Ingress:

```bash
kubectl get ingress
```

Si todos los pods están en estado `Running`, la aplicación se ha desplegado correctamente.

---

## 2.6 Desinstalación

Para eliminar la aplicación del clúster:

```bash
helm uninstall pedido-app
```

Esto eliminará todos los recursos Kubernetes asociados al release.

---


# 3. Configuración de ArgoCD y sincronización

# 3. Configuración de ArgoCD

El despliegue de la aplicación se gestiona mediante **ArgoCD**, siguiendo el enfoque **GitOps**, donde el estado deseado del sistema se define en un repositorio Git y ArgoCD se encarga de sincronizar automáticamente el clúster de Kubernetes con ese estado.

ArgoCD se encuentra instalado en el **namespace `argocd`** del clúster y ejecuta los componentes principales necesarios para la gestión de aplicaciones declarativas.

Componentes activos en el clúster:

```
argocd-application-controller
argocd-applicationset-controller
argocd-dex-server
argocd-notifications-controller
argocd-redis
argocd-repo-server
argocd-server
```

Estos servicios permiten que ArgoCD monitoree el repositorio Git, procese los charts de Helm y sincronice automáticamente los cambios en el clúster.

---

# 3.1 Repositorio Git utilizado

ArgoCD obtiene la definición de la aplicación desde el repositorio:

```
https://github.com/PatronesArquitectonicos/Parcial-I.git
```

Dentro de este repositorio se encuentra el **chart principal de Helm**:

```
charts/pedido-app
```

El despliegue se realiza usando Helm, pero **ArgoCD es quien ejecuta la instalación automáticamente**.

---

# 3.2 Definición de aplicaciones en ArgoCD

Se configuraron **dos aplicaciones independientes en ArgoCD**, una para cada entorno:

```
pedido-app-dev
pedido-app-prod
```

Ambas aplicaciones se encuentran registradas en el namespace:

```
argocd
```

Estado actual en el clúster:

```
NAME              SYNC STATUS   HEALTH STATUS
pedido-app-dev    Synced        Healthy
pedido-app-prod   Synced        Healthy
```

Esto indica que el estado del clúster coincide con la configuración declarada en el repositorio.

---

# 3.3 Configuración de la aplicación de desarrollo

La aplicación **pedido-app-dev** se define mediante el archivo:

```
environments/dev/application.yaml
```

Configuración principal:

```
source:
  repoURL: https://github.com/PatronesArquitectonicos/Parcial-I.git
  path: charts/pedido-app
  targetRevision: main
  helm:
    valueFiles:
      - values-dev.yaml

destination:
  namespace: pedido-dev
  server: https://kubernetes.default.svc
```

Esto significa que:

* ArgoCD toma el **chart `pedido-app`**
* Usa el archivo **`values-dev.yaml`**
* Despliega los recursos en el namespace:

```
pedido-dev
```

---

# 3.4 Configuración de la aplicación de producción

La aplicación **pedido-app-prod** se define mediante:

```
environments/prod/application.yaml
```

Configuración principal:

```
source:
  repoURL: https://github.com/PatronesArquitectonicos/Parcial-I.git
  path: charts/pedido-app
  targetRevision: main
  helm:
    valueFiles:
      - values-prod.yaml

destination:
  namespace: pedido-prod
  server: https://kubernetes.default.svc
```

En este caso ArgoCD:

* utiliza el archivo **`values-prod.yaml`**
* despliega la aplicación en el namespace:

```
pedido-prod
```

Este archivo contiene una configuración más robusta para producción, incluyendo mayor número de réplicas.

---

# 3.5 Sincronización automática (GitOps)

Ambas aplicaciones utilizan la política de sincronización automática:

```
syncPolicy:
  automated:
    prune: true
    selfHeal: true
```

Esto significa que:

**prune**

Elimina automáticamente recursos que ya no existan en el repositorio.

**selfHeal**

Si algún recurso del clúster es modificado manualmente, ArgoCD lo restaura al estado definido en Git.

Adicionalmente se utiliza la opción:

```
CreateNamespace=true
```

Esto permite que ArgoCD cree automáticamente el namespace si aún no existe.

---

# 3.6 Recursos desplegados por ArgoCD

Una vez sincronizada la aplicación, ArgoCD despliega todos los recursos definidos en el chart de Helm.

Recursos creados en cada entorno:

**Deployments**

```
backend
frontend
```

**StatefulSet**

```
db
```

**Services**

```
backend
frontend
db
db-hl
```

**Horizontal Pod Autoscaler**

```
backend
```

**ConfigMaps**

```
backend
db-init
```

**Ingress**

```
pedido-app
```

**NetworkPolicy**

```
db
```

**PodDisruptionBudget**

```
db
```

---

# 3.7 Namespaces de los entornos

Cada entorno se despliega en su propio namespace:

```
pedido-dev
pedido-prod
```

Esto permite aislar los recursos de desarrollo y producción dentro del mismo clúster de Kubernetes.

Pods actualmente ejecutándose:

**Dev**

```
backend
frontend
db
```

**Prod**

```
backend (2 replicas)
frontend (2 replicas)
db
```

---

# 3.8 Exposición mediante Ingress

La aplicación se expone mediante **NGINX Ingress Controller**.

Configuración de rutas:

```
/api  → backend
/     → frontend
```

Hosts configurados:

**Desarrollo**

```
http://dev.pedidos.local
http://dev.pedidos.local/api
```

**Producción**

```
http://prod.pedidos.local
http://prod.pedidos.local/api
```

Ambos entornos utilizan el mismo **LoadBalancer IP**:

```
134.209.140.84
```

---

# 3.9 Flujo GitOps

El flujo de despliegue funciona de la siguiente manera:

```
Cambio en Git (values.yaml o chart)
        ↓
ArgoCD detecta cambio en el repositorio
        ↓
ArgoCD renderiza el chart de Helm
        ↓
Se aplican los cambios al clúster
        ↓
La aplicación se actualiza automáticamente
```

De esta forma **no es necesario ejecutar comandos manuales de Helm en el clúster**, ya que ArgoCD mantiene el sistema sincronizado con el repositorio Git.

---

# 4. Endpoints de acceso (Frontend y API)

La aplicación se expone al exterior mediante **NGINX Ingress Controller**, que enruta las peticiones HTTP hacia los servicios internos del clúster de Kubernetes.

Se configuraron **dos entornos independientes**:

* **Desarrollo**
* **Producción**

Cada uno tiene su propio namespace, configuración de Helm y dominio de acceso.

---

# 4.1 Acceso al Frontend

El frontend es una aplicación **React** que se expone a través del Ingress en la ruta raíz (`/`).

Dominios configurados:

**Entorno de desarrollo**

```id="9ej0pd"
http://dev.pedidos.local
```

**Entorno de producción**

```id="aw8y1y"
http://prod.pedidos.local
```

Para acceder a estos dominios se configuró el archivo **hosts** del sistema operativo apuntando al LoadBalancer del clúster:

```id="lct5ip"
134.209.140.84 dev.pedidos.local
134.209.140.84 prod.pedidos.local
```

Cuando el usuario accede a estos dominios, el Ingress enruta la petición al servicio:

```id="mj9d4g"
frontend:80
```

que corresponde al contenedor que ejecuta la aplicación React mediante Nginx.

---

# 4.2 Acceso a la API

La API REST está implementada en **Spring Boot** y se expone en el prefijo:

```id="1g0lgh"
/api
```

El Ingress redirige estas rutas al servicio del backend:

```id="plvrnh"
backend:8080
```

Rutas completas de acceso:

**Desarrollo**

```id="7gik6p"
http://dev.pedidos.local/api
```

**Producción**

```id="0zyzw0"
http://prod.pedidos.local/api
```

---

# 4.3 Endpoints de la API de pedidos

El backend expone un conjunto de endpoints REST para gestionar pedidos.

Base URL:

```id="yypq3c"
/api/pedidos
```

### Listar pedidos

```id="xkbhja"
GET /api/pedidos
```

Devuelve todos los pedidos registrados en la base de datos.

Ejemplo:

```id="8bnc2v"
GET http://dev.pedidos.local/api/pedidos
```

---

### Obtener pedido por ID

```id="f66g5d"
GET /api/pedidos/{id}
```

Ejemplo:

```id="erhyg3"
GET http://dev.pedidos.local/api/pedidos/1
```

---

### Crear un pedido

```id="0m7z5r"
POST /api/pedidos
```

Body de ejemplo:

```json
{
  "cliente": "Juan Perez",
  "producto": "Laptop",
  "cantidad": 1,
  "precioTotal": 2500,
  "estado": "PENDIENTE"
}
```

Ejemplo de llamada:

```id="8oelkl"
POST http://dev.pedidos.local/api/pedidos
```

---

### Actualizar un pedido

```id="gl42om"
PUT /api/pedidos/{id}
```

Ejemplo:

```id="7pqyh9"
PUT http://dev.pedidos.local/api/pedidos/1
```

---

### Eliminar un pedido

```id="qv17ta"
DELETE /api/pedidos/{id}
```

Ejemplo:

```id="iqymt4"
DELETE http://dev.pedidos.local/api/pedidos/1
```

---

### Endpoint de salud del backend

El backend también expone un endpoint de verificación de estado:

```id="9c7h3k"
GET /api/pedidos/health
```

Ejemplo:

```id="hrj0dx"
http://dev.pedidos.local/api/pedidos/health
```

Respuesta esperada:

```
OK
```

Este endpoint permite verificar rápidamente si el backend está funcionando correctamente dentro del clúster.

---

# 4.4 Flujo de acceso completo

El flujo de una petición desde el navegador hasta la base de datos es el siguiente:

```id="xvdeib"
Usuario
   ↓
NGINX Ingress
   ↓
Frontend (React)
   ↓
API Backend (Spring Boot)
   ↓
PostgreSQL
```

El Ingress se encarga de enrutar el tráfico según la ruta solicitada:

```id="dcbb50"
/        → frontend
/api/*   → backend
```

De esta forma la aplicación funciona como un sistema integrado accesible desde un único dominio por entorno.
