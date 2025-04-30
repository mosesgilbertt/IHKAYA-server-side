# IHKAYA-Server-Side

# IHKAYA product API Documentation

## Models :

_User_
- email : string, unique (required)
- password : string, length min 5 (required)
- role : string, default: Staff (required)
- phoneNumber : string
- address : string
- createdAt : date
- updatedAt : date

_Category_
- name : string (required)
- createdAt : date
- updatedAt : date

_Product_
- name : string (required)
- description : string (required)
- price : integer (required)
- stock : integer
- imgUrl : string
- categoryId : integer (required)
- authorId : integer (required)
- createdAt : date
- updatedAt : date


## Endpoints

List of Available Endpoints:
- `GET /pub/products`
- `GET /pub/products/:id`

- `POST /login`
- `POST /add-user`

- `POST /categories`
- `GET /categories`
- `PUT /categories/:id`

- `POST /products`
- `GET /products`
- `GET /products/:id`
- `PUT /products/:id`
- `PATCH /products/:id`
- `DELETE /products/:id`

&nbsp;


### 1. GET /pub/products

#### Description
- Get all the products data without authentication and authorization

#### Request
- Query:
  ```json
    {
      "search": "(Name of product)",
      "sortBy": "[ASC, DESC]",
      "filter": "(categoryId)",
      "limit": "integer",
      "page": "integer"
    }
  ```

#### Request Example
http://localhost:3000/pub/products?search=chair&sortBy=DESC&filter=1&limit=5&page=1

#### Response
_200 - OK_

  ```json
  {
      "currentPage": 1,
      "totalPages": 1,
      "totalProducts": 1,
      "products": [
          {
              "id": 3,
              "name": "POÄNG Armchair",
              "description": "A comfortable armchair with a ...",
              "price": 1899000,
              "stock": 20,
              "imgUrl": "https://www.ikea.com/poang.jpg",
              "categoryId": 1,
              "authorId": 3,
              "createdAt": "2025-03-13T08:58:31.765Z",
              "updatedAt": "2025-03-13T08:58:31.765Z"
          }
      ]
  }
  ```


&nbsp;


### 2. GET /pub/products/:id

#### Description
- Get product data by id without authentication and authorization

#### Request
- Params:
  ```json
  {
    "id": "integer (required)"
  }
  ```

#### Response
 _200 - OK_
  ```json
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "string",
    "stock": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer",
    "createdAt": "date",
    "updatedAt": "date"
  }
  ```

_404 - Not Found_
  ```json
    {
      "message": "Product with id:... not found"
    }
  ```

&nbsp;


### 3. POST /login

#### Description
- Login for admin or staff

#### Request
- Body
  ```json
  {
    "email": "string (required)",
    "password": "string (required)"
  }
  ```

#### Response
_200 - OK_

  ```json
  {
    "access_token": "string"
  }
  ```

_400 - Bad Request_

  ```json
  {
    "message": "Email is  required"
  }
  OR
  {
    "message": "Password is required"
  }
  ```

_401 - Unauthorized_

  ```json
  {
    "message": "Invalid email or password"
  }
  ```


&nbsp;


### 4. POST /add-user

#### Description
- Add new user (admin only)

#### Request
- Header
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```

- Body
  ```json
  {
    "email": "string (required)",
    "password": "string (required)",
    "phoneNumber": "string",
    "address": "string"
  }
  ```

#### Response
_201 - Created_

  ```json
  {
    "id": "integer",
    "email": "string",
  }
  ```

_401 - Unauthorized_

  ```json
  {
    "message": "Invalid Token"
  }
  ```

_403 - Forbidden_

  ```json
  {
    "message": "You are not authorized"
  }
  ```

_400 - Bad Request_

  ```json
  {
    "message": "Email is required"
  }
  OR
  {
    "message": "Invalid email format"
  }
  OR
  {
    "message": "Password is required"
  }
  OR
  {
    "message": "Password must be at least 5 characters"
  }
  OR
  {
    "message": "Email already exists"
  }
  ```


&nbsp;


### 5. POST /categories

#### Description
- Add new category

#### Request
- Header
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```

- Body
  ```json
  {
    "name": "string (required)"
  }
  ```

#### Response
_201 - Created_
  ```json
  {
    "category": {
        "id": "integer",
        "name": "string",
        "updatedAt": "date",
        "createdAt": "date"
    }
  }
  ```

_401 - Unauthorized_
  ```json
  {
    "message": "Invalid Token"
  }
  ```

_400 - Bad Request_
  ```json
  {
    "message": "Name of category is required"
  }
  ```

&nbsp;


### 6. GET /categories

#### Description
- Get all categories

#### Request
- Header
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```

#### Response
_200 - OK_
  ```json
  {
    "categories": [
        {
            "id": "integer",
            "name": "string",
            "createdAt": "date",
            "updatedAt": "date"
        },
        ...
    ]   
  }
  ```

_401 - Unauthorized_
  ```json
  {
    "message": "Invalid Token"
  }
  ```


&nbsp;


### 7. PUT /categories/:id

#### Description
- Update category by id

#### Request
- Header
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```

- Params
  ```json
  {
    "id": "integer (required)"
  }
  ```

- Body
  ```json
  {
    "name": "string (required)"
  }
  ```

#### Response
_200 - OK_
  ```json
  {
    "category": {
        "id": "integer",
        "name": "string",
        "createdAt": "date",
        "updatedAt": "date"
    }
  }
  ```

