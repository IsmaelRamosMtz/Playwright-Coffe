# Playwright Coffee Shop ☕

Este proyecto es una introducción práctica a Playwright con ejemplos reales de pruebas end-to-end en una tienda de café.

Incluye:
- ✅ pruebas de un flujo de compra completo.
- 📁 uso de Page Objects para separar la lógica de UI.
- 🌐 interceptación y mock de peticiones HTTP.
- ✉️ manejo de correos temporales con MailSlurp.
- 🔒 persistencia de sesión mediante `storageState`.

---

## 1. Estructura del proyecto 🧱

### Carpetas principales

- `tests/` - todos los specs de Playwright.
  - `basic/` - ejemplos y flujos de prueba.
  - `pages/` - Page Objects para cada página.
  - `setup/` - scripts de configuración y autenticación.
- `utils/` - helpers reutilizables.
- `playwright.config.ts` - configuración central de Playwright.

### Archivos importantes

- `package.json` - dependencias y comandos.
- `README.md` - esta guía.
- `.env` - variables de entorno privadas.

---

## 2. Instalación 🚀

Instala dependencias con:

```bash
npm install
```

Si necesitas reinstalar desde cero:

```bash
rm -rf node_modules && npm install
```

### Librerías principales

- `playwright` - navegador y runtime principal.
- `@playwright/test` - runner, assertions y utilidades de test.
- `dotenv` - carga variables de entorno desde `.env`.
- `mailslurp-client` - crea correos temporales para pruebas de email.

---

## 3. Configuración de entorno 🔧

Crea un archivo `.env` en la raíz del proyecto con la clave de MailSlurp:

```env
MAIL_SLURP_API_KEY=sk_tu_clave_aqui
```

Asegúrate de no subir `.env` al repositorio.

---

## 4. Configuración de Playwright 🧩

El archivo `playwright.config.ts` contiene la configuración más importante:

- `testDir: './tests'` - carpeta donde están los tests.
- `fullyParallel: true` - ejecuta tests en paralelo.
- `forbidOnly: !!process.env.CI` - evita que `test.only` quede activo en CI.
- `retries` y `workers` adaptados para CI.
- `reporter: [['html'], ['list']]` - genera reporte HTML y salida en consola.
- `use.headless: false` - ejecuta los tests de forma visible.
- `baseURL: 'https://valentinos-magic-beans.click/'` - URL base para `page.goto('/ruta')`.
- `trace: 'on-first-retry'` - recopila trazas solo cuando un fallo se reintenta.

### Multi-proyectos y sesión

Hay dos proyectos configurados:

- `auth-setup`
  - ejecuta `tests/setup/auth.setup.ts`.
  - hace login con credenciales y guarda el estado en `playwright/.auth/user-session.json`.
- `chromium`
  - usa `Desktop Chrome`.
  - reproduce tests principales usando `storageState`.
  - depende de `auth-setup`.

Esto permite mantener una sesión autenticada entre tests sin repetir el paso de login en cada ejecución.

---

## 5. Cómo ejecutar los tests ▶️

### Ejecutar todos los tests

```bash
npx playwright test
```

### Ejecutar un test en particular

```bash
npx playwright test tests/basic/cart.spec.ts
```

### Ejecutar el proyecto Chromium

```bash
npx playwright test --project=chromium
```

### Ejecutar el flujo de sign-up con MailSlurp

```bash
SIGN_UP_FLOW=true npx playwright test tests/basic/auth.spec.ts
```

---

## 6. Qué hace cada test 🧪

### `tests/basic/1ApiIntercept.spec.ts`

- imprime las peticiones de red que se disparan en `/products`.
- intercepta la llamada a la API de productos.
- devuelve una respuesta mock con productos.
- comprueba que el producto fake se añade al carrito.

### `tests/basic/2ResourceBlock.spec.ts`

- bloquea la carga de imágenes.
- demuestra cómo usar `page.route()` para abortar recursos.
- útil para simular condiciones de red y mejorar rendimiento.

### `tests/basic/auth-actions.spec.ts`

