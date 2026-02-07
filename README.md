# CarGoRent - Car Rental Application

A full-stack car rental application built with Spring Boot and React.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 16+
- MySQL 8+
- Maven

### Backend Setup

1. **Create Database**
   ```sql
   CREATE DATABASE cargorent;
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   DB_URL=jdbc:mysql://localhost:3306/cargorent
   DB_USERNAME=root
   DB_PASSWORD=your_password
   JWT_SECRET=$(openssl rand -base64 32)
   JWT_ACCESS_EXPIRY=900000
   JWT_REFRESH_EXPIRY=2592000000
   SERVER_PORT=8080
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```

   **Important**: Generate a secure JWT secret:
   ```bash
   openssl rand -base64 32
   ```

3. **Load Environment Variables**
   
   **Option A - Using export (Unix/Mac)**:
   ```bash
   export $(cat .env | xargs)
   ```

   **Option B - Using IntelliJ IDEA**:
   - Edit Run Configuration
   - Add environment variables from `.env` file

   **Option C - Using VS Code**:
   - Install "DotENV" extension
   - Variables will be loaded automatically

4. **Run Backend**
   ```bash
   mvn spring-boot:run
   ```

   Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd cargorent-ui
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment** (Optional)
   
   The frontend already has `.env` configured. To change the API URL:
   ```bash
   # Edit cargorent-ui/.env
   REACT_APP_API_URL=http://localhost:8080/api
   ```

4. **Run Frontend**
   ```bash
   npm start
   ```

   Frontend will start on `http://localhost:3000`

## 📋 Features

- **User Authentication**: JWT-based secure login and registration
- **Role-Based Access**: Customer and Company roles
- **Car Management**: Companies can manage their fleet
- **Order Management**: Customers can rent cars, view orders
- **Order Tracking**: View order status and history

## 🔐 Security Features

- Environment-based configuration (no hardcoded secrets)
- JWT authentication with configurable expiry
- Password validation (minimum 8 characters, uppercase, lowercase, digit required)
- Input validation on all endpoints
- CORS configuration
- Password encryption with BCrypt

## 🏗️ Tech Stack

### Backend
- Java 17
- Spring Boot 3.5.10
- Spring Security
- JWT (jjwt 0.11.5)
- MySQL
- JPA/Hibernate
- Lombok
- Bean Validation

### Frontend
- React 18
- React Router
- Axios
- Tailwind CSS
- Lucide React (icons)

## 📁 Project Structure

```
cargorent/
├── src/main/java/com/cargorent/
│   ├── config/          # Security, CORS configuration
│   ├── controller/      # REST controllers
│   ├── dto/             # Data Transfer Objects
│   ├── entity/          # JPA entities
│   ├── exception/       # Custom exceptions
│   ├── repository/      # Data repositories
│   ├── security/        # JWT utilities
│   └── service/         # Business logic
├── cargorent-ui/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── context/     # React context
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── utils/       # Utilities
└── .env                 # Environment variables (gitignored)
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `POST /api/users/register` - User registration
- `GET /api/users` - Get all users (protected)

### Companies
- `GET /api/companies` - List all companies
- `POST /api/companies` - Create company (protected)
- `GET /api/companies/{id}/cars` - Get company's cars

### Cars
- `GET /api/cars/company/{companyId}` - Get cars by company

### Orders
- `POST /api/orders` - Place order (protected)
- `GET /api/orders/my` - Get my orders (protected)
- `GET /api/orders/{orderId}` - Get order details (protected)
- `PUT /api/orders/{orderId}/cancel` - Cancel order (protected)
- `PUT /api/orders/{orderId}/status` - Update status (protected)

## ⚠️ Important Notes

### Security
1. **Never commit `.env`** - It's in `.gitignore` for your safety
2. **Change JWT_SECRET** - Use a cryptographically secure random string
3. **Change DB password** - Don't use default passwords in production

### Development
- Backend runs on port `8080`
- Frontend runs on port `3000`
- Hot reload enabled for both

## 🐛 Troubleshooting

### Backend won't start
- Check if environment variables are set: `echo $JWT_SECRET`
- Verify MySQL is running: `mysql -u root -p`
- Check database exists: `SHOW DATABASES;`

### Frontend can't connect to backend
- Verify backend is running on port 8080
- Check CORS configuration in backend
- Verify `REACT_APP_API_URL` in frontend `.env`

### JWT errors
- Ensure `JWT_SECRET` is set and at least 32 characters
- Check token expiry settings

## 📝 License

This project is for educational purposes.

## 👥 Contributors

- Atharva M

---

**Need help?** Check the setup guides in `.env.example` files.
