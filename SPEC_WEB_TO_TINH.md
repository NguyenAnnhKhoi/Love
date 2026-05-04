# SPEC - Website Tỏ Tình Interactive Mini-Game

## 1. Mục tiêu
Xây dựng một website tương tác dạng mini-game theo phong cách "Ai là triệu phú" để dẫn dắt người dùng qua một hành trình vui nhộn, cảm xúc và có tính bất ngờ, kết thúc bằng trang tỏ tình với 2 lựa chọn `Yes / No`.

## 2. Đối tượng sử dụng
- Người chơi chính: cô gái được tỏ tình.
- Người tạo nội dung: người chuẩn bị câu hỏi, lời nhắn, quà thưởng và câu tỏ tình.

## 3. Công nghệ
### Backend
- Java 17+ hoặc theo môi trường dự án
- Spring Boot
- REST API hoặc render server-side tuỳ cách triển khai

### Frontend
- HTML
- CSS
- TailwindCSS
- Vanilla JavaScript
- Có thể dùng Alpine.js nếu cần tương tác gọn hơn

## 4. Luồng tổng thể
1. Trang nhập tên
2. Trang bắt đầu game
3. 10 câu hỏi tương tác
4. Trang phần thưởng
5. Trang tâm thư
6. Trang câu hỏi tỏ tình
7. Trang kết quả `Yes / No`

## 5. Mô tả từng màn hình

### 5.1 Trang nhập tên
Mục tiêu là tạo cảm giác cá nhân hoá ngay từ đầu.
- Hiển thị ô nhập tên người chơi.
- Nút bắt đầu.
- Giao diện nhẹ nhàng, đáng yêu, tạo cảm giác tò mò.
- Có validation cơ bản: không được để trống.

### 5.2 Trang bắt đầu game
- Chào mừng người chơi bằng tên đã nhập.
- Giới thiệu ngắn gọn luật chơi.
- Nút bắt đầu câu hỏi đầu tiên.
- Có animation xuất hiện mượt.

### 5.3 Trang 10 câu hỏi
- Mỗi câu hỏi có nhiều đáp án.
- Mỗi câu trả lời đúng sẽ mở câu tiếp theo.
- Có thanh tiến độ theo số câu đã hoàn thành.
- Có thể chèn các hiệu ứng vui nhộn sau mỗi câu đúng.
- Câu hỏi nên tăng dần cảm xúc, từ vui đến lãng mạn.

### 5.4 Trang phần thưởng
- Hiển thị phần thưởng sau khi hoàn thành 10 câu hỏi.
- Phần thưởng có thể là ảnh, sticker, lời chúc hoặc một hiệu ứng đặc biệt.
- Nội dung phần thưởng nên mang tính cá nhân hoá.

### 5.5 Trang tâm thư
- Nội dung chữ viết tình cảm, chân thành.
- Có thể dùng animation gõ chữ hoặc hiệu ứng letter reveal.
- Bố cục đọc dễ, ít nhiễu.

### 5.6 Trang câu hỏi tỏ tình
- Hiển thị câu hỏi chính: đồng ý hay không.
- Có hai nút `Yes` và `No`.
- Nút `Yes` là lựa chọn chính.
- Có thể làm nút `No` khó bấm hơn hoặc né nhẹ để tăng tính hài hước, nhưng vẫn phải đảm bảo không gây khó chịu.

### 5.7 Trang kết quả
- Nếu chọn `Yes`: hiển thị trạng thái chúc mừng, ngọt ngào, vui vẻ.
- Nếu chọn `No`: hiển thị trạng thái lịch sự, tôn trọng, không gây áp lực.
- Có thể thêm nút quay lại hoặc kết thúc.

## 6. Yêu cầu chức năng
- Lưu tên người chơi từ đầu đến cuối flow.
- Điều hướng đúng theo trạng thái game.
- Kiểm tra đáp án từng câu hỏi.
- Ghi nhận trạng thái hoàn thành 10 câu.
- Cho phép hiển thị nội dung theo cấu hình từ backend.
- Hỗ trợ responsive cho desktop và mobile.