- revisa un flujo básico de navegación.
- comprueba que aparece el mensaje `Welcome!`.

### `tests/basic/cart.spec.ts`

- agrega el primer producto disponible al carrito.
- abre el carrito.
- valida que el producto agregado está visible.
- verifica el subtotal.

### `tests/basic/orderFlow.spec.ts`

- realiza un flujo completo de compra:
  1. agrega un producto al carrito.
  2. navega a checkout.
  3. completa contacto, envío y pago.
  4. confirma el pedido.
  5. rastrea la orden y verifica la URL de detalle.
- también incluye una versión con `test.step()` para mayor claridad.

### `tests/basic/auth.spec.ts`

- crea un inbox temporal con MailSlurp.
- completa el flujo de sign-up en `/signup`.
- espera un email de confirmación.
- extrae el código de confirmación del email.
- hace login con ese usuario.
- guarda las credenciales en `playwright/.auth/loginData.json`.

### `tests/setup/auth.setup.ts`

- lee las credenciales guardadas en `playwright/.auth/loginData.json`.
- hace login en `/login`.
- guarda el estado de sesión en `playwright/.auth/user-session.json`.
- este archivo es consumido por el proyecto `chromium`.

---

## 7. Page Objects 📄

Los Page Objects ayudan a tener tests más limpios y reutilizables.

### `tests/pages/login.ts`

Acciones:
- `fillLoginForm(page, email, password)`
- `submitLogin(page)`
- `verifyLoginSuccess(page)`

### `tests/pages/signUp.ts`

Acciones:
- `fillUserRegister(page, email)`
- `submitSignUp(page)`
- `confirmationCode(page, code)`

### `tests/pages/Products.ts`

Acciones:
- `addProductToCart(page, index)`

Devuelve el nombre y precio del producto agregado.

### `tests/pages/Carts.ts`

Acciones:
- `assertProductInCart(page, heading)`
- `getSubTotal(page)`

### `tests/pages/Checkout.ts`

Acciones:
- `fillContactInfo(page)`
- `fillShippingInfo(page)`
- `fillPaymentInfo(page)`
- `submitCheckout(page)`

### `tests/pages/Contact.ts`

Acciones:
- `trackOrder(page, orderId, email)`
- `submitTrackOrder(page)`

---

## 8. Utilidades 🛠️

### `utils/EmailUtil.ts`

- `createInbox()` - crea un inbox temporal con MailSlurp.
- `waitForLatestEmail(inboxId)` - espera el último email recibido.

Esto permite automatizar pruebas de email sin usar una cuenta de correo real.

---

## 9. Conceptos avanzados usados ✨

### `dotenv`

Se carga en `playwright.config.ts` para que las variables de entorno estén disponibles en todos los tests.

### `storageState`

Permite guardar el estado de sesión de un browser context y reutilizarlo.

### `page.route()`

Sirve para interceptar peticiones y:
- mockear respuestas
- bloquear recursos
- simular fallos en API

### `test.step()`

Se usa para estructurar los tests en pasos claros y legibles.

---

## 10. Integración continua con Jenkins y Docker 🚀

Aquí explico todo lo que hicimos para que el proyecto corra en CI.

### 10.1 Qué hicimos

1. Creamos un `Dockerfile` basado en `jenkins/jenkins:lts`.
2. Instalamos Node.js 20 y npm dentro del contenedor.
3. Configuramos Jenkins para ejecutar `npm ci` y `npx playwright install chromium`.
4. Añadimos soporte para MailSlurp en CI con la variable `MAIL_SLURP_API_KEY`.
5. Definimos un pipeline en `Jenkinsfile` que ejecuta:
   - `Install Dependencies`
   - `Install Playwright Browsers`
   - `Auth Setup` (opcional)
   - `API Tests`
   - `UI Tests`

### 10.2 Dockerfile final

El `Dockerfile` quedó así:

```Dockerfile
FROM jenkins/jenkins:lts

USER root

RUN apt-get update && apt-get install -y curl gnupg2 ca-certificates \
 && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y nodejs \
 && npm install -g npm@latest \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

USER jenkins
```

