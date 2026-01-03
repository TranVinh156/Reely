# Reely — Short Video Social (TikTok-style)

Reely là ứng dụng mạng xã hội video ngắn theo phong cách TikTok, gồm:

- **Frontend**: React + TypeScript (Vite)
- **Gateway**: Spring Cloud Gateway (WebFlux)
- **Backend**: Spring Boot (REST API)

Các tính năng nổi bật: feed cuộn dọc, tìm kiếm video/user/tag, hashtag page, upload video (presigned + chunked), like/comment/follow, notification (long-polling), report nội dung và analytics cơ bản.

## Tính năng chính

- **Auth**: đăng ký/đăng nhập, refresh token (cookie `httpOnly`), đổi/quen/reset mật khẩu
- **Feed**: autoplay + auto pause theo viewport; tính view sau khi xem liên tục ≥ 5s (`POST /videos/{id}/view`)
- **Video**: upload presigned (S3), upload theo **chunks**, CRUD cơ bản
- **Interaction**: like/unlike, comment/reply, follow/unfollow
- **Search**: search videos/users/tags; click tag → danh sách video theo tag
- **Notification**: tạo từ like/comment/follow (RabbitMQ); FE nhận qua **long-polling**
- **Report**: báo cáo video/comment theo trạng thái
- **Analytics**: thống kê like/view/comment theo user và theo ngày

## Kiến trúc

```mermaid
flowchart LR
  U((User)) --> FE[Frontend]
  FE --> GW[Gateway]
  GW --> BE[Backend]
  BE --> DB[(MySQL)]
  BE --> MQ[(RabbitMQ)]
  BE --> S3[(S3 / Object Storage)]
```

### Gateway làm gì?

- Cấu hình CORS cho Frontend
- Xác thực JWT ở lớp edge
- Inject header nội bộ (`X-UserId`, `X-Username`, `X-Role`) sang Backend
- Proxy route `/api/v1/**` → Backend

## Tech stack

- **Frontend**: React + TypeScript + Vite + Axios + Zustand + React Query
- **Gateway**: Spring Cloud Gateway (WebFlux) + JWT
- **Backend**: Spring Boot + Spring Security + Spring Data JPA + AMQP (RabbitMQ)
- **Database**: MySQL
- **Storage**: AWS S3 (có thể thay bằng MinIO nếu tự cấu hình endpoint)

## Cấu trúc thư mục

```
Reely/
  backend/           # Spring Boot API
  gateway/           # Spring Cloud Gateway
  frontend/          # React TS (UI)
  docker-compose.yml # local: mysql + backend + gateway
```

Ngoài ra có file [backend/compose.yaml](backend/compose.yaml) để dựng RabbitMQ (dev).

## Chạy local nhanh (Docker Compose)

Yêu cầu: Docker Desktop.

1) Dựng MySQL + Backend + Gateway

```bash
docker compose up -d --build
```

2) Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Endpoint mặc định:

- Gateway: http://localhost:8081
- Backend: http://localhost:8080
- MySQL: `localhost:3307` (map từ container `3306`)

Lưu ý:

- Compose ở root **chưa kèm RabbitMQ và S3**. Nếu bạn dùng notification hoặc upload thực tế, hãy chạy thêm RabbitMQ/S3 tương ứng.

## Chạy local không dùng Docker (dev)

Yêu cầu khuyến nghị:

- Node.js 18+ (hoặc 20+)
- JDK 21 (repo có `mvnw` và Dockerfile dùng Temurin 21)

### 1) Hạ tầng: RabbitMQ (tuỳ chọn)

File [backend/compose.yaml](backend/compose.yaml) có cả `mysql` và `rabbitmq`. Nếu bạn chỉ cần RabbitMQ, có thể chạy riêng service `rabbitmq`:

```bash
cd backend
docker compose -f compose.yaml up -d rabbitmq
```

- RabbitMQ AMQP: `amqp://guest:guest@localhost:5672`
- Management UI: http://localhost:15672 (guest/guest)

### 2) Backend

Tạo file `backend/.env` (đặt cùng cấp với `pom.xml`):

```bash
# Server
PORT=8080

# DB
DB_URL=jdbc:mysql://localhost:3306/mydatabase?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false
DB_USERNAME=root
DB_PASSWORD=verysecret

# JWT
SECRET_TOKEN=YOUR_SECRET
ACCESS_TOKEN_EXPIRATION=3600000
REFRESH_TOKEN_EXPIRATION=604800000

# Seed super admin
SUPER_ADMIN_USERNAME=admin
SUPER_ADMIN_EMAIL=admin@reely.local
SUPER_ADMIN_PASSWORD=admin123

# RabbitMQ (tuỳ chọn)
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# S3
S3_ACCESS_KEY=YOUR_ACCESS_KEY
S3_SECRET_KEY=YOUR_SECRET_KEY

# Email (forgot password) - tuỳ chọn
RESEND_API_KEY=YOUR_RESEND_KEY
FRONTEND_URL=http://localhost:5173
```

Chạy backend:

```bash
cd backend
./mvnw spring-boot:run
```

Trên Windows bạn có thể dùng:

```bash
cd backend
mvnw.cmd spring-boot:run
```

### 3) Gateway

Tạo file `gateway/.env`:

```bash
PORT=8081
BACKEND_URL=http://localhost:8080
SECRET_TOKEN=YOUR_SECRET
FRONTEND_URL=http://localhost:5173
```

Chạy gateway:

```bash
cd gateway
./mvnw spring-boot:run
```

### 4) Frontend

```ts
const API_URL = 'https://reely-hofs.onrender.com/api/v1'
```

Khi chạy local, đổi thành:

```ts
const API_URL = 'http://localhost:8081/api/v1'
```

Chạy FE:

```bash
cd frontend
npm install
npm run dev
```

## API (tóm tắt)

Base path: `/api/v1`

- **Auth**: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`, ...
- **Feed/Search/Tags**: `GET /feed/**`, `GET /search/videos?q=...`, `GET /search/users?q=...`, `GET /search/tags?q=...`, `GET /tags/{tagName}/videos`
- **Video**: `POST /videos`, `POST /videos/{videoId}/view`, `GET /videos/users/{userId}`, `GET /videos/liked/{userId}`, `DELETE /videos/{videoId}`
- **Upload (S3)**: `GET /upload/avatar?fileName=...`, `GET /upload/video?fileName=...`, `POST /upload/video/chunk/*`
- **Interaction**: `POST /likes/**`, `POST /comments/**`, `POST /reports/**`
- **Notification**: `GET /notifications/polling?...`

Ghi chú: Gateway sẽ tự động gắn `X-UserId/X-Role/...` từ JWT vào request gửi sang Backend.


## Deployment (Production)

- Frontend: Vercel
- Gateway/Backend: Render
- Database: MySQL ( AWS RDS)
- Queue: RabbitMQ
- Storage: AWS S3

Khuyến nghị:

- Bật HTTPS cho Gateway/Backend (để cookie `secure=true` hoạt động đúng)
- Cấu hình CORS origin theo domain frontend (Vercel) trong Gateway

## License

Dùng cho mục đích học tập/đồ án.
