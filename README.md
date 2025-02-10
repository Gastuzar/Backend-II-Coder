# Backend-II-Coder
Proyecto final Backend II CoderHouse

Backend-II-Coder-main> cd project-root => \Backend-II-Coder-main\project-root> npm install  => \Backend-II-Coder-main\project-root> npm run dev

Rutas Postman
Sessions:

Método HTTP: GET
URL: http://localhost:3000/api/sessions/current
(devuelve los datos)

Método HTTP: POST
URL: http://localhost:3000/api/sessions/register
Body:
{
  "first_name": "Perfil",
  "last_name": "Prueba",
  "email": "Prueba10@admin.com",
  "password": "123456",
  "age": "29",
  "role": "admin"
}
(registra)

Método HTTP: POST
URL: http://localhost:3000/api/sessions/login
Body:
{
  "email": "Prueba10@admin.com",
  "password": "123456"
}
(loguea)

Método HTTP: POST
URL: http://localhost:3000/api/sessions/logout
(cierra session)

PRODUCTOS:

Método HTTP: GET
URL: http://localhost:3000/api/products
(devuelve los productos creados)

Método HTTP: POST
URL: http://localhost:3000/api/products
Body
{
  "code": "GAMING-003",
  "name": "Monitor",
  "description": "Monitor LG.",
  "price": 175.00,
  "stock": 50
}
(añade un producto)

Método HTTP: PUT
URL: http://localhost:3000/api/products/:id
Ej: http://localhost:3000/api/products/67a240cbc4e309aff05baab6
Body:
{
        "name": "Silla Gaming",
        "price": 200, Actualización de precio.
        "stock": 30, Actualización de stock.
 }
(modifica un producto)

Método HTTP: DELETE
URL: http://localhost:3000/api/products/:id
(elimina un producto)

CARRITO

Método HTTP: GET
URL: http://localhost:3000/api/carts
(devuelve carrito del usuario)

Método HTTP: GET
URL: http://localhost:3000/api/carts/all
(devuelve todos los carrito)

Método HTTP: GET
URL: http://localhost:3000/api/carts/:cid
(devuelve carrito por id de carrito)

Método HTTP: POST
URL: http://localhost:3000/api/carts
(crea un carrito vacio)

Método HTTP: POST
URL: http://localhost:3000/api/carts/:cid/add-product
Ej: http://localhost:3000/api/carts/67a23e87b888c53ea2a94d47/add-product
Body:
{
  "productId": "67a240cbc4e309aff05baab6",
  "quantity": "5"
}
(agrega un producto al carrito)

Método HTTP: PUT
URL: http://localhost:3000/api/carts/:cid
(modifica un producto del carrito del usuario logueado)

Método HTTP: PUT
URL: http://localhost:3000/api/carts/:cid
Body:
{
    "products": [
        { 
            "_id": "67a2314c0dca2ad0ff8e5436",
            "quantity": 3
        },
        { 
            "_id": "67a240cbc4e309aff05baab6",
            "quantity": 1
        }
    ]
}
(modifica un producto del carrito por id)

Método HTTP: DELETE
URL: http://localhost:3000/api/carts/:cid/remove-product/:productId
Ej: http://localhost:3000/api/carts/67a2314c0dca2ad0ff8e5436/remove-product/65d2314c0dca2ad0ff8e9876
(elimina un producto del carrito)

Método HTTP: POST
URL: http://localhost:3000/api/carts//:cid/purchase
(finaliza una compra)