### 10.3 Construir la imagen Docker

```bash
docker build -t jenkins-node .
```

### 10.4 Ejecutar Jenkins en Docker

```bash
docker run -d --name jenkins-node -p 8081:8080 jenkins-node
```

### 10.5 Configurar Jenkins

- Abre `http://localhost:8081`.
- Crea un nuevo pipeline.
- Usa `Pipeline script from SCM`.
- Configura tu repositorio y branch `junior`.
- Crea un credential de tipo `Secret text` con id `MAIL_SLURP_API_KEY`.

---

## 11. Jenkinsfile y pipeline

El `Jenkinsfile` define las etapas que corren en CI.

### Contenido clave del `Jenkinsfile`

```groovy
pipeline {

    agent any

    environment {
        CI = 'true'
        BASE_URL = 'https://valentinos-magic-beans.click/'
        MAIL_SLURP_API_KEY = credentials('MAIL_SLURP_API_KEY')
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Debug') {
            steps {
                sh 'which node || true'
                sh 'which npm || true'
                sh 'which npx || true'
                sh 'node -v'
                sh 'npm -v'
                sh 'npx -v'
                sh 'echo $PATH'
            }
        }

        stage('Verify Environment') {
            steps {
                sh 'pwd'
                sh 'node -v'
                sh 'npm -v'
                sh 'npx -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install chromium'
            }
        }

        stage('Sign Up Flow') {
            steps {
                sh 'SIGN_UP_FLOW=true npx playwright test --project=signup'
            }
        }

        stage('Auth Setup') {
            steps {
                sh 'npx playwright test --project=auth-setup'
            }
        }

        stage('API Tests') {
            steps {
                sh 'npx playwright test --project=api-test'
            }
        }

        stage('UI Tests') {
            steps {
                sh 'npx playwright test --project=chromium'
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true,
                  testResults: 'reports-e2e/junit.xml'

            archiveArtifacts(
                artifacts: 'reports-e2e/**/*',
                allowEmptyArchive: true
            )
        }
    }
}
```

### Qué hace cada etapa

- `Checkout`: trae el código.
- `Debug`: muestra que Node/npm/npx existen.
- `Verify Environment`: valida versiones y ruta.
- `Install Dependencies`: instala paquetes con `npm ci`.
- `Install Playwright Browsers`: instala Chromium.
- `Sign Up Flow`: genera `loginData.json`.
- `Auth Setup`: genera `user-session.json`.
- `API Tests`: corre tests de API.
- `UI Tests`: corre tests de UI con sesión restaurada.

---

## 12. Flujo de autenticación completos

### Paso 1: generar credenciales

```bash
SIGN_UP_FLOW=true npx playwright test --project=signup
```

Esto genera:
- `playwright/.auth/loginData.json`

### Paso 2: crear sesión autenticada

```bash
npx playwright test --project=auth-setup
```

Esto genera:
- `playwright/.auth/user-session.json`

### Paso 3: ejecutar pruebas UI autenticadas

```bash
npx playwright test --project=chromium
```

---

## 13. Errores comunes y solución

### `Missing apiKey config parameter`

Significa que `MAIL_SLURP_API_KEY` no está definido.

- En local: revisa el archivo `.env`.
- En Jenkins: revisa el credential `MAIL_SLURP_API_KEY`.

### Si fallan los tests de UI en Jenkins

- Asegúrate de que `npx playwright install chromium` se ejecute.
- Comprueba versiones de Node y npm.
- Verifica que `playwright/.auth/user-session.json` exista.

### Si `loginData.json` no existe

Ejecuta primero `Sign Up Flow` con:

```bash
SIGN_UP_FLOW=true npx playwright test --project=signup
```

---

## 14. Comando para fijar el branch en un commit

Para dejar `junior` en el commit `507de9d210b539809bfb5bba9c00255f8e8f0b4b` usamos:

```bash
git reset --hard 507de9d210b539809bfb5bba9c00255f8e8f0b4b
git push --force-with-lease origin junior
```

---

