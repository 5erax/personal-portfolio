# Astraa · Personal Portfolio

Portfolio của **Astraa**, fullstack developer tại TP. Hồ Chí Minh, tập trung vào UI, chuyển động và tương tác. Giao diện desktop macOS với thư mục thắt nơ, cửa sổ Finder, About Me, Mail và dock pastel.

Thông tin và 11 dự án được lấy từ [hồ sơ GitHub](https://github.com/5erax/5erax) và [portfolio trước](https://github.com/5erax/astraa-scroll-portfolio). Liên hệ: **lagna0175@gmail.com**.

## Chạy local

Yêu cầu Node.js 22.13+ hoặc 24+.

```sh
npm ci
npm run dev
```

## Kiểm tra và build

```sh
npm test
npm run build
npm run preview
```

Deploy dưới dạng website tĩnh: build command `npm run build`, output `dist`.

## Media và iOS

Các file dự án trong Finder, Gallery và Launchpad hiển thị ảnh demo thật từ portfolio trước. Bấm ảnh trong chi tiết dự án để xem kích thước đầy đủ.

Nền dùng nguyên tệp video Minecraft mùa thu được cung cấp: 3840 × 2160, 60 fps, 131.033.887 byte. Không nén, đổi độ phân giải hay tốc độ khung hình. Tệp gốc được lưu trên Vercel Blob vì vượt giới hạn tệp GitHub; URL nằm trong `src/portfolio.json`. Video chạy `muted`, `playsinline`, tự lặp và không có nút điều khiển wallpaper. Ảnh tĩnh hiển thị khi Reduce Motion được bật hoặc trình duyệt chặn phát video.

Music dùng MP3 **Buồn vương mi (htingale)** được cung cấp, có phát/tạm dừng, tua, lùi/tiến 15 giây và lặp bài. Nhạc chỉ bắt đầu sau thao tác Play. Bộ phát đồng bộ metadata và điều khiển qua Media Session khi trình duyệt hỗ trợ. Trên iOS, âm lượng điều chỉnh bằng nút phần cứng hoặc Control Center. Thu nhỏ cửa sổ vẫn phát nhạc; đóng cửa sổ Music sẽ tạm dừng. Thời gian phát không lưu qua tải lại trang.

Ảnh và MP3 nằm tại `public/media/`; thông tin media nằm trong `src/portfolio.json`. Video gốc phát trực tiếp từ Blob, nên không cần tải thủ công khi clone repo. Video lớn tải nặng trên mạng di động; nếu chạm hạn mức Blob của gói Hobby thì nền trở về ảnh tĩnh. Không có bản nén thay thế.

## Chỉnh nội dung

Sửa `src/portfolio.json` để cập nhật giới thiệu, dự án, email, kỹ năng, FAQ và ghi chú Now. Các thư mục mở bằng double-click trên desktop, chạm trên điện thoại hoặc Enter bằng bàn phím. Ctrl/Cmd+K mở Spotlight; Escape đóng overlay/cửa sổ đang hoạt động.

Mail mở ứng dụng email bằng `mailto:`; Calendar là lịch minh họa với liên kết liên hệ. Messages trả lời từ FAQ có sẵn. Không có backend gửi thư, đặt lịch hay AI chat. Thao tác desktop chỉ lưu trong phiên trang.

## Nguồn template

Dựa trên [Coquette Desktop Portfolio của Kedhareswer Naidu](https://github.com/Kedhareswer/21stdev-my-components/tree/37062b5de72354e0045d807aeb923f6dade4dc19/components/coquette-desktop-portfolio), commit `37062b5de72354e0045d807aeb923f6dade4dc19`. Tác giả cho phép xem, sao chép và chỉnh sửa theo README gốc. Giữ lại giao diện và cơ chế tương tác, thay nội dung mẫu bằng hồ sơ Astraa. Bộ kiểm tra logic được điều chỉnh từ kiểm tra gốc của tác giả.
