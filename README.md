<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar 
```
npm install
```

3. Tener Nest CLI instalado
```
npm i -g @nest/cli
```
4. Levantar la base de datos

```
docker-compose up -d
```

5. Clonar el archivo __.env.template__ y renombrar la copia __.env__

6. Llenar las variables de entorno en el __.env__

7. Ejecutar la aplicación en dev:
```
npm run start:dev 
```

8. Reconstruir la base de datos con la semilla 
```
http://localhost:3000/api/v2/seed 
```

#Build de producción
1. Crear un archivo ```.env.prod```
2. Llenar las variablres de entorno en prod
3. Crear un nueva imagen 
```
docker-compose -f docker-compose.prod.yaml --env.file .env-prod up --build
```

4. Ejecutar imagen si ya esta creada
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```