## 15. Resumen final

Este README ahora incluye:
- la estructura original del proyecto
- cómo funciona cada prueba
- cómo instalar y configurar Docker/Jenkins
- el `Dockerfile` que usamos
- el `Jenkinsfile` completo
- el flujo `signup` → `auth-setup` → `chromium`
- soluciones a errores comunes
- el comando git para fijar el branch en un commit específico
- agregamos MailSlurp para generar usuarios temporales y verificar emails.
- guardamos credenciales y sesión para ejecutar pruebas autenticadas.
- dejamos documentado el proceso paso a paso para poder repetirlo desde cero.

## 10. Recomendaciones ✅

- Usa Page Objects siempre que añadas nuevos flujos.
- Mantén las variables sensibles fuera del repositorio.
- Si agregas un nuevo setup, documenta el propósito en este README.
- Si quieres un nuevo flujo de usuario, crea un nuevo spec en `tests/basic/`.

---

## 16. GitHub Actions — Integración continua (desde lo más básico hasta "verde") 🟢

Esta sección explica cómo añadir GitHub Actions para ejecutar las pruebas de Playwright en CI, desde un workflow mínimo hasta un pipeline completo y listo para pasar en un PR.

### 16.1 Conceptos básicos

- `workflow`: archivo YAML en `.github/workflows/` que contiene jobs y steps.
- `job`: colección de steps que corren en un mismo runner.
- `step`: acción individual, p.ej. `actions/checkout` o `run: npm ci`.
- `runner`: máquina que ejecuta el job (ubuntu-latest, windows-latest, macos-latest).
- `trigger`: evento que inicia el workflow (`push`, `pull_request`, `workflow_dispatch`).

Para que GitHub Actions detecte un workflow, el archivo DEBE estar en `.github/workflows/`.

### 16.2 Workflow mínimo (ejemplo)

Archivo: `.github/workflows/ci.yml`

```yaml
name: CI

on:
    push:
        branches: [ junior, main ]
    pull_request:
    workflow_dispatch:

jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
                with:
                    node-version: 18
            - run: npm ci
            - run: npx playwright install --with-deps
            - run: npx playwright test --project=api-test
```

Este workflow:
- se ejecuta en push/PR/dispatch,
- instala dependencias,
- instala los browsers necesarios para Playwright,
- ejecuta solamente el proyecto `api-test`.

### 16.3 Explicación detallada (lo que usamos en este repo)

- `on.pull_request`: hace que el workflow se ejecute cuando se crea/actualiza un PR — revisa la pestaña **Checks** del PR.
- `actions/checkout@v4`: clona el repo en el runner.
- `actions/setup-node@v4`: instala Node.js en la versión especificada.
- `npx playwright install --with-deps`: instala navegadores y dependencias del sistema necesarias en runners Ubuntu.
- `npx playwright test --project=api-test`: ejecuta solo el proyecto `api-test` (útil para pipelines separados: API vs UI).

> Nota: si un paso como `npm run build` falla con "Missing script: build", añade el script `build` en `package.json` o elimina/ajusta el step. En este repo hemos añadido un `build` mínimo para evitar el fallo.

### 16.4 Playwright en GitHub Actions — mejoras y alternativas

- Usar la imagen oficial de Playwright en contenedor (opcional) para entornos reproducibles:

```yaml
container:
    image: mcr.microsoft.com/playwright:v1.54.2-jammy
    options: --user 1001
```

- Si usas la imagen, no necesitas `npx playwright install` (los navegadores ya vienen incluidos).
- En runners Ubuntu, `npx playwright install --with-deps` instala dependencias nativas (recomendado si no se usa container).

### 16.5 Secrets y permisos

- Guarda credenciales sensibles en `Settings -> Secrets and variables -> Actions` (ej. `MAIL_SLURP_API_KEY`).
- En la sección `Settings -> Actions -> General` revisa `Workflow permissions` y el comportamiento de `Allow GitHub Actions to create and approve pull requests` si aplica.
- Los PRs desde forks no exponen secrets por seguridad; usa tokens limitados o configura runners privados si necesitas secrets en forks.