## 7. Yêu cầu phi chức năng
- Tốc độ tải nhanh.
- Giao diện mượt, không rối mắt.
- Hiệu ứng chuyển cảnh nhẹ nhàng.
- Tối ưu trải nghiệm mobile trước.
- Không làm người dùng cảm thấy bị ép buộc khi chọn `No`.

## 8. Định hướng UI/UX
- Tông cảm xúc: ấm áp, lãng mạn, tinh tế, hơi bất ngờ.
- Typography rõ ràng, dễ đọc.
- Nên có nền gradient hoặc texture nhẹ, tránh nền đơn điệu.
- Dùng animation có chủ đích, không lạm dụng.
- Mỗi màn hình nên có một điểm nhấn riêng.

## 9. Cấu trúc dữ liệu gợi ý
### 9.1 User Session
- `playerName`
- `currentStep`
- `answeredQuestions`
- `selectedAnswers`
- `result`

### 9.2 Question
- `id`
- `title`
- `options`
- `correctAnswer`
- `explanation`

### 9.3 Result
- `type`: `YES` hoặc `NO`
- `message`
- `ctaText`

## 10. API gợi ý
Nếu triển khai theo Spring Boot API, có thể dùng các endpoint sau:
- `GET /api/game/start`
- `GET /api/game/questions`
- `POST /api/game/answer`
- `GET /api/game/reward`
- `GET /api/game/letter`
- `GET /api/game/proposal`
- `POST /api/game/result`

## 11. Luật chơi gợi ý
- Người chơi trả lời đúng để đi tiếp.
- Có thể giới hạn sai tối đa hoặc cho trả lời lại, tuỳ kịch bản mong muốn.
- Sau khi hoàn thành 10 câu, tự động mở phần thưởng.
- Từ tâm thư chuyển sang câu hỏi tỏ tình bằng một màn hình chuyển tiếp mượt.

## 12. Tiêu chí nghiệm thu
- Người chơi nhập tên và đi hết flow mà không bị lỗi điều hướng.
- 10 câu hỏi hiển thị và hoạt động đúng.
- Phần thưởng, tâm thư, câu hỏi tỏ tình và kết quả hiển thị đầy đủ.
- Giao diện responsive tốt trên điện thoại.
- Trải nghiệm có cảm xúc, dễ hiểu, không gây rối.

## 13. Gợi ý mở rộng
- Hiệu ứng âm thanh nhẹ.
- Lưu lịch sử lựa chọn.
- Thêm ảnh cá nhân hoá.
- Thêm chế độ chia sẻ kết quả.
- Thêm biến thể nội dung theo tên người chơi.

## 14. Gợi ý cấu trúc project
### Backend
```text
/backend (Spring Boot)
	├── controller
	├── service
	└── model
```

### Frontend
```text
/frontend
	├── index.html
	├── quiz.html
	├── confession.html
	├── success.html
	├── css/
	└── js/
```

## 15. Lưu ý UX
- Đừng làm câu hỏi quá khó, vì mục tiêu là dẫn đến tỏ tình chứ không phải kiểm tra kiến thức.
- Button `NO` có thể né nhẹ để tạo không khí vui, nhưng không nên né quá mức gây khó chịu.
- Nội dung cần tự nhiên, chân thành, tránh quá sến hoặc "cringe" để không làm hỏng cảm xúc của người chơi.

## 16. Kết luận
Đây là một mini-game tỏ tình có cấu trúc rõ ràng, dễ triển khai bằng Spring Boot + HTML/CSS/TailwindCSS + JavaScript. Mục tiêu quan trọng nhất là giữ cho trải nghiệm vui, cá nhân hoá và tinh tế, để người chơi đi từ tò mò đến cảm xúc tự nhiên.
