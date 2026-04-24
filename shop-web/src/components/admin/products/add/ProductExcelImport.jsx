import { useState, useEffect, useCallback } from "react";
import { 
  Upload, Button, Table, Input, Select, 
  Card, Space, Typography, Tag, Empty, Tooltip 
} from "antd";
import { 
  UploadOutlined, 
  FileExcelOutlined, 
  CloudUploadOutlined,
  ExclamationCircleOutlined 
} from "@ant-design/icons";

import * as XLSX from "xlsx";
import productService from "../../../../services/product.service";
import categoryService from "../../../../services/category.service";
import BrandService from "../../../../services/brand.service";
import { useToast } from "../../../../context/ToastProvider";

const { Option } = Select;
const { Title } = Typography;

const ProductExcelImport = () => {
  const toast = useToast();

  const [excelFile, setExcelFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [cateRes, brandRes] = await Promise.all([
        categoryService.getCategories(),
        BrandService.getBrands()
      ]);
      setCategories(cateRes.data.data.items);
      setBrands(brandRes.data.data.items);
    } catch (err) {
      toast.error("Không tải được danh mục hoặc thương hiệu");
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const normalize = (str) => str?.toString().toLowerCase().trim();

  const handleUpload = (file) => {
    setExcelFile(file);
    return false;
  };

  const validateData = useCallback((input) => {
    let hasError = false;
    const nameMap = {};

    const newData = input.map((item, index) => {
      const rowNumber = index + 1;

      const cate = categories.find(
        (c) => normalize(c.name) === normalize(item.category_name)
      );
      const brand = brands.find(
        (b) => normalize(b.name) === normalize(item.brand_name)
      );

      let errors = [];

      // NAME
      if (!item.name) {
        errors.push(`Dòng ${rowNumber}: Thiếu tên`);
      } else {
        const key = normalize(item.name);
        if (nameMap[key]) {
          errors.push(`Trùng với dòng ${nameMap[key]}`);
        } else {
          nameMap[key] = rowNumber;
        }
      }

      // CATEGORY
      if (!cate) {
        errors.push(`Sai category (dòng ${rowNumber})`);
      }

      // BRAND
      if (!brand) {
        errors.push(`Sai brand (dòng ${rowNumber})`);
      }

      // DESCRIPTION
      if (!item.description) {
        errors.push(`Thiếu mô tả (dòng ${rowNumber})`);
      }

      if (errors.length > 0) hasError = true;

      return {
        ...item,
        _error: errors.join(" | ")
      };
    });

    setData(newData);
    return !hasError;
  }, [categories, brands]);

  const handlePreview = () => {
    if (!excelFile) return toast.error("Vui lòng chọn file Excel trước");

    const reader = new FileReader();
    reader.readAsArrayBuffer(excelFile);

    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      const newData = json.map((item) => ({
        ...item,
        product_type: item.product_type || "main",
        description: item.description || "",
        _error: ""
      }));

      validateData(newData);
    };
  };

  const handleChange = (value, index, key) => {
    const newData = [...data];
    newData[index][key] = value;
    setData(newData);
    // ✅ Re-validate ngay sau khi sửa
    setTimeout(() => validateData(newData), 0);
  };

  const handleImport = async () => {
    if (!validateData(data)) {
      const errorRows = data
        .map((item, i) => item._error ? `Dòng ${i + 1}` : null)
        .filter(Boolean)
        .join(", ");

      return toast.error(`Có lỗi ở: ${errorRows}`);
    }

    setLoading(true);

    try {
      const mapped = data.map((item) => {
        const cate = categories.find(
          c => normalize(c.name) === normalize(item.category_name)
        );
        const brand = brands.find(
          b => normalize(b.name) === normalize(item.brand_name)
        );

        return {
          name: item.name,
          category_id: cate.id,
          brand_id: brand.id,
          product_type: item.product_type,
          description: item.description
        };
      });

      await productService.createBulkProducts(mapped);

      toast.success("Import sản phẩm thành công!");
      setData([]);
      setExcelFile(null);

    } catch (err) {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra khi lưu vào hệ thống");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      width: 200,
      render: (val, r, i) => (
        <Input
          value={val}
          onChange={(e) => handleChange(e.target.value, i, "name")}
        />
      )
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: 300,
      render: (val, r, i) => (
        <Input
          value={val}
          onChange={(e) => handleChange(e.target.value, i, "description")}
        />
      )
    },
    {
      title: "Danh mục",
      dataIndex: "category_name",
      width: 200,
      render: (val, r, i) => (
        <Select
          showSearch
          style={{ width: "100%" }}
          value={val}
          onChange={(v) => handleChange(v, i, "category_name")}
        >
          {categories.map(c => (
            <Option key={c.id} value={c.name}>{c.name}</Option>
          ))}
        </Select>
      )
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand_name",
      width: 200,
      render: (val, r, i) => (
        <Select
          showSearch
          style={{ width: "100%" }}
          value={val}
          onChange={(v) => handleChange(v, i, "brand_name")}
        >
          {brands.map(b => (
            <Option key={b.id} value={b.name}>{b.name}</Option>
          ))}
        </Select>
      )
    },
    {
      title: "Loại",
      dataIndex: "product_type",
      width: 130,
      render: (val, r, i) => (
        <Select
          style={{ width: "100%" }}
          value={val}
          onChange={(v) => handleChange(v, i, "product_type")}
        >
          <Option value="main">Sản phẩm chính</Option>
          <Option value="accessory">Phụ kiện</Option>
        </Select>
      )
    },
    {
      title: "Trạng thái / Lỗi",
      dataIndex: "_error",
      width: 180,
      render: (err) => err ? (
        <Tooltip title={err}>
          <Tag color="error" icon={<ExclamationCircleOutlined />}>
            Lỗi
          </Tag>
        </Tooltip>
      ) : (
        <Tag color="success">Hợp lệ</Tag>
      )
    }
  ];

  return (
    <Card title={<Title level={4}>Import Sản phẩm từ Excel</Title>}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space>
          <Upload
            beforeUpload={handleUpload}
            maxCount={1}
            fileList={excelFile ? [excelFile] : []}
            onRemove={() => setExcelFile(null)}
          >
            <Button icon={<UploadOutlined />}>Chọn file Excel</Button>
          </Upload>

          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={handlePreview}
            disabled={!excelFile}
          >
            Xem trước
          </Button>
        </Space>

        {data.length > 0 ? (
          <>
            <Table
              dataSource={data}
              columns={columns}
              rowKey={(r, i) => i}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 1200 }}
              bordered
              size="small"
            />

            <div style={{ textAlign: "right" }}>
              <Button
                type="primary"
                size="large"
                icon={<CloudUploadOutlined />}
                loading={loading}
                onClick={handleImport}
              >
                Import {data.length} sản phẩm
              </Button>
            </div>
          </>
        ) : (
          <Empty description="Chưa có dữ liệu preview" />
        )}
      </Space>
    </Card>
  );
};

export default ProductExcelImport;