### 16.6 Artefactos y reportes

- Para subir reportes HTML/JUnit y poder descargarlos desde la ejecución, usa `actions/upload-artifact@v4`.

Ejemplo de paso para subir reportes:

```yaml
- uses: actions/upload-artifact@v4
    if: ${{ always() }}
    with:
        name: e2e-report
        path: reports-e2e/html/
        if-no-files-found: warn
```

Y para publicar JUnit (si tu workflow lo necesita) simplemente genera `reports-e2e/junit.xml` desde Playwright (`--reporter=junit`) y archívalo.

### 16.7 Debugging y consejos cuando algo falla

- Revisa la pestaña **Actions** y dentro del run abre el job y busca el step que falló — GitHub muestra la salida completa.
- Para errores de dependencias nativas en Ubuntu, añade `npx playwright install --with-deps` antes de correr tests.
- Si un step falla por falta de script (p.ej. `npm run build`), añade el script en `package.json` o modifica el workflow para no llamarlo.
- Para reproducir localmente el runner puedes usar `act` (https://github.com/nektos/act): instala `act`, luego:

```bash
act -j test --secret-file .secrets
```

(`.secrets` es un fichero con tus variables de entorno en formato KEY=VALUE, si el workflow las necesita).

### 16.8 Forzar re-run y pruebas manuales

- En la pestaña **Actions** -> selecciona el run -> botón **Re-run jobs** -> `Re-run all jobs`.
- Desde un PR: en la lista de checks, haz click en el run fallido y re-run si tienes permisos.

### 16.9 Branch protections y checks requeridos

- Si quieres que el PR no pueda mergearse hasta que las acciones pasen, ve a `Settings -> Branches -> Branch protection rules` y añade:
    - Require status checks to pass before merging (selecciona el job `CI` o checks específicos).
    - Require linear history / required reviews según política.

### 16.10 Checklist para dejar todo "en verde" (guía paso a paso)

1. Asegúrate que `.github/workflows/ci.yml` exista en la rama del PR.
2. Verifica `on: pull_request` presente si quieres que corra en PRs.
3. Añade `actions/checkout@v4` y `actions/setup-node@v4` con `node-version` apropiado.
4. Ejecuta `npm ci` (no `npm install`) para entornos CI reproducibles.
5. Instala navegadores: `npx playwright install --with-deps` o usa la imagen `mcr.microsoft.com/playwright`.
6. Asegúrate que `package.json` contenga los scripts llamados por el workflow (`build`, `test`, etc.).
7. Para reducir ruido en PRs grandes, ejecuta solo el proyecto necesario: `npx playwright test --project=api-test`.
8. Sube artefactos y reportes para investigar fallos más fácilmente.
9. Re-run si hay fallos transitivos.
10. Ajusta Branch Protection para exigir checks verdes antes de merge.

### 16.11 Ejemplo real (este repo)

- Archivo usado aquí: [`.github/workflows/ci.yml`](.github/workflows/ci.yml#L1-L200)
- Ejecuta en `pull_request` y en `push` a `junior`/`main`.
- Ejecuta por separado:
    - `test_integration` -> `npx playwright test --project=api-test`
    - `e2e` -> `npx playwright test --project=api-test` (limitado para evitar correr la suite completa en PRs)

Si quieres que añada jobs separados por cada proyecto (`signup`, `auth-setup`, `api-test`, `chromium`) puedo generarlos y documentar cómo paralelizarlos.

---

Si quieres, puedo ahora:
- (A) Añadir jobs en el workflow para `signup`, `auth-setup`, `api-test` y `chromium` separados, o
- (B) Dejar el workflow tal cual y documentar cómo añadir caching y parallelización.


---

## 11. ¿Para qué sirve este README? 📘

Esta guía es una referencia rápida para entender:
- la estructura del proyecto
- qué hace cada test
- cómo funcionan las dependencias y el setup
- cómo correr Playwright de forma correcta

Usa este README cuando tengas dudas de por qué existe un archivo o cómo se construye un flujo de prueba.
