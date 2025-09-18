# Admin Dashboard API

## Installation

```bash
npm install
npm start
```

## Endpoints

### Authentication
- `POST /auth/login` — Login (body: username, password)

### Products
- `GET /api/products` — List all products
- `GET /api/products/:id` — Get product by id
- `POST /api/products` — Add or update product
- `PUT /api/products/:id` — Add or update product by id
- `DELETE /api/products/:id` — Delete product

### Categories
- `GET /api/categories` — List all categories
- `GET /api/categories/:id` — Get category by id
- `POST /api/categories` — Add or update category
- `PUT /api/categories/:id` — Add or update category by id
- `DELETE /api/categories/:id` — Delete category

### Languages
- `GET /api/languages` — List all languages
- `GET /api/languages/:id` — Get language by id
- `POST /api/languages` — Add or update language
- `PUT /api/languages/:id` — Add or update language by id
- `DELETE /api/languages/:id` — Delete language

### Currencies
- `GET /api/currencies` — List all currencies
- `GET /api/currencies/:id` — Get currency by id
- `POST /api/currencies` — Add or update currency
- `PUT /api/currencies/:id` — Add or update currency by id
- `DELETE /api/currencies/:id` — Delete currency

### Reports
- `GET /api/reports` — List all reports
- `GET /api/reports/:id` — Get report by id
- `POST /api/reports` — Add or update report
- `PUT /api/reports/:id` — Add or update report by id
- `DELETE /api/reports/:id` — Delete report
- `POST /api/reports/:id/status` — Change report status

### Orders
- `GET /api/orders` — List all orders
- `GET /api/orders/:id` — Get order by id
- `POST /api/orders/:id/status` — Change order status

### Customers
- `GET /api/customers` — List all customers
- `GET /api/customers/:id` — Get customer by id

### Users
- `GET /api/users?username=...&password=...` — Login (query params)

### Stats
- `GET /api/stats` — Get statistics