_401 - Unauthorized_
  ```json
  {
    "message": "Invalid Token"
  }
  ```

_404 - Not Found_
  ```json
  {
    "message": "Category with id:... not found"
  }
  ```

_400 - Bad Request_
  ```json
  {
    "message": "Name of category is required"
  }
  ```


&nbsp;



### 8. POST /products

#### Description
- Add new product

#### Request
- Header
  ```json
  {
   "Authorization": "Bearer <access_token>"
  }
  ```

- Body
  ```json
  {
    "name": "string (required)",
    "description": "string (required)",
    "price": "integer (required)",
    "stock": "integer",
    "imgUrl": "string",
    "categoryId": "integer (required)"
  }
  ```

#### Response
_201 - Created_
  ```json
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer",
    "updatedAt": "date",
    "createdAt": "date"
  }
  ```

_401 - Unauthorized_
  ```json
  {
    "message": "Invalid Token"
  }
  ```

_400 - Bad Request_
  ```json
  {
    "message": "Name of product is required"
  }
  OR
  {
    "message": "Description is required"
  }
  OR
  {
    "message": "Price is required"
  }
  OR
  {
    "message": "Price must be at least 20000"
  }
  OR
  {
    "message": "Category is required"
  }
  ```


&nbsp;


### 9. GET /products

#### Description
- Get all products

#### Request
- Header
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```

#### Response
_200 - OK_
  ```json
  [
    {
        "id": "integer",
        "name": "string",
        "description": "string",
        "price": "integer",
        "stock": "integer",
        "imgUrl": "string",
        "categoryId": "integer",
        "authorId": "integer",
        "createdAt": "date",
        "updatedAt": "date",
        "User": {
            "id": "integer",
            "email": "string",
            "role": "string",
            "phoneNumber": "string",
            "address": "string",
            "createdAt": "date",
            "updatedAt": "date"
        }
    },
    ...
  ]
  ```

_401 - Unauthorized_
  ```json
  {
    "message": "Invalid Token"
  }
  ```


&nbsp;


### 10. GET /products/:id

#### Description
- Get product by id

#### Request
- Header
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```

- Params
  ```json
  {
    "id": "integer (required)"
  }
  ```

#### Response
_200 - OK_
  ```json
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer",
    "createdAt": "date",
    "updatedAt": "date",
    "User": {
        "id": "integer",
        "email": "string",
        "role": "string",
        "phoneNumber": "string",
        "address": "string",
        "createdAt": "date",
        "updatedAt": "date"
    }
  }
  ```

_401 - Unauthorized_
  ```json
  {
    "message": "Invalid Token"
  }
  ```

_404 - Not Found_
  ```json
  {
    "message": "Product with id:... not found"
  }
  ```


&nbsp;


### 11. PUT /products/:id

#### Description
- Update product by id (admin or owner only)

#### Request
- Header
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```

- Params
  ```json
  {
    "id": "integer (required)"
  }
  ```

- Body
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer",
    "imgUrl": "string",
    "categoryId": "integer"
  }
  ```

#### Response
_200 - OK_
  ```json
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer",
    "imgUrl": "string",
    "categoryId": "integer",
    "authorId": "integer",
    "createdAt": "date",
    "updatedAt": "date",
  }
  ```

_401 - Unauthorized_
  ```json
  {
    "message": "Invalid Token"
  }
  ```

_403 - Forbidden_
  ```json
  {
    "message": "You are not authorized"
  }
  ```

_404 - Not Found_
  ```json
  {
    "message": "Product with id:... not found"
  }
  ```

_400 - Bad Request_
  ```json
  {
    "message": "Name of product is required"
  }
  OR
  {
    "message": "Description is required"
  }
  OR
  {
    "message": "Price is required"
  }
  OR
  {
    "message": "Price must be at least 20000"
  }
  OR
  {
    "message": "Category is required"
  }
  ```


&nbsp;


### 12. PATCH /products/:id

#### Description
- Update image url product by id (admin or owner only)

#### Request
- Header
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```

- Params
  ```json
  {
    "id": "integer (required)"
  }
  ```

- Body
  ```json
  {
    "imgUrl": "string"
  }
  ```

#### Response
_200 - OK_
  ```json
  {
    "message": "Image ... success to update"
  }
  ```

_401 - Unauthorized_
  ```json
  {
    "message": "Invalid Token"
  }
  ```

_403 - Forbidden_
  ```json
  {
    "message": "You are not authorized"
  }
  ```

_404 - Not Found_
  ```json
  {
    "message": "Product with id:... not found"
  }
  ```

_400 - Bad Request_
  ```json
  {
    "message": "Image is required"
  }
  ```


&nbsp;


### 13. DELETE /products/:id

#### Description
- Delete product by id (admin or owner only)

#### Request
- Header
  ```json
  {
    "Authorization": "Bearer <access_token>"
  }
  ```

- Params
  ```json
  {
    "id": "integer (required)"
  }
  ```

#### Response
_200 - OK_
  ```json
  {
    "message": "... deleted successfully"
  }
  ```

_401 - Unauthorized_
  ```json
  {
    "message": "Invalid Token"
  }
  ```

_403 - Forbidden_
  ```json
  {
    "message": "You are not authorized"
  }
  ```

_404 - Not Found_
  ```json
  {
    "message": "Product with id:... not found"
  }
  ```


&nbsp;


## Global Error

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```