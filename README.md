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
+ Với bạn nào dùng VPS vui lòng mở port 2345
+ Sau khi hoàn tất dùng lệnh cài đặt các package cần thiết
```batch
    npm install 
    hoặc
    yarn
```
+ Bạn có thể dùng pm2 để giữ app chạy khi bị crash

### Và cuối cùng nếu app có lỗi vui lòng Issues lại để chúng mình fix nhé


