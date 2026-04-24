import { useEffect } from "react";
import { Card, Form, Input, Button, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import attributeService from "../../../services/attribute.service";
import attributeValueService from "../../../services/attributeValue.service";
import { useToast } from "../../../context/ToastProvider";

const AttributeEdit = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const attr = await attributeService.getById(id);
        const valuesRes = await attributeValueService.getAll();

        const attrData = attr.data?.data || attr.data;

        const valuesData = Array.isArray(valuesRes.data)
          ? valuesRes.data
          : valuesRes.data?.data || [];

        // Sử dụng === để tránh lỗi eqeqeq
        const list = valuesData.filter(
          (v) => String(v.attribute_id) === String(id)
        );

        // FORMAT CHO Form.List
        const formattedValues = list.map((v) => ({
          value: v.value,
        }));

        form.setFieldsValue({
          name: attrData.name,
          values: formattedValues,
        });
      } catch (err) {
        console.error(err);
        toast.error("Lỗi load dữ liệu");
      }
    };

    fetchData();
  }, [id, form, toast]);

  // ================= SUBMIT =================
  const onFinish = async (values) => {
    try {
      // update attribute
      await attributeService.update(id, {
        name: values.name,
      });

      // lấy danh sách cũ để xử lý
      const oldRes = await attributeValueService.getAll();

      const oldData = Array.isArray(oldRes.data)
        ? oldRes.data
        : oldRes.data?.data || [];

      const oldList = oldData.filter(
        (v) => String(v.attribute_id) === String(id)
      );

      // xoá cũ
      for (let v of oldList) {
        await attributeValueService.remove(v.id);
      }

      // tạo mới
      if (values.values && values.values.length > 0) {
        for (let v of values.values) {
          if (v?.value) {
            await attributeValueService.create({
              attribute_id: id,
              value: v.value,
            });
          }
        }
      }

      toast.success("Cập nhật thành công");
      navigate("/admin/attributes");
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error("Lỗi cập nhật");
    }
  };

  return (
    <Card title="Sửa Attribute">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* NAME */}
        <Form.Item
          label="Tên thuộc tính"
          name="name"
          rules={[{ required: true, message: "Nhập tên" }]}
        >
          <Input placeholder="Ví dụ: Color, Size..." />
        </Form.Item>

        {/* VALUES */}
        <Form.List name="values">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "value"]}
                    rules={[{ required: true, message: "Nhập giá trị" }]}
                  >
                    <Input placeholder="Ví dụ: Red, XL..." />
                  </Form.Item>

                  <Button danger onClick={() => remove(name)}>
                    Xóa
                  </Button>
                </Space>
              ))}

              <Form.Item>
                <Button onClick={() => add()} type="dashed" block>
                  + Thêm giá trị (Value)
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* SUBMIT */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", marginTop: 10 }}
          >
            Cập nhật thuộc tính
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AttributeEdit;