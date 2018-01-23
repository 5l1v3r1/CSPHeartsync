# [OPENSOURCE] Source code của CSP Heartsync

## Overview
- CSP Heartsync là chatbot giúp bạn có thể kết nối với mọi người trong CSP
- CSP Heartsync là sản phẩm của Trần Công Việt An và Nguyễn Hoàng Minh, được sở hữu và quảng bá bởi CLB Công Nghệ ADaPT
## Development  
### Khung xây dựng tính năng
- [x] Xử lí start user's session
    + [x] Xử lí check user's status
- [x] Xử lí lựa chọn giới tính
- [x] Xử lí trong khi nhắn tin
    + [x] Xử lí lọc tin nhắn
- [x] Xử lí kết thúc user's session
    + [x] Xử lí destroy session
### Công nghệ sử dụng:
+ Node.js
+ MongoDB
+ Express

## Hướng dẫn sử dụng
### Yêu cầu
+ Một máy chủ ảo VPS Linux hoặc Windows có cài sẵn các công cụ sau: Apache(Nginx), NodeJS min 8.9.4 LTS (Recommend 9.3.0) và MongoDB
+ Một page Facebook
+ Một App Facebook đăng kí tại api.facebook.com

### Cách thiết lập: Thiết lập trong file ".env" đối với bạn nào dùng heroku thì thêm 1 file Procfile rồi thêm content nó là: web: node index.js
+ Mặc định MongoDB có url là: mongodb://localhost:27017
+ Thiết lập một địa chỉ webhook trên webserver của bạn, đồng thời cung cấp cho địa chỉ đó một port (mặc định là 2345)
+ Cung cấp các thông tin cần thiết vào file .env
+ Chạy một trong các lệnh sau để cài đặt các module cần thiết cho chatbot
```batch
    npm install 
    hoặc
    yarn
```
+ Chạy lệnh ```node setup.js``` để thiết lập giao diện chatbot
+ Chạy lệnh ```node index.js``` để bắt đầu chatbot
+ Bạn có thể dùng pm2 để giữ app chạy khi bị crash

### Và cuối cùng nếu app có lỗi vui lòng Issues lại để chúng mình fix nhé


