import { Card, Form, Input, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

import attributeService from "../../../services/attribute.service";
import attributeValueService from "../../../services/attributeValue.service";
import { useToast } from "../../../context/ToastProvider";

const AttributeAdd = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const toast = useToast();

  const onFinish = async (values) => {
    try {
      // ================= CREATE ATTRIBUTE =================
      const res = await attributeService.create({
        name: values.name,
      });

      // ⚠️ FIX LẤY ID AN TOÀN
      const attributeId =
        res.data?.id || res.data?.data?.id;

      if (!attributeId) {
        throw new Error("Không lấy được attribute_id");
      }

      // ================= CREATE VALUES =================
      if (values.values && values.values.length > 0) {
        for (let v of values.values) {
          if (v?.value) {
            await attributeValueService.create({
              attribute_id: attributeId,
              value: v.value,
            });
          }
        }
      }

      toast.success("Thêm thành công");
      navigate("/admin/attributes"); // ✅ FIX

    } catch (err) {
      console.log("ERROR:", err?.response?.data || err);
      toast.error("Lỗi thêm");
    }
  };

  return (
    <Card title="Thêm Attribute">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        
        {/* NAME */}
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Nhập tên attribute" }]}
        >
          <Input placeholder="Color, Size..." />
        </Form.Item>

        {/* VALUES */}
        <Form.List name="values">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Space
                  key={field.key}
                  style={{ display: "flex", marginBottom: 8 }}
                >
                  <Form.Item
                    key={field.key} // ✅ FIX KEY
                    name={[field.name, "value"]}
                    fieldKey={[field.fieldKey, "value"]}
                    rules={[{ required: true, message: "Nhập value" }]}
                  >
                    <Input placeholder="Value (Red, XL...)" />
                  </Form.Item>

                  <Button danger onClick={() => remove(field.name)}>
                    Xóa
                  </Button>
                </Space>
              ))}

              <Button onClick={() => add()} type="dashed">
                + Thêm Value
              </Button>
            </>
          )}
        </Form.List>

        {/* SUBMIT */}
        <Button type="primary" htmlType="submit" style={{ marginTop: 20 }}>
          Lưu
        </Button>
      </Form>
    </Card>
  );
};

export default AttributeAdd;
