module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("posts", [

      {
        topic_id: 1,
        title: "Xu hướng công nghệ nổi bật năm 2026",
        slug: "xu-huong-cong-nghe-2026",
        content: `
Năm 2026 đánh dấu sự bùng nổ mạnh mẽ của trí tuệ nhân tạo (AI) trong mọi lĩnh vực.
Từ laptop, điện thoại cho đến các thiết bị gia dụng, AI đều được tích hợp nhằm tối ưu trải nghiệm người dùng.

Bên cạnh đó, công nghệ chip cũng có bước tiến lớn khi các hãng như Intel, AMD và Apple liên tục ra mắt các dòng CPU mới
với hiệu năng cao hơn nhưng tiêu thụ điện năng thấp hơn.

Ngoài ra, xu hướng điện toán đám mây và làm việc từ xa tiếp tục phát triển, kéo theo nhu cầu về thiết bị mạnh mẽ,
kết nối ổn định và bảo mật cao.

Có thể nói, công nghệ năm 2026 không chỉ mạnh hơn mà còn thông minh hơn, hướng tới cá nhân hóa trải nghiệm người dùng.
        `,
        thumbnail: "tech2026.jpg",
        created_by: 1,
        status: 1,
      },

      {
        topic_id: 2,
        title: "Đánh giá Macbook M3 sau 1 tháng sử dụng",
        slug: "danh-gia-macbook-m3",
        content: `
Macbook M3 là một trong những chiếc laptop đáng chú ý nhất hiện nay.
Sau 1 tháng sử dụng, thiết bị cho thấy hiệu năng cực kỳ ấn tượng trong cả công việc lẫn giải trí.

Chip M3 giúp xử lý nhanh các tác vụ nặng như lập trình, chỉnh sửa video hay thiết kế đồ họa.
Thời lượng pin vẫn là điểm mạnh khi có thể sử dụng cả ngày mà không cần sạc.

Màn hình Retina sắc nét, màu sắc chính xác, rất phù hợp cho designer.
Tuy nhiên, giá thành vẫn là một rào cản đối với nhiều người dùng.

Tổng kết lại, nếu bạn cần một chiếc laptop mạnh mẽ, ổn định và lâu dài thì Macbook M3 là lựa chọn rất đáng cân nhắc.
        `,
        thumbnail: "macbookm3.jpg",
        created_by: 1,
        status: 1,
      },

      {
        topic_id: 3,
        title: "Build PC Gaming 25 triệu: Cấu hình tối ưu",
        slug: "build-pc-gaming-25tr",
        content: `
Với ngân sách khoảng 25 triệu, bạn hoàn toàn có thể build một bộ PC gaming mạnh mẽ để chơi hầu hết các tựa game hiện nay.

Cấu hình đề xuất:
- CPU: Ryzen 5 5600 hoặc Intel i5-12400F
- GPU: RTX 4060
- RAM: 16GB DDR4
- SSD: 512GB NVMe

Cấu hình này đủ sức chiến tốt các game AAA ở mức setting cao.
Ngoài ra, bạn cũng có thể nâng cấp trong tương lai mà không cần thay toàn bộ hệ thống.

Điểm quan trọng khi build PC là cân đối giữa CPU và GPU để tránh nghẽn cổ chai.
        `,
        thumbnail: "pcgaming.jpg",
        created_by: 1,
        status: 1,
      },

      {
        topic_id: 4,
        title: "5 cách giúp máy tính Windows chạy nhanh hơn",
        slug: "meo-windows-nhanh-hon",
        content: `
Sau một thời gian sử dụng, máy tính Windows thường bị chậm đi do nhiều nguyên nhân.

Dưới đây là một số cách đơn giản giúp cải thiện hiệu năng:

1. Tắt các ứng dụng khởi động cùng hệ thống
2. Dọn dẹp file rác và bộ nhớ tạm
3. Gỡ bỏ phần mềm không cần thiết
4. Nâng cấp SSD nếu vẫn dùng HDD
5. Cập nhật Windows và driver thường xuyên

Những thao tác này tuy đơn giản nhưng mang lại hiệu quả rõ rệt,
giúp máy tính hoạt động mượt mà hơn và tăng tuổi thọ thiết bị.
        `,
        thumbnail: "windows.jpg",
        created_by: 1,
        status: 1,
      }

    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("posts", null, {});
  }
};
